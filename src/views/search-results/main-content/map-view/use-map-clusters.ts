import type { MapPinPoint } from "./normalize-pins";
import Supercluster from "supercluster";
import { useMemo } from "react";

type ClusterFeature = Supercluster.ClusterFeature<MapPinPoint>;
type PointFeature = Supercluster.PointFeature<MapPinPoint>;

export type MapClusterItem =
  | { type: "cluster"; id: number; lat: number; lng: number; count: number }
  | { type: "pin"; id: string; lat: number; lng: number; pricePerNight: number };

export const useMapClusters = (pins: MapPinPoint[], zoom: number) =>
  useMemo(() => {
    if (pins.length === 0) return { items: [] as MapClusterItem[], index: null };

    const index = new Supercluster<MapPinPoint>({ radius: 56, maxZoom: 16 });

    const features: PointFeature[] = pins.map((pin) => ({
      type: "Feature",
      properties: pin,
      geometry: { type: "Point", coordinates: [pin.lng, pin.lat] },
    }));

    index.load(features);

    const bounds = pins.reduce(
      (acc, pin) => ({
        minLng: Math.min(acc.minLng, pin.lng),
        maxLng: Math.max(acc.maxLng, pin.lng),
        minLat: Math.min(acc.minLat, pin.lat),
        maxLat: Math.max(acc.maxLat, pin.lat),
      }),
      {
        minLng: pins[0].lng,
        maxLng: pins[0].lng,
        minLat: pins[0].lat,
        maxLat: pins[0].lat,
      },
    );

    const clusters = index.getClusters(
      [bounds.minLng, bounds.minLat, bounds.maxLng, bounds.maxLat],
      Math.floor(zoom),
    );

    const items = clusters.map((feature): MapClusterItem => {
      const [lng, lat] = feature.geometry.coordinates;
      const clusterFeature = feature as ClusterFeature;

      if (clusterFeature.properties.cluster) {
        return {
          type: "cluster",
          id: clusterFeature.properties.cluster_id,
          lat,
          lng,
          count: clusterFeature.properties.point_count,
        };
      }

      const pin = (feature as PointFeature).properties;
      return {
        type: "pin",
        id: pin.id,
        lat,
        lng,
        pricePerNight: pin.pricePerNight,
      };
    });

    return { items, index };
  }, [pins, zoom]);
