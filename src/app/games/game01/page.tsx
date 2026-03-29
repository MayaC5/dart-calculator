"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  // 🆕 history
  currentThrows: number[];
  rounds: number[][];
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

  const [inputMode, setInputMode] = useState<"buttons" | "board">("buttons");

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
  };

  // 🔁 Next player
  const getNextPlayer = (players: PlayerState[], current: number) => {
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
    if (points < 0 || points > 180) return;

    setPlayers((prev) => {
      const updated = [...prev];
      const idx = currentPlayer;
      const player = { ...updated[idx] };

      if (player.finished) return prev;

      player.throws += 1;
      player.score -= points;

      // 🆕 track throws
      player.currentThrows = [...player.currentThrows, points];

      let nextPlayer = idx;

      // 🎉 Finish
      if (player.score === 0) {
        player.finished = true;

        player.rounds = [...player.rounds, player.currentThrows];
        player.currentThrows = [];
        player.throws = 0;
        player.hasPlayedThisRound = true;

        nextPlayer = getNextPlayer(updated, idx);
      }
      // ❌ Bust
      else if (player.score < 0) {
        player.score = player.roundStartScore;

        player.rounds = [...player.rounds, player.currentThrows];
        player.currentThrows = [];
        player.throws = 0;
        player.hasPlayedThisRound = true;

        nextPlayer = getNextPlayer(updated, idx);
      }
      // ✅ End turn
      else if (player.throws === 3) {
        player.rounds = [...player.rounds, player.currentThrows];
        player.currentThrows = [];
        player.throws = 0;
        player.roundStartScore = player.score;
        player.hasPlayedThisRound = true;

        nextPlayer = getNextPlayer(updated, idx);
      }

      updated[idx] = player;

      // ✅ Round complete
      const allPlayed = updated.every(
        (p) => p.finished || p.hasPlayedThisRound,
      );

      if (allPlayed) {
        updated.forEach((p) => (p.hasPlayedThisRound = false));

        setCurrentRound((r) => {
          if (r >= roundLimit) {
            setGameEnded(true);
            return r;
          }
          return r + 1;
        });
      }

      setCurrentPlayer(nextPlayer);

      // 🏁 All finished
      if (updated.every((p) => p.finished)) {
        setGameEnded(true);
      }

      return updated;
    });
  };

  // 🎯 Board hit
  const handleBoardHit = (value: string, multiplier: number) => {
    if (value === "MISS") return handleThrow(0);

    const base = parseInt(value);
    const score = base * multiplier;

    handleThrow(score);
  };

  // 🧹 Clear
  const clearGame = () => {
    setPlayers([]);
    setGameStarted(false);
    setGameEnded(false);
    setCurrentPlayer(0);
    setCurrentRound(1);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">01 Games 🎯</h1>

      {/* Game Type */}
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

      {/* GAME */}
      {gameStarted && (
        <>
          <div>
            Round: {currentRound} / {roundLimit}
          </div>

          <div className="grid grid-cols-2 gap-4 ">
            {players.map((p, i) => (
              <div key={i} className="border p-3 rounded">
                <h3>
                  Player {i + 1}
                  {i === currentPlayer && !gameEnded && " 🎯"}
                  {p.finished && " ✅"}
                </h3>

                <div>Score: {p.score}</div>

                <div>Current: {p.currentThrows.join(" | ") || "-"}</div>

                <div className="text-sm text-gray-500">
                  History:
                  {p.rounds.map((round, idx) => (
                    <div key={idx}>
                      {idx + 1}: {round.join(" | ")} (
                      {round.reduce((a, b) => a + b, 0)})
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!gameEnded && (
            <>
              {/* Mode switch */}
              <div className="flex gap-2">
                <button onClick={() => setInputMode("buttons")}>Buttons</button>
                <button onClick={() => setInputMode("board")}>Board</button>
              </div>

              {/* Buttons mode */}
              {inputMode === "buttons" && (
                <input
                  type="number"
                  placeholder="Enter score"
                  className="border p-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = parseInt(
                        (e.target as HTMLInputElement).value,
                      );
                      if (!isNaN(val)) {
                        handleThrow(val);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
              )}

              {/* Board mode */}
              {inputMode === "board" && (
                <div className="grid grid-cols-3 gap-2">
                  {BOARD_NUMBERS.map((n) => (
                    <div key={n} className="border py-2 px-1 text-center">
                      <div>{n}</div>
                      <div className="flex gap-1 justify-between">
                        <Button
                          className="bg-blue-500"
                          onClick={() => handleBoardHit(n, 1)}
                        >
                          S
                        </Button>
                        <Button
                          className="bg-red-500"
                          onClick={() => handleBoardHit(n, 2)}
                        >
                          D
                        </Button>
                        <Button
                          className="bg-green-500"
                          onClick={() => handleBoardHit(n, 3)}
                        >
                          T
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    className="px-4 py-2 bg-gray-400"
                    onClick={() => handleBoardHit("MISS", 0)}
                  >
                    MISS
                  </Button>
                </div>
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
          Clear
        </button>
      )}
    </div>
  );
}

