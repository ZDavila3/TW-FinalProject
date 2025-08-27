import React, { useRef, useState } from "react";
import "./Dashboard.css";

import { dashboardConfig } from "./dashboardConfig.js";
import Navbar from "./Navbar.jsx";
import FileUploader from "./FileUploader/FileUploader.tsx";

import { useAuth } from "../context/AuthContext.jsx";
import { documentProcessor } from "../services/documentProcessor.js";

import CleanResults from "../components/CleanResults/CleanResults.jsx";
import axios from "axios";

import { saveResultToLocal } from "../services/saveResult";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const Dashboard = () => {
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const { user } = useAuth();

  // paste-to-analyze state
  const [isProcessingText, setIsProcessingText] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState("");

  const [textResults, setTextResults] = useState(null);
  const [showTextResults, setShowTextResults] = useState(false);

  // where to scroll when results appear
  const resultsRef = useRef(null);

  // ————————————————————————————————————
  // helpers
  const detectDocumentType = (text) => {
    const t = String(text || "").toLowerCase();
    if (
      t.includes("terms of service") ||
      t.includes("terms and conditions") ||
      t.includes("acceptable use")
    )
      return "tos";
    if (
      t.includes("privacy policy") ||
      t.includes("personal information") ||
      t.includes("cookies")
    )
      return "privacy-policy";
    if (
      t.includes("end user license") ||
      t.includes("software license") ||
      t.includes("eula")
    )
      return "eula";
    return "other";
  };

  // ————————————————————————————————————
  // main handler for the left textarea
  const handleSubmit = async (textboxId, textValue) => {
    const text = String(textValue || "").trim();
    if (!text) {
      alert("Please enter some text to process.");
      return;
    }

    if (textboxId !== "main-textbox") return;

    setIsProcessingText(true);
    setProcessingProgress(0);
    setProcessingMessage("Analyzing document type...");
    setTextResults(null);
    setShowTextResults(false);

    try {
      const documentType = detectDocumentType(text);
      const onProgress = (p) => {
        setProcessingProgress(p?.progress ?? 0);
        setProcessingMessage(p?.message ?? "");
      };

      // Use the unified processor that accepts a text object
      const result = await documentProcessor.processDocument(
        {
          text,
          filename: "Pasted Text",
          type: "text/plain",
          documentType,
        },
        onProgress
      );

      if (result && result.success) {
        setTextResults(result);
        setShowTextResults(true);

        // let the layout update then scroll into view
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 50);

        // ✅ save to local cache history
        try {
          saveResultToLocal(result, "paste");
        } catch {}

        // Optional: persist to API if logged in
        if (user) {
          try {
            await axios.post(
              `${API_BASE_URL}/documents/text`,
              { filename: "Pasted Text", text, analysis: result },
              { withCredentials: true }
            );
          } catch (e) {
            console.warn("Failed to save document:", e);
          }
        }

        setProcessingMessage("Analysis complete!");
      } else {
        setProcessingMessage("Failed to process text. Please try again.");
      }
    } catch (err) {
      setProcessingMessage(
        err?.message || "Processing failed. Please try again."
      );
    } finally {
      setIsProcessingText(false);
    }
  };

  const handleCloseTextResults = () => {
    setShowTextResults(false);
    setTextResults(null);
    setProcessingProgress(0);
    setProcessingMessage("");
  };

  // ————————————————————————————————————
  return (
    <div className={`dashboard ${isNavbarExpanded ? "navbar-expanded" : ""}`}>
      <Navbar onToggle={setIsNavbarExpanded} />

      <div className="page-container">
        <h1 className="dashboard-title">{dashboardConfig.header.title}</h1>

        <div className="dashboard-grid">
          {/* LEFT: Paste-to-analyze card */}
          <div className="textbox-card ui-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: "#fff" }}>
                  Paste to Analyze
                </div>
                <div className="pill">TOS • Privacy Policy • EULA</div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  const ta = document.getElementById("main-textbox");
                  const textValue = ta && "value" in ta ? ta.value : "";
                  handleSubmit("main-textbox", textValue);
                }}
                disabled={isProcessingText}
              >
                {isProcessingText ? "Analyzing…" : "Analyze"}
              </button>
            </div>

            <textarea
              id="main-textbox"
              className="textarea input"
              placeholder={
                dashboardConfig.textboxes?.[0]?.placeholder ||
                "Paste legal text here…"
              }
              defaultValue={dashboardConfig.textboxes?.[0]?.initialValue || ""}
            />

            {isProcessingText && (
              <div className="progress-row">
                <div className="progress">
                  <div
                    className="fill"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <div className="pill" style={{ marginTop: 6 }}>
                  {processingMessage}
                </div>
              </div>
            )}

            {/* RESULTS: rendered directly under textarea, same UI as uploads */}
            {showTextResults && textResults && (
              <div
                className="results-panel reveal"
                ref={resultsRef}
                style={{ position: "static" }}
              >
                <CleanResults
                  result={textResults}
                  onClose={handleCloseTextResults}
                  onSave={() => {
                    try { saveResultToLocal(textResults, "paste"); alert("Saved to History (local)"); } catch {}
                  }}
                  />
              </div>
            )}
          </div>

          {/* RIGHT: File Uploader card (its results also use the same CleanResults UI) */}
          <FileUploader />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
