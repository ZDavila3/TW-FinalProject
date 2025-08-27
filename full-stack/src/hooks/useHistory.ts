import { useEffect, useState } from "react";
import { historyStore, SavedAnalysis } from "../services/historyStore";

export function useHistory() {
  const [items, setItems] = useState<SavedAnalysis[]>([]);

  const refresh = () => setItems(historyStore.all());
  const remove = (id: string) => { historyStore.remove(id); refresh(); };
  const clear = () => { historyStore.clear(); refresh(); };

  useEffect(refresh, []);

  return { items, refresh, remove, clear, exportJson: historyStore.export };
}
