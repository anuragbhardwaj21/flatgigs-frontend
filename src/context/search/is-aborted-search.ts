export const isAbortedSearchError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const err = error as { name?: string; status?: string | number; error?: string };
  if (err.name === "AbortError") return true;
  if (err.status === "ABORTED") return true;
  if (typeof err.error === "string" && err.error.toLowerCase().includes("abort")) {
    return true;
  }

  const nested = (error as { error?: { status?: string; name?: string } }).error;
  if (nested?.status === "ABORTED" || nested?.name === "AbortError") return true;

  return false;
};
