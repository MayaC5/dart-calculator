"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  onThrow: (points: number) => void;
  onUndo: () => void;
};

export default function CalculatorMode({ onThrow, onUndo }: Props) {
  const [multiplier, setMultiplier] = useState<"S" | "D" | "T" | null>(null);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isBullSelected, setIsBullSelected] = useState(false);

  const selectMultiplier = (m: "S" | "D" | "T") => {
    setMultiplier(m);
    setIsBullSelected(false);
  };

  const handleNumber = (num: string) => {
    if (isBullSelected) return;
    if (currentInput.length >= 2) return;
    setCurrentInput((prev) => prev + num);
  };

  const selectBull = (points: number) => {
    setIsBullSelected(true);
    setCurrentInput(points.toString());
    setMultiplier(null);
  };

  const handleEnter = () => {
    let points = 0;

    if (isBullSelected) {
      points = parseInt(currentInput);
    } else if (multiplier && currentInput) {
      const base = parseInt(currentInput);
      if (isNaN(base) || base < 1 || base > 20) return;

      points = base;
      if (multiplier === "D") points *= 2;
      if (multiplier === "T") points *= 3;
    } else {
      return;
    }

    onThrow(points);

    // Reset
    setCurrentInput("");
    setMultiplier(null);
    setIsBullSelected(false);
  };

  const handleClear = () => {
    setCurrentInput("");
    setMultiplier(null);
    setIsBullSelected(false);
  };

  return (
    <div className="max-w-sm mx-auto space-y-4">
      {/* Multiplier */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={() => selectMultiplier("S")}
          className={`flex-1 ${multiplier === "S" ? "bg-blue-600" : "bg-blue-500"}`}
        >
          SINGLE
        </Button>
        <Button
          onClick={() => selectMultiplier("D")}
          className={`flex-1 ${multiplier === "D" ? "bg-red-600" : "bg-red-500"}`}
        >
          DOUBLE
        </Button>
        <Button
          onClick={() => selectMultiplier("T")}
          className={`flex-1 ${multiplier === "T" ? "bg-green-600" : "bg-green-500"}`}
        >
          TRIPLE
        </Button>
      </div>

      {/* Number Pad - Now includes 0 */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumber(num.toString())}
            className="h-16 text-2xl bg-gray-700 hover:bg-gray-600"
          >
            {num}
          </Button>
        ))}

        <Button
          onClick={() => selectBull(25)}
          className={`h-16 text-lg ${isBullSelected && currentInput === "25" ? "bg-purple-600" : "bg-purple-500"}`}
        >
          BULL
        </Button>

        {/* Zero Button */}
        <Button
          onClick={() => handleNumber("0")}
          className="h-16 text-2xl bg-gray-700 hover:bg-gray-600"
        >
          0
        </Button>

        {/* Empty spot */}
        <Button
          onClick={() => selectBull(50)}
          className={`h-16 text-lg ${isBullSelected && currentInput === "50" ? "bg-purple-600" : "bg-purple-500"}`}
        >
          IN BULL
        </Button>
      </div>


      {/* Display */}
      <div className="bg-gray-900 text-white text-4xl font-mono h-20 flex items-center justify-center rounded-xl tracking-wider">
        {isBullSelected
          ? currentInput
          : multiplier
            ? `${multiplier} ${currentInput || "__"}`
            : currentInput || "READY"}
      </div>

      {/* Enter & Clear */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleClear}
          className="h-14 bg-orange-500 hover:bg-orange-600 text-lg"
        >
          CLEAR
        </Button>
        <Button
          onClick={handleEnter}
          disabled={!currentInput}
          className="h-14 bg-green-600 hover:bg-green-700 text-lg disabled:bg-gray-500"
        >
          ENTER
        </Button>
      </div>

      {/* Undo */}
      <Button
        onClick={onUndo}
        className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-lg font-semibold"
      >
        ↩️ Undo Last Throw/Round
      </Button>
    </div>
  );
}
