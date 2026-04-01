"use client";

import { InputModeType } from "@/_types/dart";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react"; // Optional: for visual feedback

interface SettingsPageProps {
  currentMode: InputModeType;
  onModeChange: (mode: InputModeType) => void;
  onBack: () => void;
}

const MODES: { id: InputModeType; label: string; desc: string }[] = [
  { id: "buttons", label: "Quick Buttons", desc: "Standard point increments" },
  { id: "board", label: "Visual Board", desc: "Tap sections on a dartboard" },
  { id: "calculator", label: "Calculator", desc: "Numpad for precise entry" },
  { id: "directCal", label: "Direct", desc: "Enter total round score at once" },
];

export default function SettingsPage({
  currentMode,
  onModeChange,
  onBack,
}: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Game Settings</h2>
        <Button variant="ghost" onClick={onBack}>
          Close
        </Button>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-500 uppercase">
          Input Method
        </label>
        <div className="grid gap-3">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                currentMode === mode.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <div className="text-left">
                <div className="font-bold text-gray-900">{mode.label}</div>
                <div className="text-xs text-gray-500">{mode.desc}</div>
              </div>
              {currentMode === mode.id && (
                <div className="bg-blue-500 rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 text-center text-[10px] text-gray-400">
        Settings are saved automatically to your device.
      </div>
    </div>
  );
}
