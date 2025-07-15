import type { IconProps } from "src/ui/base/icons/types";

export function ChevronLeftIcon({ title, ...props }: IconProps) {
  return (
    <svg
      width="7"
      height="13"
      viewBox="0 0 7 13"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="graphics-symbol"
      {...props}
    >
      <title>{title}</title>
      <path
        d="M6 11.5L1 6.5L6 1.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
