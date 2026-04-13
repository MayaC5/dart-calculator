export type PlayerState = {
  id: string;
  score: number;
  // Use a Record where the key is the dartboard number as a string
  cricketMarks: Record<string, number>;
  rounds: number[][];
  currentThrows: number[];
  throws: number;
  roundStartScore: number;
  finished: boolean;
  hasPlayedThisRound: boolean;
};

export type HistoryEntry = {
  players: PlayerState[];
  currentPlayer: number;
  currentRound: number;
  gameEnded: boolean;
};

export type InputModeType = "buttons" | "board" | "calculator" | "directCal";
