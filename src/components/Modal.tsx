import classNames from "classnames";
import { type PropsWithChildren, useCallback, useEffect } from "react";
import { XIcon } from "src/components/icons/XIcon";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
  className,
}: PropsWithChildren<ModalProps>) {
  function handleClose(e: React.MouseEvent) {
    if (e.target && "blur" in e.target && typeof e.target.blur === "function") {
      e.target.blur();
    }
    onClose();
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent | React.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      role="dialog"
      className={classNames(
        "pointer-events-none fixed inset-0 z-50 flex items-center justify-center opacity-0 transition duration-100",
        {
          "bg-moss/50 !pointer-events-auto opacity-100": isOpen,
        },
        className,
      )}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
    >
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: stopping propagation */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: stopping propagation */}
      <div
        className="w-full max-w-md space-y-4 rounded-lg bg-(image:--bg) p-6 shadow-[2px_4px_20px_rgb(from_var(--color-moss)_r_g_b_/_0.2)]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex gap-4">
          <h2 className="text-h4 leading-h4 grow font-bold">{title}</h2>
          <button
            type="button"
            className="border-stone hover:border-cedar hover:bg-stone/50 flex size-10 items-center justify-center rounded-full border p-1 transition duration-150 hover:scale-110"
            title="Close modal"
            onClick={handleClose}
          >
            <XIcon />
          </button>
        </div>
        {children}
        {actions && (
          <div className="mt-8 flex justify-end gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
