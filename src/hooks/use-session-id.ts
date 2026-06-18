import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const SESSION_ID_KEY = "zavo_session_id";

const createSessionId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : uuidv4();

const readOrCreateSessionId = (): string => {
  if (typeof window === "undefined") return "";

  const existing = sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) return existing;

  const sessionId = createSessionId();
  sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  return sessionId;
};

/** Same token used for `X-Token` on API requests (sessionStorage). */
export const getSessionToken = (): string => readOrCreateSessionId();

/** Unique per tab session; new id after the tab/window is closed. */
export function useSessionId(): string {
  const [sessionId] = useState(getSessionToken);
  return sessionId;
}
