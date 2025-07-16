import classNames from "classnames";
import type { InputStatus } from "src/ui/game/types";

export function InputButton({
  value,
  onClick,
  status,
}: {
  value: string;
  onClick: (value: string) => void;
  status?: InputStatus;
}) {
  return (
    <button
      type="button"
      className={classNames(
        "flex h-11 grow items-center justify-center rounded border font-mono text-lg transition duration-100 hover:not-active:scale-110",
        {
          "bg-seafoam/33 border-fern/30 text-evergreen hover:shadow-tile-inner hover:border-fern/50":
            !status,
          "bg-dune scale-100! border-transparent opacity-50":
            status === "absent",
          "bg-goldenrod border-olive/30 text-peat hover:shadow-tile-inner":
            status === "present",
          "bg-fern border-evergreen/30 hover:bg-evergreen text-white":
            status === "correct",
        },
      )}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
}
