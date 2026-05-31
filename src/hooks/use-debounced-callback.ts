import { useCallback, useEffect, useRef } from "react";

export type DebouncedCallback<T extends (...args: never[]) => void> = {
  debounced: T;
  cancel: () => void;
};

export const useDebouncedCallback = <T extends (...args: never[]) => void>(
  callback: T,
  delayMs: number,
): DebouncedCallback<T> => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      cancel();
    },
    [cancel],
  );

  const debounced = useCallback(
    ((...args: Parameters<T>) => {
      cancel();
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        callbackRef.current(...args);
      }, delayMs);
    }) as T,
    [cancel, delayMs],
  );

  return { debounced, cancel };
};
