"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PdfDropzone } from "../tools/PdfDropzone";
import { PdfViewer } from "../pdf/PdfViewer";
import { DualPdfViewer } from "../pdf/DualPdfViewer";
import { TranslationOptions } from "./TranslationOptions";
import { useAppStore } from "@/lib/store/useAppStore";
import { executeLayoutPreservingTranslation } from "@/lib/pdf/layout-translator";
import { formatFileSize } from "@/lib/utils";
import {
  Languages,
  Loader2,
  RotateCcw,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Settings2,
  Trash2,
  Download,
} from "lucide-react";

export function TranslationWorkspace() {
  const {
    files,
    activeFileIndex,
    translationConfig,
    currentJob,
    setJobState,
    resetJob,
    clearFiles,
  } = useAppStore();

  const [translatedBuffer, setTranslatedBuffer] = useState<ArrayBuffer | null>(null);
  const [translatedDownloadUrl, setTranslatedDownloadUrl] = useState<string | null>(null);

  const activeFile = files[activeFileIndex] || files[0];

  const handleStartTranslation = async () => {
    if (!activeFile) return;

    try {
      setJobState({
        status: "running",
        progress: 10,
        message: "Khởi động Semantic Layout Engine & đo đạc Bounding Box...",
        error: null,
      });

      const result = await executeLayoutPreservingTranslation(
        activeFile.arrayBuffer,
        translationConfig,
        (progress, message) => {
          setJobState({ progress, message });
        }
      );

      // Create download blob
      const blob = new Blob([result.pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const downloadName =
        activeFile.name.replace(/\.pdf$/i, "") +
        `_${translationConfig.targetLang}_dich_chuan_bo_cuc.pdf`;

      setTranslatedBuffer(result.pdfBytes.buffer as ArrayBuffer);
      setTranslatedDownloadUrl(url);

      setJobState({
        status: "succeeded",
        progress: 100,
        message: `Đã dịch hoàn tất ${result.translatedBlocksCount} khối văn bản trên ${result.totalPages} trang!`,
        resultBlob: blob,
        resultUrl: url,
        resultFilename: downloadName,
      });
    } catch (err: any) {
      console.error("Translation execution error:", err);
      setJobState({
        status: "failed",
        progress: 0,
        message: "Xảy ra lỗi trong quá trình dịch",
        error: err?.message || "Không thể dịch tài liệu này",
      });
    }
  };

  const handleReset = () => {
    if (translatedDownloadUrl) URL.revokeObjectURL(translatedDownloadUrl);
    setTranslatedBuffer(null);
    setTranslatedDownloadUrl(null);
    resetJob();
  };

  return (
    <div className="space-y-10">
      {/* 1. Breadcrumbs & Showcase Header */}
      <div className="space-y-4">
        <nav className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#2D5A4C] dark:hover:text-[#6BAF9A] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#2D5A4C] dark:hover:text-[#6BAF9A] transition-colors">
            Tất cả công cụ
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111827] dark:text-[#F9FAFB]">
            Dịch PDF giữ nguyên định dạng
          </span>
        </nav>

        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center justify-center shrink-0 shadow-2xs">
                <Languages className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
                    Dịch PDF giữ nguyên định dạng
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] border border-[#CFE2D7] dark:border-[#253A31]">
                    Công nghệ trọng tâm
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF] max-w-2xl leading-relaxed">
                  Tự động nhận diện tọa độ khối chữ, phân cụm ngữ nghĩa, thay thế văn bản tiếng Việt
                  ngay tại khung gốc với font Unicode chuẩn xác. Bảo toàn 100% hình ảnh và bảng biểu.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                    <span>Zero Data Retention</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                    <span>Đo đạc pixel chuẩn xác</span>
                  </span>
                  <span>•</span>
                  <span>Nhúng font tiếng Việt đầy đủ dấu</span>
                </div>
              </div>
            </div>

            {activeFile && !translatedBuffer && (
              <button
                type="button"
                onClick={handleStartTranslation}
                disabled={currentJob.status === "running"}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0 self-start md:self-center"
              >
                {currentJob.status === "running" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Languages className="w-4 h-4" />
                )}
                <span>
                  {currentJob.status === "running" ? "Đang dịch tài liệu..." : "Bắt đầu dịch ngay"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Workspace Body */}
      {!activeFile ? (
        // Empty Dropzone
        <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-6 sm:p-10 shadow-sm">
          <PdfDropzone
            label="Kéo thả tài liệu PDF cần dịch vào đây"
            sublabel="Hỗ trợ tài liệu học thuật, báo cáo, bài thuyết trình đến 50MB"
            showSampleButton={true}
          />
        </div>
      ) : translatedBuffer ? (
        // Result State: Dual side-by-side view
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#EAF3EE] dark:bg-[#182620] border-2 border-[#2D5A4C]/60 dark:border-[#4E8A77] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D5A4C] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#111827] dark:text-[#F9FAFB]">
                  Bản dịch hoàn tất — Đối chiếu song ngữ chuẩn bố cục
                </h3>
                <p className="text-xs text-[#4B5563] dark:text-[#9CA3AF]">
                  {currentJob.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {translatedDownloadUrl && (
                <a
                  href={translatedDownloadUrl}
                  download={currentJob.resultFilename || "hipdf_dich_giu_dinh_dang.pdf"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải bản dịch (.pdf)</span>
                </a>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6B7280] hover:text-[#111827] bg-white dark:bg-[#161D1A] border border-[#CFE2D7] dark:border-[#253A31] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Dịch tài liệu khác</span>
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-4 sm:p-6 shadow-2xs">
            <DualPdfViewer
              originalBuffer={activeFile.arrayBuffer}
              translatedBuffer={translatedBuffer}
              totalPages={activeFile.pageCount || 1}
              downloadUrl={translatedDownloadUrl}
              downloadFilename={currentJob.resultFilename || "hipdf_dich_giu_dinh_dang.pdf"}
            />
          </div>
        </div>
      ) : (
        // Pre-translation State with 2-Column: Viewer (65%) + Options Card (35%)
        <div className="space-y-6">
          {/* File bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#161D1A] text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center justify-center shadow-2xs font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] truncate max-w-md">
                  {activeFile.name}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  {activeFile.pageCount} trang • {formatFileSize(activeFile.size)} • Sẵn sàng dịch
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                clearFiles();
                resetJob();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Đổi tệp khác</span>
            </button>
          </div>

          {/* Running Progress Banner */}
          {currentJob.status === "running" && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#161D1A] border border-[#CFE2D7] dark:border-[#253A31] shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-[#2D5A4C] dark:text-[#6BAF9A]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{currentJob.message}</span>
                </span>
                <span>{currentJob.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E5E7EB] dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-[#2D5A4C] rounded-full transition-all duration-300"
                  style={{ width: `${currentJob.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* 2-Column: Viewer + Translation Options */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">
                  Xem trước bản gốc
                </span>
                <span className="text-xs text-[#9CA3AF]">
                  {activeFile.pageCount} trang
                </span>
              </div>
              <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-4 shadow-2xs">
                <PdfViewer
                  arrayBuffer={activeFile.arrayBuffer}
                  totalPages={activeFile.pageCount || 1}
                />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E8EAED] dark:border-[#24312B]">
                  <Settings2 className="w-4 h-4 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                  <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Thiết lập dịch thuật
                  </h3>
                </div>

                {/* Built-in Translation Options */}
                <TranslationOptions />

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStartTranslation}
                    disabled={currentJob.status === "running"}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {currentJob.status === "running" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Languages className="w-4 h-4" />
                    )}
                    <span>
                      {currentJob.status === "running" ? "Đang dịch..." : "Bắt đầu dịch giữ bố cục"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Step-by-Step Visual Guide */}
      <section className="pt-6 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-[#F9FAFB]">
            Quy trình dịch tài liệu bảo toàn bố cục
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            Ứng dụng công nghệ xử lý tọa độ tự động khớp khung không làm xô lệch trang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] shadow-2xs space-y-2">
            <span className="w-7 h-7 rounded-lg bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
              Tải tài liệu PDF
            </h4>
            <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              Tải lên tài liệu tiếng Anh hoặc ngôn ngữ bất kỳ. Hệ thống tự động phân tích tọa độ từng khối văn bản.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] shadow-2xs space-y-2">
            <span className="w-7 h-7 rounded-lg bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
              Chọn ngôn ngữ & Chế độ
            </h4>
            <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              Chọn ngôn ngữ đích (tiếng Việt), chế độ giữ bố cục gốc hoặc đối chiếu song ngữ hai cột.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] shadow-2xs space-y-2">
            <span className="w-7 h-7 rounded-lg bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
              Đối chiếu & Tải về
            </h4>
            <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              Kiểm tra trang dịch với tính năng cuộn đồng bộ và tải tệp PDF đã dịch về máy tính.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
