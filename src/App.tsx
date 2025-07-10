import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";

// const problems = [
//   { values: [119, "-", 41] },
//   { values: [21, "/", 7, "+", 9] },
//   { values: [90, "/", 9, "+", 7] },
//   { values: [18, "+", 6, "-", 3] },
//   { values: [24, "*", 2, "-", 9] },
//   { values: [112, "-", 47] },
//   { values: [27, "*", 3, "-", 9] },
//   { values: [28, "-", 3, "+", 7] },
//   { values: [95, "/", 5, "+", 8] },
//   { values: [132, "-", 59] },
// ];

const rowCount = 6;
const colCount = 6;
const operators = ["+", "-", "*", "/"];

function App() {
  const [completedRows, setCompletedRows] = useState<string[][]>([]);
  const [currentRow, setCurrentRow] = useState<string[]>([]);

  const handleSubmit = useCallback(() => {
    if (currentRow.length !== colCount) return;
    if (completedRows.length === rowCount) return;
    setCompletedRows((prev) => [...prev, currentRow]);
    setCurrentRow([]);
  }, [currentRow, completedRows]);

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
  }, []);

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

  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="inline-flex">
        <div className="flex flex-col shrink gap-4 items-stretch">
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
                  className="flex gap-1 relative"
                >
                  {Array.from({ length: colCount }).map((_, colIndex) => {
                    return (
                      <NumberTile
                        key={`${colIndex}:${values?.[colIndex]}`}
                        value={values?.[colIndex]}
                        status={isCurrentRow ? "active" : "inactive"}
                      />
                    );
                  })}
                  {isCurrentRow && (
                    <div className="left-full top-1/2 -translate-y-1/2 ml-4 absolute text-h6 font-mono whitespace-nowrap">
                      = 19
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Buttons */}
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
                className="flex gap-2 items-center justify-center h-11 text-terracotta bg-blush/33 border border-ash-rose/30 rounded pl-4 pr-3"
                onClick={handleDelete}
              >
                <svg
                  width="7"
                  height="13"
                  viewBox="0 0 7 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-terracotta"
                >
                  <path
                    d="M6 11.5L1 6.5L6 1.5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                delete
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="flex items-center justify-center h-14 bg-fern text-white font-semibold text-lg rounded-lg shadow-button"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

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
        "flex items-center justify-center h-11 rounded font-mono text-lg grow",
        {
          "bg-seafoam/33 border border-fern/30 text-evergreen":
            status === "active",
          "bg-dune": status === "eliminated",
          "bg-goldenrod border border-olive/30 text-peat":
            status === "wrong-position",
          "bg-fern text-white border border-evergreen/30": status === "correct",
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
  status = "inactive",
}: {
  value?: string;
  status?: "active" | "inactive" | "incorrect" | "wrong-position" | "correct";
}) {
  return (
    <div
      className={classNames(
        "flex items-center justify-center w-14 h-11 bg-white/33 rounded font-mono text-lg font-bold",
        {
          "shadow-tile": status === "active",
          "opacity-50 shadow-tile-inner border border-stone/75":
            status === "inactive",
        },
      )}
    >
      {value}
    </div>
  );
}

export default App;
