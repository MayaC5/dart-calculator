// "use client";

// import { useState } from "react";

// const BOARD_NUMBERS = [
//   "20",
//   "19",
//   "18",
//   "17",
//   "16",
//   "15",
//   "14",
//   "13",
//   "12",
//   "11",
//   "10",
//   "9",
//   "8",
//   "7",
//   "6",
//   "5",
//   "4",
//   "3",
//   "2",
//   "1",
//   "25",
// ];

// type PlayerState = {
//   score: number;
//   roundStartScore: number;
//   throws: number;
//   finished: boolean;
//   hasPlayedThisRound: boolean;
// };

// export default function ZeroOneGames() {
//   const [numberOfPlayers, setNumberOfPlayers] = useState<number>(1);
//   const [gameType, setGameType] = useState<string>("301");
//   const [players, setPlayers] = useState<PlayerState[]>([]);
//   const [currentPlayer, setCurrentPlayer] = useState<number>(0);
//   const [gameStarted, setGameStarted] = useState<boolean>(false);
//   const [gameEnded, setGameEnded] = useState<boolean>(false);

//   const [roundLimit, setRoundLimit] = useState<number>(10);
//   const [currentRound, setCurrentRound] = useState<number>(1);

//   // 🆕 input mode
//   const [inputMode, setInputMode] = useState<"buttons" | "board">("buttons");

//   // 🎯 Start Game
//   const startGame = () => {
//     const start = parseInt(gameType);

//     const initialPlayers: PlayerState[] = Array.from(
//       { length: numberOfPlayers },
//       () => ({
//         score: start,
//         roundStartScore: start,
//         throws: 0,
//         finished: false,
//         hasPlayedThisRound: false,
//       }),
//     );

//     setPlayers(initialPlayers);
//     setCurrentPlayer(0);
//     setCurrentRound(1);
//     setGameStarted(true);
//     setGameEnded(false);
//   };

//   // 🔁 Next player
//   const getNextPlayer = (players: PlayerState[], current: number) => {
//     let next = current;
//     for (let i = 0; i < players.length; i++) {
//       next = (next + 1) % players.length;
//       if (!players[next].finished) return next;
//     }
//     return current;
//   };

//   // 🎯 Handle throw (points-based)
//   const handleThrow = (points: number) => {
//     if (!gameStarted || gameEnded) return;
//     if (points < 0 || points > 180) return;

//     const playerIndex = currentPlayer;

//     setPlayers((prev) => {
//       const updated = [...prev];
//       const player = { ...updated[playerIndex] };

//       if (player.finished) return prev;

//       player.throws += 1;
//       player.score -= points;

//       let nextPlayer = playerIndex;

//       // 🎉 Finish
//       if (player.score === 0) {
//         player.finished = true;
//         player.throws = 0;
//         player.hasPlayedThisRound = true;
//         nextPlayer = getNextPlayer(updated, playerIndex);
//       }
//       // ❌ Bust
//       else if (player.score < 0) {
//         player.score = player.roundStartScore;
//         player.throws = 0;
//         player.hasPlayedThisRound = true;
//         nextPlayer = getNextPlayer(updated, playerIndex);
//       }
//       // ✅ End turn
//       else if (player.throws === 3) {
//         player.throws = 0;
//         player.roundStartScore = player.score;
//         player.hasPlayedThisRound = true;
//         nextPlayer = getNextPlayer(updated, playerIndex);
//       }

//       updated[playerIndex] = player;

//       // ✅ Round complete
//       const allPlayed = updated.every(
//         (p) => p.finished || p.hasPlayedThisRound,
//       );

//       if (allPlayed) {
//         updated.forEach((p) => (p.hasPlayedThisRound = false));

//         setCurrentRound((r) => {
//           if (r >= roundLimit) {
//             setGameEnded(true);
//             return r;
//           }
//           return r + 1;
//         });
//       }

//       setCurrentPlayer(nextPlayer);

//       // 🏁 All finished
//       if (updated.every((p) => p.finished)) {
//         setGameEnded(true);
//       }

//       return updated;
//     });
//   };

//   // 🎯 Convert S/D/T → points
//   const handleBoardHit = (value: string, multiplier: number) => {
//     if (value === "MISS") {
//       handleThrow(0);
//       return;
//     }

//     const base = parseInt(value);
//     const score = base * multiplier;

//     handleThrow(score);
//   };

//   // 🧹 Clear
//   const clearGame = () => {
//     setPlayers([]);
//     setGameStarted(false);
//     setGameEnded(false);
//     setCurrentPlayer(0);
//     setCurrentRound(1);
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <h1 className="text-xl font-bold">01 Games</h1>

//       {/* Game Type */}
//       <div className="space-x-2">
//         {["301", "501", "701", "1501"].map((type) => (
//           <button
//             key={type}
//             onClick={() => setGameType(type)}
//             className={`px-3 py-1 border rounded ${
//               gameType === type ? "bg-blue-500 text-white" : ""
//             }`}
//           >
//             {type}
//           </button>
//         ))}
//       </div>

