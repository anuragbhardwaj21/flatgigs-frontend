import { buildSearchQueryFromSlots, slotsAreSearchable } from "@/context/chat/build-search-query-from-slots";
import { persistChatTrace } from "@/context/chat/persist-traces";
import { normalizeAssistantResults } from "@/context/chat/normalize-chat-search";
import {
  createAssistantChatMessage,
  createTraceRecordedChatMessage,
  normalizeChatMessages,
} from "@/context/chat/normalize-chat-messages";
import { useSearch } from "@/context/search/search-context";
import {
  createChatWebSocket,
  type ChatWebSocketClient,
} from "@/services/chat-websocket";
import type {
  AgentTimelineStep,
  AssistantHistoryData,
  AssistantMessageData,
  AssistantResultsData,
  AssistantStatusData,
  ChatCitation,
  ChatMessage,
  ChatStatus,
  CitationData,
  ConversationState,
  DoneData,
  StateUpdatedData,
  StepCompletedData,
  StepStartedData,
  WsFrame,
} from "@/store/types/chat";
import { isChatBusy, mapAssistantStatus } from "@/store/types/chat";
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
const MAX_TIMELINE_STEPS = 24;
const MAX_CITATIONS = 12;

const createOptimisticMessage = (content: string): ChatMessage => ({
  id: `local-${Date.now()}`,
  role: "user",
  content,
  createdAt: new Date().toISOString(),
  kind: "text",
});

