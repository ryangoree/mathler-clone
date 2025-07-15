import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [
  value: T | undefined,
  setValue: (value: T | ((previousValue: T) => T)) => void,
] {
  const [storedValue, setStoredValue] = useState<T | undefined>();

  const setValue = useCallback(
    (value: T | ((previousValue: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore =
            value instanceof Function ? value(prev || initialValue) : value;
          localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, initialValue],
  );

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;
      setValue(value);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setValue(initialValue);
    }
  }, [key, initialValue, setValue]);

  return [storedValue, setValue];
}
