import type { AssistantResultsData } from "@/store/types/chat";
import type { SearchData, SearchListingItem } from "@/store/types/search";

const normalizeItem = (item: SearchListingItem): SearchListingItem => ({
  ...item,
  propertyType: item.propertyType ?? "property",
  roomType: item.roomType ?? "entire_place",
  photos: item.photos ?? [],
  amenities: item.amenities ?? [],
  rating: item.rating ?? null,
  reviewCount: item.reviewCount ?? 0,
});

export const normalizeAssistantResults = (data: AssistantResultsData): SearchData => ({
  items: (data.items ?? []).map(normalizeItem),
  total: data.total ?? 0,
  mapPins: data.mapPins ?? [],
  facets: data.facets ?? data.meta?.facets ?? {
    priceRange: { min: 0, max: 0 },
    propertyTypes: {},
    amenities: {},
  },
});
