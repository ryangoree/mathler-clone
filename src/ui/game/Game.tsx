import { ChevronLeftIcon } from "@dynamic-labs/sdk-react-core";
import { parseFixed } from "@gud/math";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { usePulse } from "src/ui/base/hooks/usePulse";
import { Modal } from "src/ui/base/Modal";
import { PrimaryButton } from "src/ui/base/PrimaryButton";
import { SecondaryButton } from "src/ui/base/SecondaryButton";
import { useGameHistory } from "src/ui/game/hooks/useGameHistory";
import { useUpdateGameHistory } from "src/ui/game/hooks/useUpdateGameHistory";
import { InputButton } from "src/ui/game/InputButton";
import { InputTile, type InputTileStatus } from "src/ui/game/InputTile";
import { getAnswerStatus, type InputStatus } from "src/ui/game/utils/status";
import { evaluate } from "src/utils/math";

interface Attempt {
  answer: string;
  statuses: InputStatus[];
}
type GameStatus = "playing" | "invalid" | "won" | "lost";

const maxAttempts = 6;
const operators = ["+", "-", "*", "/"];
const equations = [
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
];
const initialEquationIndex = Math.floor(Math.random() * equations.length);

export function Game() {
  // State
  const gameHistory = useGameHistory();
  const { updateGameHistory, updateGameHistoryStatus } = useUpdateGameHistory();
  const [targetEquation, setTargetEquation] = useState({
    index: initialEquationIndex,
    value: equations[initialEquationIndex]!,
  });
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(true);
  const {
    isPulsing: isEarlySubmitWarningVisible,
    pulse: triggerEarlySubmitWarning,
    reset: resetEarlySubmitWarning,
  } = usePulse();

  // Derived state

  const expectedResult = evaluate(targetEquation.value);

  // Initialize button statuses
  const buttonStatusMap = new Map<string, InputStatus | undefined>();
  if (gameStatus === "won") {
    for (const char of targetEquation.value) {
      buttonStatusMap.set(char, "correct");
    }
  }
  for (const { answer, statuses } of attempts) {
    for (const [i, status] of statuses.entries()) {
      const character = answer[i]!;
      if (buttonStatusMap.get(character) !== "correct") {
        buttonStatusMap.set(character, status);
      }
    }
  }

  // Handlers

  const handleSubmit = useCallback(() => {
    if (gameStatus !== "playing") return;
    if (currentAnswer.length !== targetEquation.value.length) {
      triggerEarlySubmitWarning();
      return;
    }

    // Check the submitted answer
    const { isEqual, isCorrect, statuses } = getAnswerStatus({
      answer: currentAnswer,
      targetEquation: targetEquation.value,
    });

    // Invalid answer
    if (!isEqual) {
      setGameStatus("invalid");
      return;
    }

    // Update game status
    if (isCorrect) {
      setIsEndGameModalOpen(true);
      setGameStatus("won");
      updateGameHistory?.((prev) => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1,
        currentWinStreak: prev.currentWinStreak + 1,
        bestWinStreak: Math.max(prev.bestWinStreak, prev.currentWinStreak + 1),
      }));
      return;
    }
    if (attempts.length >= maxAttempts - 1) {
      setIsEndGameModalOpen(true);
      setGameStatus("lost");
      updateGameHistory?.((prev) => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        currentWinStreak: 0,
      }));
      return;
    }

    // Move to the next attempt
    setAttempts((prev) => [
      ...prev,
      {
        answer: currentAnswer,
        statuses: statuses,
      },
    ]);
    setCurrentAnswer("");
  }, [
    attempts,
    currentAnswer,
    gameStatus,
    targetEquation,
    triggerEarlySubmitWarning,
    updateGameHistory,
  ]);

  const handleInput = useCallback(
    (value: string) => {
      if (gameStatus !== "playing") return;
      if (currentAnswer.length === targetEquation.value.length) return;
      if (Number.isNaN(+value) && !operators.includes(value)) return;
      resetEarlySubmitWarning();
      setCurrentAnswer((prev) => `${prev}${value}`);
    },
    [gameStatus, currentAnswer, targetEquation, resetEarlySubmitWarning],
  );

  const handleDelete = useCallback(() => {
    if (gameStatus !== "playing" && gameStatus !== "invalid") return;
    resetEarlySubmitWarning();
    setCurrentAnswer((prev) => prev.slice(0, -1));
    setGameStatus("playing");
  }, [gameStatus, resetEarlySubmitWarning]);

  function handlePlayAgain() {
    setIsEndGameModalOpen(false);
    const nextIndex =
      targetEquation.index + 1 >= equations.length
        ? 0
        : targetEquation.index + 1;
    setTargetEquation({
      index: nextIndex,
      value: equations[nextIndex]!,
    });
    setAttempts([]);
    setCurrentAnswer("");
    setGameStatus("playing");
  }

  // Keyboard listener
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
    <>
      <div className="inline-flex">
        <div className="flex shrink flex-col items-stretch gap-4">
          <p className="text-h5 text-center">Find the hidden equation</p>

          {/* Attempt Rows */}
          <div className="flex flex-col gap-1">
            {Array.from({ length: maxAttempts }).map((_, rowIndex) => {
              const isCurrentRow = rowIndex === attempts.length;
              const values = isCurrentRow
                ? currentAnswer
                : attempts[rowIndex]?.answer;
              const { statuses, isCorrect } = getAnswerStatus({
                answer: values || "",
                targetEquation: targetEquation.value,
              });
              return (
                <div
                  key={`${rowIndex}:${values}`}
                  className={classNames("relative flex gap-1 rounded", {
                    "animate-jump-pulse !transition-none":
                      isCurrentRow && isEarlySubmitWarningVisible,
                  })}
                >
                  {Array.from({ length: targetEquation.value.length }).map(
                    (_, colIndex) => {
                      const value = values?.[colIndex] || "";
                      let status: InputTileStatus | undefined =
                        statuses[colIndex];
                      if (isCurrentRow) {
                        if (gameStatus === "invalid") {
                          status = "invalid";
                        } else if (isCorrect) {
                          status = "correct";
                        }
                      }
                      return (
                        <InputTile
                          key={`${colIndex}:${value}`}
                          value={value}
                          active={gameStatus !== "won" && isCurrentRow}
                          status={status}
                        />
                      );
                    },
                  )}
                  {isCurrentRow && (
                    <div className="text-h6 absolute left-full ml-4 flex h-full items-center gap-2 font-mono whitespace-nowrap">
                      = {expectedResult}{" "}
                      {gameStatus === "invalid" && (
                        <span className="text-terracotta text-p">
                          (Must equal {expectedResult})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input Buttons */}
          <div className="flex flex-col gap-1">
            {/* Number Buttons */}
            <div className="flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => {
                const value = String(i);
                return (
                  <InputButton
                    key={value}
                    value={value}
                    onClick={handleInput}
                    status={buttonStatusMap.get(value)}
                  />
                );
              })}
            </div>

            <div className="flex gap-1">
              {/* Operator Buttons */}
              {operators.map((operator) => (
                <InputButton
                  key={operator}
                  value={operator}
                  onClick={handleInput}
                  status={buttonStatusMap.get(operator)}
                />
              ))}

              {/* Delete Button */}
              <button
                type="button"
                className="text-terracotta bg-blush/33 border-ash-rose/30 hover:shadow-tile-inner flex h-11 items-center justify-center gap-2 rounded border pr-3 pl-4 transition-all duration-100 hover:not-active:scale-105"
                onClick={handleDelete}
                title="Delete last input"
              >
                <ChevronLeftIcon className="mt-px" />
                <span className="mb-px">delete</span>
              </button>
            </div>
          </div>

          {/* Game over message */}
          {gameStatus === "lost" && (
            <p className="text-terracotta text-center">
              The solution was:{" "}
              <span className="text-h5 font-mono font-medium">
                {targetEquation.value}
              </span>
            </p>
          )}

          {gameStatus === "playing" || gameStatus === "invalid" ? (
            <div className="flex flex-col gap-2">
              {/* Submit Button */}
              <PrimaryButton
                type="button"
                onClick={handleSubmit}
                disabled={
                  currentAnswer.length !== targetEquation.value.length ||
                  attempts.length === maxAttempts
                }
              >
                Submit
              </PrimaryButton>

              {/* Reset */}
              <SecondaryButton type="button" onClick={handlePlayAgain}>
                Reset
              </SecondaryButton>
            </div>
          ) : (
            // Play Again Button
            <PrimaryButton
              type="button"
              className="grow"
              onClick={handlePlayAgain}
            >
              Play again
            </PrimaryButton>
          )}
        </div>
      </div>

      {/* End Game Modal */}
      <Modal
        title={gameStatus === "won" ? "Success" : "Game Over"}
        isOpen={isEndGameModalOpen}
        onClose={() => setIsEndGameModalOpen(false)}
        actions={
          <PrimaryButton
            type="button"
            className="grow"
            onClick={(e) => {
              e.currentTarget.blur();
              handlePlayAgain();
            }}
          >
            Play again
          </PrimaryButton>
        }
      >
        {gameStatus === "won" ? (
          <p>You got it! Congratulations 🎉</p>
        ) : (
          <>
            <p>Good try! The solution was:</p>
            <p className="text-h5 bg-dune/50 border-stone text-terracotta flex items-center justify-center rounded border p-3 font-mono font-medium">
              {targetEquation.value}
            </p>
          </>
        )}
        {gameHistory && (
          <ul className="border-stone flex flex-col gap-2 rounded border p-3">
            <li className="flex items-center justify-between">
              <span className="text-lichen">Games played:</span>
              <span className="font-mono text-h6">
                {gameHistory.gamesPlayed}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-lichen">Win %:</span>
              <span className="font-mono text-h6">
                {parseFixed(gameHistory.gamesWon)
                  .div(gameHistory.gamesPlayed, 0)
                  .format({ percent: true, decimals: 1 })}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-lichen">Current Win Streak:</span>
              <span className="font-mono text-h6">
                {gameHistory.currentWinStreak}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-lichen">Best Win Streak:</span>
              <span className="font-mono text-h6">
                {gameHistory.bestWinStreak}
              </span>
            </li>
          </ul>
        )}
      </Modal>
    </>
  );
}
