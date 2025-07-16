import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useLocalStorage } from "src/ui/base/hooks/useLocalStorage";
import type { GameHistory } from "src/ui/game/types";

export const initialGameHistory: GameHistory = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
};

export function useLocalGameHistory() {
  const { primaryWallet } = useDynamicContext();
  return useLocalStorage(
    `gameHistory:${primaryWallet?.address || "local"}`,
    initialGameHistory,
  );
}
