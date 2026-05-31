import { MAP_BOUNDS_DEBOUNCE_MS } from "@/context/search/constants";
import type { MapRef } from "react-map-gl/maplibre";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import { encodeMapBounds } from "./normalize-pins";

type UseMapBoundsSearchArgs = {
  mapRef: RefObject<MapRef | null>;
  mapExpanded: boolean;
  enabled: boolean;
  refreshMapBounds: (bounds: string) => void;
};

export const useMapBoundsSearch = ({
  mapRef,
  mapExpanded,
  enabled,
  refreshMapBounds,
}: UseMapBoundsSearchArgs) => {
  const timerRef = useRef<number | null>(null);
  const skipNextRef = useRef(true);

  const cancelPending = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const skipNextBoundsSearch = useCallback(() => {
    skipNextRef.current = true;
  }, []);

  const scheduleBoundsSearch = useCallback(() => {
    if (!enabled || mapExpanded) return;

    const map = mapRef.current?.getMap();
    if (!map) return;

    cancelPending();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      if (skipNextRef.current) {
        skipNextRef.current = false;
        return;
      }
      refreshMapBounds(encodeMapBounds(map.getBounds()));
    }, MAP_BOUNDS_DEBOUNCE_MS);
  }, [cancelPending, enabled, mapExpanded, mapRef, refreshMapBounds]);

  useEffect(() => cancelPending, [cancelPending]);

  return { scheduleBoundsSearch, skipNextBoundsSearch, cancelPending };
};
