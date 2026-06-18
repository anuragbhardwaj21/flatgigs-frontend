export type PersistedChatTrace = {
  requestId: string;
  message: string;
  createdAt: string;
};

const STORAGE_KEY = "zavo_chat_traces";
const MAX_TRACES = 50;

const isPersistedChatTrace = (value: unknown): value is PersistedChatTrace => {
  if (!value || typeof value !== "object") return false;
  const trace = value as PersistedChatTrace;
  return (
    typeof trace.requestId === "string" &&
    trace.requestId.length > 0 &&
    typeof trace.message === "string" &&
    typeof trace.createdAt === "string"
  );
};

export const loadPersistedChatTraces = (): PersistedChatTrace[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isPersistedChatTrace);
  } catch {
    return [];
  }
};

export const persistChatTrace = (entry: PersistedChatTrace) => {
  const existing = loadPersistedChatTraces().filter(
    (trace) => trace.requestId !== entry.requestId,
  );
  const next = [entry, ...existing].slice(0, MAX_TRACES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};
