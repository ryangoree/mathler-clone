import { findAllFocusable } from "src/ui/base/utils/findAllFocusable";
import { createMockElement } from "src/ui/base/utils/testing/createMockElement";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("findAllFocusable", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("returns undefined for a null container", () => {
    expect(findAllFocusable(null)).toBeUndefined();
  });

  it("filters out non-focusable elements", () => {
    const container = createMockElement("div");

    const goodBtn = createMockElement("button");
    container.appendChild(goodBtn);

    const disabledBtn = createMockElement("button", {
      disabled: true,
    });
    container.appendChild(disabledBtn);

    const link = createMockElement("a", {
      href: "#",
    });
    container.appendChild(link);

    const hiddenDiv = createMockElement("div", {
      ariaHidden: "true",
      width: 0,
      height: 0,
    });
    container.appendChild(hiddenDiv);

    const found = findAllFocusable(container)!;
    expect(found).toEqual([goodBtn, link]);
  });
});
