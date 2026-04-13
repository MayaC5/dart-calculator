"use client";

import { Plus, Minus } from "lucide-react"; // or "lucide-react" depending on your setup

interface GameSetupProps {
  gameType: string;

  numberOfPlayers: number;
  setNumberOfPlayers: (val: number) => void;
  roundLimit: number;
  setRoundLimit: (val: number) => void;
  onStart: () => void;
  gameStarted?: boolean;
}

export default function CountUpGameSetup({
  numberOfPlayers,
  setNumberOfPlayers,
  roundLimit,
  setRoundLimit,
  onStart,
  gameStarted,
}: GameSetupProps) {
  return (
    <div className="flex gap-4 flex-col w-full">


      {/* 3. Player Selection */}
      <div className="flex flex-col">
        <div className="flex text-center justify-center mb-2">Players</div>
        <div className="grid grid-cols-4 gap-4 justify-between">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setNumberOfPlayers(n)}
              className={`px-4 py-2 border rounded ${numberOfPlayers === n ? "bg-blue-500 text-white" : ""}`}
            >
              {n}P
            </button>
          ))}
        </div>
      </div>

      {/* 4. Max Rounds */}
      <div className="flex flex-col">
        <div className="flex text-center justify-center mb-2">Max Rounds:</div>
        <div className="grid grid-cols-4 gap-4 justify-between">
          <button
            type="button"
            onClick={() => setRoundLimit(Math.max(1, roundLimit - 1))}
            disabled={gameStarted || roundLimit <= 1}
            className="flex px-4 py-2 items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <Minus className="h-5 w-5" />
          </button>

          <div className="flex px-4 py-2 col-span-2 border justify-center items-center border-gray-300 rounded bg-white font-bold">
            {roundLimit}
          </div>

          <button
            type="button"
            onClick={() => setRoundLimit(Math.min(50, roundLimit + 1))}
            disabled={gameStarted || roundLimit >= 50}
            className="flex px-4 py-2 items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Start Game
      </button>
    </div>
  );
}
