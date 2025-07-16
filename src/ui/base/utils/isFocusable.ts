export function isFocusable<T extends HTMLElement | EventTarget>(
  target: T | null,
): target is T & HTMLElement {
  if (!target) return false;

  // Compare with the active element
  if (document.activeElement === target) return true;

  // Check for the "focus" method
  if (!("focus" in target)) return false;
  if (typeof target.focus !== "function") return false;

  // Check attributes that would prevent focus
  if (target.hasAttribute("disabled")) return false;
  if (target.getAttribute("aria-hidden") === "true") return false;
  const tabindex = target.getAttribute("tabindex");
  if (tabindex && +tabindex < 0) return false;

  // Check visibility
  const rect = target.getBoundingClientRect();
  if (rect.width * rect.height === 0) return false;

  return true;
}
