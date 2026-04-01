export type PlayerState = {
  score: number;
  roundStartScore: number;
  throws: number;
  finished: boolean;
  hasPlayedThisRound: boolean;
  currentThrows: number[];
  rounds: number[][];
};

export type HistoryEntry = {
  players: PlayerState[];
  currentPlayer: number;
  currentRound: number;
  gameEnded: boolean;
};

export type InputModeType = "buttons" | "board" | "calculator" | "directCal";
