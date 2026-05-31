import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "@/views/search-results/main-content/map-view/map-styles.css";

const MAP_STYLE =
  import.meta.env.VITE_MAP_STYLE_URL ??
  "https://tiles.openfreemap.org/styles/liberty";

type DetailLocationMapProps = {
  latitude: number;
  longitude: number;
  label: string;
};

const DetailLocationMap = ({
  latitude,
  longitude,
  label,
}: DetailLocationMapProps) => (
  <div className="overflow-hidden rounded-2xl ring-1 ring-black/6">
    <Map
      initialViewState={{
        longitude,
        latitude,
        zoom: 13,
      }}
      style={{ width: "100%", height: 220 }}
      mapStyle={MAP_STYLE}
      scrollZoom={false}
      dragPan={false}
      doubleClickZoom={false}
      attributionControl={false}
    >
      <NavigationControl position="top-right" showCompass={false} />
      <Marker longitude={longitude} latitude={latitude} anchor="bottom">
        <span className="flex size-8 items-center justify-center rounded-full bg-main text-xs font-bold text-white shadow-md ring-2 ring-white">
          •
        </span>
      </Marker>
    </Map>
    <p className="border-t border-black/6 bg-white/90 px-3 py-2 text-[12px] text-black/55">
      {label}
    </p>
  </div>
);

export default DetailLocationMap;
