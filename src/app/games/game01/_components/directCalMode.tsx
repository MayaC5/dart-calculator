"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  onThrow: (points: number, multiplier: number) => void;
  onUndo: () => void;
  finishType: "Single" | "Double";
};

export default function CalculatorMode({ onThrow, onUndo, finishType }: Props) {
  const [multiplier, setMultiplier] = useState<"S" | "D" | "T" | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const autoSubmit = (newMultiplier?: "S" | "D" | "T", newNumber?: number) => {
    const m = newMultiplier !== undefined ? newMultiplier : multiplier;
    const n = newNumber !== undefined ? newNumber : selectedNumber;

    if (!m || n === null) return;

    const multiplierMap: Record<string, number> = {
      S: 1,
      D: 2,
      T: 3,
    };

    const mValue = multiplierMap[m];
    const points = n * mValue;

    onThrow(points, mValue);
    resetState();
  };

  const resetState = () => {
    setMultiplier(null);
    setSelectedNumber(null);
  };

  const selectMultiplier = (m: "S" | "D" | "T") => {
    setMultiplier(m);
    if (selectedNumber !== null) autoSubmit(m);
  };

  const selectNumber = (num: number) => {
    setSelectedNumber(num);
    if (multiplier) autoSubmit(undefined, num);
  };

  const selectBull = (points: number) => {
    // 50 is a Double (2), 25 is a Single (1)
    const mValue = points === 50 ? 2 : 1;
    onThrow(points, mValue);
    resetState();
  };

  const handleMiss = () => {
    onThrow(0, 1);
    resetState();
  };

  return (
    <div className="gap-2 flex flex-col">
      {/* 1. Multiplier & Bull Selection - All h-10 */}
      <div className="flex gap-2">
        <button
          onClick={() => selectMultiplier("S")}
          className={`flex-1 h-10 rounded-md text-[15px] font-medium transition-colors ${
            multiplier === "S"
              ? "bg-yellow-500 text-black"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          S
        </button>
        <button
          onClick={() => selectMultiplier("D")}
          className={`flex-1 h-10 rounded-md text-[15px] font-medium transition-colors ${
            multiplier === "D"
              ? "bg-yellow-500 text-black"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          D
        </button>
        <button
          onClick={() => selectMultiplier("T")}
          className={`flex-1 h-10 rounded-md text-[15px] font-medium transition-colors ${
            multiplier === "T"
              ? "bg-yellow-500 text-black"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          T
        </button>
        <button
          onClick={() => selectBull(25)}
          className="flex-1 h-10 rounded-md text-[15px] font-medium bg-purple-500 text-white hover:bg-purple-600"
        >
          25
        </button>
        <button
          onClick={() => selectBull(50)}
          className="flex-1 h-10 rounded-md text-[15px] font-medium bg-purple-500 text-white hover:bg-purple-600"
        >
          50
        </button>
      </div>

      {/* 2. Numbers 1 - 20 - All h-10 */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => selectNumber(num)}
            className={`h-10 rounded-md text-[15px] font-medium transition-all ${
              selectedNumber === num
                ? "bg-yellow-500 text-black scale-105"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* 3. Action Buttons - All h-10 */}
      <div className="flex gap-2">
        <button
          onClick={handleMiss}
          className="flex-1 h-10 rounded-md text-[15px] font-bold bg-slate-600 text-white hover:bg-slate-700"
        >
          MISS (0)
        </button>

        <button
          onClick={resetState}
          className="flex-1 h-10 rounded-md text-[15px] bg-orange-500 text-white hover:bg-orange-600"
        >
          CLEAR
        </button>

        <button
          onClick={onUndo}
          className="flex-1 h-10 rounded-md text-[15px] bg-yellow-500 text-black hover:bg-yellow-600"
        >
          ↩️ UNDO
        </button>
      </div>
    </div>
  );
}
