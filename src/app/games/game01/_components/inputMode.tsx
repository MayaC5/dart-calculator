"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onThrow: (score: number) => void;
  onUndo: () => void;
};

export default function InputMode({ onThrow, onUndo }: Props) {
  return (
    <>
      <input
        type="number"
        placeholder="Enter score"
        className="border p-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const val = parseInt((e.target as HTMLInputElement).value);
            if (!isNaN(val)) {
              onThrow(val);
              (e.target as HTMLInputElement).value = "";
            }
          }
        }}
      />
      {/* 🆕 Undo */}
      <Button className="w-full bg-yellow-500" onClick={onUndo}>
        Undo
      </Button>
    </>
  );
}
