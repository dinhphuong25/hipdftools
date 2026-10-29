"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  X,
  ArrowRight,
  FileSearch,
  CornerDownLeft,
} from "lucide-react";
import { TOOLS, ToolItem } from "@/lib/tools-registry";
import { removeVietnameseAccents } from "@/lib/utils";
import { DynamicIcon } from "../ui/DynamicIcon";
import { useAppStore } from "@/lib/store/useAppStore";
import { TRANSLATIONS, TOOL_TRANSLATIONS_EN } from "@/lib/i18n/translations";
import { ToolUploadPromptModal } from "../modals/ToolUploadPromptModal";
import { PdfStudioModal } from "../studio/PdfStudioModal";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [promptTool, setPromptTool] = useState<ToolItem | null>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [activeStudioTool, setActiveStudioTool] = useState<string>("merge-pdf");

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  const { files, activeFileIndex, language } = useAppStore();
  const isEn = language === "en";
  const t = TRANSLATIONS[language]?.quickSearch || TRANSLATIONS.vi.quickSearch;

  // Focus input and reset on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Lock outer scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [isOpen]);

  // Clean query
  const cleanQuery = removeVietnameseAccents(query.trim().toLowerCase());

  // Filter tools
  const filteredTools = useMemo(() => {
    if (!cleanQuery) {
      // When empty, show popular & focal tools first as clean suggestions
      return TOOLS.filter((t) => t.isPopular || t.isFocal).slice(0, 8);
    }

    return TOOLS.filter((tool) => {
      const enInfo = TOOL_TRANSLATIONS_EN[tool.slug];
      const nameMatchVi = removeVietnameseAccents(tool.name.toLowerCase()).includes(cleanQuery);
      const nameMatchEn = enInfo ? enInfo.name.toLowerCase().includes(cleanQuery) : false;
      const descMatchVi = removeVietnameseAccents(tool.shortDescription.toLowerCase()).includes(cleanQuery);
      const descMatchEn = enInfo ? enInfo.shortDescription.toLowerCase().includes(cleanQuery) : false;
      const keywordMatch = tool.keywords.some((k) =>
        removeVietnameseAccents(k.toLowerCase()).includes(cleanQuery)
      );
      const formatMatch = tool.outputFormats?.some((fmt) =>
        fmt.toLowerCase().includes(cleanQuery)
      );

      return nameMatchVi || nameMatchEn || descMatchVi || descMatchEn || keywordMatch || formatMatch;
    });
  }, [cleanQuery]);

  // Scroll active item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredTools.length - 1) : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelect = (tool: ToolItem) => {
    if (files && files.length > 0) {
      // If user has a file loaded in session, open studio directly
      setActiveStudioTool(tool.slug);
      setStudioOpen(true);
    } else {
      // Prompt user to upload file first!
      setPromptTool(tool);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-12 px-3 sm:px-4 bg-slate-950/65 backdrop-blur-md animate-backdrop-in cursor-pointer"
        onClick={onClose}
      >
        {/* Simple & Clean Search Card with Spring Animation */}
        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-xl bg-white dark:bg-[#111827] rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-slate-300 dark:border-slate-700 overflow-hidden cursor-default flex flex-col max-h-[80vh] animate-search-open"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Ultra-Clean Search Input Bar */}
          <div className="p-4 sm:p-5 pb-3.5 border-b-2 border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />

            <input
              ref={inputRef}
              type="text"
              placeholder={
                isEn
                  ? "Type a tool name, format or action..."
                  : "Tìm kiếm công cụ PDF..."
              }
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              style={{ outline: "none", boxShadow: "none" }}
              className="flex-1 bg-transparent border-none outline-none text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base font-medium p-0"
            />

            {/* Clear button if text exists */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="w-6 h-6 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title={t.clearQuery}
                aria-label={t.clearQuery}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Close Button ("Nút tắt") */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shrink-0 active:scale-95"
              title={isEn ? "Close search (Esc)" : "Đóng tìm kiếm (Esc)"}
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          {/* 2. Results List */}
          <div
            ref={listRef}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2 sm:p-3 space-y-1"
          >
            {/* Section Label */}
            <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {query
                ? (isEn ? `Search results (${filteredTools.length})` : `Kết quả tìm kiếm (${filteredTools.length})`)
                : (isEn ? "Popular Tools" : "Gợi ý công cụ phổ biến")}
            </div>

            {filteredTools.length === 0 ? (
              /* Clean Empty State */
              <div className="py-12 px-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 mx-auto">
                  <FileSearch className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? `No tools found for "${query}"` : `Không tìm thấy công cụ "${query}"`}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {isEn
                    ? "Try keywords like merge, compress, word, translate..."
                    : "Thử tìm từ khóa như: ghép, tách, nén, word, dịch..."}
                </p>
              </div>
            ) : (
              filteredTools.map((tool, index) => {
                const isSelected = index === selectedIndex;
                const enData = TOOL_TRANSLATIONS_EN[tool.slug];
                const toolTitle = (isEn && enData?.name) || tool.name;
                const toolDesc = (isEn && enData?.shortDescription) || tool.shortDescription;

                return (
                  <div
                    key={tool.id}
                    ref={isSelected ? selectedItemRef : null}
                    onClick={() => handleSelect(tool)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#F0F9FF] dark:bg-[#0C2438] text-[#0284C7] dark:text-[#38BDF8]"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {/* Left: Icon & Title */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#0284C7] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8]"
                        }`}
                      >
                        <DynamicIcon name={tool.icon} className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <span
                          className={`text-xs sm:text-sm font-semibold truncate block ${
                            isSelected
                              ? "text-[#0284C7] dark:text-[#38BDF8]"
                              : "text-slate-800 dark:text-slate-100"
                          }`}
                        >
                          {toolTitle}
                        </span>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-sm sm:max-w-md">
                          {toolDesc}
                        </p>
                      </div>
                    </div>

                    {/* Right: Enter key hint when selected */}
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] dark:text-[#38BDF8]">
                          <span>{isEn ? "Open" : "Mở"}</span>
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 3. Ultra-Minimal Footer */}
          <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
            <div className="flex items-center gap-3">
              <span>↑↓ {isEn ? "navigate" : "di chuyển"}</span>
              <span>•</span>
              <span>↵ {isEn ? "open" : "mở"}</span>
              <span>•</span>
              <span>ESC {isEn ? "close" : "đóng"}</span>
            </div>

            <span className="text-[10px]">HiPDF Fast Search</span>
          </div>
        </div>
      </div>

      {/* Tool Upload Prompt Modal */}
      <ToolUploadPromptModal
        isOpen={!!promptTool}
        onClose={() => setPromptTool(null)}
        tool={promptTool}
        onFileReady={(slug) => {
          setActiveStudioTool(slug);
          setPromptTool(null);
          setStudioOpen(true);
        }}
      />

      {/* Fullscreen PDF Studio Workspace */}
      <PdfStudioModal
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        initialToolSlug={activeStudioTool}
        file={files[activeFileIndex] || files[0]}
      />
    </>
  );
}
