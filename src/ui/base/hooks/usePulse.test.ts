import { act, renderHook } from "@testing-library/react";
import { usePulse } from "src/ui/base/hooks/usePulse";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("usePulse", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts pulsing on next tick when pulse is called", () => {
    const { result } = renderHook(() => usePulse(1000));
    expect(result.current.isPulsing).toBe(false);

    act(() => {
      result.current.pulse();
    });
    // false until the next tick
    expect(result.current.isPulsing).toBe(false);

    // next tick
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current.isPulsing).toBe(true);
  });

  it("automatically resets after the given duration", () => {
    const { result } = renderHook(() => usePulse(1000));

    act(() => {
      result.current.pulse();
      vi.advanceTimersByTime(0);
    });
    expect(result.current.isPulsing).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.isPulsing).toBe(false);
  });

  it("restarts the timer when pulse is called mid-pulse", () => {
    const { result } = renderHook(() => usePulse(1000));

    act(() => {
      result.current.pulse();
      vi.advanceTimersByTime(0);
    });
    expect(result.current.isPulsing).toBe(true);

    // second pulse halfway through the first
    act(() => {
      vi.advanceTimersByTime(500);
      result.current.pulse();
    });
    // stopped until the next tick
    expect(result.current.isPulsing).toBe(false);

    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current.isPulsing).toBe(true);

    // original 1000ms timeout was cleared, so advancing 500ms more doesn't stop
    // it yet
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.isPulsing).toBe(true);

    // stopped 1000ms after second pulse
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.isPulsing).toBe(false);
  });

  it("stops pulsing and clears timeout when reset is called", () => {
    const { result } = renderHook(() => usePulse(1000));

    act(() => {
      result.current.pulse();
      vi.advanceTimersByTime(0);
    });
    expect(result.current.isPulsing).toBe(true);

    act(() => {
      result.current.reset();
    });
    expect(result.current.isPulsing).toBe(false);
  });
});
