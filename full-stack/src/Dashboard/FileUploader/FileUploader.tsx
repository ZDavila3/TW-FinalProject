import { useRef, useState } from "react";
import { documentProcessor } from "../../services/documentProcessor.js";
import CleanResults from "../../components/CleanResults/CleanResults.jsx";
import { saveResultToLocal } from "../../services/saveResult";

type ProcessingStatus = "idle" | "processing" | "success" | "error";

interface ProcessingProgress {
  step: string;
  progress: number;
  message: string;
}

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetUI = () => {
    setStatus("idle");
    setResult(null);
    setShowResults(false);
    setProgress(0);
    setProgressMessage("");
  };

  const onProgress = (p: ProcessingProgress) => {
    setProgress(p?.progress ?? 0);
    setProgressMessage(p?.message ?? "");
    if (p?.step === "error") setStatus("error");
    if (p?.step === "complete") setStatus("success");
  };

  const pickFile = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    resetUI();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFile(f);
    resetUI();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") pickFile();
  };

  const handleProcessDocument = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(0);
    setProgressMessage("Starting document processing…");

    try {
      const res = await documentProcessor.processDocument(file, onProgress);
      setResult(res);
      if (res?.success) {
        setStatus("success");
        setShowResults(true);
        setProgressMessage("Document processing complete!");
      } else {
        setStatus("error");
        setProgressMessage(res?.error || "Processing failed.");
      }
    } catch (err: any) {
      setStatus("error");
      setProgressMessage(err?.message || "Processing failed.");
    }
  };

  return (
    <div className="uploader-card ui-card">
      <div
        className={`dropzone ${dragOver ? "dragover" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={pickFile}
        onKeyUp={handleKeyUp}
        role="button"
        tabIndex={0}
        aria-label="Upload document (txt, pdf, doc, docx)"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div className="pill">📁 Drop file here or click to upload</div>
          <small>Supported: .txt · .pdf · .doc · .docx</small>
        </div>
      </div>

      {file && (
        <div className="ui-card" style={{ marginTop: 14, padding: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </div>
              <div className="pill">
                {(file.size / 1024).toFixed(1)} KB • {file.type || "unknown"}
              </div>
            </div>
            <button className="btn btn-ghost" onClick={() => setFile(null)}>
              Remove
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 10,
          marginTop: 14,
        }}
      >
        <div className="progress" aria-label="processing progress">
          <div className="fill" style={{ width: `${progress}%` }} />
        </div>
        <button
          className="btn btn-primary"
          disabled={!file || status === "processing"}
          onClick={handleProcessDocument}
        >
          {status === "processing" ? "Analyzing…" : "Analyze with AI"}
        </button>
      </div>
      <div style={{ marginTop: 8, color: "var(--muted)" }}>
        {progressMessage}
      </div>

      {status === "success" && !showResults && (
        <div
          className="ui-card"
          style={{ marginTop: 14, padding: 14, borderLeft: "3px solid var(--success)" }}
        >
          ✅ Processed successfully.{" "}
          <button className="btn btn-ghost" onClick={() => setShowResults(true)}>
            View Results
          </button>
        </div>
      )}
      {status === "error" && (
        <div
          className="ui-card"
          style={{ marginTop: 14, padding: 14, borderLeft: "3px solid var(--danger)" }}
        >
          ❌ {progressMessage || "Processing failed. Please try again."}
        </div>
      )}

      {showResults && result && (
        <div className="results-panel reveal" style={{ marginTop: 16 }}>
          <CleanResults
            result={result}
            onClose={() => {
              setShowResults(false);
              setResult(null);
            }}
            onSave={() => {
              try {
                saveResultToLocal(result, "upload");
                alert("Saved to History (local)");
              } catch {}
            }}
          />
        </div>
      )}
    </div>
  );
}