const mergeMessages = (
  serverMessages: ChatMessage[],
  optimistic: ChatMessage[],
): ChatMessage[] => {
  const byId = new Map<string, ChatMessage>();
  for (const message of serverMessages) byId.set(message.id, message);
  for (const message of optimistic) byId.set(message.id, message);
  return [...byId.values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

const shouldUseChatMessage = (
  conversationId: string | null,
  messages: ChatMessage[],
): boolean => {
  if (conversationId) return true;
  return messages.some((message) => message.role === "user");
};

const pushTimelineStep = (
  steps: AgentTimelineStep[],
  next: Omit<AgentTimelineStep, "id" | "at" | "status"> & { status?: AgentTimelineStep["status"] },
): AgentTimelineStep[] => {
  const updated = steps.map((step) =>
    step.status === "active" ? { ...step, status: "done" as const } : step,
  );
  const entry: AgentTimelineStep = {
    id: `${next.agent ?? "agent"}-${next.step ?? "step"}-${Date.now()}`,
    at: new Date().toISOString(),
    status: next.status ?? "active",
    agent: next.agent,
    step: next.step,
    label: next.label,
    detail: next.detail,
    progress: next.progress,
  };
  return [...updated, entry].slice(-MAX_TIMELINE_STEPS);
};

type ChatContextValue = {
  messages: ChatMessage[];
  conversationState: ConversationState | null;
  status: ChatStatus;
  statusLabel: string | null;
  activeStatus: AssistantStatusData | null;
  agentTimeline: AgentTimelineStep[];
  citations: ChatCitation[];
  lastError: string | null;
  isWsReady: boolean;
  isBusy: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  sendMessage: (text: string) => void;
  cancelChat: () => void;
  clearTimeline: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    hydrateSearch,
    fetchSearch,
    searchData,
    searchSource,
  } = useSearch();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationState, setConversationState] = useState<ConversationState | null>(
    null,
  );
  const [status, setStatus] = useState<ChatStatus>("connecting");
  const [statusLabel, setStatusLabel] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<AssistantStatusData | null>(null);
  const [agentTimeline, setAgentTimeline] = useState<AgentTimelineStep[]>([]);
  const [citations, setCitations] = useState<ChatCitation[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isWsReady, setIsWsReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const wsRef = useRef<ChatWebSocketClient | null>(null);
  const optimisticRef = useRef<ChatMessage[]>([]);
  const citationsRef = useRef<ChatCitation[]>([]);
  const resultsAppliedRef = useRef(false);

  const refetchListingCards = useCallback(
    (state: ConversationState | null) => {
      if (resultsAppliedRef.current || searchSource === "chat") return;
      const query = buildSearchQueryFromSlots(state?.slots);
      if (!query) return;

      fetchSearch({
        city: query.city,
        checkIn: query.checkIn,
        checkOut: query.checkOut,
        adults: query.adults,
        children: query.children,
        page: 1,
      });
    },
    [fetchSearch, searchSource],
  );

  const applyHistory = useCallback(
    (history: AssistantHistoryData, options?: { refetchCards?: boolean }) => {
      optimisticRef.current = [];
      const normalized = normalizeChatMessages(
        history.messages as Parameters<typeof normalizeChatMessages>[0],
      );
      setMessages(normalized);
      setConversationId(history.conversationId ?? null);
      if (history.state) setConversationState(history.state);

      if (options?.refetchCards && slotsAreSearchable(history.state?.slots)) {
        void refetchListingCards(history.state);
      }
    },
    [refetchListingCards],
  );

  const appendChatMessage = useCallback((next: ChatMessage) => {
    setMessages((current) => {
      if (current.some((message) => message.id === next.id)) return current;
      return [...current, next].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    });
  }, []);

  const appendAssistantMessage = useCallback(
    (data: AssistantMessageData, options?: { animate?: boolean; citations?: ChatCitation[]; resultsTotal?: number }) => {
      optimisticRef.current = [];
      const next = createAssistantChatMessage(data);
      if (options?.animate) next.animate = true;
      if (options?.citations?.length) next.citations = options.citations;
      if (options?.resultsTotal != null) {
        next.kind = "results";
        next.resultsTotal = options.resultsTotal;
      }
      appendChatMessage(next);
    },
    [appendChatMessage],
  );

  const appendTraceRecordedMessage = useCallback(() => {
    optimisticRef.current = [];
    appendChatMessage(createTraceRecordedChatMessage());
  }, [appendChatMessage]);

  const clearTimeline = useCallback(() => {
    setAgentTimeline([]);
    setCitations([]);
    citationsRef.current = [];
  }, []);

  const handleWsFrame = useCallback(
    (frame: WsFrame<unknown>) => {
      if (!frame.envelope.success || frame.event === "error") {
        const message =
          frame.envelope.meta?.message ?? "Something went wrong. Please try again.";
        setLastError(message);
        setStatus("error");
        return;
      }

      setLastError(null);

      switch (frame.event) {
        case "connected":
          setIsWsReady(true);
          setStatus((current) =>
            current === "connecting" ? "ready" : current,
          );
          break;

        case "assistant.history": {
          const data = frame.envelope.data as AssistantHistoryData | null;
          if (!data) return;
          applyHistory(data, { refetchCards: pathname === RESULTS_PATH });
          break;
        }

        case "assistant.status": {
          const data = frame.envelope.data as AssistantStatusData | null;
          if (!data) return;
          setActiveStatus(data);
          setStatus(mapAssistantStatus(data.status));
          setStatusLabel(data.label ?? null);
          if (data.label) {
            setAgentTimeline((steps) =>
              pushTimelineStep(steps, {
                agent: data.agent,
                step: data.step,
                label: data.label!,
                detail: data.detail,
                progress: data.progress,
              }),
            );
          }
          break;
        }

        case "assistant.message": {
          const data = frame.envelope.data as AssistantMessageData | null;
          if (!data?.message) return;
          appendAssistantMessage(data, {
            animate: data.messageType === "answer",
            citations: citationsRef.current.length
              ? [...citationsRef.current]
              : undefined,
          });
          if (data.messageType === "question") {
            setStatus("clarifying");
          }
          setDrawerOpen(true);
          break;
        }

        case "state.updated": {
          const data = frame.envelope.data as StateUpdatedData | null;
          if (!data) return;
          setConversationState((prev) => ({
            ...(prev ?? {}),
            phase: data.phase ?? prev?.phase,
            missingMandatory: data.missingMandatory ?? prev?.missingMandatory,
            missingFields: data.missingFields ?? prev?.missingFields,
            chips: data.chips ?? prev?.chips,
            parsedFilters: data.parsedFilters ?? prev?.parsedFilters,
            slots: prev?.slots,
          }));
          hydrateSearch({
            chips: data.chips,
            inputs: data.inputs,
            selectedFacets: data.selectedFacets,
            source: "chat",
          });
          break;
        }

        case "assistant.results": {
          const data = frame.envelope.data as AssistantResultsData | null;
          if (!data) return;
          optimisticRef.current = [];
          resultsAppliedRef.current = true;

          const requestId =
            frame.envelope.meta?.requestId ??
            (typeof data.meta?.requestId === "string" ? data.meta.requestId : undefined);
          if (requestId) {
            persistChatTrace({
              requestId,
              message: data.message?.trim() ?? "",
              createdAt: new Date().toISOString(),
            });
          }

          if (data.message?.trim()) {
            appendAssistantMessage({
              message: data.message.trim(),
              messageType: "transition",
            });
          }

          appendTraceRecordedMessage();

          hydrateSearch({
            data: normalizeAssistantResults(data),
            inputs: data.inputs,
            chips: data.chips,
            selectedFacets: data.selectedFacets,
            source: "chat",
          });
          setDrawerOpen(false);
          navigate(RESULTS_PATH);
          break;
        }

        case "step_started": {
          const data = frame.envelope.data as StepStartedData | null;
          setStatus("searching");
          if (data?.step) {
            const step = data.step;
            setAgentTimeline((steps) =>
              pushTimelineStep(steps, {
                agent: data.agent,
                step,
                label: step.replace(/_/g, " "),
              }),
            );
          }
          break;
        }

        case "step_completed": {
          const data = frame.envelope.data as StepCompletedData | null;
          if (data?.step) {
            setAgentTimeline((steps) =>
              steps.map((step) =>
                step.step === data.step && step.status === "active"
                  ? { ...step, status: "done" }
                  : step,
              ),
            );
          }
          break;
        }

        case "citation": {
          const data = frame.envelope.data as CitationData | null;
          if (!data?.listingId) return;
          const citation: ChatCitation = {
            listingId: data.listingId,
            reviewId: data.reviewId,
            excerpt: data.excerpt,
          };
          setCitations((prev) => {
            const next = [...prev, citation].slice(-MAX_CITATIONS);
            citationsRef.current = next;
            return next;
          });
          break;
        }

        case "done": {
          const data = frame.envelope.data as DoneData | null;
          if (data?.answer?.trim()) {
            appendAssistantMessage(
              {
                message: data.answer.trim(),
                messageType: "answer",
              },
              {
                animate: true,
                citations: citationsRef.current.length
                  ? [...citationsRef.current]
                  : undefined,
              },
            );
          }
          setStatus("idle");
          setAgentTimeline((steps) =>
            steps.map((step) =>
              step.status === "active" ? { ...step, status: "done" } : step,
            ),
          );
          break;
        }

        default:
          break;
      }
    },
    [
      appendAssistantMessage,
      appendTraceRecordedMessage,
      hydrateSearch,
      applyHistory,
      navigate,
      pathname,
    ],
  );

  const handleWsFrameRef = useRef(handleWsFrame);
  handleWsFrameRef.current = handleWsFrame;

  useEffect(() => {
    const client = createChatWebSocket(
      (frame) => handleWsFrameRef.current(frame),
      (connected) => {
        setIsWsReady(connected);
        if (!connected) setStatus("connecting");
      },
    );
    wsRef.current = client;

    return () => {
      client.close();
      wsRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (pathname !== RESULTS_PATH) return;
    if (searchData) return;
    if (searchSource === "chat") return;
    if (!slotsAreSearchable(conversationState?.slots)) return;

    void refetchListingCards(conversationState);
  }, [
    pathname,
    searchData,
    searchSource,
    conversationState,
    refetchListingCards,
  ]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const client = wsRef.current;
      if (!client || client.readyState() !== WebSocket.OPEN) {
        setLastError("Connection not ready. Please wait a moment and try again.");
        setStatus("error");
        return;
      }

      const useChatMessage = shouldUseChatMessage(conversationId, messages);

      const optimistic = createOptimisticMessage(trimmed);
      optimisticRef.current = [...optimisticRef.current, optimistic];
      setMessages((current) => mergeMessages(current, optimisticRef.current));
      setDrawerOpen(true);
      setLastError(null);
      clearTimeline();
      citationsRef.current = [];
      setCitations([]);
      resultsAppliedRef.current = false;

      if (useChatMessage) {
        client.sendChatMessage(trimmed);
      } else {
        client.sendChatStart(trimmed);
      }
    },
    [clearTimeline, conversationId, messages],
  );

  const cancelChat = useCallback(() => {
    wsRef.current?.sendCancel();
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const isBusy = isChatBusy(status);

  const value = useMemo<ChatContextValue>(
    () => ({
      messages,
      conversationState,
      status,
      statusLabel,
      activeStatus,
      agentTimeline,
      citations,
      lastError,
      isWsReady,
      isBusy,
      drawerOpen,
      setDrawerOpen,
      openDrawer,
      closeDrawer,
      sendMessage,
      cancelChat,
      clearTimeline,
    }),
    [
      messages,
      conversationState,
      status,
      statusLabel,
      activeStatus,
      agentTimeline,
      citations,
      lastError,
      isWsReady,
      isBusy,
      drawerOpen,
      openDrawer,
      closeDrawer,
      sendMessage,
      cancelChat,
      clearTimeline,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
