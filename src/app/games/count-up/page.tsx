"use client";

import { useEffect, useState } from "react";
import GameBoard from "../../../components/GameBoard";
import GameSetCountUpGameSetupup from "./_components/CountupGameSetup";
import { useDartsLogic } from "../../../hooks/useDartsLogic";
import { InputModeType } from "../../../_types/dart";
import useDeviceSize from "@/hooks/useOrientation";
import Link from "next/link";
import { MoveLeft, Settings } from "lucide-react";

export default function CountUpGame() {
    const logic = useDartsLogic();
    const [orientation, width, height] = useDeviceSize();
    const [inputMode, setInputMode] = useState<InputModeType>("buttons");

    useEffect(() => {
        logic.setGameType("CountUp");
    }, []);

    console.log(orientation, width, height);

    const gameStarted = logic.gameStarted;

    return (
      <div className="h-screen w-screen">
        {/* Common Header could go here */}
        <div className=" items-center bg-yellow-500 p-2">
          {!logic.gameStarted && (
            <div className="grid grid-cols-3 items-center">
              <Link href="/">
                <MoveLeft className="h-5 w-5 text-white" />
              </Link>
              <div className="font-semibold text-center text-white">
                Count Up Games
              </div>
              <div className="flex justify-end">
                <Link
                  href="/setting"
                  className="text-sm font-medium text-white "
                >
                  <Settings className="h-5 w-5 text-white" />
                </Link>
              </div>
            </div>
          )}

          {logic.gameStarted && (
            <div className=" grid grid-cols-3 items-center">
              <div></div>
              <div className="font-semibold text-center text-white">
                Count Up Games
              </div>
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
            <GameSetCountUpGameSetupup {...logic} onStart={logic.startGame} />
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
}