//       {/* Players */}
//       <input
//         type="number"
//         min={1}
//         max={4}
//         value={numberOfPlayers}
//         disabled={gameStarted}
//         onChange={(e) =>
//           setNumberOfPlayers(
//             Math.min(4, Math.max(1, parseInt(e.target.value) || 1)),
//           )
//         }
//       />

//       {/* Round */}
//       <input
//         type="number"
//         value={roundLimit}
//         disabled={gameStarted}
//         onChange={(e) => setRoundLimit(parseInt(e.target.value) || 1)}
//       />

//       <button onClick={startGame}>Start Game</button>

//       {/* GAME */}
//       {gameStarted && (
//         <>
//           <div>
//             Round: {currentRound} / {roundLimit}
//           </div>

//           {players.map((p, i) => (
//             <div key={i} className="border p-2">
//               <h3>
//                 Player {i + 1} {p.finished && "✅"}
//               </h3>
//               <div>Score: {p.score}</div>
//               <div>Throws: {p.throws}/3</div>
//             </div>
//           ))}

//           {/* 🎯 MODE SWITCH */}
//           {!gameEnded && (
//             <>
//               <div className="flex gap-2">
//                 <button onClick={() => setInputMode("buttons")}>Buttons</button>
//                 <button onClick={() => setInputMode("board")}>Board</button>
//               </div>

//               {/* 🎯 BUTTON MODE */}
//               {inputMode === "buttons" && (
//                 <input
//                   type="number"
//                   placeholder="Enter score"
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       const value = parseInt(
//                         (e.target as HTMLInputElement).value,
//                       );
//                       if (!isNaN(value)) {
//                         handleThrow(value);
//                         (e.target as HTMLInputElement).value = "";
//                       }
//                     }
//                   }}
//                 />
//               )}

//               {/* 🎯 BOARD MODE */}
//               {inputMode === "board" && (
//                 <div className="grid grid-cols-4 gap-2">
//                   {BOARD_NUMBERS.map((n) => (
//                     <div key={n} className="border p-1 text-center">
//                       <div>{n}</div>
//                       <div className="flex gap-1 justify-center">
//                         <button onClick={() => handleBoardHit(n, 1)}>S</button>
//                         <button onClick={() => handleBoardHit(n, 2)}>D</button>
//                         <button onClick={() => handleBoardHit(n, 3)}>T</button>
//                       </div>
//                     </div>
//                   ))}

//                   <button onClick={() => handleBoardHit("MISS", 0)}>
//                     MISS
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </>
//       )}

//       {gameStarted && <button onClick={clearGame}>Clear</button>}
//     </div>
//   );
// }
"use client";

import { useState } from "react";

const DART_ORDER = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
];

type PlayerState = {
  score: number;
  roundStartScore: number;
  throws: number;
  currentThrows: string[];
  rounds: string[][];
  finished: boolean;
};

