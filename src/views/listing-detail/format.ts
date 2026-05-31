export const formatLabel = (value: string) =>
  value.replace(/[_-]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);

export const splitDescription = (description: string | null) =>
  description
    ?.split(/<br\s*\/?>/i)
    .map((part) => part.trim())
    .filter(Boolean) ?? [];
