import type { ApiEnvelope } from "./listings";

export type SearchSort =
  | "price_asc"
  | "price_desc"
  | "rating"
  | "popularity"
  | "distance";

export type SearchQuery = {
  city: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  rooms?: number;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
  propertyTypes?: string[];
  amenities?: string[];
  sort?: SearchSort;
  lat?: number;
  lng?: number;
  bounds?: string;
  page?: number;
  limit?: number;
  includeMapPins?: boolean;
};

export type SearchListingItem = {
  id: string;
  name: string;
  photos: string[];
  propertyType: string;
  roomType: string;
  pricePerNight: number;
  totalForStay: number;
  rating: number | null;
  reviewCount: number;
  amenities: string[];
  latitude: number;
  longitude: number;
  distanceKm?: number;
};

export type SearchMapPin = {
  id: string;
  lat: number;
  lng: number;
  pricePerNight: number;
  ratingAvg: number;
};

export type SearchFacets = {
  priceRange: { min: number; max: number };
  propertyTypes: Record<string, number>;
  amenities: Record<string, number>;
};

export type SearchData = {
  items: SearchListingItem[];
  total: number;
  facets: SearchFacets;
  mapPins: SearchMapPin[];
};

export type SearchResponse = ApiEnvelope<SearchData>;
