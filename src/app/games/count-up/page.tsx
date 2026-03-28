"use client";

import { useState } from "react";

type PlayerState = {
  score: number;
  throws: number;
  finished: boolean;
  hasPlayedThisRound: boolean;
};

export default function CountUpGames() {
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>(1);
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);

  const [roundLimit, setRoundLimit] = useState<number>(10);
  const [currentRound, setCurrentRound] = useState<number>(1);

  // 🎯 Start Game
  const startGame = () => {
    const initialPlayers: PlayerState[] = Array.from(
      { length: numberOfPlayers },
      () => ({
        score: 0,
        throws: 0,
        finished: false,
        hasPlayedThisRound: false,
      }),
    );

    setPlayers(initialPlayers);
    setCurrentPlayer(0);
    setCurrentRound(1);
    setGameStarted(true);
    setGameEnded(false);
  };

  // 🔁 Get next active player
  const getNextPlayer = (players: PlayerState[], current: number) => {
    let next = current;
    for (let i = 0; i < players.length; i++) {
      next = (next + 1) % players.length;
      if (!players[next].finished) return next;
    }
    return current; // all finished
  };

  // 🎯 Handle Throw
  const handleThrow = (points: number) => {
    if (!gameStarted || gameEnded) return;
    if (points < 0 || points > 60) return;

    const playerIndex = currentPlayer;

    setPlayers((prev) => {
      const updated = [...prev];
      const player = { ...updated[playerIndex] };

      if (player.finished) return prev;

      player.throws += 1;
      player.score += points;

      let nextPlayer = playerIndex;

      // ✅ End of turn (3 throws)
      if (player.throws === 3) {
        player.throws = 0;
        player.hasPlayedThisRound = true;

        nextPlayer = getNextPlayer(updated, playerIndex);
      }

      updated[playerIndex] = player;

      // ✅ Check if all active players finished this round
      const allPlayed = updated.every(
        (p) => p.finished || p.hasPlayedThisRound,
      );

      if (allPlayed) {
        updated.forEach((p) => {
          p.hasPlayedThisRound = false;
        });

        setCurrentRound((prevRound) => {
          if (prevRound >= roundLimit) {
            setGameEnded(true);
            return prevRound;
          }
          return prevRound + 1;
        });
      }

      setCurrentPlayer(nextPlayer);

      return updated;
    });
  };

  // 🧹 Clear Game
  const clearGame = () => {
    setPlayers([]);
    setGameStarted(false);
    setGameEnded(false);
    setCurrentPlayer(0);
    setCurrentRound(1);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Count-Up Games</h1>

      {/* 👥 Players */}
      <div>
        <div>Number of players (1–4)</div>
        <input
          type="number"
          min={1}
          max={4}
          value={numberOfPlayers}
          onChange={(e) => {
            let value = parseInt(e.target.value) || 1;
            if (value < 1) value = 1;
            if (value > 4) value = 4;
            setNumberOfPlayers(value);
          }}
          className="border p-1"
        />
      </div>

      {/* 🔁 Round Limit */}
      <div>
        <div>Round Limit</div>
        <input
          type="number"
          min={1}
          value={roundLimit}
          onChange={(e) => setRoundLimit(parseInt(e.target.value) || 1)}
          className="border p-1"
        />
      </div>

      {/* ▶️ Start */}
      <button
        onClick={startGame}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Start Game
      </button>

      {/* 🎯 Game Board */}
      {gameStarted && (
        <>
          <div className="font-bold">
            Round: {currentRound} / {roundLimit}
          </div>

          {gameEnded && (
            <div className="text-red-600 font-bold">Game Finished 🎉</div>
          )}

          <div className="space-y-2">
            {players.map((player, index) => (
              <div
                key={index}
                className={`p-3 border rounded ${
                  index === currentPlayer && !gameEnded ? "bg-yellow-100" : ""
                }`}
              >
                <h3>
                  Player {index + 1} {player.finished && "✅ Finished"}
                </h3>
                <div>Score: {player.score}</div>
                <div>Throws: {player.throws}/3</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🎯 Input */}
      {gameStarted && !gameEnded && (
        <input
          type="number"
          placeholder="Enter score (0–60)"
          className="border p-2 w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = parseInt((e.target as HTMLInputElement).value);

              if (!isNaN(value)) {
                handleThrow(value);
                (e.target as HTMLInputElement).value = "";
              }
            }
          }}
        />
      )}

      {/* 🧹 Clear */}
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
