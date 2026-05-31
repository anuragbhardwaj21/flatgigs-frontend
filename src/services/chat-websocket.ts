import { getSessionToken } from "@/hooks/use-session-id";
import type { WsFrame } from "@/store/types/chat";

export type ChatWsEventHandler = (frame: WsFrame<unknown>) => void;

const getWsBaseUrl = (): string => {
  const explicit = (import.meta.env.VITE_WS_URL ?? "").trim();
  if (explicit) {
    const url = new URL(explicit.replace(/\/$/, "") + "/");
    if (!url.pathname.endsWith("/ws")) url.pathname = "/ws";
    return url.toString().replace(/\/$/, "");
  }

  const apiTarget = (import.meta.env.VITE_API_PROXY_TARGET ?? "").trim();
  if (apiTarget) {
    const url = new URL(apiTarget.replace(/\/$/, "") + "/");
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/ws";
    url.search = "";
    return url.toString().replace(/\/$/, "");
  }

  if (import.meta.env.DEV && typeof window !== "undefined") {
    return `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`;
  }

  return "ws://localhost:4000/ws";
};

export const buildChatWebSocketUrl = (token: string): string => {
  const base = getWsBaseUrl();
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}token=${encodeURIComponent(token)}`;
};

export type ChatWebSocketClient = {
  sendChatStart: (query: string) => void;
  sendChatMessage: (message: string) => void;
  sendCancel: () => void;
  sendPing: () => void;
  close: () => void;
  readyState: () => number;
};

const sendFrame = (ws: WebSocket, event: string, data: Record<string, unknown>) => {
  if (ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ event, data }));
};

const releaseWebSocket = (ws: WebSocket) => {
  const state = ws.readyState;
  if (state === WebSocket.CLOSED || state === WebSocket.CLOSING) return;

  ws.onmessage = null;

  if (state === WebSocket.CONNECTING) {
    ws.onopen = () => {
      ws.onopen = null;
      ws.onerror = null;
      ws.onclose = null;
      ws.close(1000, "client_release");
    };
    ws.onerror = null;
    ws.onclose = null;
    return;
  }

  ws.onopen = null;
  ws.onerror = null;
  ws.onclose = null;
  ws.close(1000, "client_release");
};

export const createChatWebSocket = (
  onEvent: ChatWsEventHandler,
  onConnectionChange?: (connected: boolean) => void,
): ChatWebSocketClient => {
  const token = getSessionToken();
  const ws = new WebSocket(buildChatWebSocketUrl(token));
  let released = false;

  ws.onopen = () => {
    if (released) {
      ws.close(1000, "client_release");
      return;
    }
    onConnectionChange?.(true);
  };

  ws.onclose = () => {
    if (!released) onConnectionChange?.(false);
  };

  ws.onerror = () => {
    if (!released) onConnectionChange?.(false);
  };

  ws.onmessage = (event) => {
    if (released) return;
    try {
      const frame = JSON.parse(event.data as string) as WsFrame<unknown>;
      onEvent(frame);
    } catch {
      onEvent({
        event: "error",
        envelope: {
          data: null,
          success: false,
          meta: { code: 400, message: "Invalid WebSocket message" },
        },
      });
    }
  };

  return {
    sendChatStart(query: string) {
      sendFrame(ws, "chat.start", { query });
    },
    sendChatMessage(message: string) {
      sendFrame(ws, "chat.message", { message });
    },
    sendCancel() {
      sendFrame(ws, "chat.cancel", {});
    },
    sendPing() {
      sendFrame(ws, "ping", {});
    },
    close() {
      released = true;
      releaseWebSocket(ws);
    },
    readyState: () => ws.readyState,
  };
};
