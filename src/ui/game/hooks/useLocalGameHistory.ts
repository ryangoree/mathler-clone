import { useLocalStorage } from "src/ui/base/hooks/useLocalStorage";
import type { GameHistory } from "src/ui/game/types";

export const initialGameHistory: GameHistory = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
};

export function useLocalGameHistory() {
  return useLocalStorage("gameHistory", initialGameHistory);
}
