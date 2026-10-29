"use client";

import React, { useState } from "react";
import { PdfViewer } from "./PdfViewer";
import { Download, Columns, CheckCircle2 } from "lucide-react";

interface DualPdfViewerProps {
  originalBuffer: ArrayBuffer | null;
  translatedBuffer: ArrayBuffer | null;
  totalPages?: number;
  downloadUrl?: string | null;
  downloadFilename?: string;
}

export function DualPdfViewer({
  originalBuffer,
  translatedBuffer,
  totalPages = 1,
  downloadUrl,
  downloadFilename = "hipdf_dich_giu_dinh_dang.pdf",
}: DualPdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileTab, setMobileTab] = useState<"original" | "translated">("translated");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & View Mode Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center justify-center">
            <Columns className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB]">
              Đối chiếu song ngữ (Giữ trọn vẹn bố cục)
            </h4>
            <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
              Bản gốc và bản dịch được đồng bộ chuyển trang tự động
            </p>
          </div>
        </div>

        {/* Mobile View Toggle Tabs (Visible only on small screens) */}
        <div className="flex md:hidden p-1 rounded-xl bg-[#F3F6F4] dark:bg-[#182620]">
          <button
            onClick={() => setMobileTab("original")}
            className={`flex-1 py-1 px-3 text-xs font-medium rounded-lg transition-colors ${
              mobileTab === "original"
                ? "bg-white dark:bg-[#161D1A] text-[#111827] dark:text-[#F9FAFB] shadow-2xs"
                : "text-[#6B7280] dark:text-[#9CA3AF]"
            }`}
          >
            Bản gốc
          </button>
          <button
            onClick={() => setMobileTab("translated")}
            className={`flex-1 py-1 px-3 text-xs font-medium rounded-lg transition-colors ${
              mobileTab === "translated"
                ? "bg-[#2D5A4C] text-white shadow-2xs"
                : "text-[#6B7280] dark:text-[#9CA3AF]"
            }`}
          >
            Bản dịch
          </button>
        </div>

        {/* Download result button */}
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={downloadFilename}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Tải bản dịch PDF</span>
          </a>
        )}
      </div>

      {/* Side-by-Side Dual View on Desktop / Tabbed on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Original Document */}
        <div className={mobileTab === "translated" ? "hidden md:block" : "block"}>
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">
              Tài liệu gốc
            </span>
            <span className="text-[11px] text-[#9CA3AF]">Trang {currentPage}</span>
          </div>
          <PdfViewer
            arrayBuffer={originalBuffer}
            totalPages={totalPages}
            initialPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Right: Translated Document */}
        <div className={mobileTab === "original" ? "hidden md:block" : "block"}>
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[#2D5A4C] dark:text-[#6BAF9A] uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bản dịch (Giữ bố cục)</span>
            </span>
            <span className="text-[11px] text-[#94A3B8]">Trang {currentPage}</span>
          </div>
          <PdfViewer
            arrayBuffer={translatedBuffer}
            totalPages={totalPages}
            initialPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
