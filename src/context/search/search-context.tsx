
import { buildSearchQuery } from "@/context/search/build-search-query";
import { DEFAULT_VIEW_TYPE, SEARCH_PAGE_LIMIT } from "@/context/search/constants";
import { isAbortedSearchError } from "@/context/search/is-aborted-search";
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
import type { AssistantResultsData } from "@/store/types/chat";
import { useLazySearchQuery } from "@/store/services/search-api";
import type { SearchData } from "@/store/types/search";
import { buildAssistantSearchPayload } from "@/context/chat/apply-assistant-search";
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
  loadMoreResults: () => void;
  refreshMapBounds: (bounds: string) => void;
  searchData: SearchData | null;
  searchSource: SearchSource;
  applyChatSearchFromAssistant: (data: AssistantResultsData) => void;
  applyChatFiltersFromState: (data: {
    chips?: AssistantResultsData["chips"];
    inputs?: AssistantResultsData["inputs"];
  }) => void;
  hasMoreResults: boolean;
  isLoadingMore: boolean;
  isSearching: boolean;
  searchError: string | null;
};

const SearchContext = createContext<SearchContextValue | null>(null);

const mergeSearchPages = (prev: SearchData | null, next: SearchData, page: number): SearchData => {
  if (!prev || page <= 1) return next;
  const seen = new Set(prev.items.map((item) => item.id));
  const mergedItems = [
    ...prev.items,
    ...next.items.filter((item) => !seen.has(item.id)),
  ];
  return {
    ...next,
    items: mergedItems,
    mapPins: page === 1 ? next.mapPins : [...(prev.mapPins ?? []), ...next.mapPins],
  };
};

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [triggerSearch, { isFetching }] = useLazySearchQuery();
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [searchSource, setSearchSource] = useState<SearchSource>("form");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasRestoredResultsRef = useRef(false);
  const activeSearchRef = useRef<ReturnType<typeof triggerSearch> | null>(null);
  const searchGenerationRef = useRef(0);

  const cancelActiveSearch = useCallback(() => {
    activeSearchRef.current?.abort();
    activeSearchRef.current = null;
  }, []);

  const runSearch = useCallback(
    async (
      values: SearchInputs,
      options?: {
        navigate?: boolean;
        append?: boolean;
        page?: number;
        preferCache?: boolean;
      },
    ) => {
      const page = options?.page ?? values.page ?? 1;
      const queryValues = {
        ...values,
        page,
        limit: values.limit ?? SEARCH_PAGE_LIMIT,
      };
      const query = buildSearchQuery(queryValues);
      if (!query) return false;

      cancelActiveSearch();
      const generation = ++searchGenerationRef.current;
      setSearchError(null);

      const request = triggerSearch(query, options?.preferCache ?? true);
      activeSearchRef.current = request;

      try {
        const result = await request.unwrap();
        if (generation !== searchGenerationRef.current) return false;

        setSearchSource("form");
        setSearchData((prev) =>
          options?.append ? mergeSearchPages(prev, result, page) : result,
        );
        persistSearchInputs(queryValues);
        if (options?.navigate) navigate(RESULTS_PATH);
        return true;
      } catch (error) {
        if (generation !== searchGenerationRef.current) return false;
        if (isAbortedSearchError(error)) return false;
        setSearchError("Search failed. Please try again.");
        return false;
      } finally {
        if (activeSearchRef.current === request) {
          activeSearchRef.current = null;
        }
        setIsLoadingMore(false);
      }
    },
    [cancelActiveSearch, navigate, triggerSearch],
  );

  const formik = useFormik<SearchInputs>({
    initialValues: {
      ...loadPersistedSearchInputs(),
      limit: SEARCH_PAGE_LIMIT,
      page: 1,
    },
    validationSchema: searchValidationSchema,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting }) => {
      await runSearch({ ...values, page: 1 }, { navigate: true });
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

    if (searchSource === "chat" && searchData) return;
    if (searchData || hasRestoredResultsRef.current) return;

    const query = buildSearchQuery(formik.values);
    if (!query) return;

    hasRestoredResultsRef.current = true;

    void (async () => {
      setSearchError(null);
      try {
        const result = await triggerSearch(query, true).unwrap();
        setSearchSource("form");
        setSearchData(result);
      } catch {
        setSearchError("Search failed. Please try again.");
        hasRestoredResultsRef.current = false;
      }
    })();
  }, [pathname, searchData, searchSource, formik.values, triggerSearch]);

  const applyInputPatch = useCallback(
    (patch: Partial<SearchInputs>) => {
      for (const [key, value] of Object.entries(patch) as [
        keyof SearchInputs,
        SearchInputs[keyof SearchInputs],
      ][]) {
        void formik.setFieldValue(key, value);
      }
      persistSearchInputs({ ...formik.values, ...patch });
    },
    [formik],
  );

  const applyChatSearchFromAssistant = useCallback(
    (data: AssistantResultsData) => {
      const { searchData: nextData, inputPatch } = buildAssistantSearchPayload(data);
      setSearchError(null);
      setSearchSource("chat");
      setSearchData(nextData);
      hasRestoredResultsRef.current = true;
      applyInputPatch(inputPatch);
    },
    [applyInputPatch],
  );

  const applyChatFiltersFromState = useCallback(
    (data: {
      chips?: AssistantResultsData["chips"];
      inputs?: AssistantResultsData["inputs"];
    }) => {
      const { inputPatch } = buildAssistantSearchPayload({
        items: [],
        total: 0,
        chips: data.chips,
        inputs: data.inputs,
      });
      applyInputPatch(inputPatch);
    },
    [applyInputPatch],
  );

  const setSearchInput = useCallback(
    (patch: SearchInputPatch) => {
      applyInputPatch(patch);
    },
    [applyInputPatch],
  );

  const submitSearch = useCallback(() => {
    void formik.submitForm();
  }, [formik]);

  const refreshSearch = useCallback(
    (patch?: SearchInputPatch) => {
      const merged = { ...formik.values, ...patch, page: patch?.page ?? 1 };
      void formik.setFieldValue("page", merged.page ?? 1);
      void runSearch(merged);
    },
    [formik.values, runSearch],
  );

  const loadMoreResults = useCallback(() => {
    const currentPage = formik.values.page ?? 1;
    const nextPage = currentPage + 1;
    if (searchData && searchData.items.length >= searchData.total) return;
    setIsLoadingMore(true);
    void formik.setFieldValue("page", nextPage);
    void runSearch(
      { ...formik.values, page: nextPage },
      { append: true, page: nextPage },
    );
  }, [formik, runSearch, searchData]);

  const refreshMapBounds = useCallback(
    (bounds: string) => {
      void formik.setFieldValue("bounds", bounds);
      void formik.setFieldValue("page", 1);
      void runSearch(
        { ...formik.values, bounds, includeMapPins: true, page: 1 },
        { preferCache: false },
      );
    },
    [formik, runSearch],
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
          page: 1,
        });
      }
    },
    [formik, runSearch],
  );

  const hasMoreResults = useMemo(() => {
    if (!searchData) return false;
    return searchData.items.length < searchData.total;
  }, [searchData]);

  const value = useMemo<SearchContextValue>(
    () => ({
      searchInputs: formik.values,
      formik,
      viewType,
      setSearchInput,
      setViewType,
      submitSearch,
      refreshSearch,
      loadMoreResults,
      refreshMapBounds,
      searchData,
      searchSource,
      applyChatSearchFromAssistant,
      applyChatFiltersFromState,
      hasMoreResults,
      isLoadingMore,
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
      loadMoreResults,
      refreshMapBounds,
      searchData,
      searchSource,
      applyChatSearchFromAssistant,
      applyChatFiltersFromState,
      hasMoreResults,
      isLoadingMore,
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
