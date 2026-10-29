"use client";

import React, { useState } from "react";
import { Trash2, FileOutput, Check, Download, CheckCircle2, Loader2 } from "lucide-react";
import { extractOrDeletePages } from "@/lib/pdf/pdf-engine";
import { LoadedPdfFile } from "@/lib/store/useAppStore";

interface ExtractDeleteWorkspaceProps {
  activeFile: LoadedPdfFile;
}

export function ExtractDeleteWorkspace({ activeFile }: ExtractDeleteWorkspaceProps) {
  const totalPages = activeFile.pageCount || 1;
  const [mode, setMode] = useState<"delete" | "extract">("delete");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const togglePage = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum]
    );
  };

  const handleSelectAll = () => {
    setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  };

  const handleDeselectAll = () => {
    setSelectedPages([]);
  };

  const handleSelectEven = () => {
    setSelectedPages(
      Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 === 0)
    );
  };

  const handleSelectOdd = () => {
    setSelectedPages(
      Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 !== 0)
    );
  };

  const handleExecute = async () => {
    if (selectedPages.length === 0) {
      alert("Vui lòng chọn ít nhất một trang.");
      return;
    }

    setProcessing(true);
    try {
      let keepPages: number[];
      if (mode === "delete") {
        keepPages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
          (p) => !selectedPages.includes(p)
        );
      } else {
        keepPages = [...selectedPages].sort((a, b) => a - b);
      }

      if (keepPages.length === 0) {
        alert("Bạn không thể xóa hết toàn bộ các trang trong tài liệu.");
        setProcessing(false);
        return;
      }

      const bytes = await extractOrDeletePages(activeFile.arrayBuffer, keepPages);
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);

      try {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeFile.name.replace(".pdf", "")}_${mode === "delete" ? "da_xoa_trang" : "trich_xuat"}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.warn("Auto-download prevented:", e);
      }
    } catch (err) {
      console.error("Error processing pages:", err);
      alert("Có lỗi xảy ra khi xử lý trang PDF.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Succeeded Result Card with Download */}
      {resultUrl && (
        <div className="p-6 rounded-3xl bg-[#EAF3EE] dark:bg-[#182620] border-2 border-[#2D5A4C]/60 dark:border-[#4E8A77] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2D5A4C] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827] dark:text-[#F9FAFB]">
                {mode === "delete" ? "Đã xóa trang thừa thành công!" : "Đã trích xuất trang thành công!"}
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-[#9CA3AF] mt-0.5">
                Tài liệu PDF mới đã được tạo và sẵn sàng tải về.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={resultUrl}
              download={`${activeFile.name.replace(".pdf", "")}_${mode === "delete" ? "da_xoa_trang" : "trich_xuat"}.pdf`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải tệp PDF về máy</span>
            </a>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("delete");
              setSelectedPages([]);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === "delete"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-[#F8F9FA] dark:bg-[#111722] text-[#4B5563] dark:text-[#9CA3AF] border border-[#E8EAED] dark:border-[#24312B]"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa các trang đã chọn</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("extract");
              setSelectedPages([]);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === "extract"
                ? "bg-[#2D5A4C] text-white shadow-xs"
                : "bg-[#F8F9FA] dark:bg-[#111722] text-[#4B5563] dark:text-[#9CA3AF] border border-[#E8EAED] dark:border-[#24312B]"
            }`}
          >
            <FileOutput className="w-3.5 h-3.5" />
            <span>Trích xuất trang đã chọn</span>
          </button>
        </div>

        {/* Quick Filter Buttons & Execute */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSelectEven}
            className="px-2.5 py-1.5 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-medium text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
          >
            Trang chẵn
          </button>
          <button
            type="button"
            onClick={handleSelectOdd}
            className="px-2.5 py-1.5 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-medium text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
          >
            Trang lẻ
          </button>
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-2.5 py-1.5 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-medium text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
          >
            Chọn tất cả
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            disabled={selectedPages.length === 0}
            className="px-2.5 py-1.5 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-medium text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] cursor-pointer disabled:opacity-40"
          >
            Bỏ chọn
          </button>

          <button
            type="button"
            onClick={handleExecute}
            disabled={processing || selectedPages.length === 0}
            className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 ${
              mode === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-[#2D5A4C] hover:bg-[#23473C]"
            }`}
          >
            {processing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : mode === "delete" ? (
              <Trash2 className="w-3.5 h-3.5" />
            ) : (
              <FileOutput className="w-3.5 h-3.5" />
            )}
            <span>
              {processing
                ? "Đang xử lý..."
                : mode === "delete"
                ? `Xóa ${selectedPages.length} trang`
                : `Trích xuất ${selectedPages.length} trang`}
            </span>
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-6 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const thumbnail = activeFile.pageThumbnails?.[idx];
            const isSelected = selectedPages.includes(pageNum);

            return (
              <div
                key={`page-select-${pageNum}`}
                onClick={() => togglePage(pageNum)}
                className={`group relative flex flex-col justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? mode === "delete"
                      ? "bg-red-50/60 dark:bg-red-950/20 border-red-500 ring-2 ring-red-500/20"
                      : "bg-[#EAF3EE] dark:bg-[#182620] border-[#2D5A4C] ring-2 ring-[#2D5A4C]/20"
                    : "bg-[#F8F9FA] dark:bg-[#111722] border-[#E8EAED] dark:border-[#24312B] hover:border-[#2D5A4C]/50"
                }`}
              >
                {/* Header: Page number & checkbox */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Trang {pageNum}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                      isSelected
                        ? mode === "delete"
                          ? "bg-red-600 border-red-600 text-white"
                          : "bg-[#2D5A4C] border-[#2D5A4C] text-white"
                        : "bg-white dark:bg-[#161D1A] border-[#D1D5DB] dark:border-[#374151]"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Thumbnail Preview */}
                <div className="w-full aspect-3/4 rounded-xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] overflow-hidden flex items-center justify-center shadow-2xs relative">
                  {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnail}
                      alt={`Trang ${pageNum}`}
                      className={`w-full h-full object-contain pointer-events-none transition-opacity ${
                        isSelected && mode === "delete" ? "opacity-35" : "opacity-100"
                      }`}
                    />
                  ) : (
                    <div className="text-center p-2">
                      <div className="text-xs font-bold text-[#6B7280]">Trang {pageNum}</div>
                    </div>
                  )}

                  {/* Strikethrough if marked for deletion */}
                  {isSelected && mode === "delete" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-950/20">
                      <span className="px-2 py-1 rounded-md bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Sẽ xóa
                      </span>
                    </div>
                  )}
                  {isSelected && mode === "extract" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#2D5A4C]/15">
                      <span className="px-2 py-1 rounded-md bg-[#2D5A4C] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        Đã chọn
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                    {isSelected
                      ? mode === "delete"
                        ? "Đã đánh dấu xóa"
                        : "Đã chọn trích xuất"
                      : "Nhấp để chọn"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
