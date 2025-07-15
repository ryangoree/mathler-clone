import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook to manage a pulsing effect that automatically resets after a specified
 * duration. Calling `pulse()` while already pulsing will restart the timer,
 * ensuring back-to-back pulses re-trigger the effect.
 */
export function usePulse(duration = 1000) {
  const [isPulsing, setIsPulsing] = useState(false);
  const resetTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimeout.current), []);

  const reset = useCallback(() => {
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
      resetTimeout.current = undefined;
    }
    setIsPulsing(false);
  }, []);

  const pulse = useCallback(() => {
    reset();
    setTimeout(() => setIsPulsing(true), 0);
    resetTimeout.current = setTimeout(reset, duration);
  }, [reset, duration]);

  return { isPulsing, pulse, reset };
}
