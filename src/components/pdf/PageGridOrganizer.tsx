"use client";

import React from "react";
import { Trash2, RotateCw, ArrowLeft, ArrowRight, Check } from "lucide-react";

interface PageGridOrganizerProps {
  pageThumbnails: string[];
  totalPages: number;
  selectedPages?: number[];
  onToggleSelectPage?: (pageNumber: number) => void;
  onDeletePage?: (pageNumber: number) => void;
  onRotatePage?: (pageNumber: number) => void;
  onMovePage?: (fromIndex: number, toIndex: number) => void;
  allowDelete?: boolean;
  allowRotate?: boolean;
  allowReorder?: boolean;
  mode?: "select" | "delete" | "reorder" | "rotate";
}

export function PageGridOrganizer({
  pageThumbnails,
  totalPages,
  selectedPages = [],
  onToggleSelectPage,
  onDeletePage,
  onRotatePage,
  onMovePage,
  allowDelete = true,
  allowRotate = false,
  allowReorder = false,
  mode: _mode = "select",
}: PageGridOrganizerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 p-4 bg-[#F8FAFC] dark:bg-[#0D1117] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] max-h-[580px] overflow-y-auto">
      {Array.from({ length: totalPages }).map((_, idx) => {
        const pageNum = idx + 1;
        const thumbnail = pageThumbnails[idx];
        const isSelected = selectedPages.includes(pageNum);

        return (
          <div
            key={pageNum}
            onClick={() => onToggleSelectPage?.(pageNum)}
            className={`group relative flex flex-col items-center p-2 rounded-xl bg-white dark:bg-[#161D1A] border transition-all duration-150 cursor-pointer ${
              isSelected
                ? "border-[#2D5A4C] dark:border-[#4E8A77] ring-2 ring-[#2D5A4C]/20 shadow-xs"
                : "border-[#E8EAED] dark:border-[#24312B] hover:border-[#2D5A4C]/40"
            }`}
          >
            {/* Top Badge (Page Number and Selection Check) */}
            <div className="w-full flex items-center justify-between mb-1.5 px-1">
              <span className="text-[11px] font-mono font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                Trang {pageNum}
              </span>
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border text-white transition-colors ${
                  isSelected
                    ? "bg-[#2D5A4C] border-[#2D5A4C] dark:bg-[#4E8A77] dark:border-[#4E8A77]"
                    : "border-[#D1D5DB] dark:border-[#374151]"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Thumbnail Canvas / Image */}
            <div className="w-full aspect-3/4 rounded-md bg-[#F3F4F6] dark:bg-[#21262D] overflow-hidden flex items-center justify-center border border-[#F3F4F6] dark:border-[#21262D]">
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnail}
                  alt={`Trang ${pageNum}`}
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <span className="text-xs text-[#9CA3AF]">Trang {pageNum}</span>
              )}
            </div>

            {/* Action Bar overlay for quick delete/rotate/reorder */}
            <div className="w-full flex items-center justify-center gap-1.5 mt-2 pt-1 border-t border-[#F3F4F6] dark:border-[#21262D]">
              {allowRotate && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRotatePage?.(pageNum);
                  }}
                  className="p-1 rounded text-[#6B7280] hover:text-[#1F2937] dark:hover:text-[#F0F6FC] hover:bg-[#F3F4F6] dark:hover:bg-[#21262D] transition-colors"
                  title="Xoay 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              )}

              {allowReorder && (
                <>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovePage?.(idx, idx - 1);
                    }}
                    className="p-1 rounded text-[#6B7280] hover:text-[#1F2937] disabled:opacity-20 transition-colors"
                    title="Di chuyển sang trái"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === totalPages - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovePage?.(idx, idx + 1);
                    }}
                    className="p-1 rounded text-[#6B7280] hover:text-[#1F2937] disabled:opacity-20 transition-colors"
                    title="Di chuyển sang phải"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {allowDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePage?.(pageNum);
                  }}
                  className="p-1 rounded text-[#6B7280] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Xóa trang này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
