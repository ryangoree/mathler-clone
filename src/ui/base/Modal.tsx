import classNames from "classnames";
import { useCallback, useEffect } from "react";
import { XIcon } from "src/ui/base/icons/XIcon";

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
}: React.PropsWithChildren<ModalProps>) {
  function handleClose(e: React.MouseEvent) {
    if ("blur" in e.target && typeof e.target.blur === "function") {
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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      role="dialog"
      className={classNames(
        "bg-moss/50 pointer-events-none fixed inset-0 z-50 flex items-center justify-center opacity-0 transition duration-100",
        {
          "pointer-events-auto! opacity-100": isOpen,
        },
        className,
      )}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
    >
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: stopping propagation */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: stopping propagation */}
      <div
        className={classNames(
          "mb-[10vh] w-full max-w-sm translate-y-6 scale-95 space-y-4 rounded-lg bg-(image:--bg) p-6 shadow-[2px_4px_20px_rgb(from_var(--color-moss)_r_g_b_/_0.2)] transition-all",
          {
            "translate-y-0! scale-100": isOpen,
          },
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="mb-5 flex gap-4">
          <h2 className="text-h4 leading-h4 grow font-bold">{title}</h2>
          <button
            type="button"
            className="border-stone hover:shadow-tile-inner flex size-10 items-center justify-center rounded-full border p-1 transition duration-150 hover:scale-110"
            title="Close modal"
            onClick={handleClose}
          >
            <XIcon />
          </button>
        </div>
        {children}
        {actions && (
          <div className="mt-6 flex justify-end gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
