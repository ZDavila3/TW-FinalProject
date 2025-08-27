export type SavedAnalysis = {
    id: string;
    savedAt: string;
    source: "paste" | "upload";
    documentType: "tos" | "privacy-policy" | "eula" | "other";
    file?: { name: string; size?: number; type?: string };
    summary: string;            // simplified / processed text
    originalPreview?: string;   // optional small preview
    meta?: Record<string, any>;
  };
  
  const KEY = "tos-dumbifier-history";
  const MAX_ITEMS = 30;
  
  const read = (): SavedAnalysis[] => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  };
  const write = (arr: SavedAnalysis[]) => {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch {}
  };
  
  export const historyStore = {
    all: read,
    save(item: SavedAnalysis) {
      const list = read();
      list.unshift(item);
      write(list.slice(0, MAX_ITEMS));
    },
    remove(id: string) { write(read().filter(i => i.id !== id)); },
    clear() { write([]); },
    export(): string { return JSON.stringify(read(), null, 2); }
  };
  