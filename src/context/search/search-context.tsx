import { buildSearchQuery } from "@/context/search/build-search-query";
import type { SearchInputPatch, SearchInputs } from "@/context/search/types";
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

type SearchContextValue = {
  searchInputs: SearchInputs;
  formik: FormikProps<SearchInputs>;
  setSearchInput: (patch: SearchInputPatch) => void;
  submitSearch: () => void;
  refreshSearch: (patch?: SearchInputPatch) => void;
  searchData: SearchData | null;
  isSearching: boolean;
  searchError: string | null;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [triggerSearch, { isFetching }] = useLazySearchQuery();
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const hasRestoredResultsRef = useRef(false);

  const runSearch = useCallback(
    async (values: SearchInputs, options?: { navigate?: boolean }) => {
      setSearchError(null);

      const query = buildSearchQuery(values);
      if (!query) return false;

      try {
        const result = await triggerSearch(query).unwrap();
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
        setSearchData(result);
      } catch {
        setSearchError("Search failed. Please try again.");
        hasRestoredResultsRef.current = false;
      }
    })();
  }, [pathname, searchData, formik.values, triggerSearch]);

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

  const value = useMemo<SearchContextValue>(
    () => ({
      searchInputs: formik.values,
      formik,
      setSearchInput,
      submitSearch,
      refreshSearch,
      searchData,
      isSearching: isFetching || formik.isSubmitting,
      searchError,
    }),
    [
      formik,
      setSearchInput,
      submitSearch,
      refreshSearch,
      searchData,
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
