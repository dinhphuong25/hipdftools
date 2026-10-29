"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  X,
  Search,
  CheckCircle2,
  FileText,
  ArrowRight,
  UploadCloud,
  Sparkles,
  Star,
  ArrowRightLeft,
  PenTool,
  Layers,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";
import { LoadedPdfFile, useAppStore } from "@/lib/store/useAppStore";
import { TOOLS, ToolItem } from "@/lib/tools-registry";
import { DynamicIcon } from "../ui/DynamicIcon";
import { formatFileSize, removeVietnameseAccents } from "@/lib/utils";
import { TRANSLATIONS, TOOL_TRANSLATIONS_EN } from "@/lib/i18n/translations";

interface ToolSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: LoadedPdfFile;
  onSelectTool: (toolSlug: string) => void;
  onChangeFile?: (newFile: File) => void;
}

export function ToolSelectorModal({
  isOpen,
  onClose,
  file,
  onSelectTool,
  onChangeFile,
}: ToolSelectorModalProps) {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language].toolModal;
  const heroT = TRANSLATIONS[language].hero;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body & html scroll to ensure only the inner modal area can scroll ("chỉ sử dụng scroll trong")
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflowHtml = document.documentElement.style.overflow;
    const originalOverflowBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalOverflowHtml;
      document.body.style.overflow = originalOverflowBody;
    };
  }, [isOpen]);

  const categories = useMemo(
    () => [
      { id: "all", label: t.categories.all, icon: LayoutGrid },
      { id: "popular", label: t.categories.popular, icon: Star },
      { id: "convert", label: t.categories.convert, icon: ArrowRightLeft },
      { id: "ai_translate", label: t.categories.ai_translate, icon: Sparkles },
      { id: "edit_sign", label: t.categories.edit_sign, icon: PenTool },
      { id: "organize", label: t.categories.organize, icon: Layers },
      { id: "security_optimize", label: t.categories.security_optimize, icon: ShieldCheck },
    ],
    [t.categories]
  );

  const categoryCounts = useMemo(
    () => ({
      all: TOOLS.length,
      popular: TOOLS.filter((item: ToolItem) => item.isPopular).length,
      convert: TOOLS.filter(
        (item: ToolItem) =>
          item.category === "convert_to_pdf" || item.category === "convert_from_pdf"
      ).length,
      ai_translate: TOOLS.filter((item: ToolItem) => item.category === "ai_translate").length,
      edit_sign: TOOLS.filter(
        (item: ToolItem) => item.category === "edit" || item.id === "sign-pdf"
      ).length,
      organize: TOOLS.filter(
        (item: ToolItem) =>
          item.category === "organize" || item.category === "view_inspect"
      ).length,
      security_optimize: TOOLS.filter(
        (item: ToolItem) =>
          (item.category === "security" ||
            item.category === "optimize" ||
            item.category === "ocr") &&
          item.id !== "sign-pdf"
      ).length,
    }),
    []
  );

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    const q = removeVietnameseAccents(searchQuery.trim().toLowerCase());

    return TOOLS.filter((tool: ToolItem) => {
      // Category filter
      if (selectedCategory === "popular") {
        if (!tool.isPopular) return false;
      } else if (selectedCategory === "ai_translate") {
        if (tool.category !== "ai_translate") return false;
      } else if (selectedCategory === "organize") {
        if (tool.category !== "organize" && tool.category !== "view_inspect") return false;
      } else if (selectedCategory === "convert") {
        if (tool.category !== "convert_to_pdf" && tool.category !== "convert_from_pdf") return false;
      } else if (selectedCategory === "edit_sign") {
        if (tool.category !== "edit" && tool.id !== "sign-pdf") return false;
      } else if (selectedCategory === "security_optimize") {
        if (tool.category !== "security" && tool.category !== "optimize" && tool.category !== "ocr") return false;
        if (tool.id === "sign-pdf") return false;
      }

      // Search query filter
      if (q) {
        const enInfo = TOOL_TRANSLATIONS_EN[tool.slug];
        const nameMatchVi = removeVietnameseAccents(tool.name.toLowerCase()).includes(q);
        const nameMatchEn = enInfo ? enInfo.name.toLowerCase().includes(q) : false;
        const descMatchVi = removeVietnameseAccents(tool.shortDescription.toLowerCase()).includes(q);
        const descMatchEn = enInfo ? enInfo.shortDescription.toLowerCase().includes(q) : false;
        const keywordMatch = tool.keywords?.some((k) =>
          removeVietnameseAccents(k.toLowerCase()).includes(q)
        );
        return nameMatchVi || nameMatchEn || descMatchVi || descMatchEn || keywordMatch;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Box */}
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#141B18] rounded-3xl shadow-2xl border border-gray-200/80 dark:border-gray-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Uploaded File Info Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#F0F9FF] via-white to-[#F8FAFC] dark:from-[#0F1E2E] dark:via-[#111827] dark:to-[#0F172A] border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* File Icon */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0284C7]/20">
              <FileText className="w-6 h-6 stroke-[2]" />
            </div>

            {/* File Metadata */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  {t.uploadedSuccess}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {file.pageCount ? `${file.pageCount} ${heroT.activeFile.pages} • ` : ""}
                {formatFileSize(file.size)} • {t.desc}
              </p>
            </div>
          </div>

          {/* Right Action: Change File & Close */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {onChangeFile && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) {
                      onChangeFile(selected);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#0284C7] dark:hover:text-[#38BDF8] hover:bg-gray-100 dark:hover:bg-[#1E293B] border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{t.changeFile}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-[#1E293B] hover:bg-gray-200 dark:hover:bg-[#334155] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800/80 space-y-3.5 shrink-0 bg-white dark:bg-[#111827]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  {t.title}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0F9FF] dark:bg-[#0C2438] text-[#0284C7] dark:text-[#38BDF8]">
                  {filteredTools.length} {t.toolsCount}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {t.desc}
              </p>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills - Responsive wrap, zero horizontal scroll */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              const count = categoryCounts[cat.id as keyof typeof categoryCounts] ?? 0;
              return (
                <button
                  key={cat.id}
                  data-category-id={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-md shadow-[#0284C7]/25 border border-[#0284C7]"
                      : "bg-gray-100/90 dark:bg-[#1E293B] hover:bg-[#F0F9FF] dark:hover:bg-[#0C2438] text-gray-700 dark:text-gray-300 border border-gray-200/90 dark:border-gray-700/80 hover:border-[#0284C7]/40 dark:hover:border-[#38BDF8]/40 hover:text-[#0284C7] dark:hover:text-[#38BDF8]"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? "text-white" : "text-[#0284C7] dark:text-[#38BDF8]"
                      }`}
                    />
                  )}
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5 transition-colors ${
                      isSelected
                        ? "bg-white/25 text-white"
                        : "bg-gray-200/80 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Tool Cards Grid with Smooth Card Animations */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 overscroll-contain">
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTools.map((tool) => {
                const isFocal = tool.isFocal;
                const enInfo = TOOL_TRANSLATIONS_EN[tool.slug];
                const toolName = language === "en" && enInfo ? enInfo.name : tool.name;
                const toolDesc = language === "en" && enInfo ? enInfo.shortDescription : tool.shortDescription;

                return (
                  <button
                    key={tool.id}
                    data-tool-slug={tool.slug}
                    type="button"
                    onClick={() => onSelectTool(tool.slug)}
                    className={`group text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] ${
                      isFocal
                        ? "bg-gradient-to-br from-[#F0F9FF] to-white dark:from-[#0C2438] dark:to-[#111827] border-[#0284C7]/40 hover:border-[#0284C7] shadow-xs"
                        : "bg-white dark:bg-[#111827] border-gray-200/80 dark:border-gray-700/80 hover:border-[#0284C7] dark:hover:border-[#38BDF8] shadow-2xs"
                    }`}
                  >
                    <div>
                      {/* Top icon and badge */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                            isFocal
                              ? "bg-[#0284C7] text-white shadow-sm shadow-[#0284C7]/30"
                              : "bg-[#F0F9FF] dark:bg-[#0C2438] text-[#0284C7] dark:text-[#38BDF8] group-hover:bg-[#0284C7] group-hover:text-white"
                          }`}
                        >
                          <DynamicIcon name={tool.icon} className="w-4 h-4" />
                        </div>

                        {isFocal ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0284C7] text-white shadow-2xs animate-pulse-glow">
                            <Sparkles className="w-2.5 h-2.5" />
                            {t.aiBadge}
                          </span>
                        ) : tool.isPopular ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                            {t.popularBadge}
                          </span>
                        ) : null}
                      </div>

                      {/* Tool Name */}
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] transition-colors line-clamp-1 leading-snug">
                        {toolName}
                      </h4>

                      {/* Tool Description */}
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {toolDesc}
                      </p>
                    </div>

                    {/* Bottom CTA with Slide Animation */}
                    <div className="pt-3 mt-1 flex items-center gap-1.5 text-[11px] font-bold text-[#0284C7] dark:text-[#38BDF8] group-hover:translate-x-1.5 transition-transform duration-200">
                      <span>{t.applyTool}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.notFound} &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-xs font-bold text-[#0284C7] dark:text-[#38BDF8] hover:underline cursor-pointer"
              >
                {t.clearFilter}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
