"use client";

import React from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { ToolItem } from "@/lib/tools-registry";
import { ToolIllustration } from "../ui/ToolIllustration";
import { useAppStore } from "@/lib/store/useAppStore";

interface ToolCardProps {
  tool: ToolItem;
  onSelect?: (tool: ToolItem) => void;
}

export function ToolCard({ tool, onSelect }: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useAppStore();
  const fav = isFavorite(tool.slug);

  const destinationHref =
    tool.slug === "translate-pdf"
      ? "/tools/translate-pdf"
      : `/tools/${tool.slug}`;

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(tool);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111827] border-2 transition-all duration-300 ${
        onSelect ? "cursor-pointer" : ""
      } ${
        tool.isFocal
          ? "border-[#0284C7] dark:border-[#38BDF8] ring-2 ring-[#0284C7]/20 bg-[#F0F9FF]/40 dark:bg-[#0C2438]/40 shadow-sm"
          : "border-[#CBD5E1] dark:border-[#1E293B] hover:border-[#0284C7] dark:hover:border-[#38BDF8] hover:shadow-xl hover:-translate-y-1"
      }`}
    >
      <div>
        {/* Top bar with Illustration & Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Vector Illustration */}
          <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] group-hover:border-[#0284C7]/50 group-hover:shadow-md transition-all shadow-2xs">
            <ToolIllustration
              slug={tool.slug}
              className="w-16 h-16 sm:w-18 sm:h-18 group-hover:scale-108 group-hover:-translate-y-0.5 transition-all duration-300"
            />
          </div>

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(tool.slug);
            }}
            className="p-1.5 rounded-xl text-[#94A3B8] hover:text-amber-500 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
            title={fav ? "Bỏ yêu thích" : "Yêu thích"}
          >
            <Star
              className={`w-4 h-4 transition-transform active:scale-125 ${
                fav ? "fill-amber-400 text-amber-400" : ""
              }`}
            />
          </button>
        </div>

        {/* Title & Description */}
        <div className="block space-y-1.5">
          <h3 className="text-base font-extrabold text-[#0F172A] dark:text-[#F9FAFB] group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] transition-colors line-clamp-1">
            {tool.name}
          </h3>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
            {tool.shortDescription}
          </p>
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-3.5 mt-4 border-t border-[#F1F5F9] dark:border-[#1E293B] flex items-center justify-end text-xs font-semibold text-[#475569] dark:text-[#94A3B8]">
        {onSelect ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(tool);
            }}
            className="flex items-center gap-1 text-[#0284C7] dark:text-[#38BDF8] font-bold group-hover:translate-x-1 transition-transform cursor-pointer"
          >
            <span>Mở công cụ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link
            href={destinationHref}
            className="flex items-center gap-1 text-[#0284C7] dark:text-[#38BDF8] font-bold group-hover:translate-x-1 transition-transform"
          >
            <span>Mở công cụ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
