"use client";

import React, { useState, useMemo } from "react";
import { ToolCard } from "./ToolCard";
import { TOOLS, CATEGORIES, ToolCategory, ToolItem } from "@/lib/tools-registry";
import { removeVietnameseAccents } from "@/lib/utils";
import { DynamicIcon } from "../ui/DynamicIcon";
import { Search, X, Filter, LayoutGrid } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { ToolUploadPromptModal } from "../modals/ToolUploadPromptModal";
import { PdfStudioModal } from "../studio/PdfStudioModal";

interface ToolGridProps {
  initialCategory?: ToolCategory | "all";
  showSearch?: boolean;
}

export function ToolGrid({ initialCategory = "all", showSearch = true }: ToolGridProps) {
  const { files, activeFileIndex } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [promptTool, setPromptTool] = useState<ToolItem | null>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [activeStudioTool, setActiveStudioTool] = useState<string>("merge-pdf");

  const handleSelectTool = (tool: ToolItem) => {
    if (files && files.length > 0) {
      setActiveStudioTool(tool.slug);
      setStudioOpen(true);
    } else {
      setPromptTool(tool);
    }
  };

  const filteredTools = useMemo(() => {
    const cleanQ = removeVietnameseAccents(searchQuery.trim());

    return TOOLS.filter((tool) => {
      // Category filter
      if (selectedCategory !== "all" && tool.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (cleanQ) {
        const nameMatch = removeVietnameseAccents(tool.name).includes(cleanQ);
        const descMatch = removeVietnameseAccents(tool.shortDescription).includes(cleanQ);
        const keywordMatch = tool.keywords.some((k) =>
          removeVietnameseAccents(k).includes(cleanQ)
        );
        if (!nameMatch && !descMatch && !keywordMatch) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Category Pills & Search Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Filter Pills - Responsive wrap, zero horizontal scroll */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1.5 ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-md shadow-[#0284C7]/20 border border-[#0284C7]"
                : "bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-[#0284C7]/40 dark:hover:border-[#38BDF8]/40 hover:bg-[#F0F9FF] dark:hover:bg-[#0C2438] hover:text-[#0284C7] dark:hover:text-[#38BDF8]"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
            <span>Tất cả</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5 transition-colors ${
                selectedCategory === "all"
                  ? "bg-white/25 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {TOOLS.length}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const count = TOOLS.filter((t) => t.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-md shadow-[#0284C7]/20 border border-[#0284C7]"
                    : "bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-[#0284C7]/40 dark:hover:border-[#38BDF8]/40 hover:bg-[#F0F9FF] dark:hover:bg-[#0C2438] hover:text-[#0284C7] dark:hover:text-[#38BDF8]"
                }`}
              >
                <DynamicIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5 transition-colors ${
                    isSelected
                      ? "bg-white/25 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inline Search Filter */}
        {showSearch && (
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Lọc nhanh công cụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0284C7] dark:focus:border-[#38BDF8] focus:ring-2 focus:ring-[#0284C7]/20 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid of Tools */}
      {filteredTools.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Filter className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Không tìm thấy công cụ phù hợp
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Không có công cụ nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="px-4 py-2 text-xs font-bold text-[#0284C7] dark:text-[#38BDF8] bg-[#F0F9FF] dark:bg-[#0C2438] rounded-xl hover:bg-[#E0F2FE] dark:hover:bg-[#075985]/30 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={handleSelectTool} />
          ))}
        </div>
      )}

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
    </div>
  );
}
