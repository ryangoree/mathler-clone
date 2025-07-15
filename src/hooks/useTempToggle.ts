import { useCallback, useMemo, useRef, useState } from "react";

/**
 * Hook to manage a temporary toggle state which automatically resets after a
 * specified duration.
 */
export function useTempToggle(initialValue = false, duration = 3000) {
  const [state, setState] = useState(initialValue);
  const resetTimeout = useRef<NodeJS.Timeout | null>(null);

  const toggle = useCallback(() => {
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
    }
    setState(initialValue);
    setTimeout(() => {
      setState(!initialValue);
    }, 0);
    resetTimeout.current = setTimeout(() => setState(initialValue), duration);
  }, [initialValue, duration]);

  const reset = useCallback(() => {
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
      resetTimeout.current = null;
    }
    setState(initialValue);
  }, [initialValue]);

  const actions = useMemo(
    () => ({
      toggle,
      reset,
    }),
    [toggle, reset],
  );

  return [state, actions] as const;
}
