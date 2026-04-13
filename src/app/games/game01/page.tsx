"use client";

import { useState } from "react";
import GameBoard from "../../../components/GameBoard";
import GameSetup from "../../../components/GameSetup";
import { useDartsLogic } from "../../../hooks/useDartsLogic";
import { InputModeType } from "../../../_types/dart";
import useDeviceSize from "@/hooks/useOrientation";
import Link from "next/link";
import { MoveLeft, Settings } from "lucide-react";
import GameSetup01 from "./_components/01GameSetup";

export default function ZeroOneGames() {
  const logic = useDartsLogic();
  const [orientation, width, height] = useDeviceSize();
  const [inputMode, setInputMode] = useState<InputModeType>("buttons");

  console.log(orientation, width, height);

  const gameStarted = logic.gameStarted;

  return (
    <div className="h-screen w-screen">
      {/* Common Header could go here */}
      <div className=" items-center bg-red-500 p-2">
        {!logic.gameStarted && (
          <div className="grid grid-cols-3 items-center">
            <Link href="/">
              <MoveLeft className="h-5 w-5 text-white" />
            </Link>
            <div className="font-semibold text-center text-white">01 Games</div>
            <div className="flex justify-end">
              <Link href="/setting" className="text-sm font-medium text-white ">
                <Settings className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>
        )}

        {logic.gameStarted && (
          <div className=" grid grid-cols-3 items-center">
            <div></div>
            <div className="font-semibold text-center text-white">01 Games</div>
            <div className="flex justify-end text-sm font-medium text-white">
              <button onClick={logic.clearGame} className="...">
                Quit Game
              </button>
            </div>
          </div>
        )}
      </div>

      {!gameStarted ? (
        <div className="p-2 h-[90%]">
          <GameSetup01 {...logic} onStart={logic.startGame} />
        </div>
      ) : (
        <div
          className={`flex flex-col h-screen ${orientation === "portrait" ? "justify-between" : ""}`}
        >
          <GameBoard
            {...logic}
            inputMode={inputMode}
            handleBoardHit={logic.handleBoardHit}
            finishType={logic.finishType}
          />
        </div>
      )}
    </div>
  );
  // Else return the GameBoard...
}
