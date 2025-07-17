import {
  useDynamicContext,
  useUserUpdateRequest,
} from "@dynamic-labs/sdk-react-core";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocalStorage } from "src/ui/base/hooks/useLocalStorage";
import type { UpdateValue } from "src/ui/base/types";
import type { GameHistory } from "src/ui/game/types";

export const initialGameHistory: GameHistory = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
};

export function useGameHistory() {
  const { user } = useDynamicContext();
  const { updateUser } = useUserUpdateRequest();
  const [gameHistory, setGameHistory] = useLocalStorage(
    `gameHistory:${user?.verifiedCredentials?.[0]?.address || "local"}`,
    initialGameHistory,
  );

  const { mutate, status } = useMutation({
    mutationKey: ["updateGameHistory"],
    mutationFn: async (newGameHistory: UpdateValue<GameHistory>) => {
      const updatedGameHistory =
        typeof newGameHistory === "function"
          ? newGameHistory(gameHistory)
          : { ...gameHistory, ...newGameHistory };

      return user
        ? updateUser({ metadata: updatedGameHistory })
        : setGameHistory(updatedGameHistory);
    },
  });

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

  return {
    gameHistory,
    updateGameHistory: mutate,
    updateGameHistoryStatus: status,
  };
}
