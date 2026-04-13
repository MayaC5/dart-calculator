"use client";

import { useState } from "react";
import { PlayerState, HistoryEntry } from "../_types/dart";

export function useDartsLogic() {
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(1);
  const [gameType, setGameType] = useState<string>("301");
  const [roundLimit, setRoundLimit] = useState<number>(15);
  const [finishType, setFinishType] = useState<"Single" | "Double">("Single");

  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  

  const startGame = () => {
    let start = 0;
    if (gameType !== "Cricket" && gameType !== "CountUp") {
      start = parseInt(gameType);
    }
    const initialPlayers = Array.from({ length: numberOfPlayers }, (_, i) => ({
      id: `p${i + 1}`,
      score: start,
      cricketMarks: {}, // Initialize as empty object
      rounds: [],
      currentThrows: [],
      throws: 0,
      roundStartScore: start,
      finished: false,
      hasPlayedThisRound: false,
    }));

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

  const handleThrow = (points: number, multiplier: number = 1) => {
    if (!gameStarted || gameEnded) return;

    // 1. Snapshot for history (Undo)
    const prevPlayers = JSON.parse(JSON.stringify(players));
    const updated = [...players];
    const player = { ...updated[currentPlayer] };

    if (player.finished) return;

    // 2. Track the throw
    player.throws += 1;
    player.currentThrows = [...player.currentThrows, points];

    // 3. --- LOGIC BRANCHING ---
    if (gameType === "CountUp") {
      handleCountUpLogic(player, points);
    } else if (gameType === "Cricket") {
      handleCricketLogic(player, points, multiplier);
    } else {
      // Standard 01 Games (301, 501, etc.)
      handle01Logic(player, points, multiplier);
    }

    // 4. --- FINALIZE TURN & ROUNDS ---
    // If player finished 3 throws OR the game logic set them to 'finished'
    if (player.throws === 3 || player.finished) {
      player.rounds = [...player.rounds, player.currentThrows];
      player.currentThrows = [];
      player.throws = 0;
      player.hasPlayedThisRound = true;
      player.roundStartScore = player.score; // Save for next round's bust protection
    }

    // 5. --- UPDATE GLOBAL STATE ---
    finalizeGameState(updated, player, prevPlayers);
  };

  const handle01Logic = (player: any, points: number, multiplier: number) => {
    const potentialScore = player.score - points;

    if (finishType === "Double") {
      if (potentialScore === 0 && multiplier === 2) {
        player.score = 0;
        player.finished = true;
      } else if (potentialScore <= 1) {
        // Bust
        player.score = player.roundStartScore;
        player.finished = false; // Ensure they keep playing next round
        player.throws = 3; // Force end of turn
      } else {
        player.score = potentialScore;
      }
    } else {
      if (potentialScore === 0) {
        player.score = 0;
        player.finished = true;
      } else if (potentialScore < 0) {
        player.score = player.roundStartScore;
        player.throws = 3;
      } else {
        player.score = potentialScore;
      }
    }
  };

  const handleCountUpLogic = (player: any, points: number) => {
    player.score += points;
  };

  const handleCricketLogic = (
    player: PlayerState,
    value: number,
    multiplier: number,
  ) => {
    const validNumbers = [15, 16, 17, 18, 19, 20, 25];
    if (!validNumbers.includes(value)) return;

    const key = value.toString();

    // Ensure the object exists before reading
    if (!player.cricketMarks) player.cricketMarks = {};

    const currentMarks = player.cricketMarks[key] || 0;

    const totalMarks = currentMarks + multiplier;
    player.cricketMarks[key] = Math.min(totalMarks, 3);

    if (totalMarks > 3) {
      const pointsToApply = (totalMarks - Math.max(currentMarks, 3)) * value;

      // Type-safe check against other players
      const isClosedByAll = players.every(
        (p) => (p.cricketMarks?.[key] || 0) >= 3,
      );

      if (!isClosedByAll) {
        player.score += pointsToApply;
      }
    }
  };

  const finalizeGameState = (
    updated: any[],
    activePlayer: any,
    prevPlayers: any,
  ) => {
    updated[currentPlayer] = activePlayer;

    let nextPlayer = currentPlayer;
    let nextRound = currentRound;
    let nextGameEnded = gameEnded;

    // Move to next player if current is done
    if (activePlayer.hasPlayedThisRound) {
      nextPlayer = getNextPlayer(updated, currentPlayer);
    }

    // Check round increment
    const allPlayed = updated.every((p) => p.finished || p.hasPlayedThisRound);
    if (allPlayed) {
      updated.forEach((p) => (p.hasPlayedThisRound = false));
      if (currentRound >= roundLimit) {
        nextGameEnded = true;
      } else {
        nextRound += 1;
      }
    }

    // Check if everyone finished (01 games)
    if (updated.every((p) => p.finished)) nextGameEnded = true;

    // Set State
    setHistory((h) => [
      ...h,
      { players: prevPlayers, currentPlayer, currentRound, gameEnded },
    ]);
    setPlayers(updated);
    setCurrentPlayer(nextPlayer);
    setCurrentRound(nextRound);
    setGameEnded(nextGameEnded);
  };

  /**
   * FIX: Changed multiplier type to 'number' to match GameBoard props.
   */
  const handleBoardHit = (value: string, multiplier: number) => {
    if (value === "MISS") return handleThrow(0, 1);

    const base = parseInt(value);
    // Directly pass the numeric multiplier to handleThrow
    handleThrow(base * multiplier, multiplier);
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
