"use client";

import * as React from "react";

export const THEMES = ["paper", "parchment", "kraft"] as const;
export type ThemeName = (typeof THEMES)[number];

export const THEME_LABELS: Record<ThemeName, string> = {
  paper: "Paper",
  parchment: "Parchment",
  kraft: "Kraft",
};

const STORAGE_KEY = "daily-newsfeed-theme";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function isThemeName(value: string | null): value is ThemeName {
  return !!value && (THEMES as readonly string[]).includes(value);
}

function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeName>("paper");

  // Reconciles React state with the theme the blocking <script> in the root
  // layout already applied to the DOM before hydration. This intentionally
  // runs once on mount (mirroring the standard next-themes pattern) so the
  // server-rendered "paper" default never causes a visible flash, while the
  // client state still ends up correct for consumers like ThemeToggle.
  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isThemeName(stored)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from an external system (localStorage/DOM) on mount, not a derived-state anti-pattern
      setThemeState(stored);
    } else {
      const current = document.documentElement.dataset.theme;
      if (isThemeName(current ?? null)) {
        setThemeState(current as ThemeName);
      }
    }
  }, []);

  const setTheme = React.useCallback((next: ThemeName) => {
    setThemeState(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const cycleTheme = React.useCallback(() => {
    setThemeState((current) => {
      const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
      applyTheme(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({ theme, setTheme, cycleTheme }),
    [theme, setTheme, cycleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
