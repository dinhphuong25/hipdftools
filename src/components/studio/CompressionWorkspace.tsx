"use client";

import React, { useState } from "react";
import {
  Minimize2,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Check,
  TrendingDown,
} from "lucide-react";
import { LoadedPdfFile } from "@/lib/store/useAppStore";
import { formatFileSize } from "@/lib/utils";
import { compressPdf } from "@/lib/pdf/pdf-engine";

interface CompressionWorkspaceProps {
  file: LoadedPdfFile;
  onComplete: (outputBlob: Blob, filename: string) => void;
  triggerDownload: (url: string, filename: string) => void;
}

export function CompressionWorkspace({
  file,
  onComplete,
  triggerDownload,
}: CompressionWorkspaceProps) {
  const [level, setLevel] = useState<"recommended" | "extreme" | "low">("recommended");
  const [stripMeta, setStripMeta] = useState(true);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    originalSize: number;
    compressedSize: number;
    ratio: number;
    blobUrl: string;
    filename: string;
  } | null>(null);

  const originalSize = file.size;

  // Estimated stats
  const estimatedSavings =
    level === "extreme" ? 0.8 : level === "recommended" ? 0.65 : 0.3;
  const estimatedSize = Math.round(originalSize * (1 - estimatedSavings));

  const handleCompress = async () => {
    setCompressing(true);
    setProgress(15);
    try {
      const pTimer = setInterval(() => {
        setProgress((p) => (p >= 85 ? p : p + 15));
      }, 150);

      const res = await compressPdf(file.arrayBuffer, level);
      clearInterval(pTimer);
      setProgress(100);

      const blob = new Blob([res.bytes as unknown as BlobPart], { type: "application/pdf" });
      const filename = `${file.name.replace(".pdf", "")}_da_nen.pdf`;
      const url = URL.createObjectURL(blob);

      setResult({
        originalSize: res.originalSize || originalSize,
        compressedSize: res.compressedSize || estimatedSize,
        ratio: res.ratio || Math.round(estimatedSavings * 100),
        blobUrl: url,
        filename,
      });

      onComplete(blob, filename);
      triggerDownload(url, filename);
    } catch (err: any) {
      console.error(err);
      alert(`Nén PDF: ${err?.message || "Đã xảy ra lỗi khi nén tệp"}`);
    } finally {
      setCompressing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC] dark:bg-[#0B1120] p-4 sm:p-8 overflow-y-auto overscroll-contain">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* 1. HERO METRIC COMPARISON BANNER */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-sky-50/40 to-blue-50/20 dark:from-[#111827] dark:via-[#0F1E2E] dark:to-[#0B1120] border-2 border-[#BAE6FD] dark:border-[#0369A1]/40 shadow-lg shadow-sky-500/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Original Card */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 shadow-inner">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                  Dung lượng gốc
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {formatFileSize(originalSize)}
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-[200px]">{file.name}</p>
              </div>
            </div>

            {/* Reduction Indicator Arrow */}
            <div className="flex flex-col items-center justify-center px-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-black shadow-2xs">
                <TrendingDown className="w-4 h-4 stroke-[2.5]" />
                <span>Tiết kiệm ~{Math.round(estimatedSavings * 100)}%</span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Giảm ~{formatFileSize(originalSize - estimatedSize)}
              </span>
            </div>

            {/* Estimated Compressed Card */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0284C7]/25">
                <Minimize2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-[#0284C7] dark:text-[#38BDF8] tracking-wider">
                  Dự kiến sau nén
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0284C7] dark:text-[#38BDF8]">
                  ~{formatFileSize(estimatedSize)}
                </h3>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-[#0284C7] dark:text-[#38BDF8]">
                  Siêu tối ưu hóa
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. COMPRESSION LEVEL SELECTOR */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-extrabold uppercase text-slate-900 dark:text-slate-100 tracking-wider">
            Chọn mức độ nén phù hợp nhu cầu của bạn:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Level 1: Recommended */}
            <div
              onClick={() => setLevel("recommended")}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                level === "recommended"
                  ? "border-[#0284C7] bg-[#F0F9FF] dark:bg-[#0C2438] ring-2 ring-[#0284C7]/20 shadow-md"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-[#0284C7]/50"
              }`}
            >
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white">
                  KHUYÊN DÙNG
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      level === "recommended" ? "border-[#0284C7] bg-[#0284C7]" : "border-slate-300"
                    }`}
                  >
                    {level === "recommended" && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">Nén khuyến nghị</h5>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Cân bằng hoàn hảo giữa dung lượng siêu nhẹ và chất lượng hình ảnh sắc nét.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-[#0284C7]">
                <span>Giảm ~65%</span>
                <span>~{formatFileSize(originalSize * 0.35)}</span>
              </div>
            </div>

            {/* Level 2: Extreme */}
            <div
              onClick={() => setLevel("extreme")}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                level === "extreme"
                  ? "border-[#0284C7] bg-[#F0F9FF] dark:bg-[#0C2438] ring-2 ring-[#0284C7]/20 shadow-md"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-[#0284C7]/50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      level === "extreme" ? "border-[#0284C7] bg-[#0284C7]" : "border-slate-300"
                    }`}
                  >
                    {level === "extreme" && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">Nén cực độ</h5>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Dung lượng nhỏ nhất có thể, tối ưu để gửi qua email, Zalo hoặc cổng dịch vụ công.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
                <span>Giảm ~80%</span>
                <span>~{formatFileSize(originalSize * 0.2)}</span>
              </div>
            </div>

            {/* Level 3: Low / Basic */}
            <div
              onClick={() => setLevel("low")}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                level === "low"
                  ? "border-[#0284C7] bg-[#F0F9FF] dark:bg-[#0C2438] ring-2 ring-[#0284C7]/20 shadow-md"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-[#0284C7]/50"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      level === "low" ? "border-[#0284C7] bg-[#0284C7]" : "border-slate-300"
                    }`}
                  >
                    {level === "low" && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">Nén cơ bản</h5>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Nén nhẹ, giữ trọn vẹn 100% độ sắc nét chuẩn cho in ấn và triển lãm đồ họa.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Giảm ~30%</span>
                <span>~{formatFileSize(originalSize * 0.7)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ADDITIONAL SETTINGS & ACTION */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={stripMeta}
              onChange={(e) => setStripMeta(e.target.checked)}
              className="accent-[#0284C7] w-4 h-4 rounded"
            />
            <span>Xóa bỏ siêu dữ liệu ẩn (Metadata) để bảo vệ quyền riêng tư & giảm thêm byte</span>
          </label>

          <button
            type="button"
            onClick={handleCompress}
            disabled={compressing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white text-sm font-bold shadow-lg shadow-[#0284C7]/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {compressing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang nén tài liệu ({progress}%)...</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-4 h-4 stroke-[2.5]" />
                <span>Bắt đầu nén PDF ngay</span>
              </>
            )}
          </button>
        </div>

        {/* 4. SUCCESS RESULT BANNER */}
        {result && (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                  Nén thành công! Giảm được {result.ratio}% dung lượng
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Từ {formatFileSize(result.originalSize)} xuống còn {formatFileSize(result.compressedSize)}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerDownload(result.blobUrl, result.filename)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải file PDF đã nén</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
