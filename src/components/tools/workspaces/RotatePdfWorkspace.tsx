"use client";

import React, { useState } from "react";
import { RotateCw, RotateCcw, Download, CheckCircle2, Loader2 } from "lucide-react";
import { rotatePdf } from "@/lib/pdf/pdf-engine";
import { LoadedPdfFile } from "@/lib/store/useAppStore";

interface RotatePdfWorkspaceProps {
  activeFile: LoadedPdfFile;
}

export function RotatePdfWorkspace({ activeFile }: RotatePdfWorkspaceProps) {
  const totalPages = activeFile.pageCount || 1;
  // Per-page rotation state in degrees: 0, 90, 180, 270
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const getPageRotation = (pageNum: number) => rotations[pageNum] || 0;

  const handleRotatePage = (pageNum: number) => {
    setRotations((prev) => ({
      ...prev,
      [pageNum]: ((prev[pageNum] || 0) + 90) % 360,
    }));
  };

  const handleRotateAll = (deltaAngle: number) => {
    setRotations((prev) => {
      const updated: Record<number, number> = {};
      for (let i = 1; i <= totalPages; i++) {
        const cur = prev[i] || 0;
        updated[i] = (cur + deltaAngle + 360) % 360;
      }
      return updated;
    });
  };

  const handleReset = () => {
    setRotations({});
  };

  const hasRotations = Object.values(rotations).some((r) => r > 0);

  const handleExecuteRotate = async () => {
    setProcessing(true);
    try {
      // Find pages with same rotation or apply page-by-page
      // Usually users want to rotate all or specific pages
      // If all pages have the same angle:
      const firstAngle = getPageRotation(1);
      const allSame = Array.from({ length: totalPages }).every(
        (_, i) => getPageRotation(i + 1) === firstAngle
      );

      let bytes: Uint8Array;
      if (allSame && firstAngle > 0) {
        bytes = await rotatePdf(activeFile.arrayBuffer, firstAngle);
      } else {
        // Apply page-by-page
        let currentBuf = activeFile.arrayBuffer;
        for (let p = 1; p <= totalPages; p++) {
          const angle = getPageRotation(p);
          if (angle > 0) {
            bytes = await rotatePdf(currentBuf, angle, [p]);
            currentBuf = bytes.buffer as ArrayBuffer;
          }
        }
        bytes = new Uint8Array(currentBuf);
      }

      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);

      try {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeFile.name.replace(".pdf", "")}_xoay.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.warn("Auto-download prevented:", e);
      }
    } catch (err) {
      console.error("Error rotating PDF:", err);
      alert("Có lỗi xảy ra khi xoay trang PDF.");
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
                Đã xoay trang PDF thành công!
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-[#9CA3AF] mt-0.5">
                Các trang tài liệu đã được xoay theo đúng góc độ bạn chọn.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={resultUrl}
              download={`${activeFile.name.replace(".pdf", "")}_da_xoay.pdf`}
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
              Xoay hướng trang ({totalPages} trang)
            </h3>
            {hasRotations && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A]">
                Đã chỉnh góc xoay
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            Nhấp nút xoay trên từng trang hoặc xoay đồng loạt toàn bộ tài liệu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleRotateAll(90)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-semibold text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer"
            title="Xoay tất cả sang phải 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Xoay tất cả +90°</span>
          </button>

          <button
            type="button"
            onClick={() => handleRotateAll(-90)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-semibold text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer"
            title="Xoay tất cả sang trái 90°"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xoay -90°</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={!hasRotations}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-semibold text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer disabled:opacity-40"
          >
            <span>Đặt lại</span>
          </button>

          <button
            type="button"
            onClick={handleExecuteRotate}
            disabled={processing}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {processing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCw className="w-3.5 h-3.5" />
            )}
            <span>{processing ? "Đang xử lý..." : "Lưu & Xuất PDF"}</span>
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-6 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const thumbnail = activeFile.pageThumbnails?.[idx];
            const rot = getPageRotation(pageNum);

            return (
              <div
                key={`rotate-page-${pageNum}`}
                className="group relative flex flex-col justify-between p-2.5 rounded-2xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] hover:border-[#2D5A4C] transition-all hover:shadow-xs"
              >
                {/* Header: Page number and rotation angle */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[11px] font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Trang {pageNum}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      rot > 0
                        ? "bg-[#2D5A4C] text-white font-bold"
                        : "bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] text-[#6B7280]"
                    }`}
                  >
                    {rot}°
                  </span>
                </div>

                {/* Thumbnail Preview with CSS Rotation */}
                <div className="w-full aspect-3/4 rounded-xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] overflow-hidden flex items-center justify-center shadow-2xs p-2">
                  <div
                    className="w-full h-full flex items-center justify-center transition-transform duration-200"
                    style={{ transform: `rotate(${rot}deg)` }}
                  >
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnail}
                        alt={`Trang ${pageNum}`}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <div className="text-xs font-bold text-[#6B7280]">Trang {pageNum}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Per-page Rotate Button */}
                <div className="mt-2.5 pt-2 border-t border-[#E8EAED] dark:border-[#24312B]">
                  <button
                    type="button"
                    onClick={() => handleRotatePage(pageNum)}
                    className="w-full py-1.5 px-2 rounded-xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] text-xs font-semibold text-[#2D5A4C] dark:text-[#6BAF9A] hover:bg-[#EAF3EE] dark:hover:bg-[#182620] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Xoay +90°</span>
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
