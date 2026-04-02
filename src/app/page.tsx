"use client";
import useDeviceSize from "@/hooks/useOrientation";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useLayoutEffect, useState } from "react";

export default function Home() {
  const [orientation, width, height] = useDeviceSize();

  console.log(orientation, width, height)

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <div className="text-center items-center align-center mb-10">
        <div className="font-semibold">Dart Game Tracker</div>
        <div>Choose one to start with</div>
      </div>

      <div
        className={`grid gap-4 ${orientation === "portrait" ? "grid-cols-1" : "grid-cols-2 justify-between"}`}
      >
        <div className="flex flex-col gap-2 bg-amber-400 p-4 rounded">
          <Link className="text-center" href="/games/game01">
            <div>01 Games</div>
            <div>301, 501, 701, 1501</div>
          </Link>
        </div>
        <div className="flex flex-col gap-2 bg-amber-400 p-4 rounded">
          <Link className="text-center" href="/games/cricket">
            <div>Cricket Game</div>
            <div>Standard Cricket</div>
          </Link>
        </div>
        <div className="flex flex-col gap-2 bg-amber-400 p-4 rounded">
          <Link className="text-center" href="/games/count-up">
            <div>Count Up</div>
            <div>Practice Game mode</div>
          </Link>
        </div>
        <div className="flex flex-col gap-2 bg-amber-400 p-4 rounded">
          <Link className="text-center" href="/setting">
            <div>Setting</div>
            <div>Modify Game Settings</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
