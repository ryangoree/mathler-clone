import {
  DynamicConnectButton,
  useDynamicContext,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import { parseFixed } from "@gud/math";
import { useState } from "react";
import { PrimaryButton } from "src/ui/base/buttons/PrimaryButton";
import { SecondaryButton } from "src/ui/base/buttons/SecondaryButton";
import { ProfileIcon } from "src/ui/base/icons/ProfileIcon";
import { Modal } from "src/ui/base/Modal";
import { formatAddress } from "src/ui/base/utils/formatAddress";
import { useGameHistory } from "src/ui/game/hooks/useGameHistory";

export function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { handleLogOut } = useDynamicContext();
  const [wallet] = useUserWallets();
  const gameHistory = useGameHistory();
  return (
    <>
      <SecondaryButton
        onClick={() => setIsOpen(true)}
        className="text-caption! h-10!"
      >
        <ProfileIcon />
        Profile
      </SecondaryButton>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Profile"
        actions={
          wallet?.address ? (
            <SecondaryButton className="w-full" onClick={() => handleLogOut()}>
              Log out
            </SecondaryButton>
          ) : (
            <DynamicConnectButton
              buttonContainerClassName="w-full"
              buttonClassName="w-full"
            >
              <PrimaryButton className="w-full" as="span">
                Log in
              </PrimaryButton>
            </DynamicConnectButton>
          )
        }
      >
        <ul className="border-stone flex flex-col gap-2 rounded border p-3">
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
