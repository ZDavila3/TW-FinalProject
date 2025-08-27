import React from "react";
import { useHistory } from "../../hooks/useHistory";

export default function HistoryPanel({ open, onClose, onLoad }) {
  const { items, remove, clear, exportJson } = useHistory();

  return (
    <div style={{
      position:"fixed", top:0, right:0, bottom:0, width:380,
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: ".25s ease", background:"var(--card-bg)",
      borderLeft:"1px solid var(--card-brd)", boxShadow:"var(--shadow)",
      zIndex: 10000, display:"flex", flexDirection:"column"
    }}>
      <div style={{ padding:12, borderBottom:"1px solid var(--card-brd)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <strong style={{color:"#fff"}}>History (local)</strong>
        <div style={{display:"flex", gap:8}}>
          <button className="btn btn-ghost" onClick={() => {
            const blob = new Blob([exportJson()], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "tos-dumbifier-history.json"; a.click();
            URL.revokeObjectURL(url);
          }}>Export</button>
          <button className="btn btn-ghost" onClick={() => { if (confirm("Clear history?")) clear(); }}>Clear</button>
          <button className="btn btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>

      <div style={{ padding:12, overflow:"auto" }}>
        {items.length === 0 ? (
          <p style={{color:"#cbd5e1"}}>Nothing here yet. Analyze something to populate history.</p>
        ) : items.map(item => (
          <div key={item.id} className="ui-card" style={{padding:12, marginBottom:10}}>
            <div style={{display:"flex", justifyContent:"space-between", gap:10}}>
              <div style={{minWidth:0}}>
                <div style={{color:"#fff", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis"}}>
                  {item.file?.name || "Pasted Text"}
                </div>
                <div className="pill" style={{marginTop:4}}>
                  {new Date(item.savedAt).toLocaleString()} • {item.source} • {item.documentType.toUpperCase()}
                </div>
              </div>
              <div style={{display:"flex", gap:8}}>
                <button className="btn btn-ghost" onClick={() => onLoad?.(item)}>Load</button>
                <button className="btn btn-ghost" onClick={() => remove(item.id)}>Delete</button>
              </div>
            </div>
            <div style={{marginTop:8, color:"#e5e7eb", fontSize:13, maxHeight:90, overflow:"hidden"}}>
              {item.summary?.slice(0, 240)}{(item.summary?.length || 0) > 240 ? "…" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
