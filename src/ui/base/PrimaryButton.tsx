import classNames from "classnames";
import type { ButtonHTMLAttributes } from "react";

export interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function PrimaryButton({
  className,
  children,
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        "bg-fern shadow-button-primary hover:not-disabled:bg-fern-dark flex h-12 items-center justify-center rounded-lg px-6 text-lg font-semibold text-white transition duration-100",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
