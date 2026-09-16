"use client";

import * as React from "react";
import { Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { THEMES, THEME_LABELS, useTheme, type ThemeName } from "./ThemeProvider";

const SWATCH_COLORS: Record<ThemeName, string> = {
  paper: "#ffffff",
  parchment: "#ece8c1",
  kraft: "#ddbe93",
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, cycleTheme } = useTheme();

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={cycleTheme}
        aria-label="Switch color mode"
        title="Switch color mode"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted"
      >
        <Sun className="size-4" />
      </button>
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Color mode">
        {THEMES.map((name) => (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={theme === name}
            aria-label={THEME_LABELS[name]}
            title={THEME_LABELS[name]}
            onClick={() => setTheme(name)}
            className={cn(
              "size-4 rounded-full border border-border/70 transition-transform",
              theme === name && "ring-2 ring-ring ring-offset-1 ring-offset-background scale-110"
            )}
            style={{ backgroundColor: SWATCH_COLORS[name] }}
          />
        ))}
      </div>
    </div>
  );
}
