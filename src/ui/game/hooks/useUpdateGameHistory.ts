import {
  useIsLoggedIn,
  useUserUpdateRequest,
} from "@dynamic-labs/sdk-react-core";
import { useMutation } from "@tanstack/react-query";
import type { UpdateValue } from "src/ui/base/types";
import { useGameHistory } from "src/ui/game/hooks/useGameHistory";
import { useLocalGameHistory } from "src/ui/game/hooks/useLocalGameHistory";
import type { GameHistory } from "src/ui/game/types";

export function useUpdateGameHistory() {
  const isLoggedIn = useIsLoggedIn();
  const { updateUser } = useUserUpdateRequest();
  const gameHistory = useGameHistory();
  const [, setLocalGameHistory] = useLocalGameHistory();

  const { mutate, status } = useMutation({
    mutationKey: ["updateGameHistory"],
    mutationFn: async (newGameHistory: UpdateValue<GameHistory>) => {
      if (!gameHistory) return;

      const updatedGameHistory =
        typeof newGameHistory === "function"
          ? newGameHistory(gameHistory)
          : { ...gameHistory, ...newGameHistory };

      setLocalGameHistory(updatedGameHistory);
      if (isLoggedIn) {
        return updateUser({ metadata: updatedGameHistory });
      }
    },
  });

  return {
    updateGameHistory: gameHistory ? mutate : undefined,
    updateGameHistoryStatus: status,
  };
}
