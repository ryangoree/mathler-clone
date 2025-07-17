import { Game } from "src/ui/game/Game";
import { ProfileButton } from "src/ui/game/ProfileButton";

export function App() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="flex w-full justify-between px-6 py-4">
        <h1 className="text-h6 font-bold">Mathler</h1>
        <ProfileButton />
      </div>

      {/* Main */}
      <div className="flex justify-center p-14">
        <Game />
      </div>
    </div>
  );
}
