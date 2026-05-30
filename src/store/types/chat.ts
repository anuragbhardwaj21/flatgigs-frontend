import type { SearchData, SearchListingItem, SearchMapPin } from "./search";

export type WsEnvelopeMeta = {
  code: number;
  message: string;
  retryable?: boolean;
  [key: string]: unknown;
};

export type WsFrame<T> = {
  event: string;
  envelope: {
    data: T | null;
    success: boolean;
    meta: WsEnvelopeMeta;
  };
};

export type ChatClientEvent = "chat.start" | "chat.message" | "chat.cancel" | "ping";

export type ChatServerEvent =
  | "connected"
  | "assistant.history"
  | "assistant.status"
  | "assistant.message"
  | "assistant.results"
  | "state.updated"
  | "step_started"
  | "step_completed"
  | "citation"
  | "done"
  | "error";

export type AssistantStatusValue =
  | "online"
  | "thinking"
  | "typing"
  | "searching"
  | "idle";

export type AssistantStatusData = {
  status: AssistantStatusValue;
  label?: string;
  agent?: string;
};

export type AssistantMessageType = "question" | "transition" | "answer";

export type AssistantMessageData = {
  message: string;
  messageType: AssistantMessageType;
  id?: string;
};

export type AssistantResultsData = {
  message?: string;
  items: SearchListingItem[];
  total: number;
  mapPins?: SearchMapPin[];
  chips?: unknown;
  meta?: { facets?: SearchData["facets"]; [key: string]: unknown };
  facets?: SearchData["facets"];
};

export type ChatMessageRole = "user" | "assistant";

export type ChatMessageKind = "text" | "results";

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
  createdAt: string;
  kind?: ChatMessageKind;
  messageType?: AssistantMessageType;
};

export type ConversationSlots = {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  [key: string]: unknown;
};

export type ConversationPhase =
  | "clarifying"
  | "searching"
  | "answering"
  | "complete"
  | string;

export type ConversationState = {
  phase?: ConversationPhase;
  slots?: ConversationSlots;
  missingMandatory?: string[];
  missingFields?: string[];
  parsedFilters?: unknown;
  chips?: unknown;
  [key: string]: unknown;
};

export type AssistantHistoryData = {
  conversationId: string | null;
  state: ConversationState | null;
  messages: ChatMessage[];
  expiresAt?: string;
};

export type ChatSessionData = AssistantHistoryData;

export type StateUpdatedData = {
  parsedFilters?: unknown;
  chips?: unknown;
  phase?: ConversationPhase;
  missingMandatory?: string[];
  missingFields?: string[];
};

export type CitationData = {
  listingId: string;
  reviewId?: string;
  excerpt?: string;
};

export type DoneData = {
  answer?: string;
  usage?: unknown;
  meta?: unknown;
};

/** UI-facing status mapped from assistant.status + connection */
export type ChatStatus =
  | "connecting"
  | "ready"
  | "idle"
  | "thinking"
  | "typing"
  | "searching"
  | "clarifying"
  | "error";

export type ChatSearchResultsData = SearchData;

export const isChatBusy = (status: ChatStatus): boolean =>
  status === "connecting" ||
  status === "thinking" ||
  status === "typing" ||
  status === "searching";

export const mapAssistantStatus = (value: AssistantStatusValue): ChatStatus => {
  switch (value) {
    case "thinking":
      return "thinking";
    case "typing":
      return "typing";
    case "searching":
      return "searching";
    case "idle":
      return "idle";
    case "online":
    default:
      return "ready";
  }
};
