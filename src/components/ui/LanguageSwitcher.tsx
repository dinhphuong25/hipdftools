"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

export interface LanguageOption {
  code: "vi" | "en";
  name: string;
  nativeName: string;
  flag: React.ReactNode;
}

// Crisp Vector SVG Flags
function VietnamFlag({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={`w-full h-full block ${className}`}>
      <rect width="30" height="20" fill="#DA251D" />
      <polygon
        points="15,4 16.54,8.75 21.54,8.75 17.5,11.68 19.04,16.44 15,13.5 10.96,16.44 12.5,11.68 8.46,8.75 13.46,8.75"
        fill="#FFFF00"
      />
    </svg>
  );
}

function UsFlag({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={`w-full h-full block ${className}`}>
      <rect width="30" height="20" fill="#B22234" />
      <path d="M0,2.3h30M0,5.4h30M0,8.5h30M0,11.5h30M0,14.6h30M0,17.7h30" stroke="#FFFFFF" strokeWidth="1.54" />
      <rect width="13" height="10.8" fill="#3C3B6E" />
      <circle cx="6.5" cy="5.4" r="2.2" fill="#FFFFFF" />
    </svg>
  );
}

// Only Vietnamese and English as requested
export const LANGUAGES: LanguageOption[] = [
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: <VietnamFlag /> },
  { code: "en", name: "English", nativeName: "English", flag: <UsFlag /> },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currentLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const handleSelect = (code: "vi" | "en") => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button with Flag icon & bold border */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl bg-white dark:bg-[#111827] hover:bg-gray-50 dark:hover:bg-[#1E293B] border-2 border-slate-300 dark:border-slate-700 hover:border-[#0284C7] dark:hover:border-[#38BDF8] text-xs sm:text-[13px] font-bold text-gray-800 dark:text-gray-200 transition-all cursor-pointer shadow-2xs group focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={language === "vi" ? "Chuyển đổi ngôn ngữ (Tiếng Việt / English)" : "Switch language (Tiếng Việt / English)"}
      >
        <div className="w-5 h-3.5 rounded-[3px] overflow-hidden shrink-0 flex items-center justify-center border border-slate-300 dark:border-slate-600 shadow-2xs group-hover:scale-105 transition-transform">
          {currentLanguage.flag}
        </div>
        <span className="truncate">{currentLanguage.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-hover:text-gray-700 dark:group-hover:text-gray-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Language Options Dropdown Menu - 2 languages only with bold border */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white dark:bg-[#111827] border-2 border-slate-300 dark:border-slate-700 shadow-xl dark:shadow-[0_10px_25px_rgba(0,0,0,0.5)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-1">
            {language === "vi" ? "Chọn ngôn ngữ" : "Select language"}
          </div>

          <div className="py-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#F0F9FF] dark:bg-[#0C2438] text-[#0284C7] dark:text-[#38BDF8]"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1E293B]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-5 h-3.5 rounded-[3px] overflow-hidden shrink-0 flex items-center justify-center border border-slate-300 dark:border-slate-600 shadow-2xs">
                      {lang.flag}
                    </div>
                    <span className="truncate">{lang.nativeName}</span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8] shrink-0 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
