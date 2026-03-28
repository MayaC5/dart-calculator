"use client";

import { useState } from "react";

const CRICKET_NUMBERS = ["20", "19", "18", "17", "16", "15", "25"];

type Marks = {
  [key: string]: number;
};

type PlayerState = {
  marks: Marks;
  score: number;
  throws: number;
  hasPlayedThisRound: boolean;
};

export default function CricketGame() {
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const [roundLimit, setRoundLimit] = useState(20);
  const [currentRound, setCurrentRound] = useState(1);

  // 🆕 Input mode
  const [inputMode, setInputMode] = useState<"buttons" | "board">("buttons");

  // 🎯 Start Game
  const startGame = () => {
    const initialPlayers: PlayerState[] = Array.from(
      { length: numberOfPlayers },
      () => ({
        marks: Object.fromEntries(CRICKET_NUMBERS.map((n) => [n, 0])),
        score: 0,
        throws: 0,
        hasPlayedThisRound: false,
      }),
    );

    setPlayers(initialPlayers);
    setCurrentPlayer(0);
    setCurrentRound(1);
    setGameStarted(true);
    setGameEnded(false);
  };

  // 🔁 Next Player
  const nextPlayer = (players: PlayerState[], current: number) => {
    return (current + 1) % players.length;
  };

  // 🎯 Handle Hit (CORRECT CRICKET LOGIC)
  const handleHit = (value: string, multiplier: number) => {
    if (!gameStarted || gameEnded) return;

    setPlayers((prev) => {
      const updated = [...prev];
      const player = { ...updated[currentPlayer] };

      player.throws += 1;

      if (value !== "MISS") {
        const currentMarks = player.marks[value];

        // ✅ NOT CLOSED → only add marks
        if (currentMarks < 3) {
          player.marks[value] = Math.min(3, currentMarks + multiplier);
        }
        // ✅ CLOSED → scoring allowed
        else {
          const othersClosed = updated.every(
            (p, i) => i === currentPlayer || p.marks[value] >= 3,
          );

          if (!othersClosed) {
            const scoreValue = value === "25" ? 25 : parseInt(value);
            player.score += multiplier * scoreValue;
          }
        }
      }

      let next = currentPlayer;

      // ✅ End turn
      if (player.throws === 3) {
        player.throws = 0;
        player.hasPlayedThisRound = true;
        next = nextPlayer(updated, currentPlayer);
      }

      updated[currentPlayer] = player;

      // ✅ Round complete
      const allPlayed = updated.every((p) => p.hasPlayedThisRound);

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

      // 🏁 Win condition
      const hasClosedAll = CRICKET_NUMBERS.every((n) => player.marks[n] >= 3);

      const highestScore = Math.max(...updated.map((p) => p.score));

      if (hasClosedAll && player.score >= highestScore) {
        setGameEnded(true);
      }

      setCurrentPlayer(next);

      return updated;
    });
  };

  // 🧹 Clear Game
  const clearGame = () => {
    setPlayers([]);
    setGameStarted(false);
    setGameEnded(false);
    setCurrentRound(1);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Cricket</h1>

      {/* Players */}
      <div>
        <div>Players (1–4)</div>
        <input
          type="number"
          min={1}
          max={4}
          value={numberOfPlayers}
          disabled={gameStarted}
          onChange={(e) =>
            setNumberOfPlayers(
              Math.min(4, Math.max(1, parseInt(e.target.value) || 1)),
            )
          }
          className="border p-1"
        />
      </div>

      {/* Rounds */}
      <div>
        <div>Round Limit</div>
        <input
          type="number"
          value={roundLimit}
          disabled={gameStarted}
          onChange={(e) => setRoundLimit(parseInt(e.target.value) || 1)}
          className="border p-1"
        />
      </div>

      {/* Start */}
      <button
        onClick={startGame}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Start Game
      </button>

      {/* Game */}
      {gameStarted && (
        <>
          <div className="font-bold">
            Round: {currentRound} / {roundLimit}
          </div>

          {gameEnded && (
            <div className="text-red-600 font-bold">Game Finished 🎉</div>
          )}

          {/* Players */}
          <div className="space-y-2">
            {players.map((p, i) => (
              <div
                key={i}
                className={`border p-3 rounded ${
                  i === currentPlayer && !gameEnded ? "bg-yellow-100" : ""
                }`}
              >
                <h3>Player {i + 1}</h3>
                <div>Score: {p.score}</div>

                {CRICKET_NUMBERS.map((n) => (
                  <div key={n}>
                    {n}: {"X".repeat(p.marks[n])}
                  </div>
                ))}

                <div>Throws: {p.throws}/3</div>
              </div>
            ))}
          </div>

          {/* 🎯 INPUT MODE TOGGLE */}
          {!gameEnded && (
            <>
              <div className="flex gap-2">
                <button
                  onClick={() => setInputMode("buttons")}
                  className={`px-3 py-1 border rounded ${
                    inputMode === "buttons" ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  Buttons
                </button>

                <button
                  onClick={() => setInputMode("board")}
                  className={`px-3 py-1 border rounded ${
                    inputMode === "board" ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  Board
                </button>
              </div>

              {/* 🎯 BUTTON MODE */}
              {inputMode === "buttons" && (
                <div className="space-y-2">
                  {CRICKET_NUMBERS.map((n) => (
                    <div key={n} className="flex gap-2 items-center">
                      <span className="w-8">{n}</span>
                      <button onClick={() => handleHit(n, 1)}>S</button>
                      <button onClick={() => handleHit(n, 2)}>D</button>
                      <button onClick={() => handleHit(n, 3)}>T</button>
                    </div>
                  ))}

                  <button
                    onClick={() => handleHit("MISS", 0)}
                    className="px-3 py-1 border"
                  >
                    MISS
                  </button>
                </div>
              )}

              {/* 🎯 BOARD MODE */}
              {inputMode === "board" && (
                <div className="grid grid-cols-3 gap-3">
                  {CRICKET_NUMBERS.map((n) => (
                    <div
                      key={n}
                      className="border rounded p-2 flex flex-col items-center"
                    >
                      <div className="font-bold mb-1">{n}</div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleHit(n, 1)}
                          className="px-2 py-1 bg-green-300 rounded"
                        >
                          S
                        </button>

                        <button
                          onClick={() => handleHit(n, 2)}
                          className="px-2 py-1 bg-blue-400 text-white rounded"
                        >
                          D
                        </button>

                        <button
                          onClick={() => handleHit(n, 3)}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          T
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* MISS */}
                  <div className="col-span-3 flex justify-center">
                    <button
                      onClick={() => handleHit("MISS", 0)}
                      className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                      MISS
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Clear */}
      {gameStarted && (
        <button
          onClick={clearGame}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear Game
        </button>
      )}
    </div>
  );
}
