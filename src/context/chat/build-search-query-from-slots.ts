import type { ConversationSlots } from "@/store/types/chat";
import type { SearchQuery } from "@/store/types/search";

export const buildSearchQueryFromSlots = (
  slots?: ConversationSlots | null,
): SearchQuery | null => {
  if (!slots) return null;

  const city = typeof slots.city === "string" ? slots.city.trim().toLowerCase() : "";
  const checkIn = typeof slots.checkIn === "string" ? slots.checkIn : "";
  const checkOut = typeof slots.checkOut === "string" ? slots.checkOut : "";

  if (!city || !checkIn || !checkOut) return null;

  const query: SearchQuery = { city, checkIn, checkOut };

  if (typeof slots.adults === "number") query.adults = slots.adults;
  if (typeof slots.children === "number") query.children = slots.children;

  return query;
};

export const slotsAreSearchable = (slots?: ConversationSlots | null): boolean =>
  buildSearchQueryFromSlots(slots) != null;
