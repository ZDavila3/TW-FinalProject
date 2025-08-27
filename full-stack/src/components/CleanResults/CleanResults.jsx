import React, { useMemo, useState } from "react";
import { saveResultToLocal } from "../../services/saveResult";

/**
 * CleanResults
 * - Predictable, theme-friendly markup
 * - If onSave isn't provided, will save to local history automatically
 * - Adds a Copy button for the current tab content
 */
export default function CleanResults({ result, onClose, onSave }) {
  const [tab, setTab] = useState("summary");
  const isTextInput = !!result?.isTextInput;

  const texts = useMemo(() => {
    const simplified =
      result?.analysis?.simplified ??
      result?.processedText ??
      "";
    const original =
      result?.analysis?.original ??
      result?.originalText ??
      "";
    return { simplified, original };
  }, [result]);

  const stats = useMemo(() => {
    const meta = result?.metadata || {};
    const wc = meta.wordCount || {};
    const oWords =
      wc.original ??
      (texts.original ? texts.original.trim().split(/\s+/).length : 0);
    const sWords =
      wc.simplified ??
      (texts.simplified ? texts.simplified.trim().split(/\s+/).length : 0);
    return {
      processedAt: result?.processedAt,
      type: result?.documentType || "tos",
      fileName: result?.file?.name || result?.filename || "Pasted Text",
      originalWords: oWords,
      simplifiedWords: sWords,
      meta,
    };
  }, [result, texts]);

  const doSave = () => {
    // Prefer parent's handler; otherwise save locally.
    if (typeof onSave === "function") {
      onSave(result);
      return;
    }
    try {
      saveResultToLocal(result, isTextInput ? "paste" : "upload");
      alert("Saved to History (local)");
    } catch (e) {
      console.warn("Local save failed:", e);
      alert("Sorry, failed to save.");
    }
  };

  const getActiveText = () =>
    tab === "summary" ? texts.simplified : tab === "original" ? texts.original : "";

  const copyActive = async () => {
    try {
      const text = getActiveText();
      if (!text) return;
      await navigator.clipboard.writeText(text);
      // Tiny unobtrusive feedback
      // (Use your toast system if you have one)
      alert("Copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <div className="cr-panel">
      {/* Header */}
      <div className="cr-header">
        <div>
          <div className="cr-title">Analysis Results</div>
          <div className="cr-subtitle">
            {stats.fileName} • {String(stats.type).toUpperCase()}
          </div>
        </div>
        <div className="cr-actions">
          <button className="cr-btn outline" onClick={copyActive} title="Copy visible text">
            Copy
          </button>
          <button className="cr-btn outline" onClick={doSave}>
            Save
          </button>
          {onClose && (
            <button className="cr-btn" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="cr-tabs" role="tablist" aria-label="Result tabs">
        <button
          className={`cr-tab ${tab === "summary" ? "active" : ""}`}
          role="tab"
          aria-selected={tab === "summary"}
          onClick={() => setTab("summary")}
        >
          Simplified Summary
        </button>
        <button
          className={`cr-tab ${tab === "original" ? "active" : ""}`}
          role="tab"
          aria-selected={tab === "original"}
          onClick={() => setTab("original")}
        >
          Original Text
        </button>
        <button
          className={`cr-tab ${tab === "stats" ? "active" : ""}`}
          role="tab"
          aria-selected={tab === "stats"}
          onClick={() => setTab("stats")}
        >
          Statistics
        </button>
      </div>

      {/* Body */}
      <div className="cr-body">
        {tab === "summary" && (
          <div className="cr-surface" role="region" aria-label="Simplified summary">
            <pre className="cr-pre">
{texts.simplified || "No simplified summary available."}
            </pre>
          </div>
        )}

        {tab === "original" && (
          <div className="cr-surface" role="region" aria-label="Original text">
            <pre className="cr-pre">
{texts.original || "No original text available."}
            </pre>
          </div>
        )}

        {tab === "stats" && (
          <div className="cr-surface" role="region" aria-label="Statistics">
            <div className="cr-stats">
              <div>
                <strong>Processed:</strong>{" "}
                {new Date(stats.processedAt || Date.now()).toLocaleString()}
              </div>
              <div>
                <strong>Type:</strong> {stats.type}
              </div>
              <div>
                <strong>Original words:</strong> {stats.originalWords}
              </div>
              <div>
                <strong>Simplified words:</strong> {stats.simplifiedWords}
              </div>
              {result?.file?.name && (
                <div>
                  <strong>File:</strong> {stats.fileName}
                </div>
              )}
              {result?.success === false && (
                <div className="cr-error">
                  <strong>Error:</strong> {result?.error || "Unknown error"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
