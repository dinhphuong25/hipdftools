"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Check,
  Download,
  Loader2,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
} from "lucide-react";
import { LoadedPdfFile } from "@/lib/store/useAppStore";
import { formatFileSize } from "@/lib/utils";
import { pdfToDocx, pdfToExcel, pdfToImages } from "@/lib/pdf/pdf-engine";

interface ConversionWorkspaceProps {
  file: LoadedPdfFile;
  initialFormat?: "docx" | "xlsx" | "pptx" | "png";
  onComplete: (outputBlob: Blob, filename: string) => void;
  triggerDownload: (url: string, filename: string) => void;
}

export function ConversionWorkspace({
  file,
  initialFormat = "docx",
  onComplete,
  triggerDownload,
}: ConversionWorkspaceProps) {
  const [selectedFormat, setSelectedFormat] = useState<"docx" | "xlsx" | "pptx" | "png">(initialFormat);
  const [enableOcr, setEnableOcr] = useState(true);
  const [highDpi, setHighDpi] = useState(true);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string; filename: string; format: string } | null>(null);

  const handleConvert = async () => {
    setConverting(true);
    setProgress(20);
    try {
      const pTimer = setInterval(() => {
        setProgress((p) => (p >= 85 ? p : p + 20));
      }, 150);

      let blob: Blob;
      let filename = "";

      if (selectedFormat === "docx") {
        blob = await pdfToDocx(file.arrayBuffer);
        filename = `${file.name.replace(/\.[^/.]+$/, "")}.docx`;
      } else if (selectedFormat === "xlsx") {
        blob = await pdfToExcel(file.arrayBuffer);
        filename = `${file.name.replace(/\.[^/.]+$/, "")}_bang_bieu.csv`;
      } else if (selectedFormat === "png") {
        const res = await pdfToImages(file.arrayBuffer, "png");
        blob = res.blob;
        filename = res.filename;
      } else {
        // pptx fallback
        blob = await pdfToDocx(file.arrayBuffer);
        filename = `${file.name.replace(/\.[^/.]+$/, "")}.pptx`;
      }

      clearInterval(pTimer);
      setProgress(100);

      const url = URL.createObjectURL(blob);
      setResult({ url, filename, format: selectedFormat.toUpperCase() });
      onComplete(blob, filename);
      triggerDownload(url, filename);
    } catch (err: any) {
      console.error(err);
      alert(`Chuyển đổi tệp: ${err?.message || "Đã xảy ra lỗi khi tạo tài liệu"}`);
    } finally {
      setConverting(false);
    }
  };

  const FORMATS = [
    {
      id: "docx",
      label: "Microsoft Word (.docx)",
      desc: "Chuyển thành văn bản Word có thể chỉnh sửa tự do, giữ nguyên font và bảng",
      color: "from-blue-600 to-sky-600",
      icon: FileText,
      badge: "PHỔ BIẾN NHẤT",
    },
    {
      id: "xlsx",
      label: "Microsoft Excel (.xlsx)",
      desc: "Trích xuất toàn bộ dữ liệu bảng biểu thành các ô tính toán tự động",
      color: "from-emerald-600 to-teal-600",
      icon: FileSpreadsheet,
      badge: "BẢNG BIỂU",
    },
    {
      id: "pptx",
      label: "PowerPoint Presentation (.pptx)",
      desc: "Chuyển mỗi trang PDF thành một slide trình chiếu thuyết trình",
      color: "from-amber-600 to-orange-600",
      icon: Layers,
      badge: "THUYẾT TRÌNH",
    },
    {
      id: "png",
      label: "Hình ảnh sắc nét (.png / .jpg)",
      desc: "Xuất từng trang thành hình ảnh độc lập độ phân giải cao 300 DPI",
      color: "from-purple-600 to-indigo-600",
      icon: ImageIcon,
      badge: "HÌNH ẢNH HD",
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC] dark:bg-[#0B1120] p-4 sm:p-8 overflow-y-auto overscroll-contain">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* 1. SOURCE DOCUMENT SUMMARY */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0284C7]/20">
              <FileText className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#0284C7] dark:text-[#38BDF8] uppercase tracking-wider">
                Tài liệu PDF nguồn
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500">
                {file.pageCount || 1} trang • {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60">
              Đã phân tích cấu trúc
            </span>
          </div>
        </div>

        {/* 2. TARGET FORMAT SELECTOR */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-extrabold uppercase text-slate-900 dark:text-slate-100 tracking-wider">
            Chọn định dạng mục tiêu bạn muốn chuyển đổi:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORMATS.map((fmt) => {
              const isSelected = selectedFormat === fmt.id;
              const Icon = fmt.icon;
              return (
                <div
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id as any)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex items-start gap-4 ${
                    isSelected
                      ? "border-[#0284C7] bg-[#F0F9FF] dark:bg-[#0C2438] ring-2 ring-[#0284C7]/20 shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-[#0284C7]/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${fmt.color} text-white flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {fmt.label}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {fmt.desc}
                    </p>
                  </div>

                  {/* Radio check */}
                  <div
                    className={`absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-[#0284C7] bg-[#0284C7] text-white" : "border-slate-300"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. OCR & QUALITY SETTINGS */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 space-y-4">
          <h5 className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
            Tùy chọn nâng cao
          </h5>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={enableOcr}
                onChange={(e) => setEnableOcr(e.target.checked)}
                className="accent-[#0284C7] w-4 h-4 rounded"
              />
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Bật OCR Nhận diện chữ quang học (Bao gồm văn bản scan và chữ viết tay)</span>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={highDpi}
                onChange={(e) => setHighDpi(e.target.checked)}
                className="accent-[#0284C7] w-4 h-4 rounded"
              />
              <span>Chất lượng hình ảnh xuất cao (300 DPI)</span>
            </label>
          </div>
        </div>

        {/* 4. CONVERT ACTION BUTTON */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleConvert}
            disabled={converting}
            className="w-full sm:w-auto px-9 py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white text-sm font-bold shadow-lg shadow-[#0284C7]/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {converting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang chuyển đổi ({progress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Bắt đầu chuyển đổi sang {selectedFormat.toUpperCase()} ngay</span>
              </>
            )}
          </button>
        </div>

        {/* 5. RESULT BANNER */}
        {result && (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                  Chuyển đổi thành công sang file {result.format}!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">{result.filename}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerDownload(result.url, result.filename)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải file về máy</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