export default function ZeroOneGames() {
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);
  const [gameType, setGameType] = useState("301");
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const startGame = () => {
    const start = parseInt(gameType);

    const initial = Array.from({ length: numberOfPlayers }, () => ({
      score: start,
      roundStartScore: start,
      throws: 0,
      currentThrows: [],
      rounds: [],
      finished: false,
    }));

    setPlayers(initial);
    setCurrentPlayer(0);
    setGameStarted(true);
    setGameEnded(false);
  };

  const getNextPlayer = (players: PlayerState[], current: number) => {
    let next = current;
    for (let i = 0; i < players.length; i++) {
      next = (next + 1) % players.length;
      if (!players[next].finished) return next;
    }
    return current;
  };

  const handleThrow = (points: number, label: string) => {
    if (!gameStarted || gameEnded) return;

    setPlayers((prev) => {
      const updated = [...prev];
      const idx = currentPlayer;
      const player = { ...updated[idx] };

      if (player.finished) return prev;

      player.throws += 1;
      player.score -= points;
      player.currentThrows = [...player.currentThrows, label];

      let next = idx;

      // 🎉 Finish
      if (player.score === 0) {
        player.finished = true;

        player.rounds = [...player.rounds, player.currentThrows];
        player.currentThrows = [];
        player.throws = 0;

        next = getNextPlayer(updated, idx);
      }
      // ❌ Bust
      else if (player.score < 0) {
        player.score = player.roundStartScore;

        player.rounds = [...player.rounds, player.currentThrows];
        player.currentThrows = [];
        player.throws = 0;

        next = getNextPlayer(updated, idx);
      }
      // ✅ End turn
      else if (player.throws === 3) {
        player.rounds = [...player.rounds, player.currentThrows];
        player.currentThrows = [];
        player.throws = 0;
        player.roundStartScore = player.score;

        next = getNextPlayer(updated, idx);
      }

      updated[idx] = player;

      // ✅ move turn HERE (safe)
      setCurrentPlayer(next);

      if (updated.every((p) => p.finished)) {
        setGameEnded(true);
      }

      return updated;
    });
  };
  const handleBoardHit = (value: string, mult: number) => {
    if (value === "MISS") return handleThrow(0, "MISS");

    const score = parseInt(value) * mult;

    const label =
      mult === 1 ? `S${value}` : mult === 2 ? `D${value}` : `T${value}`;

    handleThrow(score, label);
  };

  const clearGame = () => {
    setPlayers([]);
    setGameStarted(false);
    setGameEnded(false);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">01 Game 🎯</h1>

      {/* Game Type */}
      <div className="flex gap-2">
        {["301", "501", "701", "1501"].map((g) => (
          <button
            key={g}
            onClick={() => setGameType(g)}
            disabled={gameStarted}
            className={`px-3 py-1 border rounded ${
              gameType === g ? "bg-blue-500 text-white" : ""
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Players */}
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

      <button
        onClick={startGame}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Start Game
      </button>

      {/* Players UI */}
      {gameStarted &&
        players.map((p, i) => (
          <div
            key={i}
            className={`p-3 border rounded ${
              i === currentPlayer && !gameEnded
                ? "bg-yellow-200 border-yellow-500"
                : ""
            }`}
          >
            <div>
              Player {i + 1}
              {i === currentPlayer && !gameEnded && " 🎯"}
              {p.finished && " ✅"}
            </div>

            <div>Score: {p.score}</div>

            <div>Current: {p.currentThrows.join(" | ") || "-"}</div>

            <div className="text-sm text-gray-500">
              History:
              {p.rounds.map((round, idx) => (
                <div key={idx}>
                  {idx + 1}: {round.join(" | ")}
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Dartboard */}
      {gameStarted && !gameEnded && <Dartboard onHit={handleBoardHit} />}

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

/* ===================== */
/* 🎯 DARTBOARD */
/* ===================== */

function Dartboard({
  onHit,
}: {
  onHit: (value: string, multiplier: number) => void;
}) {
  const size = 460;
  const center = size / 2;

  const slice = (Math.PI * 2) / 20;
  const offset = -Math.PI / 2 - slice / 2;

  const textRadius = 210;

  const radii = {
    bull: 12,
    outerBull: 25,
    tripleInner: 120,
    tripleOuter: 140,
    doubleInner: 180,
    doubleOuter: 200,
  };

  const polar = (r: number, a: number) => ({
    x: center + r * Math.cos(a),
    y: center + r * Math.sin(a),
  });

  const arc = (s: number, e: number, r1: number, r2: number) => {
    const p1 = polar(r2, s);
    const p2 = polar(r2, e);
    const p3 = polar(r1, e);
    const p4 = polar(r1, s);

    return `
      M ${p1.x} ${p1.y}
      A ${r2} ${r2} 0 0 1 ${p2.x} ${p2.y}
      L ${p3.x} ${p3.y}
      A ${r1} ${r1} 0 0 0 ${p4.x} ${p4.y}
      Z
    `;
  };

  const handleClick = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - center;
    const y = e.clientY - rect.top - center;

    const dist = Math.sqrt(x * x + y * y);

    let angle = Math.atan2(y, x) - offset;
    if (angle < 0) angle += Math.PI * 2;

    const index = Math.floor(angle / slice) % 20;
    const value = DART_ORDER[index];

    if (dist <= radii.bull) return onHit("25", 2);
    if (dist <= radii.outerBull) return onHit("25", 1);

    if (dist >= radii.doubleInner && dist <= radii.doubleOuter)
      return onHit(value.toString(), 2);

    if (dist >= radii.tripleInner && dist <= radii.tripleOuter)
      return onHit(value.toString(), 3);

    if (dist < radii.doubleOuter) return onHit(value.toString(), 1);

    onHit("MISS", 0);
  };

  return (
    <svg width={size} height={size} onClick={handleClick}>
      {DART_ORDER.map((num, i) => {
        const start = offset + i * slice;
        const end = start + slice;
        const even = i % 2 === 0;

        return (
          <g key={i}>
            <path d={arc(start, end, 140, 180)} fill={even ? "#111" : "#eee"} />
            <path d={arc(start, end, 120, 140)} fill={even ? "red" : "green"} />
            <path d={arc(start, end, 25, 120)} fill={even ? "#111" : "#eee"} />
            <path d={arc(start, end, 180, 200)} fill={even ? "red" : "green"} />

            <text
              x={center + Math.cos(start + slice / 2) * textRadius}
              y={center + Math.sin(start + slice / 2) * textRadius}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fill="black"
            >
              {num}
            </text>
          </g>
        );
      })}

      <circle cx={center} cy={center} r={25} fill="green" />
      <circle cx={center} cy={center} r={12} fill="red" />
    </svg>
  );
}