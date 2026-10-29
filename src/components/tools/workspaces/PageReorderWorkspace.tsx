"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, ArrowUpDown, Download, CheckCircle2, Loader2 } from "lucide-react";
import { reorderPdfPages } from "@/lib/pdf/pdf-engine";
import { LoadedPdfFile } from "@/lib/store/useAppStore";

interface PageReorderWorkspaceProps {
  activeFile: LoadedPdfFile;
}

export function PageReorderWorkspace({ activeFile }: PageReorderWorkspaceProps) {
  const totalPages = activeFile.pageCount || 1;
  const initialOrder = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [order, setOrder] = useState<number[]>(initialOrder);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  useEffect(() => {
    setOrder(Array.from({ length: activeFile.pageCount || 1 }, (_, i) => i + 1));
    setResultUrl(null);
  }, [activeFile]);

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= order.length) return;
    setOrder((prev) => {
      const updated = [...prev];
      const [item] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, item);
      return updated;
    });
  };

  const handleReverse = () => {
    setOrder((prev) => [...prev].reverse());
  };

  const handleReset = () => {
    setOrder(initialOrder);
  };

  const isOrderChanged = JSON.stringify(order) !== JSON.stringify(initialOrder);

  const handleExecuteReorder = async () => {
    setProcessing(true);
    try {
      const bytes = await reorderPdfPages(activeFile.arrayBuffer, order);
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("Error reordering pages:", err);
      alert("Có lỗi xảy ra khi sắp xếp lại trang PDF.");
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
                Đã sắp xếp lại thứ tự trang thành công!
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-[#9CA3AF] mt-0.5">
                Tài liệu mới đã sẵn sàng tải về với {totalPages} trang theo thứ tự bạn vừa chọn.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={resultUrl}
              download={`${activeFile.name.replace(".pdf", "")}_da_sap_xep.pdf`}
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
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
              Sắp xếp thứ tự các trang ({totalPages} trang)
            </h3>
            {isOrderChanged && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200">
                Đã đổi thứ tự
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            Dùng các nút mũi tên trái/phải trên từng trang để đổi vị trí hiển thị.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReverse}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-semibold text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Đảo ngược</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={!isOrderChanged}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-semibold text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>

          <button
            type="button"
            onClick={handleExecuteReorder}
            disabled={processing}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {processing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>{processing ? "Đang xử lý..." : "Lưu thứ tự mới"}</span>
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-6 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {order.map((origPageNum, currentIdx) => {
            const thumbnail = activeFile.pageThumbnails?.[origPageNum - 1];

            return (
              <div
                key={`page-slot-${currentIdx}-${origPageNum}`}
                className="group relative flex flex-col justify-between p-2.5 rounded-2xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] hover:border-[#2D5A4C] transition-all hover:shadow-xs"
              >
                {/* Header: Current Position and Original Page Number */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] font-bold text-[#2D5A4C] dark:text-[#6BAF9A]">
                    Vị trí #{currentIdx + 1}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] font-mono text-[#6B7280]">
                    Trang {origPageNum}
                  </span>
                </div>

                {/* Thumbnail Preview */}
                <div className="w-full aspect-3/4 rounded-xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] overflow-hidden flex items-center justify-center shadow-2xs">
                  {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnail}
                      alt={`Trang ${origPageNum}`}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <div className="text-xs font-bold text-[#6B7280]">Trang {origPageNum}</div>
                      <div className="text-[9px] text-[#9CA3AF] mt-1">PDF Gốc</div>
                    </div>
                  )}
                </div>

                {/* Move Controls */}
                <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-[#E8EAED] dark:border-[#24312B]">
                  <button
                    type="button"
                    disabled={currentIdx === 0}
                    onClick={() => handleMove(currentIdx, currentIdx - 1)}
                    className="flex-1 py-1 px-1.5 rounded-lg bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] hover:border-[#2D5A4C] disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-colors"
                    title="Chuyển sang trái"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={currentIdx === order.length - 1}
                    onClick={() => handleMove(currentIdx, currentIdx + 1)}
                    className="flex-1 py-1 px-1.5 rounded-lg bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] hover:border-[#2D5A4C] disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center cursor-pointer transition-colors"
                    title="Chuyển sang phải"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
