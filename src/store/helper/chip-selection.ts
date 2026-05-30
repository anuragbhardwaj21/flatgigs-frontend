export const toggleChipSelection = (
  current: string[],
  value: string,
): string[] => {
  if (value === "any") return ["any"];

  const withoutAny = current.filter((item) => item !== "any");
  const next = withoutAny.includes(value)
    ? withoutAny.filter((item) => item !== value)
    : [...withoutAny, value];

  return next.length === 0 ? ["any"] : next;
};

export const chipValuesForApi = (selected: string[]) =>
  selected.filter((value) => value !== "any");
