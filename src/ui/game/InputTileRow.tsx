import classNames from "classnames";
import { InputTile, type InputTileStatus } from "src/ui/game/InputTile";
import { checkAnswer } from "src/ui/game/utils/checkAnswer";

export interface InputTileRowProps {
  expectedResult: number;
  targetEquation: string;
  value?: string;
  active?: boolean;
  invalid?: boolean;
  showEarlySubmitWarning?: boolean;
}

export function InputTileRow({
  targetEquation,
  expectedResult,
  value = "",
  active = false,
  invalid = false,
  showEarlySubmitWarning = false,
}: InputTileRowProps) {
  const { statuses = [] } =
    value.length === targetEquation.length
      ? checkAnswer({ answer: value, targetEquation })
      : {};
  return (
    <div
      className={classNames("relative flex gap-1 rounded", {
        "animate-jump-pulse transition-none!": active && showEarlySubmitWarning,
      })}
    >
      {Array.from({ length: targetEquation.length }).map((_, colIndex) => {
        let status: InputTileStatus | undefined = statuses[colIndex];
        if (active && invalid) {
          status = "invalid";
        }
        return (
          <InputTile
            key={`${colIndex}:${value}`}
            value={value[colIndex]}
            active={active}
            status={status}
          />
        );
      })}
      {active && (
        <div className="text-h6 absolute left-full ml-4 flex h-full items-center gap-2 font-mono whitespace-nowrap">
          = {expectedResult}{" "}
          {invalid && (
            <span className="text-terracotta text-p">
              (Must equal {expectedResult})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
