"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 backdrop-blur transition hover:bg-white/10 dark:text-zinc-200"
      aria-label="Toggle theme"
    >
      {mounted ? (
        isDark ? (
          <>
            <Moon className="h-4 w-4" />
            <span className="hidden sm:inline">Dark</span>
          </>
        ) : (
          <>
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Light</span>
          </>
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}

