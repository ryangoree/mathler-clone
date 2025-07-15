import { useCallback } from "react";
import { useLocalStorage } from "src/ui/base/hooks/useLocalStorage";
import type { GameHistory } from "src/ui/game/types";

export const initialGameHistory: GameHistory = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
};

export const gameHistoryKey = "gameHistory";
export type GameHistoryKey = typeof gameHistoryKey;
export type NewGameHistory =
  | Partial<GameHistory>
  | ((prev: GameHistory) => GameHistory);

export function useLocalGameHistory() {
  const [localGameHistory, setLocalGameHistory] = useLocalStorage<GameHistory>(
    gameHistoryKey,
    initialGameHistory,
  );

  const setGameHistory = useCallback(
    (newGameHistory: NewGameHistory) => {
      setLocalGameHistory((prev) => {
        const updates =
          typeof newGameHistory === "function"
            ? newGameHistory(prev)
            : newGameHistory;
        return { ...prev, ...updates };
      });
    },
    [setLocalGameHistory],
  );
  return [localGameHistory, setGameHistory] as const;
}
