interface GameSetupProps {
  gameType: string;
  setGameType: (val: string) => void;
  numberOfPlayers: number;
  setNumberOfPlayers: (val: number) => void;
  roundLimit: number;
  setRoundLimit: (val: number) => void;
  onStart: () => void;
  gameStarted?: boolean;
}

export default function GameSetup({
  gameType,
  setGameType,
  numberOfPlayers,
  setNumberOfPlayers,
  roundLimit,
  setRoundLimit,
  onStart,
  gameStarted,

}: GameSetupProps) {
  return (
    <div className="flex gap-2 flex-col">
      {/* Game Mode Selection */}
      <div className="flex flex-col ">
        <div className="mb-2">Game Mode</div>
        <div className="flex gap-2">
          {["301", "501", "701", "1501"].map((type) => (
            <button
              key={type}
              onClick={() => setGameType(type)}
              className={`px-4 py-2 border rounded ${gameType === type ? "bg-blue-500 text-white" : ""}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Player Selection */}
      <div>
        <div className="mb-2">Players</div>
        <div className="flex gap-2">
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
      <div className="flex flex-col mb-4 ">
        <div className="mb-2 font-medium text-sm">Max Rounds:</div>
        <div className="flex gap-3 items-center">
          {/* Minus Button */}
          <button
            type="button"
            onClick={() => setRoundLimit(Math.max(1, roundLimit - 1))}
            disabled={gameStarted || roundLimit <= 1}
            className="flex h-10 w-12 items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            −
          </button>

          {/* Number Display */}
          <div className="flex h-10 w-16 border justify-center items-center border-gray-300 rounded bg-white font-bold">
            {roundLimit}
          </div>

          {/* Plus Button */}
          <button
            type="button"
            onClick={() => setRoundLimit(Math.min(50, roundLimit + 1))}
            disabled={gameStarted || roundLimit >= 50}
            className="flex h-10 w-12 items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={onStart}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Start Game
      </button>
    </div>
  );
}
