import { MAP_HOVER_CARD_WIDTH } from "./map-pin-card";
import type { MapRef } from "react-map-gl/maplibre";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode, type RefObject } from "react";

const EDGE_PADDING = 12;
const PIN_OFFSET_Y = 44;

type OverlayPosition = {
  x: number;
  y: number;
};

type MapPinHoverOverlayProps = {
  mapRef: RefObject<MapRef | null>;
  open: boolean;
  longitude?: number;
  latitude?: number;
  children: ReactNode;
  onEnter: () => void;
  onLeave: () => void;
};

const clampOverlayX = (pinX: number, mapWidth: number): number => {
  const half = MAP_HOVER_CARD_WIDTH / 2;
  const min = EDGE_PADDING + half;
  const max = mapWidth - EDGE_PADDING - half;
  if (max <= min) return mapWidth / 2;
  return Math.min(max, Math.max(min, pinX));
};

const MapPinHoverOverlay = ({
  mapRef,
  open,
  longitude,
  latitude,
  children,
  onEnter,
  onLeave,
}: MapPinHoverOverlayProps) => {
  const [position, setPosition] = useState<OverlayPosition | null>(null);

  useEffect(() => {
    if (!open || longitude == null || latitude == null) {
      setPosition(null);
      return;
    }

    const map = mapRef.current?.getMap();
    if (!map) return;

    const update = () => {
      const point = map.project([longitude, latitude]);
      const mapWidth = map.getContainer().clientWidth;
      setPosition({
        x: clampOverlayX(point.x, mapWidth),
        y: point.y,
      });
    };

    update();
    map.on("move", update);
    map.on("zoom", update);
    map.on("resize", update);

    const container = map.getContainer();
    const observer = new ResizeObserver(update);
    observer.observe(container);

    return () => {
      map.off("move", update);
      map.off("zoom", update);
      map.off("resize", update);
      observer.disconnect();
    };
  }, [open, longitude, latitude, mapRef]);

  return (
    <AnimatePresence>
      {open && position ? (
        <motion.div
          key="map-hover-overlay"
          className="pointer-events-none absolute z-40"
          style={{
            left: position.x,
            top: position.y,
            transform: `translate(-50%, calc(-100% - ${PIN_OFFSET_Y}px))`,
          }}
          initial={{ opacity: 0, y: 4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="pointer-events-auto"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            {children}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default MapPinHoverOverlay;
