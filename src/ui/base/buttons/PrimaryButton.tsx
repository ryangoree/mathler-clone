import classNames from "classnames";
import type { ButtonProps, ButtonTag } from "src/ui/base/buttons/types";

export function PrimaryButton<T extends ButtonTag = "button">({
  as: tag = "button" as T,
  className,
  children,
  ...rest
}: ButtonProps<T>) {
  const Tag = tag as React.ElementType;
  return (
    <Tag
      type={tag === "button" ? "button" : undefined}
      className={classNames(
        "bg-fern shadow-button-primary hover:not-disabled:bg-fern-dark flex h-12 items-center justify-center rounded-lg px-6 text-lg font-semibold text-white transition duration-100",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
