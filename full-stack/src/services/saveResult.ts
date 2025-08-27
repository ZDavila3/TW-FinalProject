import { historyStore, SavedAnalysis } from "./historyStore";

type AnyResult = {
  processedAt?: string;
  documentType?: string;
  file?: { name?: string; size?: number; type?: string };
  analysis?: { simplified?: string; original?: string; stats?: any };
  processedText?: string;   // alternative field your pipeline may use
  originalText?: string;
  metadata?: any;
};

export function saveResultToLocal(result: AnyResult, source: "paste"|"upload") {
  const simplified =
    result?.analysis?.simplified ?? result?.processedText ?? "";
  const originalPreview =
    (result?.analysis?.original ?? result?.originalText ?? "").slice(0, 1200);

  const item: SavedAnalysis = {
    id: String(Date.now()),
    savedAt: new Date(result?.processedAt || Date.now()).toISOString(),
    source,
    documentType: (result?.documentType as any) ?? "other",
    file: result?.file?.name
      ? { name: result.file.name!, size: result.file.size, type: result.file.type }
      : undefined,
    summary: simplified,
    originalPreview,
    meta: result?.analysis?.stats ?? result?.metadata ?? undefined
  };

  historyStore.save(item);
  return item;
}

