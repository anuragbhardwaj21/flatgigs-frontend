import { useMapResults } from "@/context/map-results";
import { useSearch } from "@/context/search";
import { useIcon } from "@/hooks/use-icons";
import cn from "@/utils/cn";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import type { MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map-styles.css";
import {
  encodeMapBounds,
  getDefaultCenter,
  getPinsBounds,
  normalizeMapPins,
} from "./normalize-pins";
import PriceMarker from "./price-marker";
import { useMapClusters } from "./use-map-clusters";

const MAP_STYLE =
  import.meta.env.VITE_MAP_STYLE_URL ??
  "https://tiles.openfreemap.org/styles/liberty";

const BOUNDS_DEBOUNCE_MS = 600;

type MapViewProps = {
  className?: string;
};

const MapView = ({ className }: MapViewProps) => {
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);
  const boundsTimerRef = useRef<number | null>(null);
  const skipBoundsSearchRef = useRef(true);

  const { searchData, searchInputs, refreshMapBounds } = useSearch();
  const {
    hoveredListingId,
    setHoveredListingId,
    mapExpanded,
    setMapExpanded,
    mobileListOpen,
    setMobileListOpen,
  } = useMapResults();

  const GridIcon = useIcon("grid");
  const MapIcon = useIcon("map");

  const pins = useMemo(() => normalizeMapPins(searchData), [searchData]);
  const defaultCenter = useMemo(
    () => getDefaultCenter(searchInputs.city, pins),
    [searchInputs.city, pins],
  );

  const [viewState, setViewState] = useState({
    longitude: defaultCenter[0],
    latitude: defaultCenter[1],
    zoom: 12,
  });

  const { items: clusterItems, index: clusterIndex } = useMapClusters(
    pins,
    viewState.zoom,
  );

  useEffect(() => {
    if (pins.length === 0) return;
    const bounds = getPinsBounds(pins);
    if (!bounds) return;

    skipBoundsSearchRef.current = true;
    mapRef.current?.fitBounds(bounds, { padding: 60, duration: 800 });
  }, [searchInputs.city, pins.length]);

  useEffect(() => {
    if (!hoveredListingId) return;
    const pin = pins.find((p) => p.id === hoveredListingId);
    if (!pin) return;

    const map = mapRef.current?.getMap();
    if (!map) return;

    const bounds = map.getBounds();
    const inView =
      pin.lng >= bounds.getWest() &&
      pin.lng <= bounds.getEast() &&
      pin.lat >= bounds.getSouth() &&
      pin.lat <= bounds.getNorth();

    if (!inView) {
      map.easeTo({ center: [pin.lng, pin.lat], duration: 400 });
    }
  }, [hoveredListingId, pins]);

  const scheduleBoundsSearch = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (boundsTimerRef.current) {
      window.clearTimeout(boundsTimerRef.current);
    }

    boundsTimerRef.current = window.setTimeout(() => {
      if (skipBoundsSearchRef.current) {
        skipBoundsSearchRef.current = false;
        return;
      }
      refreshMapBounds(encodeMapBounds(map.getBounds()));
    }, BOUNDS_DEBOUNCE_MS);
  }, [refreshMapBounds]);

  useEffect(
    () => () => {
      if (boundsTimerRef.current) window.clearTimeout(boundsTimerRef.current);
    },
    [],
  );

  const handleMove = useCallback((event: ViewStateChangeEvent) => {
    setViewState(event.viewState);
  }, []);

  const handleMoveEnd = useCallback(() => {
    scheduleBoundsSearch();
  }, [scheduleBoundsSearch]);

  const handleClusterClick = useCallback(
    (clusterId: number, lat: number, lng: number) => {
      if (!clusterIndex) return;
      const zoom = clusterIndex.getClusterExpansionZoom(clusterId);
      mapRef.current?.easeTo({ center: [lng, lat], zoom, duration: 500 });
    },
    [clusterIndex],
  );

  const handlePinClick = useCallback(
    (id: string) => {
      navigate(`/results/${id}`);
    },
    [navigate],
  );

  return (
    <div
      className={cn(
        "relative min-h-[420px] overflow-hidden rounded-[1.25rem] ring-1 ring-black/8",
        "h-[calc(100dvh-220px)] lg:min-h-[520px]",
        className,
      )}
    >
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
        mapStyle={MAP_STYLE}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        reuseMaps
      >
        <NavigationControl position="top-left" showCompass={false} />

        {clusterItems.map((item) =>
          item.type === "cluster" ? (
            <Marker
              key={`cluster-${item.id}`}
              longitude={item.lng}
              latitude={item.lat}
              anchor="bottom"
            >
              <PriceMarker
                count={item.count}
                onClick={() => handleClusterClick(item.id, item.lat, item.lng)}
              />
            </Marker>
          ) : (
            <Marker
              key={item.id}
              longitude={item.lng}
              latitude={item.lat}
              anchor="bottom"
            >
              <PriceMarker
                price={item.pricePerNight}
                active={hoveredListingId === item.id}
                onClick={() => handlePinClick(item.id)}
                onMouseEnter={() => setHoveredListingId(item.id)}
                onMouseLeave={() => setHoveredListingId(null)}
              />
            </Marker>
          ),
        )}
      </Map>

      <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-end gap-2 px-3">
        <div className="pointer-events-auto flex gap-2">
          <button
            type="button"
            onClick={() => setMapExpanded(!mapExpanded)}
            className="hidden items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-black/70 shadow-md ring-1 ring-black/8 backdrop-blur-sm transition hover:text-black/90 lg:inline-flex"
          >
            <MapIcon className="text-sm" />
            {mapExpanded ? "Show list" : "Expand map"}
          </button>
          <button
            type="button"
            onClick={() => setMobileListOpen(!mobileListOpen)}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-black/70 shadow-md ring-1 ring-black/8 backdrop-blur-sm transition hover:text-black/90 lg:hidden"
          >
            <GridIcon className="text-sm" />
            {mobileListOpen ? "Hide list" : "Show list"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;
