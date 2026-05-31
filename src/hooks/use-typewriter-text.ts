import { useEffect, useRef, useState } from "react";

const CHARS_PER_FRAME = 2;
const FRAME_MS = 16;
const MAX_ANIMATED_LENGTH = 2000;

export const useTypewriterText = (
  fullText: string,
  enabled: boolean,
  onComplete?: () => void,
) => {
  const [displayed, setDisplayed] = useState(enabled ? "" : fullText);
  const indexRef = useRef(0);
  const completedRef = useRef(!enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(fullText);
      completedRef.current = true;
      return;
    }

    if (fullText.length > MAX_ANIMATED_LENGTH) {
      setDisplayed(fullText);
      completedRef.current = true;
      onComplete?.();
      return;
    }

    indexRef.current = 0;
    completedRef.current = false;
    setDisplayed("");

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplayed(fullText);
      completedRef.current = true;
      onComplete?.();
      return;
    }

    const timer = window.setInterval(() => {
      indexRef.current = Math.min(
        indexRef.current + CHARS_PER_FRAME,
        fullText.length,
      );
      setDisplayed(fullText.slice(0, indexRef.current));
      if (indexRef.current >= fullText.length) {
        window.clearInterval(timer);
        completedRef.current = true;
        onComplete?.();
      }
    }, FRAME_MS);

    return () => window.clearInterval(timer);
  }, [fullText, enabled, onComplete]);

  return { displayed, isComplete: completedRef.current };
};
