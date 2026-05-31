import type { ListingDetail } from "@/store/types/listings";
import type { SearchData, SearchListingItem, SearchMapPin } from "@/store/types/search";

export type MapHoverCard = {
  id: string;
  name: string;
  photos: string[];
  pricePerNight: number;
  rating: number | null;
  reviewCount: number;
  propertyType?: string;
};

export const itemToHoverCard = (item: SearchListingItem): MapHoverCard => ({
  id: item.id,
  name: item.name,
  photos: item.photos,
  pricePerNight: item.pricePerNight,
  rating: item.rating,
  reviewCount: item.reviewCount,
  propertyType: item.propertyType,
});

export const pinToHoverCard = (pin: SearchMapPin): MapHoverCard => ({
  id: pin.id,
  name: "",
  photos: [],
  pricePerNight: pin.pricePerNight,
  rating: pin.ratingAvg,
  reviewCount: 0,
});

export const detailToHoverCard = (detail: ListingDetail): MapHoverCard => ({
  id: detail.id,
  name: detail.name,
  photos: detail.photos,
  pricePerNight: detail.price ?? 0,
  rating: detail.ratingAvg,
  reviewCount: detail.reviewCount,
  propertyType: detail.propertyType,
});

export const resolveHoverCard = (
  id: string | null,
  data: SearchData | null,
  detail?: ListingDetail | null,
): MapHoverCard | null => {
  if (!id || !data) return null;

  const item = data.items.find((entry) => entry.id === id);
  if (item) return itemToHoverCard(item);

  if (detail?.id === id) return detailToHoverCard(detail);

  const pin = data.mapPins.find((entry) => entry.id === id);
  if (pin) return pinToHoverCard(pin);

  return null;
};
