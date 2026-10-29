"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Star,
  ArrowRight,
  X,
  LayoutGrid,
  Sparkles,
  Layers,
  ArrowRightLeft,
  PenTool,
  ShieldCheck,
} from "lucide-react";
import { TOOLS, ToolItem } from "@/lib/tools-registry";
import { ToolIllustration } from "../ui/ToolIllustration";
import { useAppStore } from "@/lib/store/useAppStore";
import { removeVietnameseAccents } from "@/lib/utils";
import { TRANSLATIONS, TOOL_TRANSLATIONS_EN } from "@/lib/i18n/translations";
import { ToolUploadPromptModal } from "../modals/ToolUploadPromptModal";
import { PdfStudioModal } from "../studio/PdfStudioModal";

export function ToolCatalog() {
  const { files, activeFileIndex, isFavorite, toggleFavorite, language } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [promptTool, setPromptTool] = useState<ToolItem | null>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [activeStudioTool, setActiveStudioTool] = useState<string>("merge-pdf");

  const handleToolClick = (tool: ToolItem) => {
    if (files && files.length > 0) {
      // Already has file uploaded, open studio directly with this tool
      setActiveStudioTool(tool.slug);
      setStudioOpen(true);
    } else {
      // Prompt user to upload PDF file first!
      setPromptTool(tool);
    }
  };

  const t = TRANSLATIONS[language]?.catalog || TRANSLATIONS.vi.catalog;

  const filterCategories = [
    { id: "all", label: t.categories.all, icon: LayoutGrid },
    { id: "popular", label: t.categories.popular, icon: Star },
    { id: "ai_translate", label: t.categories.ai_translate, icon: Sparkles },
    { id: "organize", label: t.categories.organize, icon: Layers },
    { id: "convert", label: t.categories.convert, icon: ArrowRightLeft },
    { id: "edit", label: t.categories.edit, icon: PenTool },
    { id: "security", label: t.categories.security, icon: ShieldCheck },
  ];

  const categoryCounts = useMemo(
    () => ({
      all: TOOLS.length,
      popular: TOOLS.filter((item) => item.isPopular).length,
      ai_translate: TOOLS.filter((item) => item.category === "ai_translate").length,
      organize: TOOLS.filter((item) => item.category === "organize").length,
      convert: TOOLS.filter(
        (item) => item.category === "convert_to_pdf" || item.category === "convert_from_pdf"
      ).length,
      edit: TOOLS.filter((item) => item.category === "edit").length,
      security: TOOLS.filter((item) => item.category === "security").length,
    }),
    []
  );

  const filteredTools = useMemo(() => {
    const q = removeVietnameseAccents(searchQuery.trim().toLowerCase());

    return TOOLS.filter((tool) => {
      // Category filter
      if (selectedCategory === "popular") {
        if (!tool.isPopular) return false;
      } else if (selectedCategory === "convert") {
        if (tool.category !== "convert_to_pdf" && tool.category !== "convert_from_pdf") {
          return false;
        }
      } else if (selectedCategory !== "all") {
        if (tool.category !== selectedCategory) return false;
      }

      // Search query filter
      if (q) {
        const enInfo = TOOL_TRANSLATIONS_EN[tool.slug];
        const nameMatchVi = removeVietnameseAccents(tool.name.toLowerCase()).includes(q);
        const nameMatchEn = enInfo ? enInfo.name.toLowerCase().includes(q) : false;
        const descMatchVi = removeVietnameseAccents(tool.shortDescription.toLowerCase()).includes(q);
        const descMatchEn = enInfo ? enInfo.shortDescription.toLowerCase().includes(q) : false;
        const keywordMatch = tool.keywords.some((k) =>
          removeVietnameseAccents(k.toLowerCase()).includes(q)
        );
        return nameMatchVi || nameMatchEn || descMatchVi || descMatchEn || keywordMatch;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="tools" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] dark:text-[#38BDF8] uppercase tracking-wider">
              <span>{t.badge}</span>
              <span>•</span>
              <span>{TOOLS.length} {t.toolCount}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F9FAFB] tracking-tight">
              {t.title}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#94A3B8]">
              {t.desc}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs font-semibold rounded-2xl bg-white dark:bg-[#111827] border-2 border-[#CBD5E1] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F9FAFB] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F9FAFB]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills - Responsive wrap, zero horizontal scroll */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {filterCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            const count = categoryCounts[cat.id as keyof typeof categoryCounts] ?? 0;
            return (
              <button
                key={cat.id}
                data-category-id={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                  isSelected
                    ? "bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-md shadow-[#0284C7]/20 border border-[#0284C7]"
                    : "bg-white dark:bg-[#111827] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B] hover:bg-[#F0F9FF] dark:hover:bg-[#0C2438] hover:border-[#0284C7]/40 dark:hover:border-[#38BDF8]/40 hover:text-[#0284C7] dark:hover:text-[#38BDF8]"
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
                      : "bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const fav = isFavorite(tool.slug);
              const isFocal = tool.isFocal;
              const enData = TOOL_TRANSLATIONS_EN[tool.slug];
              const toolTitle = (language === "en" && enData?.name) || tool.name;
              const toolDesc = (language === "en" && enData?.shortDescription) || tool.shortDescription;

              return (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className={`group relative rounded-2xl sm:rounded-3xl bg-white dark:bg-[#111827] border-2 transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                    isFocal
                      ? "border-[#0284C7] dark:border-[#38BDF8] ring-2 ring-[#0284C7]/20 bg-[#F0F9FF]/40 dark:bg-[#0C2438]/40"
                      : "border-[#CBD5E1] dark:border-[#1E293B] hover:border-[#0284C7] dark:hover:border-[#38BDF8]"
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Icon + Badge + Favorite */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] group-hover:border-[#0284C7]/50 group-hover:shadow-md transition-all shadow-2xs">
                        <ToolIllustration
                          slug={tool.slug}
                          className="w-15 h-15 sm:w-16 sm:h-16 group-hover:scale-108 group-hover:-translate-y-0.5 transition-all duration-300"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(tool.slug);
                        }}
                        className="p-1 rounded-lg text-[#94A3B8] hover:text-amber-500 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors"
                        title={fav ? (language === "en" ? "Remove favorite" : "Bỏ yêu thích") : (language === "en" ? "Save to favorites" : "Lưu vào yêu thích")}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            fav ? "fill-amber-400 text-amber-400" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Tool Info */}
                    <div className="block group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] transition-colors">
                      <h3 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F9FAFB] leading-snug tracking-tight">
                        {toolTitle}
                      </h3>
                      <p className="text-xs font-medium text-[#475569] dark:text-[#94A3B8] mt-1.5 line-clamp-2 leading-relaxed">
                        {toolDesc}
                      </p>
                    </div>
                  </div>

                  {/* Action Link at Bottom */}
                  <div className="pt-4 mt-3 border-t border-[#F1F5F9] dark:border-[#1E293B] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToolClick(tool);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] dark:text-[#38BDF8] group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <span>{t.openTool}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-[#111827] rounded-3xl border border-[#E2E8F0] dark:border-[#1E293B]">
            <Search className="w-8 h-8 text-[#94A3B8] mx-auto stroke-1" />
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F9FAFB]">
              {t.notFound} &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              {t.notFoundHint}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0284C7] text-white text-xs font-semibold mt-2 cursor-pointer shadow-xs"
            >
              <span>{t.viewAll}</span>
            </button>
          </div>
        )}
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
    </section>
  );
}
