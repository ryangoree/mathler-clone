import classNames from "classnames";
import type { ButtonProps, ButtonTag } from "src/ui/base/buttons/types";

export function SecondaryButton<T extends ButtonTag = "button">({
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
        "border-stone shadow-button-secondary flex h-12 items-center justify-center gap-2 rounded-lg border px-6 text-lg font-medium",
        "hover:not-disabled:bg-pearl/50 hover:not-disabled:border-stone/80 transition duration-100",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
