"use client";

import { useState } from "react";
import GameBoard from "./_components/GameBoard";
import GameSetup from "./_components/GameSetup";
import { useDartsLogic } from "./_hook/useDartsLogic";
import { InputModeType } from "../../../_types/dart";
import useDeviceSize from "@/hooks/useOrientation";
import Link from "next/link";
import { MoveLeft, Settings } from "lucide-react";


export default function ZeroOneGames() {
  const logic = useDartsLogic();
  const [orientation, width, height] = useDeviceSize();
  const [inputMode, setInputMode] = useState<InputModeType>("buttons");

  console.log(orientation, width, height);

  const gameStarted = logic.gameStarted;

  return (
    <div className="h-screen w-screen">
      {/* Common Header could go here */}
      <div
        className={`flex ${gameStarted ? "flex justify-center" : "grid grid-cols-3"}  items-center bg-red-500 p-2`}
      >
        {!logic.gameStarted && (
          <Link href="/">
            <MoveLeft className="h-5 w-5 text-white" />
          </Link>
        )}

        <div className="font-semibold text-center text-white">01 Games</div>
        {!logic.gameStarted && (
          <div className="flex justify-end">
            <Link href="/setting" className="text-sm font-medium text-white ">
              <Settings className="h-5 w-5 text-white" />
            </Link>
          </div>
        )}
      </div>

      {!gameStarted ? (
        <div className="p-2 h-[90%]">
          <GameSetup {...logic} onStart={logic.startGame} />
        </div>
      ) : (
        <div
          className={`flex flex-col p-2 h-[95%] ${orientation === "portrait" ? "justify-between" : ""}`}
        >
          <GameBoard
            {...logic}
            inputMode={inputMode}
            handleBoardHit={logic.handleBoardHit}
          />
          <div className="mt-4 pt-2 border-t">
            <button onClick={logic.clearGame} className="...">
              Quit Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
  // Else return the GameBoard...
}
