import {
  useDynamicContext,
  useUserUpdateRequest,
} from "@dynamic-labs/sdk-react-core";
import { useEffect } from "react";
import { useLocalGameHistory } from "src/ui/game/hooks/useLocalGameHistory";
import type { GameHistory } from "src/ui/game/types";

export function useGameHistory() {
  const { user } = useDynamicContext();
  const { updateUser } = useUserUpdateRequest();
  const [gameHistory, setGameHistory] = useLocalGameHistory();

  useEffect(() => {
    if (!user) return;
    const userHistory = user.metadata as GameHistory;

    // Sync based on games played
    if (userHistory.gamesPlayed > gameHistory.gamesPlayed) {
      setGameHistory((prev) => ({ ...prev, ...userHistory }));
    } else if (userHistory.gamesPlayed < gameHistory.gamesPlayed) {
      updateUser({ metadata: gameHistory });
    }
  }, [user, gameHistory, setGameHistory, updateUser]);

  return gameHistory;
}
