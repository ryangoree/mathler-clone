import classNames from "classnames";
import type { ButtonHTMLAttributes } from "react";

export interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function SecondaryButton({
  className,
  children,
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        "border-stone shadow-button-secondary hover:not-disabled:bg-pearl/50 hover:not-disabled:border-stone/80 flex h-12 items-center justify-center gap-2 rounded-lg border px-6 text-lg font-medium transition duration-100",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
