import type { SearchData, SearchListingItem } from "@/store/types/search";

export type MapPinPoint = {
  id: string;
  lat: number;
  lng: number;
  pricePerNight: number;
};

const CITY_CENTERS: Record<string, [number, number]> = {
  lisbon: [-9.1393, 38.7223],
  barcelona: [2.1734, 41.3851],
  porto: [-8.6291, 41.1579],
};

export const normalizeMapPins = (searchData: SearchData | null): MapPinPoint[] => {
  if (!searchData) return [];

  if (searchData.mapPins.length > 0) {
    return searchData.mapPins.map((pin) => ({
      id: pin.id,
      lat: pin.lat,
      lng: pin.lng,
      pricePerNight: pin.pricePerNight,
    }));
  }

  return searchData.items.map((item) => ({
    id: item.id,
    lat: item.latitude,
    lng: item.longitude,
    pricePerNight: item.pricePerNight,
  }));
};

export const getDefaultCenter = (
  city: string,
  pins: MapPinPoint[],
): [number, number] => {
  if (pins.length > 0) {
    const lng =
      pins.reduce((sum, pin) => sum + pin.lng, 0) / pins.length;
    const lat =
      pins.reduce((sum, pin) => sum + pin.lat, 0) / pins.length;
    return [lng, lat];
  }

  return CITY_CENTERS[city.trim().toLowerCase()] ?? CITY_CENTERS.lisbon;
};

export const getPinsBounds = (
  pins: MapPinPoint[],
): [[number, number], [number, number]] | null => {
  if (pins.length === 0) return null;

  let minLng = pins[0].lng;
  let maxLng = pins[0].lng;
  let minLat = pins[0].lat;
  let maxLat = pins[0].lat;

  for (const pin of pins) {
    minLng = Math.min(minLng, pin.lng);
    maxLng = Math.max(maxLng, pin.lng);
    minLat = Math.min(minLat, pin.lat);
    maxLat = Math.max(maxLat, pin.lat);
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
};

export const listingById = (
  items: SearchListingItem[],
): Map<string, SearchListingItem> => new Map(items.map((item) => [item.id, item]));

/** API format: `neLat,neLng,swLat,swLng` (not GeoJSON west,south,east,north). */
export const geoJsonBboxToBounds = (
  west: number,
  south: number,
  east: number,
  north: number,
): string => `${north},${east},${south},${west}`;

/** MapLibre / Mapbox `LngLatBounds` → search API `bounds` param. */
export const encodeMapBounds = (bounds: {
  getNorthEast: () => { lat: number; lng: number };
  getSouthWest: () => { lat: number; lng: number };
}) => {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  return geoJsonBboxToBounds(sw.lng, sw.lat, ne.lng, ne.lat);
};
