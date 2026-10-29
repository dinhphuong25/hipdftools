"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  FileText,
} from "lucide-react";
import { renderPdfPageToCanvas } from "@/lib/pdf/pdf-renderer";

interface PdfViewerProps {
  arrayBuffer: ArrayBuffer | null;
  totalPages?: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function PdfViewer({
  arrayBuffer,
  totalPages = 1,
  initialPage = 1,
  onPageChange,
  className = "",
}: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    if (!arrayBuffer || !canvasRef.current) return;

    let isCancelled = false;
    setLoading(true);

    renderPdfPageToCanvas(arrayBuffer, currentPage, canvasRef.current, scale)
      .catch((err) => {
        if (!isCancelled) console.warn("Failed to render page to canvas", err);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [arrayBuffer, currentPage, scale]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const next = currentPage - 1;
      setCurrentPage(next);
      onPageChange?.(next);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const next = currentPage + 1;
      setCurrentPage(next);
      onPageChange?.(next);
    }
  };

  const handleZoomIn = () => setScale((s) => Math.min(2.5, s + 0.15));
  const handleZoomOut = () => setScale((s) => Math.max(0.6, s - 0.15));
  const handleResetZoom = () => setScale(1.0);

  if (!arrayBuffer) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#161B22] rounded-2xl border border-[#E5E7EB] dark:border-[#30363D] text-center min-h-[360px]">
        <FileText className="w-10 h-10 text-[#9CA3AF] mb-2 opacity-50" />
        <p className="text-xs text-[#6B7280] dark:text-[#8B949E]">
          Chưa có nội dung xem trước
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col rounded-2xl border border-[#E5E7EB] dark:border-[#30363D] bg-white dark:bg-[#161B22] overflow-hidden shadow-xs ${className}`}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#E5E7EB] dark:border-[#30363D] bg-[#F9FAFB] dark:bg-[#1C222B] text-xs text-[#4B5563] dark:text-[#8B949E]">
        {/* Page navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1 rounded-md hover:bg-white dark:hover:bg-[#21262D] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-[#1F2937] dark:text-[#F0F6FC] px-1">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-1 rounded-md hover:bg-white dark:hover:bg-[#21262D] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1 rounded-md hover:bg-white dark:hover:bg-[#21262D] transition-colors"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-0.5 font-mono text-[11px] rounded-md hover:bg-white dark:hover:bg-[#21262D] transition-colors"
            title="Tỷ lệ 100%"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded-md hover:bg-white dark:hover:bg-[#21262D] transition-colors"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas container with scroll */}
      <div className="relative flex-1 min-h-[460px] max-h-[680px] overflow-auto p-4 flex items-center justify-center bg-[#F3F4F6] dark:bg-[#0D1117]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-2xs">
            <Loader2 className="w-6 h-6 animate-spin text-[#2D5A4C] dark:text-[#6BAF9A]" />
          </div>
        )}
        <div className="shadow-md rounded-md bg-white overflow-hidden">
          <canvas ref={canvasRef} className="block max-w-full" />
        </div>
      </div>
    </div>
  );
}
