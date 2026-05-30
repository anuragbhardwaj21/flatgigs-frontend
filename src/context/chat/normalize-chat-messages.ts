import type { ChatMessage, ChatMessageRole } from "@/store/types/chat";

type RawChatMessage = {
  id?: string;
  role?: string;
  content?: string;
  message?: string;
  text?: string;
  createdAt?: string;
  kind?: string;
  messageType?: ChatMessage["messageType"];
};

const resolveRole = (role?: string): ChatMessageRole =>
  role === "user" ? "user" : "assistant";

const resolveContent = (raw: RawChatMessage): string =>
  raw.content?.trim() ||
  raw.message?.trim() ||
  raw.text?.trim() ||
  "";

export const normalizeChatMessage = (raw: RawChatMessage, index: number): ChatMessage | null => {
  const content = resolveContent(raw);
  if (!content) return null;

  return {
    id: raw.id ?? `msg-${index}-${content.slice(0, 12)}`,
    role: resolveRole(raw.role),
    content,
    createdAt: raw.createdAt ?? new Date(0).toISOString(),
    kind: raw.kind === "results" ? "results" : "text",
    messageType: raw.messageType,
  };
};

export const normalizeChatMessages = (raw: RawChatMessage[] | undefined): ChatMessage[] => {
  if (!raw?.length) return [];

  return raw
    .map((item, index) => normalizeChatMessage(item, index))
    .filter((message): message is ChatMessage => message != null)
    .sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
};

export const createAssistantChatMessage = (
  data: { message: string; messageType?: ChatMessage["messageType"]; id?: string },
  kind: ChatMessage["kind"] = "text",
): ChatMessage => ({
  id: data.id ?? `asst-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role: "assistant",
  content: data.message,
  createdAt: new Date().toISOString(),
  kind,
  messageType: data.messageType,
});
