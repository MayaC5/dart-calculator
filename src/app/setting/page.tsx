"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();
  const [mode, setMode] = useState("buttons");

  useEffect(() => {
    const saved = localStorage.getItem("darts-input-mode");
    if (saved) setMode(saved);
  }, []);

  const saveSettings = (newMode: string) => {
    setMode(newMode);
    localStorage.setItem("darts-input-mode", newMode);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Global Settings</h1>
      <div className="grid gap-2">
        {["buttons", "board", "calculator", "directCal"].map((m) => (
          <Button
            key={m}
            variant={mode === m ? "default" : "outline"}
            onClick={() => saveSettings(m)}
          >
            {m.toUpperCase()}
          </Button>
        ))}
      </div>
      <Button className="w-full mt-4" onClick={() => router.back()}>
        Save & Go Back
      </Button>
    </div>
  );
}
