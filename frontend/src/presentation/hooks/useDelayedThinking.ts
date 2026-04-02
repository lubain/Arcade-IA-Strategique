import { useRef, useState } from "react";

const DEFAULT_DELAY_MS = 1000;

export const useDelayedThinking = (delayMs = DEFAULT_DELAY_MS) => {
  const [isThinking, setIsThinking] = useState(false);
  const timerRef = useRef<number | null>(null);

  const beginThinking = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setIsThinking(true);
    }, delayMs);
  };

  const stopThinking = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setIsThinking(false);
  };

  return {
    isThinking,
    beginThinking,
    stopThinking,
    setIsThinking,
  };
};
