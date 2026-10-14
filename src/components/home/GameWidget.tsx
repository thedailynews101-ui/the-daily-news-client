import { Puzzle } from "lucide-react";

export function GameWidget() {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white">
      <div className="flex items-center gap-2">
        <Puzzle className="size-5" />
        <span className="text-xs font-semibold tracking-widest uppercase">Games</span>
      </div>
      <p className="mt-3 font-heading text-lg font-semibold">Coming soon</p>
      <p className="mt-1 text-sm text-white/80">Daily puzzles and games will appear here.</p>
    </div>
  );
}
