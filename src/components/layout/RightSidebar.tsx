"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  X,
  FileText,
  UploadCloud,
  Languages,
  Layers,
  Minimize2,
  Lightbulb,
  Lock,
  PanelRightClose,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { formatFileSize } from "@/lib/utils";
import { loadPdfDocInfo } from "@/lib/pdf/pdf-renderer";

interface RightSidebarProps {
  toolSlug?: string;
  toolName?: string;
  onExecute?: () => void;
  actionButtonLabel?: string;
  renderToolOptions?: () => React.ReactNode;
}

export function RightSidebar({
  toolName,
  onExecute,
  actionButtonLabel = "Bắt đầu xử lý",
  renderToolOptions,
}: RightSidebarProps) {
  const {
    rightSidebarOpen,
    setRightSidebarOpen,
    files,
    activeFileIndex,
    setActiveFileIndex,
    removeFile,
    addFiles,
    currentJob,
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [demoDismissed, setDemoDismissed] = React.useState(false);

  if (!rightSidebarOpen) {
    return null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    for (let i = 0; i < uploaded.length; i++) {
      const file = uploaded[i];
      try {
        const arrayBuffer = await file.arrayBuffer();
        const objectUrl = URL.createObjectURL(file);
        let pageCount = 1;
        let pageThumbnails: string[] = [];

        if (file.name.toLowerCase().endsWith(".pdf")) {
          try {
            const info = await loadPdfDocInfo(arrayBuffer);
            pageCount = info.numPages;
            pageThumbnails = info.pageThumbnails;
          } catch (err) {
            console.warn("Could not read pdf info", err);
          }
        }

        addFiles([
          {
            id: `file-${Date.now()}-${i}`,
            file,
            name: file.name,
            size: file.size,
            arrayBuffer,
            objectUrl,
            pageCount,
            pageThumbnails,
          },
        ]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <aside className="w-[280px] h-screen sticky top-0 right-0 z-20 flex flex-col justify-between bg-white dark:bg-[#111722] border-l border-[#E8EAED] dark:border-[#1E293B] transition-all select-none shrink-0 overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E8EAED] dark:border-[#24312B]">
          <h2 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
            Không gian làm việc
          </h2>
          <button
            onClick={() => setRightSidebarOpen(false)}
            className="p-1 rounded-md text-[#6B7280] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F3F6F4] dark:hover:bg-[#1A2420] transition-colors cursor-pointer"
            title="Đóng bảng làm việc"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-5">
          {/* Section: TỆP CỦA BẠN */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-[#94A3B8] dark:text-[#64748B] uppercase tracking-wider block">
              TỆP CỦA BẠN
            </span>

            {/* Dropzone Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-5 rounded-2xl border-2 border-dashed border-[#E8EAED] dark:border-[#24312B] bg-[#FAFAFC] dark:bg-[#161D1A] text-center space-y-2 cursor-pointer hover:border-[#2D5A4C] dark:hover:border-[#4E8A77] transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.xlsx,.pptx,.jpg,.png"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-9 h-9 rounded-full bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center justify-center mx-auto transition-transform group-hover:scale-105 shadow-2xs border border-[#CFE2D7] dark:border-[#253A31]">
                <UploadCloud className="w-5 h-5 stroke-[2.2]" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB]">
                  Kéo thả tài liệu
                </p>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                  hoặc chọn từ thiết bị
                </p>
              </div>

              <div>
                <button
                  type="button"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-[#111827] dark:text-[#F9FAFB] bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] shadow-2xs hover:bg-[#F3F6F4] transition-colors cursor-pointer"
                >
                  Chọn tệp
                </button>
              </div>

              <p className="text-[10px] text-[#9CA3AF] dark:text-[#6B7280] pt-0.5">
                PDF, Word, Excel, hình ảnh
              </p>
            </div>

            {/* Loaded Files List or Demo File matching reference screenshot */}
            {files.length > 0 ? (
              <div className="space-y-2 pt-1">
                {files.map((file, idx) => {
                  const isCurrent = idx === activeFileIndex;

                  return (
                    <div
                      key={file.id}
                      onClick={() => setActiveFileIndex(idx)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        isCurrent
                          ? "border-[#2D5A4C] dark:border-[#4E8A77] bg-[#EAF3EE]/60 dark:bg-[#182620] shadow-2xs"
                          : "border-[#E8EAED] dark:border-[#24312B] bg-white dark:bg-[#161D1A] hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-[#2D5A4C] dark:text-[#6BAF9A] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB] truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                            {file.pageCount ? `${file.pageCount} trang • ` : ""}
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="p-1 rounded-md text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Xóa tệp"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : !demoDismissed ? (
              <div className="space-y-2 pt-1">
                <div className="p-2.5 rounded-xl border border-[#E8EAED] dark:border-[#24312B] bg-white dark:bg-[#161D1A] flex items-center justify-between gap-2 transition-all">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-[#2D5A4C] dark:text-[#6BAF9A] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB] truncate">
                        Tai_lieu_nghien_cuu.pdf
                      </p>
                      <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                        12 trang · 2.4 MB
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDemoDismissed(true);
                    }}
                    className="p-1 rounded-md text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Xóa tệp"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Section: TRUY CẬP NHANH */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#6B7280] uppercase tracking-wider block">
              Truy cập nhanh
            </span>

            <div className="space-y-1.5">
              <Link
                href="/tools/translate-pdf"
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#E8EAED] dark:border-[#24312B] bg-white dark:bg-[#161D1A] hover:border-[#2D5A4C] hover:bg-[#EAF3EE]/40 dark:hover:bg-[#1E2824] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Languages className="w-4 h-4 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                  <span className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB]">
                    Dịch PDF
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/tools/merge-pdf"
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#E8EAED] dark:border-[#24312B] bg-white dark:bg-[#161D1A] hover:border-[#2D5A4C] hover:bg-[#EAF3EE]/40 dark:hover:bg-[#1E2824] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                  <span className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB]">
                    Ghép PDF
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/tools/compress-pdf"
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#E8EAED] dark:border-[#24312B] bg-white dark:bg-[#161D1A] hover:border-[#2D5A4C] hover:bg-[#EAF3EE]/40 dark:hover:bg-[#1E2824] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Minimize2 className="w-4 h-4 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                  <span className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB]">
                    Nén PDF
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Tool Options (if in dedicated tool workspace) */}
          {renderToolOptions && (
            <div className="pt-2 border-t border-[#E8EAED] dark:border-[#24312B]">
              <span className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#6B7280] uppercase tracking-wider block mb-2.5">
                Tùy chọn {toolName ? `• ${toolName}` : ""}
              </span>
              {renderToolOptions()}

              {onExecute && (
                <button
                  onClick={onExecute}
                  disabled={files.length === 0 || currentJob.status === "running"}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {currentJob.status === "running" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>{actionButtonLabel}</span>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Section: MẸO NHỎ Callout */}
          <div className="p-3.5 rounded-2xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] flex items-start gap-2.5 shadow-2xs">
            <Lightbulb className="w-4 h-4 text-[#2D5A4C] dark:text-[#6BAF9A] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A]">
                Mẹo nhỏ
              </h4>
              <p className="text-[11px] text-[#4B5563] dark:text-[#9CA3AF] leading-snug">
                Chọn một công cụ để bắt đầu xử lý tài liệu nhanh chóng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="p-4 border-t border-[#E8EAED] dark:border-[#24312B] text-center">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
          <Lock className="w-3.5 h-3.5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
          <span>Bạn kiểm soát tệp của mình</span>
        </div>
      </div>
    </aside>
  );
}
