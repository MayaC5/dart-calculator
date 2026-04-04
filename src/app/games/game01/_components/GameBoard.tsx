"use client";

import { InputModeType, PlayerState } from "../../../../_types/dart";
import InputMode from "./inputMode";
import ButtonMode from "./buttonMode";
import CalMode from "./calMode";
import DirectCalMode from "./directCalMode";
import useDeviceSize from "@/hooks/useOrientation";

interface GameBoardProps {
  players: PlayerState[];
  currentPlayer: number;
  currentRound: number;
  roundLimit: number;
  gameEnded: boolean;
  inputMode: InputModeType;
  finishType: "Single" | "Double";
  handleThrow: (points: number, multiplier?: number) => void;
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
  finishType,
  handleThrow,
  handleUndo,
  handleBoardHit,
}: GameBoardProps) {
  const activePlayer = players[currentPlayer];
  inputMode =
    (localStorage.getItem("darts-input-mode") as InputModeType) || "buttons";
  const [orientation, width, height] = useDeviceSize();
  console.log(orientation === "portrait" ? "Portrait Mode" : "Landscape Mode");
  const portrait = " flex-col justify-between h-full";
  const landscape = "flex-row";

  // Helper function to put inside GameBoard or a utils file
  const calculateAverages = (player: PlayerState, gameType: string) => {
    const startingScore = parseInt(gameType) || 301;
    const pointsScored = startingScore - player.score;

    // Total darts thrown across all rounds
    const totalDarts =
      player.rounds.flat().length + player.currentThrows.length;

    if (totalDarts === 0) return { avg100: "0.00", avg80: "0.00" };

    // Standard 3-dart average (100%)
    const avg100 = (pointsScored / totalDarts) * 3;

    // 80% of that average
    const avg80 = avg100 * 0.8;

    return {
      avg100: avg100.toFixed(2),
      avg80: avg80.toFixed(2),
    };
  };

  return (
    <div
      className={`flex ${orientation === "portrait" ? portrait : landscape}`}
    >
      <div
        className={`flex flex-col ${orientation === "portrait" ? "w-full h-[50%] justify-between" : "w-[50%] justify-between mr-2"} `}
      >
        {/* 1. Header Info */}
        <div className="flex justify-between items-center text-sm font-medium border-b pb-2">
          <span>
            Player {currentPlayer + 1} - Round: {currentRound} /{" "}
            {roundLimit || 15}
          </span>
          <div>{finishType === "Single" ? "Single Out" : "Double Out"}</div>
        </div>

        {/* 2. Main Score Display */}
        <div className="grid grid-cols-3  gap-4">
          {/* Left: Last 5 Rounds History */}
          <div className="justify-around space-y-2.5 text-[10px] text-gray-500">
            <div className="font-bold border-b mb-1 uppercase">History</div>
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
          <div className="text-center items-center justify-center flex flex-col">
            <div className="text-5xl font-black tracking-tighter">
              {activePlayer.score}
            </div>
            <div className="text-[10px] uppercase text-gray-400 font-bold">
              Remaining
            </div>
          </div>

          {/* Right: Current Turn Throws */}
          <div className="text-right space-y-1">
            <div className="text-[10px] font-bold text-gray-500 uppercase border-b mb-1">
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
      </div>

      {!gameEnded && (
        <div
          className={` ${orientation === "portrait" ? "w-full mt-6" : "w-[50%]"} `}
        >
          {/* 5. Dynamic Input Component */}
          <div>
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
              <DirectCalMode
                onThrow={handleThrow}
                onUndo={handleUndo}
                finishType={finishType}
              />
            )}
          </div>
        </div>
      )}

      {gameEnded && (
        <div className="bg-green-50 p-4 rounded-xl border-2 border-green-500 flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-700">Game Over!</h2>
            <p className="text-green-600 text-sm">Final Statistics</p>
          </div>

          <div className="overflow-hidden rounded-lg border border-green-200">
            <table className="w-full text-sm text-left bg-white">
              <thead className="bg-green-500 text-white text-[10px] uppercase">
                <tr>
                  <th className="px-3 py-2">Player</th>
                  <th className="px-3 py-2 text-center">Score</th>
                  <th className="px-3 py-2 text-center">Avg (100%)</th>
                  <th className="px-3 py-2 text-center">Avg (80%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {players.map((p, i) => {
                  const stats = calculateAverages(p, "501"); // Replace "501" with dynamic gameType if available
                  return (
                    <tr
                      key={i}
                      className={i === currentPlayer ? "bg-yellow-50" : ""}
                    >
                      <td className="px-3 py-2 font-bold">
                        P{i + 1}
                        {p.finished && " 🏆"}
                      </td>
                      <td className="px-3 py-2 text-center font-mono">
                        {p.score}
                      </td>
                      <td className="px-3 py-2 text-center font-bold text-blue-600">
                        {stats.avg100}
                      </td>
                      <td className="px-3 py-2 text-center text-gray-500">
                        {stats.avg80}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => window.location.reload()} // Or your reset logic
            className="w-full py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700"
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
}
