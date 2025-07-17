import { useUserWallets } from "@dynamic-labs/sdk-react-core";
import { parseFixed } from "@gud/math";
import classNames from "classnames";
import { formatAddress } from "src/ui/base/utils/formatAddress";
import { useGameHistory } from "src/ui/game/hooks/useGameHistory";

export interface ProfileStatsProps {
  className?: string;
}

export function ProfileStats({ className }: ProfileStatsProps) {
  const [wallet] = useUserWallets();
  const { gameHistory } = useGameHistory();

  return (
    <ul
      className={classNames(
        "border-stone flex flex-col gap-2 rounded border p-3",
        className,
      )}
    >
      {wallet?.address && (
        <li className="flex items-center justify-between">
          <span className="text-lichen text-h6">User:</span>
          <span className="text-h6 font-bold">
            {formatAddress(wallet.address)}
          </span>
        </li>
      )}
      <li className="flex items-center justify-between">
        <span className="text-lichen">Games played:</span>
        <span className="text-h6 font-mono">{gameHistory?.gamesPlayed}</span>
      </li>
      <li className="flex items-center justify-between">
        <span className="text-lichen">Win %:</span>
        <span className="text-h6 font-mono">
          {parseFixed(gameHistory?.gamesWon)
            .div(gameHistory?.gamesPlayed || 1, 0)
            .format({ percent: true, decimals: 1 })}
        </span>
      </li>
      <li className="flex items-center justify-between">
        <span className="text-lichen">Current Win Streak:</span>
        <span className="text-h6 font-mono">
          {gameHistory?.currentWinStreak}
        </span>
      </li>
      <li className="flex justify-between">
        <span className="text-lichen">Best Win Streak:</span>
        <span className="text-h6 font-mono">{gameHistory?.bestWinStreak}</span>
      </li>
    </ul>
  );
}
