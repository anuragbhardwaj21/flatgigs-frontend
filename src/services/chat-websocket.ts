import { getSessionToken } from "@/hooks/use-session-id";
import type { WsFrame } from "@/store/types/chat";

export type ChatWsEventHandler = (frame: WsFrame<unknown>) => void;

const PING_INTERVAL_MS = 5_000;
const RECONNECT_DELAY_MS = 5_000;

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
  let released = false;
  let ws: WebSocket | null = null;
  let pingInterval: ReturnType<typeof setInterval> | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  const clearPingInterval = () => {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
  };

  const clearReconnectTimer = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  const startPingInterval = () => {
    clearPingInterval();
    pingInterval = setInterval(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      sendFrame(ws, "ping", {});
    }, PING_INTERVAL_MS);
  };

  const scheduleReconnect = () => {
    if (released || reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      if (!released) connect();
    }, RECONNECT_DELAY_MS);
  };

  const connect = () => {
    clearReconnectTimer();
    clearPingInterval();

    if (released) return;

    const token = getSessionToken();
    const socket = new WebSocket(buildChatWebSocketUrl(token));
    ws = socket;

    socket.onopen = () => {
      if (released) {
        releaseWebSocket(socket);
        return;
      }
      onConnectionChange?.(true);
      sendFrame(socket, "ping", {});
      startPingInterval();
    };

    socket.onclose = () => {
      clearPingInterval();
      if (released) return;
      onConnectionChange?.(false);
      ws = null;
      scheduleReconnect();
    };

    socket.onerror = () => {
      if (!released) onConnectionChange?.(false);
    };

    socket.onmessage = (event) => {
      if (released) return;
      try {
        const frame = JSON.parse(event.data as string) as WsFrame<unknown>;
        if (frame.event === "pong") return;
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
  };

  connect();

  return {
    sendChatStart(query: string) {
      if (ws) sendFrame(ws, "chat.start", { query });
    },
    sendChatMessage(message: string) {
      if (ws) sendFrame(ws, "chat.message", { message });
    },
    sendCancel() {
      if (ws) sendFrame(ws, "chat.cancel", {});
    },
    sendPing() {
      if (ws) sendFrame(ws, "ping", {});
    },
    close() {
      released = true;
      clearPingInterval();
      clearReconnectTimer();
      if (ws) {
        releaseWebSocket(ws);
        ws = null;
      }
    },
    readyState: () => ws?.readyState ?? WebSocket.CLOSED,
  };
};
