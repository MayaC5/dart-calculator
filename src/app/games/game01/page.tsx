"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import InputMode from "./_components/inputMode";
import ButtonMode from "./_components/buttonMode";
import CalMode from "./_components/calMode";

const BOARD_NUMBERS = [
  "20",
  "19",
  "18",
  "17",
  "16",
  "15",
  "14",
  "13",
  "12",
  "11",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "1",
  "25",
];

type PlayerState = {
  score: number;
  roundStartScore: number;
  throws: number;
  finished: boolean;
  hasPlayedThisRound: boolean;
  currentThrows: number[];
  rounds: number[][];
};

type HistoryEntry = {
  players: PlayerState[];
  currentPlayer: number;
  currentRound: number;
  gameEnded: boolean;
};

export default function ZeroOneGames() {
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(1);
  const [gameType, setGameType] = useState<string>("301");
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  const [roundLimit, setRoundLimit] = useState<number>(15);
  const [currentRound, setCurrentRound] = useState<number>(1);

  const [inputMode, setInputMode] = useState<"buttons" | "board" | "calculator">("buttons");

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // 🎯 Start Game
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
    setHistory([]); // clear history
  };

  // 🔁 Next player
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

  const handleBoardHit = (value: string, multiplier: number) => {
    if (value === "MISS") return handleThrow(0);
    const base = parseInt(value);
    handleThrow(base * multiplier);
  };

  const clearGame = () => {
    setPlayers([]);
    setGameStarted(false);
    setGameEnded(false);
    setCurrentPlayer(0);
    setCurrentRound(1);
    setHistory([]);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">01 Games 🎯</h1>
      {/* Game Type */}
      {!gameStarted && (
        <div className="mb-2 flex gap-2 flex-col">
          <div>
            <div className="mb-2">Game Mode</div>
            <div className="flex gap-2">
              {["301", "501", "701", "1501"].map((type) => (
                <button
                  key={type}
                  onClick={() => setGameType(type)}
                  disabled={gameStarted}
                  className={`px-4 py-2 border rounded ${
                    gameType === type ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          {/* 👥 Player Buttons */}
          <div>
            <div className="mb-2">Number of Players (1–4)</div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  disabled={gameStarted}
                  onClick={() => setNumberOfPlayers(n)}
                  className={`px-4 py-2 border rounded ${
                    numberOfPlayers === n ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {n}P
                </button>
              ))}
            </div>
          </div>
          {/* Round limit */}
          {/* Round Limit Input - Fixed for Mobile */}
          {/* Max Rounds - Mobile Friendly with + and - buttons */}
          {/* Max Rounds - Mobile Friendly with + and - buttons */}
          <div className="flex flex-col">
            <div className="mb-2">Max Rounds:</div>

            <div className="flex gap-3">
              {/* Minus Button */}
              <button
                type="button"
                onClick={() => setRoundLimit(Math.max(1, roundLimit - 1))}
                disabled={gameStarted || roundLimit <= 1}
                className="flex items-center px-4 py-2 justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                −
              </button>

              {/* Number Display */}
              <div className=" text-center">
                <div className="flex border justify-center items-center border-gray-300 rounded px-4 py-2 bg-white">
                  {roundLimit}
                </div>
              </div>

              {/* Plus Button */}
              <button
                type="button"
                onClick={() => setRoundLimit(Math.min(50, roundLimit + 1))}
                disabled={gameStarted || roundLimit >= 50}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={startGame}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Start Game
          </button>
        </div>
      )}

      {gameStarted && (
        <>
          <div className="flex justify-between items-center">
            <div>
              Round: {currentRound} / {roundLimit}
            </div>
          </div>
          <div className="flex flex-col">
            Player {currentPlayer + 1}
            <div className="grid grid-cols-3 mb-3">
              <div className="w-full space-y-2 text-sm">
                {players[currentPlayer].rounds.length === 0 ? (
                  <div className="text-gray-400 italic">
                    No completed rounds yet
                  </div>
                ) : (
                  players[currentPlayer].rounds
                    .slice(-5) // Take only the last 5 rounds
                    .map((round, idx) => {
                      const totalRounds = players[currentPlayer].rounds.length;
                      const startRound = Math.max(1, totalRounds - 4); // Important fix
                      const displayRoundNumber = startRound + idx;

                      return (
                        <div key={idx} className='w-full flex'>
                          <span className="font-semibold text-gray-700 ">
                            R{displayRoundNumber}
                          </span>

                          <span className="font-mono text-center">
                            {" "}
                            {round.join("  ")}
                          </span>

                          <span className="text-gray-500 font-medium text-right">
                            ({round.reduce((a, b) => a + b, 0)})
                          </span>
                        </div>
                      );
                    })
                )}
              </div>
              <div className="text-center items-center font-bold ">
                {players[currentPlayer].score}
              </div>
              <div className="flex align-right">
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-10 font-semibold text-gray-700 text-sm">
                        T {i + 1}
                      </div>
                      <div className="text-sm">
                        {players[currentPlayer].currentThrows[i] !== undefined
                          ? players[currentPlayer].currentThrows[i]
                          : "-"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={`grid grid-cols-${numberOfPlayers} gap-2`}>
              {players.map((p, i) => (
                <div key={i} className={`${i === currentPlayer ? "bg-yellow-100" : ""} p-2`}>
                  <div>
                    <div>
                      Player {i + 1}
                      {p.finished && " ✅"}
                    </div>
                    <div>{p.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!gameEnded && (
            <>
              <div className="flex gap-2">
                <button onClick={() => setInputMode("buttons")}>Buttons</button>
                <button onClick={() => setInputMode("board")}>Board</button>
                <button onClick={() => setInputMode("calculator")}>
                  Calculator
                </button>
              </div>

              {inputMode === "buttons" && (
                <InputMode onThrow={handleThrow} onUndo={handleUndo} />
              )}

              {inputMode === "board" && (
                <ButtonMode onBoardHit={handleBoardHit} onUndo={handleUndo} />
              )}
              {inputMode === "calculator" && (
                <CalMode onThrow={handleThrow} onUndo={handleUndo} />
              )}
            </>
          )}
        </>
      )}
      {gameStarted && (
        <button
          onClick={clearGame}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Game
        </button>
      )}
    </div>
  );
}

/// save

