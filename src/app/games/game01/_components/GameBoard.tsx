"use client";

import { InputModeType, PlayerState } from "../../../../_types/dart";
import InputMode from "./inputMode";
import ButtonMode from "./buttonMode";
import CalMode from "./calMode";
import DirectCalMode from "./directCalMode";

interface GameBoardProps {
  players: PlayerState[];
  currentPlayer: number;
  currentRound: number;
  roundLimit: number;
  gameEnded: boolean;
  inputMode: InputModeType;
  handleThrow: (points: number) => void;
  handleUndo: () => void;
  handleBoardHit: (value: string, multiplier: number) => void;
}

export default function GameBoard({
  players,
  currentPlayer,
  currentRound,
  roundLimit,
  gameEnded,
  inputMode,
  handleThrow,
  handleUndo,
  handleBoardHit,
}: GameBoardProps) {
  const activePlayer = players[currentPlayer];
  inputMode = localStorage.getItem("darts-input-mode") as InputModeType || "buttons";

  return (
    <div className="space-y-6">
      {/* 1. Header Info */}
      <div className="flex justify-between items-center text-sm font-medium border-b pb-2">
        <span>
          Round: {currentRound} / {roundLimit || 15}
        </span>
        <span className="text-blue-600">Player {currentPlayer + 1}'s Turn</span>
      </div>

      {/* 2. Main Score Display */}
      <div className="grid grid-cols-3 items-center gap-4">
        {/* Left: Last 5 Rounds History */}
        <div className="space-y-1 text-[10px] sm:text-xs text-gray-500">
          <div className="font-bold border-b mb-1">History</div>
          {activePlayer.rounds.length === 0 ? (
            <div className="italic">No throws</div>
          ) : (
            activePlayer.rounds.slice(-5).map((round, idx) => (
              <div key={idx} className="flex justify-between">
                <span>R{activePlayer.rounds.length - 4 + idx}</span>
                <span className="font-mono">{round.join(", ")}</span>
              </div>
            ))
          )}
        </div>

        {/* Center: Big Score */}
        <div className="text-center">
          <div className="text-5xl font-black tracking-tighter">
            {activePlayer.score}
          </div>
          <div className="text-[10px] uppercase text-gray-400 font-bold">
            Remaining
          </div>
        </div>

        {/* Right: Current Turn Throws */}
        <div className="text-right space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase">
            Current
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="text-sm font-bold">
              T{i + 1}:{" "}
              <span
                className={
                  activePlayer.currentThrows[i] !== undefined
                    ? "text-black"
                    : "text-gray-300"
                }
              >
                {activePlayer.currentThrows[i] ?? "-"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Multi-Player Mini Grid */}
      <div className={`grid grid-cols-${players.length} gap-2`}>
        {players.map((p, i) => (
          <div
            key={i}
            className={`p-2 rounded-md text-center border transition-colors ${
              i === currentPlayer
                ? "bg-yellow-50 border-yellow-400 shadow-sm"
                : "bg-gray-50 border-transparent opacity-60"
            }`}
          >
            <div className="text-[10px] font-bold">
              P{i + 1}
              {p.finished && " ✅"}
            </div>
            <div className="text-sm font-black">{p.score}</div>
          </div>
        ))}
      </div>

       {/* 4. Input Mode Switcher */}
      {!gameEnded && (
        <div className="space-y-4">
          

          {/* 5. Dynamic Input Component */}
          <div className="bg-white rounded-xl shadow-inner min-h-[250px]">
            {inputMode === "buttons" && (
              <InputMode onThrow={handleThrow} onUndo={handleUndo} />
            )}
            {inputMode === "board" && (
              <ButtonMode onBoardHit={handleBoardHit} onUndo={handleUndo} />
            )}
            {inputMode === "calculator" && (
              <CalMode onThrow={handleThrow} onUndo={handleUndo} />
            )}
            {inputMode === "directCal" && (
              <DirectCalMode onThrow={handleThrow} onUndo={handleUndo} />
            )}
          </div>
        </div>
      )}

      {gameEnded && (
        <div className="bg-green-100 p-6 rounded-xl text-center border-2 border-green-500">
          <h2 className="text-2xl font-bold text-green-700">Game Over!</h2>
          <p className="text-green-600">Final scores have been recorded.</p>
        </div>
      )}
    </div>
  );
}
