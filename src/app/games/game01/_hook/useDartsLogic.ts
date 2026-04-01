import { useState } from "react";
import { PlayerState, HistoryEntry } from "../../../../_types/dart";

export function useDartsLogic() {
  // --- Setup States ---
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(1);
  const [gameType, setGameType] = useState<string>("301");
  const [roundLimit, setRoundLimit] = useState<number>(15);

  // --- Active Game States ---
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lockedInputMode, setLockedInputMode] = useState<string>("buttons");

  // ... Paste your startGame, handleThrow, handleUndo, and getNextPlayer functions here ...
  // 🎯 Start Game
  const startGame = () => {

    const savedSetting = localStorage.getItem("darts-input-mode") || "buttons";
    setLockedInputMode(savedSetting);


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
    setHistory([]); // clear history
  };

  const getNextPlayer = (players: PlayerState[], current: number): number => {
    let next = current;
    for (let i = 0; i < players.length; i++) {
      next = (next + 1) % players.length;
      if (!players[next].finished) return next;
    }
    return current;
  };

  // 🎯 Handle throw
  const handleThrow = (points: number) => {
    if (!gameStarted || gameEnded) return;

    const prevPlayers = JSON.parse(JSON.stringify(players));
    const prevPlayerIndex = currentPlayer;
    const prevRound = currentRound;
    const prevGameEnded = gameEnded;

    const updated = [...players];
    const player = { ...updated[prevPlayerIndex] };

    if (player.finished) return;

    player.throws += 1;
    player.score -= points;
    player.currentThrows = [...player.currentThrows, points];

    let nextPlayer = prevPlayerIndex;
    let nextRound = prevRound;
    let nextGameEnded: boolean = prevGameEnded;

    // Finish
    if (player.score === 0) {
      player.finished = true;
      player.rounds = [...player.rounds, player.currentThrows];
      player.currentThrows = [];
      player.throws = 0;
      player.hasPlayedThisRound = true;
      nextPlayer = getNextPlayer(updated, prevPlayerIndex);
    }
    // Bust
    else if (player.score < 0) {
      player.score = player.roundStartScore;
      player.rounds = [...player.rounds, player.currentThrows];
      player.currentThrows = [];
      player.throws = 0;
      player.hasPlayedThisRound = true;
      nextPlayer = getNextPlayer(updated, prevPlayerIndex);
    }
    // Normal 3 throws
    else if (player.throws === 3) {
      player.rounds = [...player.rounds, player.currentThrows];
      player.currentThrows = [];
      player.throws = 0;
      player.roundStartScore = player.score;
      player.hasPlayedThisRound = true;
      nextPlayer = getNextPlayer(updated, prevPlayerIndex);
    }

    updated[prevPlayerIndex] = player;

    // Check if round is complete
    const allPlayed = updated.every((p) => p.finished || p.hasPlayedThisRound);
    if (allPlayed) {
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

    // Save current state to history BEFORE applying new state
    setHistory((h) => [
      ...h,
      {
        players: prevPlayers,
        currentPlayer: prevPlayerIndex,
        currentRound: prevRound,
        gameEnded: prevGameEnded,
      },
    ]);

    // Apply new state
    setPlayers(updated);
    setCurrentPlayer(nextPlayer);
    setCurrentRound(nextRound);
    setGameEnded(nextGameEnded);
  };

  // ↩️ Improved Undo - Can undo full rounds
  const handleUndo = () => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];

    setPlayers(lastState.players);
    setCurrentPlayer(lastState.currentPlayer);
    setCurrentRound(lastState.currentRound);
    setGameEnded(lastState.gameEnded);

    // Remove the last history entry
    setHistory((h) => h.slice(0, -1));
  };

  const clearGame = () => {
    setGameStarted(false);
    setPlayers([]);
  };

  const handleBoardHit = (value: string, multiplier: number) => {
    if (value === "MISS") return handleThrow(0);
    const base = parseInt(value);
    handleThrow(base * multiplier);
  };

  return {
    numberOfPlayers,
    setNumberOfPlayers,
    roundLimit,
    setRoundLimit,
    gameType,
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
    setGameType,
  };
}
