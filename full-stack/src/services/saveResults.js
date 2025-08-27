// src/services/saveResult.js

const STORAGE_KEY = "tos-dumbifier-history";

/**
 * Derive a summary string from the processing result.
 */
function pickSummary(result) {
  return (
    result?.analysis?.simplified ||
    result?.processedText ||
    "" // fallback; HistoryPage will display "No summary available."
  );
}

/**
 * Derive original text if available.
 */
function pickOriginal(result) {
  return result?.analysis?.original || result?.originalText || "";
}

/**
 * Compute a word-count object safely.
 */
function computeWordCount(result, summary, original) {
  const wcMeta = result?.metadata?.wordCount || {};
  const count = (t) => (typeof t === "string" ? (t.trim() ? t.trim().split(/\s+/).length : 0) : 0);
  return {
    original: wcMeta.original ?? count(original),
    simplified: wcMeta.simplified ?? count(summary),
  };
}

/**
 * Normalize a result into a history entry shape that the History page expects.
 */
function toHistoryEntry(result, source = "paste") {
  const summary = pickSummary(result);
  const original = pickOriginal(result);

  const entry = {
    id:
      (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
      String(Date.now()),
    savedAt: new Date().toISOString(),
    source, // "paste" | "upload"
    documentType: result?.documentType || "tos",
    file: result?.file || null,
    processedAt: result?.processedAt || new Date().toISOString(),
    summary, // ALWAYS present (may be empty string)
    original, // may be empty string
    wordCount: computeWordCount(result, summary, original),
  };

  return entry;
}

/**
 * Read all history entries (array) from localStorage.
 */
export function getLocalHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Persist array back to localStorage.
 */
function setLocalHistory(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/**
 * Public: Save one result to local history.
 * Ensures a "summary" string is stored so the UI doesn't crash.
 */
export function saveResultToLocal(result, source = "paste") {
  const entry = toHistoryEntry(result, source);
  const list = getLocalHistory();
  list.unshift(entry);
  // keep last 100 to avoid unbounded growth
  setLocalHistory(list.slice(0, 100));
  return entry.id;
}

/**
 * Optional helpers (not required, but handy)
 */
export function clearLocalHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

export function removeFromLocalHistory(id) {
  const list = getLocalHistory().filter((x) => x.id !== id);
  setLocalHistory(list);
}
