import type { AspectScores } from "./listings";

export type CompareListingCard = {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  reviewSummary: string | null;
  aspectScores: AspectScores | null;
};

export type CompareRequest = {
  listingIds: string[];
  checkIn?: string;
  checkOut?: string;
};

export type CompareResponse = {
  listings: CompareListingCard[];
  verdict: string;
};
