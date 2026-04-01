"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  onThrow: (points: number) => void;
  onUndo: () => void;
};

export default function CalculatorMode({ onThrow, onUndo }: Props) {
  const [multiplier, setMultiplier] = useState<"S" | "D" | "T" | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isBullSelected, setIsBullSelected] = useState(false);

  // Auto submit when both multiplier and number are selected
  const autoSubmit = (newMultiplier?: "S" | "D" | "T", newNumber?: number) => {
    const m = newMultiplier !== undefined ? newMultiplier : multiplier;
    const n = newNumber !== undefined ? newNumber : selectedNumber;

    if (!m || n === null) return;

    let points = n;
    if (m === "D") points *= 2;
    if (m === "T") points *= 3;

    onThrow(points);

    // Reset after throw
    setMultiplier(null);
    setSelectedNumber(null);
    setIsBullSelected(false);
  };

  const selectMultiplier = (m: "S" | "D" | "T") => {
    setMultiplier(m);
    setIsBullSelected(false);

    // Auto submit if number is already selected
    if (selectedNumber !== null) {
      autoSubmit(m);
    }
  };

  const selectNumber = (num: number) => {
    setSelectedNumber(num);
    setIsBullSelected(false);

    // Auto submit if multiplier is already selected
    if (multiplier) {
      autoSubmit(undefined, num);
    }
  };

  const selectBull = (points: number) => {
    setIsBullSelected(true);
    setSelectedNumber(null);
    setMultiplier(null);

    // Bull is immediate
    onThrow(points);
    setIsBullSelected(false);
  };

  const handleClear = () => {
    setMultiplier(null);
    setSelectedNumber(null);
    setIsBullSelected(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Multiplier Selection */}
      <div className="flex gap-2">
        <Button
          onClick={() => selectMultiplier("S")}
          className={`flex-1 h-14 text-lg font-medium ${
            multiplier === "S"
              ? "bg-yellow-500 text-black"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          SINGLE
        </Button>
        <Button
          onClick={() => selectMultiplier("D")}
          className={`flex-1 h-14 text-lg font-medium ${
            multiplier === "D"
              ? "bg-yellow-500 text-black"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          DOUBLE
        </Button>
        <Button
          onClick={() => selectMultiplier("T")}
          className={`flex-1 h-14 text-lg font-medium ${
            multiplier === "T"
              ? "bg-yellow-500 text-black"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          TRIPLE
        </Button>
      </div>

      {/* 2. Numbers 1 - 20 */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <Button
            key={num}
            onClick={() => selectNumber(num)}
            className={`h-16 text-2xl font-bold transition-all ${
              selectedNumber === num
                ? "bg-yellow-500 text-black scale-105"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {num}
          </Button>
        ))}
      </div>

      {/* 3. Bull Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => selectBull(25)}
          className="h-16 text-xl font-medium bg-purple-500 hover:bg-purple-600"
        >
          BULL (25)
        </Button>
        <Button
          onClick={() => selectBull(50)}
          className="h-16 text-xl font-medium bg-purple-500 hover:bg-purple-600"
        >
          BULLSEYE (50)
        </Button>
      </div>


      {/* Clear & Undo */}
      <div className="flex gap-3">
        <Button
          onClick={handleClear}
          className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 text-lg"
        >
          CLEAR
        </Button>

        <Button
          onClick={onUndo}
          className="flex-1 h-14 bg-yellow-500 hover:bg-yellow-600 text-lg font-semibold"
        >
          ↩️ UNDO
        </Button>
      </div>
    </div>
  );
}
