import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className='text-center'>
          <div className="font-semibold">Dart Game Tracker</div>
          <div>Choose one to start with</div>
        </div>

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
      </main>
    </div>
  );
}
