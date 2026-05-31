import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MapResultsContextValue = {
  hoveredListingId: string | null;
  setHoveredListingId: (id: string | null) => void;
  mapExpanded: boolean;
  setMapExpanded: (expanded: boolean) => void;
  mobileListOpen: boolean;
  setMobileListOpen: (open: boolean) => void;
};

const MapResultsContext = createContext<MapResultsContextValue | null>(null);

export const MapResultsProvider = ({ children }: { children: ReactNode }) => {
  const [hoveredListingId, setHoveredListingIdState] = useState<string | null>(
    null,
  );
  const [mapExpanded, setMapExpandedState] = useState(false);
  const [mobileListOpen, setMobileListOpenState] = useState(false);

  const setHoveredListingId = useCallback((id: string | null) => {
    setHoveredListingIdState(id);
  }, []);

  const setMapExpanded = useCallback((expanded: boolean) => {
    setMapExpandedState(expanded);
  }, []);

  const setMobileListOpen = useCallback((open: boolean) => {
    setMobileListOpenState(open);
  }, []);

  const value = useMemo<MapResultsContextValue>(
    () => ({
      hoveredListingId,
      setHoveredListingId,
      mapExpanded,
      setMapExpanded,
      mobileListOpen,
      setMobileListOpen,
    }),
    [
      hoveredListingId,
      setHoveredListingId,
      mapExpanded,
      setMapExpanded,
      mobileListOpen,
      setMobileListOpen,
    ],
  );

  return (
    <MapResultsContext.Provider value={value}>
      {children}
    </MapResultsContext.Provider>
  );
};

export const useMapResults = () => {
  const context = useContext(MapResultsContext);
  if (!context) {
    throw new Error("useMapResults must be used within MapResultsProvider");
  }
  return context;
};
