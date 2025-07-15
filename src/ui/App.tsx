import {
  DynamicWidget, useUserUpdateRequest
} from "@dynamic-labs/sdk-react-core";
import { SecondaryButton } from "src/ui/base/SecondaryButton";
import { Game } from "src/ui/game/Game";

export function App() {
  const { updateUser } = useUserUpdateRequest();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex w-full py-4 px-6">
        <h1 className="font-bold text-h6">Mathler</h1>
        <div className="flex gap-4 items-center ml-auto">
          <SecondaryButton
            onClick={() => {
              updateUser({
                metadata: {
                  gamesPlayed: 1,
                },
              });
            }}
            className="!text-caption !h-10"
          >
            Update info
          </SecondaryButton>
          <DynamicWidget />
        </div>
      </div>

      {/* Main */}
      <div className="flex justify-center p-14">
        <Game />
      </div>
    </div>
  );
}
