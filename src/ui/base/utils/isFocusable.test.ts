import { isFocusable } from "src/ui/base/utils/isFocusable";
import { createMockElement } from "src/ui/base/utils/testing/createMockElement";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("isFocusable", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("returns false for null", () => {
    expect(isFocusable(null)).toBe(false);
  });

  it("returns true for the activeElement", () => {
    const div = createMockElement("div", {
      tabIndex: 0,
    });
    div.focus();
    expect(document.activeElement).toBe(div);
    expect(isFocusable(div)).toBe(true);
  });

  it("returns false if no focus method", () => {
    const fake = { hasAttribute: () => false } as unknown as EventTarget;
    expect(isFocusable(fake)).toBe(false);
  });

  it("returns false for disabled elements", () => {
    const btn = createMockElement("button", {
      disabled: true,
    });
    expect(isFocusable(btn)).toBe(false);
  });

  it('returns false for aria-hidden="true"', () => {
    const btn = createMockElement("button", {
      ariaHidden: "true",
    });
    expect(isFocusable(btn)).toBe(false);
  });

  it("returns false for negative tabindex values", () => {
    const btn = createMockElement("button", {
      tabIndex: -1,
    });
    expect(isFocusable(btn)).toBe(false);
  });

  it("returns false for zero area elements", () => {
    const link = createMockElement("button", {
      width: 0,
      height: 0,
    });
    expect(isFocusable(link)).toBe(false);
  });

  it("returns true for a normally focusable element", () => {
    const btn = createMockElement("button");
    expect(isFocusable(btn)).toBe(true);
  });
});
