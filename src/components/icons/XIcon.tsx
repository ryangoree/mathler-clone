import type { IconProps } from "src/components/icons/types";

export function XIcon({ title, ...props }: IconProps) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="graphics-symbol"
      {...props}
    >
      <title>{title}</title>
      <path
        d="M1 11L11 1M1 1L11 11"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
