"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { QuickSearchModal } from "./QuickSearchModal";
import { BrandLogo } from "../ui/BrandLogo";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { useAppStore } from "@/lib/store/useAppStore";
import { TRANSLATIONS } from "@/lib/i18n/translations";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { language } = useAppStore();
  const t = TRANSLATIONS[language].nav;

  // Global Ctrl+K / Cmd+K listener to open quick search
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-md border-b-2 border-slate-300 dark:border-slate-700 transition-colors shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Wordmark - Left Side matching hidownload.one */}
          <BrandLogo size="md" href="/" />

          {/* Right Action Group: Quick Search, Theme Toggle, Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search Button with bold border */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-gray-50 dark:bg-[#111827] hover:bg-[#F0F9FF] dark:hover:bg-[#0C2438] text-xs font-bold text-[#334155] dark:text-[#E2E8F0] hover:text-[#0284C7] dark:hover:text-[#38BDF8] border-2 border-slate-300 dark:border-slate-700 hover:border-[#0284C7] dark:hover:border-[#38BDF8] transition-all cursor-pointer shadow-2xs group"
              title={t.searchPlaceholder}
            >
              <Search className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] transition-colors stroke-[2.5]" />
              <span className="hidden sm:inline">{t.search}</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#1E293B] rounded border border-slate-300 dark:border-slate-600 text-[#64748B] dark:text-[#94A3B8] shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Language Switcher matching hidownload.one [ 🇻🇳 Tiếng Việt ▾ ] */}
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <QuickSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
