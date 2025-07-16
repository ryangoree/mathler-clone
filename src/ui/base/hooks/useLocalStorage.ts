import { useCallback, useEffect, useRef, useState } from "react";
import type { UpdaterFn, UpdateValue } from "src/ui/base/types";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  // Protect against unstable references
  const initialValueRef = useRef<T>(initialValue);
  initialValueRef.current = initialValue;

  useEffect(() => {
    const value = getOrSetItem<T>(key, initialValueRef.current);
    setValue(value);
  }, [key]);

  const update = useCallback(
    (value: UpdateValue<T>) => {
      setValue((prev) => {
        const newValue =
          typeof value === "function" ? (value as UpdaterFn<T>)(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {
          console.error(`Error updating localStorage key "${key}":`, error);
        }
        return newValue;
      });
    },
    [key],
  );

  return [value, update] as const;
}

/**
 * Get a value from localStorage or set it if it doesn't exist.
 */
function getOrSetItem<T>(key: string, initialValue: T): T {
  const item = localStorage.getItem(key);
  if (isValidValue(item)) {
    try {
      return JSON.parse(item);
    } catch (error) {
      console.error(
        `Error parsing localStorage key "${key}":`,
        error,
        `\n Overwriting with initial value:`,
        initialValue,
      );
    }
  }
  try {
    localStorage.setItem(key, JSON.stringify(initialValue));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
  return initialValue;
}

/**
 * Check a value returned from localStorage to ensure it is valid.
 */
function isValidValue(value: unknown): value is string {
  // Non-existent keys === null
  // Keys saved as undefined === "undefined"
  return value !== null && value !== "undefined";
}
