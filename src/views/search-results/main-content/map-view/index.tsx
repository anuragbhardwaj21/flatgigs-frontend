import { useMapResults } from "@/context/map-results";
import { useSearch } from "@/context/search";
import { useIcon } from "@/hooks/use-icons";
import { useLazyGetListingByIdQuery } from "@/store/services/listings-api";
import cn from "@/utils/cn";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import type { MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map-styles.css";
import { resolveHoverCard } from "./map-hover-card";
import MapPinCard from "./map-pin-card";
import MapPinHoverOverlay from "./map-pin-hover-overlay";
import { getDefaultCenter, getPinsBounds, normalizeMapPins } from "./normalize-pins";
import PriceMarker from "./price-marker";
import { useMapBoundsSearch } from "./use-map-bounds-search";
import { useMapClusters } from "./use-map-clusters";

const MAP_STYLE =
  import.meta.env.VITE_MAP_STYLE_URL ??
  "https://tiles.openfreemap.org/styles/liberty";

const HOVER_CLEAR_MS = 220;
const CLUSTER_ZOOM_EPSILON = 0.35;

type MapViewProps = {
  className?: string;
};

const MapView = ({ className }: MapViewProps) => {
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);
  const hoverClearTimerRef = useRef<number | null>(null);
  const lastFittedCityRef = useRef<string | null>(null);
  const clusterZoomRef = useRef(12);

  const { searchData, searchInputs, refreshMapBounds, fetchSearch } =
    useSearch();
  const {
    hoveredListingId,
    setHoveredListingId,
    mapExpanded,
    setMapExpanded,
    mobileListOpen,
    setMobileListOpen,
  } = useMapResults();

  const [fetchListingDetail, { data: listingDetail, isFetching: isDetailLoading }] =
    useLazyGetListingByIdQuery();

  const GridIcon = useIcon("grid");
  const MapIcon = useIcon("map");

  const pins = useMemo(() => normalizeMapPins(searchData), [searchData]);
  const defaultCenter = useMemo(
    () => getDefaultCenter(searchInputs.city, pins),
    [searchInputs.city, pins],
  );

  const initialViewState = useMemo(
    () => ({
      longitude: defaultCenter[0],
      latitude: defaultCenter[1],
      zoom: 12,
      bearing: 0,
      pitch: 0,
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    }),
    [defaultCenter],
  );

  const [clusterZoom, setClusterZoom] = useState(12);

  const { scheduleBoundsSearch, skipNextBoundsSearch } = useMapBoundsSearch({
    mapRef,
    mapExpanded,
    enabled: true,
    refreshMapBounds,
  });

  const hoveredPin = useMemo(
    () => pins.find((pin) => pin.id === hoveredListingId) ?? null,
    [pins, hoveredListingId],
  );

  const hoverCard = useMemo(
    () => resolveHoverCard(hoveredListingId, searchData, listingDetail),
    [hoveredListingId, searchData, listingDetail],
  );

  const needsDetailFetch = useMemo(() => {
    if (!hoveredListingId || !searchData) return false;
    const inItems = searchData.items.some((item) => item.id === hoveredListingId);
    const hasPhoto =
      listingDetail?.id === hoveredListingId && listingDetail.photos.length > 0;
    return !inItems && !hasPhoto;
  }, [hoveredListingId, listingDetail, searchData]);

  const { items: clusterItems, index: clusterIndex } = useMapClusters(
    pins,
    clusterZoom,
  );

  const syncClusterZoom = useCallback(() => {
    const zoom = mapRef.current?.getZoom();
    if (zoom == null) return;
    const floored = Math.floor(zoom);
    if (Math.abs(zoom - clusterZoomRef.current) < CLUSTER_ZOOM_EPSILON) return;
    clusterZoomRef.current = zoom;
    setClusterZoom(floored);
  }, []);

  const cancelHoverClear = useCallback(() => {
    if (hoverClearTimerRef.current) {
      window.clearTimeout(hoverClearTimerRef.current);
      hoverClearTimerRef.current = null;
    }
  }, []);

  const scheduleHoverClear = useCallback(() => {
    cancelHoverClear();
    hoverClearTimerRef.current = window.setTimeout(() => {
      setHoveredListingId(null);
    }, HOVER_CLEAR_MS);
  }, [cancelHoverClear, setHoveredListingId]);

  const setHoveredPin = useCallback(
    (id: string) => {
      cancelHoverClear();
      setHoveredListingId(id);
    },
    [cancelHoverClear, setHoveredListingId],
  );

  useEffect(() => {
    if (!hoveredListingId || !needsDetailFetch) return;
    void fetchListingDetail(hoveredListingId, true);
  }, [fetchListingDetail, hoveredListingId, needsDetailFetch]);

  const restoreCityResults = useCallback(() => {
    if (!searchInputs.bounds) return;
    fetchSearch({ bounds: undefined, page: 1 });
  }, [fetchSearch, searchInputs.bounds]);

  const handleToggleMapExpanded = useCallback(() => {
    const next = !mapExpanded;
    setMapExpanded(next);
    if (!next) restoreCityResults();
  }, [mapExpanded, restoreCityResults, setMapExpanded]);

  const handleShowMobileList = useCallback(() => {
    setMobileListOpen(!mobileListOpen);
    if (!mobileListOpen) restoreCityResults();
  }, [mobileListOpen, restoreCityResults, setMobileListOpen]);

  useEffect(() => {
    const city = searchInputs.city.trim().toLowerCase();
    if (pins.length === 0 || searchInputs.bounds) return;
    if (lastFittedCityRef.current === city) return;

    const bounds = getPinsBounds(pins);
    if (!bounds) return;

    lastFittedCityRef.current = city;
    skipNextBoundsSearch();
    mapRef.current?.fitBounds(bounds, { padding: 60, duration: 800 });
  }, [
    pins,
    searchInputs.bounds,
    searchInputs.city,
    skipNextBoundsSearch,
  ]);

  useEffect(() => {
    if (!searchInputs.bounds) return;
    lastFittedCityRef.current = null;
  }, [searchInputs.bounds]);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    skipNextBoundsSearch();
    map.flyTo({
      center: defaultCenter,
      zoom: 12,
      duration: 600,
    });
    lastFittedCityRef.current = null;
  }, [searchInputs.city, defaultCenter, skipNextBoundsSearch]);

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
      skipNextBoundsSearch();
      map.easeTo({ center: [pin.lng, pin.lat], duration: 400 });
    }
  }, [hoveredListingId, pins, skipNextBoundsSearch]);

  useEffect(
    () => () => {
      if (hoverClearTimerRef.current) window.clearTimeout(hoverClearTimerRef.current);
    },
    [],
  );

  const handleMove = useCallback(
    (_event: ViewStateChangeEvent) => {
      syncClusterZoom();
    },
    [syncClusterZoom],
  );

  const handleMoveEnd = useCallback(() => {
    syncClusterZoom();
    scheduleBoundsSearch();
  }, [scheduleBoundsSearch, syncClusterZoom]);

  const handleClusterClick = useCallback(
    (clusterId: number, lat: number, lng: number) => {
      if (!clusterIndex) return;
      const zoom = clusterIndex.getClusterExpansionZoom(clusterId);
      skipNextBoundsSearch();
      mapRef.current?.easeTo({ center: [lng, lat], zoom, duration: 500 });
    },
    [clusterIndex, skipNextBoundsSearch],
  );

  const handlePinClick = useCallback(
    (id: string) => {
      navigate(`/results/${id}`);
    },
    [navigate],
  );

  const showHoverCard = Boolean(hoveredPin && hoverCard);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
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
              style={{ zIndex: hoveredListingId === item.id ? 20 : 1 }}
            >
              <PriceMarker
                price={item.pricePerNight}
                active={hoveredListingId === item.id}
                onClick={() => handlePinClick(item.id)}
                onMouseEnter={() => setHoveredPin(item.id)}
                onMouseLeave={scheduleHoverClear}
              />
            </Marker>
          ),
        )}
      </Map>

      <MapPinHoverOverlay
        mapRef={mapRef}
        open={showHoverCard}
        longitude={hoveredPin?.lng}
        latitude={hoveredPin?.lat}
        onEnter={cancelHoverClear}
        onLeave={scheduleHoverClear}
      >
        {hoverCard ? (
          <MapPinCard card={hoverCard} loading={isDetailLoading && needsDetailFetch} />
        ) : null}
      </MapPinHoverOverlay>

      <div className="pointer-events-none absolute inset-x-0 top-3 z-50 flex justify-end gap-2 px-3">
        <div className="pointer-events-auto flex gap-2">
          <button
            type="button"
            onClick={handleToggleMapExpanded}
            className="hidden items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-black/70 shadow-md ring-1 ring-black/8 backdrop-blur-sm transition hover:text-black/90 lg:inline-flex"
          >
            <MapIcon className="text-sm" />
            {mapExpanded ? "Show list" : "Expand map"}
          </button>
          <button
            type="button"
            onClick={handleShowMobileList}
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
