import React, { useEffect, useState } from "react";
import Navbar from "../Dashboard/Navbar";

// Try to use historyStore if present, otherwise fall back to localStorage
let safeHistoryStore = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  safeHistoryStore = require("../services/historyStore").historyStore;
} catch {
  // no-op; we'll use localStorage fallback below
}

const STORAGE_KEY = "tos-dumbifier-history";

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function writeLocal(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function HistoryPage() {
  const [items, setItems] = useState([]);

  const refresh = () => {
    try {
      if (safeHistoryStore?.all) {
        setItems(safeHistoryStore.all() || []);
      } else {
        setItems(readLocal());
      }
    } catch {
      setItems(readLocal());
    }
  };

  useEffect(refresh, []);

  const remove = (id) => {
    try {
      if (safeHistoryStore?.remove) {
        safeHistoryStore.remove(id);
      } else {
        const next = readLocal().filter((x) => x.id !== id);
        writeLocal(next);
      }
    } finally {
      refresh();
    }
  };

  const clear = () => {
    if (confirm("Clear all history?")) {
      try {
        if (safeHistoryStore?.clear) {
          safeHistoryStore.clear();
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        refresh();
      }
    }
  };

  const exportJson = () => {
    const data = safeHistoryStore?.export ? safeHistoryStore.export() : JSON.stringify(readLocal(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tos-dumbifier-history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="page-container">
        <h1 className="dashboard-title">History</h1>

        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <button className="btn btn-ghost" onClick={exportJson}>Export</button>
          <button className="btn btn-ghost" onClick={clear}>Clear</button>
        </div>

        {items.length === 0 ? (
          <div className="ui-card" style={{ padding: 16, color: "#cbd5e1" }}>
            Nothing saved yet. Analyze something and hit “Save”.
          </div>
        ) : (
          items.map((item) => {
            const summary = item?.summary ?? "No summary available.";
            const preview =
              typeof summary === "string"
                ? summary.slice(0, 1200) + (summary.length > 1200 ? "…" : "")
                : "No summary available.";

            return (
              <div key={item.id} className="ui-card" style={{ padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: 700,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item?.file?.name || "Pasted Text"}
                    </div>
                    <div className="pill" style={{ marginTop: 4 }}>
                      {new Date(item?.savedAt || Date.now()).toLocaleString()} • {item?.source || "unknown"} •{" "}
                      {(item?.documentType && item.documentType.toUpperCase && item.documentType.toUpperCase()) || "TOS"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        if (typeof summary === "string") {
                          navigator.clipboard.writeText(summary);
                        } else {
                          alert("Nothing to copy.");
                        }
                      }}
                    >
                      Copy
                    </button>
                    <button className="btn btn-ghost" onClick={() => remove(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 10, color: "#e5e7eb", whiteSpace: "pre-wrap" }}>
                  {preview}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
