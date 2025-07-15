import classNames from "classnames";
import type { InputStatus } from "src/ui/game/utils/status";

export type InputTileStatus = InputStatus | "invalid";

export function InputTile({
  value = "",
  active = false,
  status,
  className,
}: {
  value?: string;
  active?: boolean;
  status?: InputTileStatus;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "flex h-11 w-14 items-center justify-center rounded font-mono text-lg font-bold bg-white/33",
        active
          ? [
              "shadow-tile",
              {
                "text-terracotta border-terracotta border":
                  status === "invalid",
              },
            ]
          : {
              "text-white !bg-fern": status === "correct",
              "text-peat !bg-goldenrod": status === "present",
              "!bg-dune": status === "absent",
              "shadow-tile-inner border-stone/75 border": !status,
              "opacity-50": !status || status === "absent",
            },
        className,
      )}
    >
      {value}
    </div>
  );
}
