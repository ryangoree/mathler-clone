import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect } from "react";
import {
  initialGameHistory,
  useLocalGameHistory,
} from "src/ui/game/hooks/useLocalGameHistory";

export interface GameHistory {
  gamesPlayed: number;
  gamesWon: number;
  currentWinStreak: number;
  bestWinStreak: number;
}

export function useGameHistory() {
  const { user } = useDynamicContext();
  const [gameHistory, setGameHistory] = useLocalGameHistory();

  useEffect(() => {
    const profileHistory = user?.metadata as GameHistory;
    console.log("Profile:", user);
    if (profileHistory) {
      setGameHistory({ ...initialGameHistory, ...profileHistory });
    }
  }, [user, setGameHistory]);

  return gameHistory;
}
