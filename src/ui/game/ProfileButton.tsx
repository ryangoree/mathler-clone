import {
  DynamicConnectButton,
  useDynamicContext,
  useIsLoggedIn,
} from "@dynamic-labs/sdk-react-core";
import { useRef, useState } from "react";
import { PrimaryButton } from "src/ui/base/buttons/PrimaryButton";
import { SecondaryButton } from "src/ui/base/buttons/SecondaryButton";
import { ProfileIcon } from "src/ui/base/icons/ProfileIcon";
import { Modal } from "src/ui/base/Modal";
import { ProfileStats } from "src/ui/game/ProfileStats";

export function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { handleLogOut } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleClose = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      <SecondaryButton
        ref={buttonRef}
        onClick={() => setIsOpen(true)}
        className="text-caption! h-10!"
      >
        <ProfileIcon />
        Profile
      </SecondaryButton>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Profile"
        actions={
          isLoggedIn ? (
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
        <ProfileStats />
      </Modal>
    </>
  );
}
