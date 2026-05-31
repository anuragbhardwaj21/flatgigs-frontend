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

export type AssistantAgent = "concierge" | "retrieval" | "review" | string;

export type AssistantStatusValue =
  | "online"
  | "idle"
  | "thinking"
  | "typing"
  | "searching"
  | "summarizing"
  | "error";

export type AssistantStatusData = {
  status: AssistantStatusValue;
  label?: string;
  agent?: AssistantAgent;
  phase?: ConversationPhase;
  step?: string;
  progress?: number;
  detail?: string;
  requestId?: string;
};

export type AssistantChip = {
  label: string;
  value: string;
};

export type AssistantMessageType = "question" | "transition" | "answer";

export type AssistantMessageData = {
  message: string;
  messageType: AssistantMessageType;
  id?: string;
};

export type AssistantSelectedFacets = {
  priceRange?: { min: number | null; max: number | null };
  propertyTypes?: Record<string, boolean>;
  amenities?: Record<string, boolean>;
  ratingMin?: number | null;
  city?: string | null;
  dates?: { checkIn?: string; checkOut?: string } | null;
  guests?: { adults?: number; children?: number; rooms?: number } | null;
  vibe?: string | null;
  areaPreference?: string | null;
};

export type AssistantResultsData = {
  message?: string;
  items: SearchListingItem[];
  total: number;
  mapPins?: SearchMapPin[];
  chips?: AssistantChip[];
  inputs?: {
    city?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
    rooms?: number;
    priceMin?: number;
    priceMax?: number;
  };
  meta?: { facets?: SearchData["facets"]; [key: string]: unknown };
  facets?: SearchData["facets"];
  selectedFacets?: AssistantSelectedFacets;
};

export type ChatMessageRole = "user" | "assistant";

export type ChatMessageKind = "text" | "results";

export type ChatCitation = {
  listingId: string;
  reviewId?: string;
  excerpt?: string;
};

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
  createdAt: string;
  kind?: ChatMessageKind;
  messageType?: AssistantMessageType;
  citations?: ChatCitation[];
  animate?: boolean;
  resultsTotal?: number;
};

export type AgentTimelineStep = {
  id: string;
  agent?: AssistantAgent;
  step?: string;
  label: string;
  detail?: string;
  progress?: number;
  status: "active" | "done";
  at: string;
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
  chips?: AssistantChip[];
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
  chips?: AssistantChip[];
  inputs?: AssistantResultsData["inputs"];
  selectedFacets?: AssistantSelectedFacets;
  phase?: ConversationPhase;
  missingMandatory?: string[];
  missingFields?: string[];
};

export type CitationData = {
  listingId: string;
  reviewId?: string;
  excerpt?: string;
};

export type StepStartedData = {
  step?: string;
  agent?: AssistantAgent;
};

export type StepCompletedData = {
  step?: string;
  agent?: AssistantAgent;
  durationMs?: number;
};

export type DoneData = {
  answer?: string;
  usage?: unknown;
  meta?: unknown;
};

export type ChatStatus =
  | "connecting"
  | "ready"
  | "idle"
  | "thinking"
  | "typing"
  | "searching"
  | "summarizing"
  | "clarifying"
  | "error";

export type ChatSearchResultsData = SearchData;

export const isChatBusy = (status: ChatStatus): boolean =>
  status === "connecting" ||
  status === "thinking" ||
  status === "typing" ||
  status === "searching" ||
  status === "summarizing";

export const mapAssistantStatus = (value: AssistantStatusValue): ChatStatus => {
  switch (value) {
    case "thinking":
      return "thinking";
    case "typing":
      return "typing";
    case "searching":
      return "searching";
    case "summarizing":
      return "summarizing";
    case "idle":
      return "idle";
    case "error":
      return "error";
    case "online":
    default:
      return "ready";
  }
};
