import {
  useDynamicContext,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import { parseFixed } from "@gud/math";
import { useState } from "react";
import { ProfileIcon } from "src/ui/base/icons/ProfileIcon";
import { Modal } from "src/ui/base/Modal";
import { SecondaryButton } from "src/ui/base/SecondaryButton";
import { useGameHistory } from "src/ui/game/hooks/useGameHistory";

export function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const gameHistory = useGameHistory();
  const { user } = useDynamicContext();
  const [wallet] = useUserWallets();
  return (
    <>
      <SecondaryButton
        onClick={() => setIsOpen(true)}
        className="!text-caption !h-10"
      >
        <ProfileIcon />
        Profile
      </SecondaryButton>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Profile">
        {user && <h3>{user.alias || user.username || wallet?.address}</h3>}
        <ul className="border-stone flex flex-col gap-2 rounded border p-3">
          <li className="flex items-center justify-between">
            <span className="text-lichen">Games played:</span>
            <span className="text-h6 font-mono">
              {gameHistory?.gamesPlayed}
            </span>
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
            <span className="text-h6 font-mono">
              {gameHistory?.bestWinStreak}
            </span>
          </li>
        </ul>
      </Modal>
    </>
  );
}
