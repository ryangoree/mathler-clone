import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { evaluate } from "src/utils/math";

const calculations = [
  "119-41",
  "21/7+9",
  "90/9+7",
  "18+6-3",
  "24*2-9",
  "112-47",
  "27*3-9",
  "28-3+7",
  "95/5+8",
  "132-59",
] as const;
const rowCount = 6;
const colCount = 6;
const operators = ["+", "-", "*", "/"];

function App() {
  const [currentCalc, setCurrentCalc] = useState({
    index: 0,
    value: calculations[0],
  });
  const [completedRows, setCompletedRows] = useState<string[][]>([]);
  const [currentRow, setCurrentRow] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState<
    "incorrect" | "pending" | "complete"
  >("pending");

  const handleInput = useCallback(
    (value: string) => {
      if (currentRow.length === colCount) return;
      if (Number.isNaN(+value) && !operators.includes(value)) return;
      setCurrentRow((prev) => [...prev, value]);
    },
    [currentRow],
  );

  const handleDelete = useCallback(() => {
    setCurrentRow((prev) => prev.slice(0, -1));
    setCurrentStatus("pending");
  }, []);

  const expectedResult = evaluate(currentCalc.value);
  const currentResult =
    currentRow.length === colCount ? evaluate(currentRow.join("")) : undefined;

  const handleSubmit = useCallback(() => {
    if (currentStatus === "complete") return;
    if (currentRow.length !== colCount) return;
    if (completedRows.length === rowCount) return;
    if (currentResult !== expectedResult) {
      setCurrentStatus("incorrect");
      return;
    }
    setCompletedRows((prev) => [...prev, currentRow]);
    setCurrentRow([]);
  }, [currentStatus, currentRow, completedRows, currentResult, expectedResult]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "Enter":
          handleSubmit();
          break;
        case "Backspace":
          handleDelete();
          break;
        default:
          handleInput(event.key);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, handleDelete, handleInput]);

  // const handleNextCalculation = () => {
  //   setCurrentCalcIndex((prev) =>
  //     prev === calculations.length - 1 ? 0 : prev + 1,
  //   );
  //   setCurrentRow([]);
  // };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="inline-flex">
        <div className="flex shrink flex-col items-stretch gap-4">
          <p className="text-h5 text-center">Find the hidden calculation</p>

          {/* Rows */}
          <div className="flex flex-col gap-1">
            {Array.from({ length: rowCount }).map((_, rowIndex) => {
              const isCurrentRow = rowIndex === completedRows.length;
              const values = isCurrentRow
                ? currentRow
                : completedRows[rowIndex];
              return (
                <div
                  key={`${rowIndex}:${values}`}
                  className="relative flex gap-1"
                >
                  {Array.from({ length: colCount }).map((_, colIndex) => {
                    const value = values?.[colIndex];
                    return (
                      <NumberTile
                        key={`${colIndex}:${value}`}
                        value={value}
                        active={isCurrentRow}
                        status={
                          isCurrentRow && currentStatus === "incorrect"
                            ? "incorrect"
                            : undefined
                        }
                      />
                    );
                  })}
                  {isCurrentRow && (
                    <div
                      className={classNames(
                        "text-h6 absolute top-1/2 left-full ml-4 -translate-y-1/2 font-mono whitespace-nowrap",
                        {
                          "text-terracotta": currentStatus === "incorrect",
                        },
                      )}
                    >
                      ={" "}
                      {currentStatus === "incorrect" && `${currentResult} =X= `}
                      {expectedResult}{" "}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input Buttons */}
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => {
                const value = String(i);
                return (
                  <InputButton
                    key={value}
                    value={value}
                    onClick={handleInput}
                  />
                );
              })}
            </div>

            <div className="flex gap-1">
              {operators.map((operator) => (
                <InputButton
                  key={operator}
                  value={operator}
                  onClick={handleInput}
                />
              ))}

              <button
                type="button"
                className="text-terracotta bg-blush/33 border-ash-rose/30 flex h-11 items-center justify-center gap-2 rounded border pr-3 pl-4"
                onClick={handleDelete}
                title="Delete last input"
              >
                <svg
                  role="graphics-symbol"
                  width="7"
                  height="13"
                  viewBox="0 0 7 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-terracotta mt-px"
                >
                  <path
                    d="M6 11.5L1 6.5L6 1.5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mb-px">delete</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="bg-fern shadow-button flex h-14 items-center justify-center rounded-lg text-lg font-semibold text-white"
            onClick={handleSubmit}
            disabled={
              currentRow.length !== colCount ||
              completedRows.length === rowCount
            }
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

export function InputButton({
  value,
  onClick,
  status = "active",
}: {
  value: string;
  onClick: (value: string) => void;
  status?: "active" | "eliminated" | "wrong-position" | "correct";
}) {
  return (
    <button
      type="button"
      className={classNames(
        "flex h-11 grow items-center justify-center rounded font-mono text-lg",
        {
          "bg-seafoam/33 border-fern/30 text-evergreen border":
            status === "active",
          "bg-dune": status === "eliminated",
          "bg-goldenrod border-olive/30 text-peat border":
            status === "wrong-position",
          "bg-fern border-evergreen/30 border text-white": status === "correct",
        },
      )}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
}

export function NumberTile({
  value = "",
  active = false,
  status,
}: {
  value?: string;
  active?: boolean;
  status?: "incorrect" | "eliminated" | "wrong-position" | "correct";
}) {
  return (
    <div
      className={classNames(
        "flex h-11 w-14 items-center justify-center rounded font-mono text-lg font-bold bg-white/33",
        active
          ? "shadow-tile"
          : "shadow-tile-inner border-stone/75 border opacity-50",
        {
          "text-terracotta border-terracotta border": status === "incorrect",
        },
      )}
    >
      {value}
    </div>
  );
}
