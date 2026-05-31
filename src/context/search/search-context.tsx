import { buildSearchQuery } from "@/context/search/build-search-query";
import { DEFAULT_VIEW_TYPE } from "@/context/search/constants";
import type {
  SearchInputPatch,
  SearchInputs,
  SearchViewType,
} from "@/context/search/types";
import {
  loadPersistedSearchInputs,
  persistSearchInputs,
} from "@/context/search/persist";
import { searchValidationSchema } from "@/context/search/validation";
import { useLazySearchQuery } from "@/store/services/search-api";
import type { SearchData } from "@/store/types/search";
import { FormikProvider, useFormik, type FormikProps } from "formik";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RESULTS_PATH = "/results";

export type SearchSource = "form" | "chat";

type SearchContextValue = {
  searchInputs: SearchInputs;
  formik: FormikProps<SearchInputs>;
  viewType: SearchViewType;
  setSearchInput: (patch: SearchInputPatch) => void;
  setViewType: (viewType: SearchViewType) => void;
  submitSearch: () => void;
  refreshSearch: (patch?: SearchInputPatch) => void;
  refreshMapBounds: (bounds: string) => void;
  searchData: SearchData | null;
  searchSource: SearchSource;
  setChatSearchData: (data: SearchData) => void;
  isSearching: boolean;
  searchError: string | null;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [triggerSearch, { isFetching }] = useLazySearchQuery();
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [searchSource, setSearchSource] = useState<SearchSource>("form");
  const [searchError, setSearchError] = useState<string | null>(null);
  const hasRestoredResultsRef = useRef(false);

  const runSearch = useCallback(
    async (values: SearchInputs, options?: { navigate?: boolean }) => {
      setSearchError(null);

      const query = buildSearchQuery(values);
      if (!query) return false;

      try {
        const result = await triggerSearch(query).unwrap();
        setSearchSource("form");
        setSearchData(result);
        persistSearchInputs(values);
        if (options?.navigate) navigate(RESULTS_PATH);
        return true;
      } catch {
        setSearchError("Search failed. Please try again.");
        return false;
      }
    },
    [navigate, triggerSearch],
  );

  const formik = useFormik<SearchInputs>({
    initialValues: loadPersistedSearchInputs(),
    validationSchema: searchValidationSchema,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting }) => {
      await runSearch(values, { navigate: true });
      setSubmitting(false);
    },
  });

  useEffect(() => {
    persistSearchInputs(formik.values);
  }, [formik.values]);

  useEffect(() => {
    if (pathname !== RESULTS_PATH) {
      hasRestoredResultsRef.current = false;
      return;
    }

    if (searchData || hasRestoredResultsRef.current) return;

    const query = buildSearchQuery(formik.values);
    if (!query) return;

    hasRestoredResultsRef.current = true;

    void (async () => {
      setSearchError(null);
      try {
        const result = await triggerSearch(query).unwrap();
        setSearchSource("form");
        setSearchData(result);
      } catch {
        setSearchError("Search failed. Please try again.");
        hasRestoredResultsRef.current = false;
      }
    })();
  }, [pathname, searchData, formik.values, triggerSearch]);

  const setChatSearchData = useCallback((data: SearchData) => {
    setSearchError(null);
    setSearchSource("chat");
    setSearchData(data);
    hasRestoredResultsRef.current = true;
  }, []);

  const setSearchInput = useCallback(
    (patch: SearchInputPatch) => {
      for (const [key, value] of Object.entries(patch) as [
        keyof SearchInputs,
        SearchInputs[keyof SearchInputs],
      ][]) {
        void formik.setFieldValue(key, value);
      }
    },
    [formik],
  );

  const submitSearch = useCallback(() => {
    void formik.submitForm();
  }, [formik]);

  const refreshSearch = useCallback(
    (patch?: SearchInputPatch) => {
      void runSearch(patch ? { ...formik.values, ...patch } : formik.values);
    },
    [formik.values, runSearch],
  );

  const refreshMapBounds = useCallback(
    (bounds: string) => {
      void runSearch({ ...formik.values, bounds, includeMapPins: true });
    },
    [formik.values, runSearch],
  );

  const viewType = formik.values.viewType ?? DEFAULT_VIEW_TYPE;

  const setViewType = useCallback(
    (nextViewType: SearchViewType) => {
      void formik.setFieldValue("viewType", nextViewType);
      if (nextViewType === "map") {
        void formik.setFieldValue("includeMapPins", true);
        void runSearch({
          ...formik.values,
          viewType: nextViewType,
          includeMapPins: true,
        });
      }
    },
    [formik, runSearch],
  );

  const value = useMemo<SearchContextValue>(
    () => ({
      searchInputs: formik.values,
      formik,
      viewType,
      setSearchInput,
      setViewType,
      submitSearch,
      refreshSearch,
      refreshMapBounds,
      searchData,
      searchSource,
      setChatSearchData,
      isSearching: isFetching || formik.isSubmitting,
      searchError,
    }),
    [
      formik,
      viewType,
      setSearchInput,
      setViewType,
      submitSearch,
      refreshSearch,
      refreshMapBounds,
      searchData,
      searchSource,
      setChatSearchData,
      isFetching,
      searchError,
    ],
  );

  return (
    <SearchContext.Provider value={value}>
      <FormikProvider value={formik}>{children}</FormikProvider>
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
};
