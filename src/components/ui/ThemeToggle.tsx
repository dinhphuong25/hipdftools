"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-full text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6] dark:text-[#9CA3AF] dark:hover:text-[#F3F4F6] dark:hover:bg-[#21262D] transition-colors"
      title={isDark ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
