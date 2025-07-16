export interface GameHistory {
  gamesPlayed: number;
  gamesWon: number;
  currentWinStreak: number;
  bestWinStreak: number;
}

export type InputStatus = "correct" | "present" | "absent";
