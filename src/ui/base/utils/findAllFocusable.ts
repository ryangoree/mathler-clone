import { isFocusable } from "src/ui/base/utils/isFocusable";

export function findAllFocusable(
  container: Element | null,
): HTMLElement[] | undefined {
  if (!container) return;

  const candidates = Array.from(
    container.querySelectorAll(
      'a[href], button, input, textarea, select, details, iframe, [tabindex]:not([tabindex="-1"])',
    ),
  );

  return candidates.filter(isFocusable);
}
