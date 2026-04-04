import { useState } from "react";
import { PlayerState, HistoryEntry } from "../../../../_types/dart";

export function useDartsLogic() {
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(1);
  const [gameType, setGameType] = useState<string>("301");
  const [roundLimit, setRoundLimit] = useState<number>(15);
  const [finishType, setFinishType] = useState<"Single" | "Double">("Single"); // Added state

  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const startGame = () => {
    const start = parseInt(gameType);
    const initialPlayers: PlayerState[] = Array.from(
      { length: numberOfPlayers },
      () => ({
        score: start,
        roundStartScore: start,
        throws: 0,
        finished: false,
        hasPlayedThisRound: false,
        currentThrows: [],
        rounds: [],
      }),
    );

    setPlayers(initialPlayers);
    setCurrentPlayer(0);
    setCurrentRound(1);
    setGameStarted(true);
    setGameEnded(false);
    setHistory([]);
  };

  const getNextPlayer = (players: PlayerState[], current: number): number => {
    let next = current;
    for (let i = 0; i < players.length; i++) {
      next = (next + 1) % players.length;
      if (!players[next].finished) return next;
    }
    return current;
  };

  // 🎯 Updated handleThrow with Multiplier logic
  const handleThrow = (points: number, multiplier: number = 1) => {
    if (!gameStarted || gameEnded) return;

    const prevPlayers = JSON.parse(JSON.stringify(players));
    const prevPlayerIndex = currentPlayer;
    const prevRound = currentRound;
    const prevGameEnded = gameEnded;

    const updated = [...players];
    const player = { ...updated[prevPlayerIndex] };

    if (player.finished) return;

    player.throws += 1;
    const potentialScore = player.score - points;
    player.currentThrows = [...player.currentThrows, points];

    let isBust = false;
    let isWin = false;

    // --- CHECK WIN/BUST LOGIC ---
    if (finishType === "Double") {
      if (potentialScore === 0 && multiplier === 2) {
        isWin = true;
      } else if (potentialScore <= 1) {
        // In Double Out, hitting 1 or going below 0 or hitting 0 without a double is a bust
        isBust = true;
      }
    } else {
      // Single Out Logic
      if (potentialScore === 0) isWin = true;
      else if (potentialScore < 0) isBust = true;
    }

    // --- APPLY RESULTS ---
    if (isWin) {
      player.score = 0;
      player.finished = true;
      finalizeTurn(player);
    } else if (isBust) {
      player.score = player.roundStartScore; // Reset to start of round
      finalizeTurn(player);
    } else {
      player.score = potentialScore;
      if (player.throws === 3) {
        player.roundStartScore = player.score; // Update base score for next round
        finalizeTurn(player);
      }
    }

    function finalizeTurn(p: any) {
      p.rounds = [...p.rounds, p.currentThrows];
      p.currentThrows = [];
      p.throws = 0;
      p.hasPlayedThisRound = true;
    }

    updated[prevPlayerIndex] = player;

    // --- NAVIGATION LOGIC ---
    let nextPlayer = prevPlayerIndex;
    let nextRound = prevRound;
    let nextGameEnded: boolean = prevGameEnded;

    // If turn finished (win, bust, or 3 throws), move to next player
    if (player.hasPlayedThisRound || player.finished) {
      nextPlayer = getNextPlayer(updated, prevPlayerIndex);
    }

    // Check if round is complete
    const allPlayedOrFinished = updated.every(
      (p) => p.finished || p.hasPlayedThisRound,
    );
    if (allPlayedOrFinished) {
      updated.forEach((p) => (p.hasPlayedThisRound = false));
      if (prevRound >= roundLimit) {
        nextGameEnded = true;
      } else {
        nextRound = prevRound + 1;
      }
    }

    if (updated.every((p) => p.finished)) {
      nextGameEnded = true;
    }

    // --- SAVE HISTORY & STATE ---
    setHistory((h) => [
      ...h,
      {
        players: prevPlayers,
        currentPlayer: prevPlayerIndex,
        currentRound: prevRound,
        gameEnded: prevGameEnded,
      },
    ]);

    setPlayers(updated);
    setCurrentPlayer(nextPlayer);
    setCurrentRound(nextRound);
    setGameEnded(nextGameEnded);
  };

  const handleBoardHit = (value: string, multiplierStr: "S" | "D" | "T") => {
    if (value === "MISS") return handleThrow(0, 1);

    const multiplierMap = { S: 1, D: 2, T: 3 };
    const m = multiplierMap[multiplierStr];
    const base = parseInt(value);

    handleThrow(base * m, m);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setPlayers(lastState.players);
    setCurrentPlayer(lastState.currentPlayer);
    setCurrentRound(lastState.currentRound);
    setGameEnded(lastState.gameEnded);
    setHistory((h) => h.slice(0, -1));
  };

  const clearGame = () => {
    setGameStarted(false);
    setPlayers([]);
  };

  return {
    numberOfPlayers,
    setNumberOfPlayers,
    roundLimit,
    setRoundLimit,
    gameType,
    setGameType,
    finishType,
    setFinishType,
    players,
    currentPlayer,
    gameStarted,
    gameEnded,
    currentRound,
    startGame,
    handleThrow,
    handleUndo,
    clearGame,
    handleBoardHit,
  };
}
