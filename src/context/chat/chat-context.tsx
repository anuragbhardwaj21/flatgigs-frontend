import { buildSearchQueryFromSlots, slotsAreSearchable } from "@/context/chat/build-search-query-from-slots";
import {
  createAssistantChatMessage,
  normalizeChatMessages,
} from "@/context/chat/normalize-chat-messages";
import { normalizeAssistantResults } from "@/context/chat/normalize-chat-search";
import { useSearch } from "@/context/search/search-context";
import {
  createChatWebSocket,
  type ChatWebSocketClient,
} from "@/services/chat-websocket";
import { useLazySearchQuery } from "@/store/services/search-api";
import type {
  AssistantHistoryData,
  AssistantMessageData,
  AssistantResultsData,
  AssistantStatusData,
  ChatMessage,
  ChatStatus,
  ConversationState,
  DoneData,
  StateUpdatedData,
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

/** First message in a session uses chat.start; every follow-up uses chat.message */
const shouldUseChatMessage = (
  conversationId: string | null,
  messages: ChatMessage[],
): boolean => {
  if (conversationId) return true;
  return messages.some((message) => message.role === "user");
};

type ChatContextValue = {
  messages: ChatMessage[];
  conversationState: ConversationState | null;
  status: ChatStatus;
  statusLabel: string | null;
  lastError: string | null;
  isWsReady: boolean;
  isBusy: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  sendMessage: (text: string) => void;
  cancelChat: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setChatSearchData, searchData } = useSearch();
  const [triggerSearch] = useLazySearchQuery();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationState, setConversationState] = useState<ConversationState | null>(
    null,
  );
  const [status, setStatus] = useState<ChatStatus>("connecting");
  const [statusLabel, setStatusLabel] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isWsReady, setIsWsReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const wsRef = useRef<ChatWebSocketClient | null>(null);
  const optimisticRef = useRef<ChatMessage[]>([]);

  const refetchListingCards = useCallback(
    async (state: ConversationState | null) => {
      const query = buildSearchQueryFromSlots(state?.slots);
      if (!query) return;

      try {
        const result = await triggerSearch(query).unwrap();
        setChatSearchData(result);
      } catch {
        /* cards optional on reconnect */
      }
    },
    [setChatSearchData, triggerSearch],
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

  const appendAssistantMessage = useCallback((data: AssistantMessageData) => {
    optimisticRef.current = [];
    const next = createAssistantChatMessage(data);
    setMessages((current) => {
      if (current.some((message) => message.id === next.id)) return current;
      return [...current, next].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    });
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
          setStatus(mapAssistantStatus(data.status));
          setStatusLabel(data.label ?? null);
          break;
        }

        case "assistant.message": {
          const data = frame.envelope.data as AssistantMessageData | null;
          if (!data?.message) return;
          appendAssistantMessage(data);
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
          break;
        }

        case "assistant.results": {
          const data = frame.envelope.data as AssistantResultsData | null;
          if (!data) return;
          optimisticRef.current = [];

          if (data.message?.trim()) {
            appendAssistantMessage({
              message: data.message.trim(),
              messageType: "transition",
            });
          }

          setChatSearchData(normalizeAssistantResults(data));
          setDrawerOpen(true);
          navigate(RESULTS_PATH);
          break;
        }

        case "step_started":
          setStatus("searching");
          break;

        case "done": {
          const data = frame.envelope.data as DoneData | null;
          if (data?.answer?.trim()) {
            appendAssistantMessage({
              message: data.answer.trim(),
              messageType: "answer",
            });
          }
          setStatus("idle");
          break;
        }

        case "citation":
        case "step_completed":
          break;

        default:
          break;
      }
    },
    [
      appendAssistantMessage,
      applyHistory,
      navigate,
      pathname,
      setChatSearchData,
    ],
  );

  useEffect(() => {
    const client = createChatWebSocket(handleWsFrame, (connected) => {
      setIsWsReady(connected);
      if (!connected) setStatus("connecting");
    });
    wsRef.current = client;

    return () => {
      client.close();
      wsRef.current = null;
    };
  }, [handleWsFrame]);

  useEffect(() => {
    if (pathname !== RESULTS_PATH) return;
    if (searchData) return;
    if (!slotsAreSearchable(conversationState?.slots)) return;

    void refetchListingCards(conversationState);
  }, [pathname, searchData, conversationState, refetchListingCards]);

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

      if (useChatMessage) {
        client.sendChatMessage(trimmed);
      } else {
        client.sendChatStart(trimmed);
      }
    },
    [conversationId, messages],
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
      lastError,
      isWsReady,
      isBusy,
      drawerOpen,
      setDrawerOpen,
      openDrawer,
      closeDrawer,
      sendMessage,
      cancelChat,
    }),
    [
      messages,
      conversationState,
      status,
      statusLabel,
      lastError,
      isWsReady,
      isBusy,
      drawerOpen,
      openDrawer,
      closeDrawer,
      sendMessage,
      cancelChat,
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
