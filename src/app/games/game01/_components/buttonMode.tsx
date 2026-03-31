"use client";

import { Button } from "@/components/ui/button";

const BOARD_NUMBERS = [
  "20",
  "19",
  "18",
  "17",
  "16",
  "15",
  "14",
  "13",
  "12",
  "11",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "1",
  "25",
];

type Props = {
  onBoardHit: (value: string, multiplier: number) => void;
  onUndo: () => void;
};

export default function ButtonMode({ onBoardHit, onUndo }: Props) {
  return (
    <div className="space-y-4">
      {/* Dartboard Numbers Grid */}
      <div className="grid grid-cols-3 gap-3">
        {BOARD_NUMBERS.map((n) => {
            const isBull = n === "25";
            return(
          <div key={n} className="border rounded-lg p-2 bg-gray-50">
            <div className="text-center font-bold text-lg mb-2">{n}</div>
            <div className="flex gap-1">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                onClick={() => onBoardHit(n, 1)}
              >
                S
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm"
                onClick={() => onBoardHit(n, 2)}
              >
                D
              </Button>
              {!isBull && (
                <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                onClick={() => onBoardHit(n, 3)}
              >
                T
              </Button>
              )}
              
            </div>
          </div>
            )
        })}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          className="py-6 text-lg bg-gray-500 hover:bg-gray-600 text-white"
          onClick={() => onBoardHit("MISS", 0)}
        >
          MISS
        </Button>

        <Button
          className="py-6 text-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
          onClick={onUndo}
        >
          Undo
        </Button>
      </div>
    </div>
  );
}
