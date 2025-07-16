import { act, renderHook } from "@testing-library/react";
import { useLocalStorage } from "src/ui/base/hooks/useLocalStorage";
import { beforeEach, describe, expect, it } from "vitest";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with initialValue and writes it to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "value"));
    const [value] = result.current;
    expect(value).toBe("value");
    expect(localStorage.getItem("key")).toBe(JSON.stringify("value"));
  });

  it("reads existing values from localStorage on mount", () => {
    localStorage.setItem("key", JSON.stringify("value"));
    const { result } = renderHook(() => useLocalStorage("key", "bar"));
    const [value] = result.current;
    expect(value).toBe("value");
  });

  it("updates state and localStorage when update is called", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0));
    const [, update] = result.current;

    act(() => {
      update((prev) => prev + 1);
    });

    const [value] = result.current;
    expect(value).toBe(1);
    expect(localStorage.getItem("count")).toBe("1");
  });

  it("handles setting a new primitive value", () => {
    const { result } = renderHook(() => useLocalStorage("flag", false));
    const [, update] = result.current;

    act(() => {
      update(true);
    });

    const [value] = result.current;
    expect(value).toBe(true);
    expect(localStorage.getItem("flag")).toBe("true");
  });

  it("falls back to initialValue if localStorage contains invalid JSON", () => {
    localStorage.setItem("key", "{ invalid json }");
    const { result } = renderHook(() => useLocalStorage("key", "fallback"));
    const [value] = result.current;
    expect(value).toBe("fallback");
  });
});
