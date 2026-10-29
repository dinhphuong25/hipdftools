"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, ChevronRight, Search } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { QuickSearchModal } from "./QuickSearchModal";

export function FloatingHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-4 z-30 w-full max-w-4xl mx-auto px-4 pointer-events-none mb-6">
        <div className="pointer-events-auto h-12 px-4 rounded-full bg-white dark:bg-[#111722] border border-[#E8EAED] dark:border-[#1E293B] shadow-sm shadow-black/4 flex items-center justify-between gap-4 transition-all">
          {/* Left: Breadcrumb / Workspace indicator */}
          <div className="flex items-center gap-1.5 text-xs text-[#4B5563] dark:text-[#9CA3AF] shrink-0">
            <Link
              href="/"
              className="p-1 rounded-md hover:text-[#2D5A4C] dark:hover:text-[#6BAF9A] transition-colors"
              title="Trang chủ"
            >
              <Home className="w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
            </Link>
            <span className="font-semibold text-[#111827] dark:text-[#F9FAFB] ml-0.5">Không gian PDF</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </div>

          {/* Center: Search pill with shortcut */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex-1 max-w-md flex items-center justify-between px-3.5 py-1.5 rounded-full bg-[#F8F9FA] dark:bg-[#161D1A] hover:bg-[#EAF3EE]/50 dark:hover:bg-[#1E2824] border border-[#E8EAED] dark:border-[#24312B] hover:border-[#2D5A4C]/40 dark:hover:border-[#4E8A77]/40 text-xs text-[#6B7280] dark:text-[#9CA3AF] transition-all cursor-pointer text-left shadow-2xs"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 shrink-0 text-[#9CA3AF]" />
              <span className="truncate">Tìm công cụ...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#6B7280] dark:text-[#9CA3AF] bg-white dark:bg-[#111722] rounded border border-[#E8EAED] dark:border-[#334155] shadow-2xs">
              ⌘ K
            </kbd>
          </button>

          {/* Right: Theme Toggle + User Avatar */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />

            {/* Profile Avatar "P" */}
            <div className="w-7 h-7 rounded-full bg-[#2D5A4C] dark:bg-[#4E8A77] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              P
            </div>
          </div>
        </div>
      </header>

      <QuickSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
