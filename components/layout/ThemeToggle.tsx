"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl bg-surface-raised border border-border animate-pulse" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2.5 rounded-xl bg-surface hover:bg-surface-raised border border-border text-foreground-muted hover:text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      aria-label="Toggle theme"
      title={isDark ? "Ganti ke Light Mode" : "Ganti ke Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="w-4 h-4 text-primary transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
