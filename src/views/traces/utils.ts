export const formatTraceDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export const formatRequestId = (id: string) => {
  if (id.length <= 20) return id;
  return `${id.slice(0, 10)}…${id.slice(-8)}`;
};
