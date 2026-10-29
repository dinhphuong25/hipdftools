"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { ToolItem } from "@/lib/tools-registry";
import { ToolIllustration } from "../ui/ToolIllustration";
import { useAppStore } from "@/lib/store/useAppStore";
import { loadPdfDocInfo } from "@/lib/pdf/pdf-renderer";
import { TOOL_TRANSLATIONS_EN } from "@/lib/i18n/translations";

interface ToolUploadPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: ToolItem | null;
  onFileReady: (toolSlug: string) => void;
}

export function ToolUploadPromptModal({
  isOpen,
  onClose,
  tool,
  onFileReady,
}: ToolUploadPromptModalProps) {
  const { addFiles, language } = useAppStore();
  const isVi = language === "vi";

  const [isProcessing, setIsProcessing] = useState(false);

  // Lock outer scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const prevHtml = document.documentElement.style.overflow;
      const prevBody = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.documentElement.style.overflow = prevHtml;
        document.body.style.overflow = prevBody;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Clean, fast, direct file processing
  const handleFiles = useCallback(
    async (fileList: File[]) => {
      if (!fileList || fileList.length === 0 || !tool) return;
      const file = fileList[0];

      setIsProcessing(true);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const objectUrl = URL.createObjectURL(file);
        let pageCount = 1;
        let pageThumbnails: string[] = [];

        if (
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf")
        ) {
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
            id: `prompt-file-${Date.now()}-0`,
            file,
            name: file.name,
            size: file.size,
            arrayBuffer,
            objectUrl,
            pageCount,
            pageThumbnails,
          },
        ]);

        setIsProcessing(false);
        onClose();
        onFileReady(tool.slug);
      } catch (err) {
        console.error("Error processing file in prompt modal:", err);
        setIsProcessing(false);
      }
    },
    [tool, addFiles, onClose, onFileReady]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleFiles,
    noClick: false,
    noKeyboard: false,
    multiple: tool?.multiple || false,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  if (!isOpen || !tool) return null;

  const enInfo = TOOL_TRANSLATIONS_EN[tool.slug];
  const toolName = isVi ? tool.name : (enInfo?.name || tool.name);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[440px] bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800 text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
              <ToolIllustration slug={tool.slug} className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                {toolName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {isVi ? "Tải lên tệp PDF để bắt đầu" : "Upload a PDF to get started"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title={isVi ? "Đóng" : "Close"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Clean, focused, human upload area */}
        <div className="p-5">
          <div
            {...getRootProps()}
            className={`rounded-xl border-2 border-dashed p-7 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragActive
                ? "border-[#0284C7] dark:border-[#38BDF8] bg-sky-50/60 dark:bg-sky-950/30 scale-[1.01]"
                : "border-slate-200 dark:border-slate-800 hover:border-[#0284C7] dark:hover:border-[#38BDF8] bg-slate-50/50 dark:bg-slate-900/40"
            }`}
          >
            <input {...getInputProps()} />

            {isProcessing ? (
              <div className="py-6 flex flex-col items-center gap-2.5">
                <Loader2 className="w-7 h-7 animate-spin text-[#0284C7] dark:text-[#38BDF8]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isVi ? "Đang chuẩn bị tệp tin..." : "Preparing document..."}
                </span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#0284C7] dark:text-[#38BDF8] shadow-xs mb-3.5">
                  <UploadCloud className="w-6 h-6 stroke-[1.8]" />
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {isDragActive
                    ? (isVi ? "Thả tệp PDF tại đây..." : "Drop PDF file here...")
                    : (isVi ? "Kéo & thả tệp PDF vào đây" : "Drag & drop PDF here")}
                </p>

                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-4">
                  {isVi ? "hoặc nhấn để duyệt tệp từ thiết bị" : "or click to browse from device"}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    open();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  {isVi ? "Chọn tệp PDF" : "Browse PDF file"}
                </button>

                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 font-medium">
                  {tool.multiple
                    ? (isVi ? "Hỗ trợ nhiều tệp • Tối đa 50MB" : "Multiple files supported • Up to 50MB")
                    : (isVi ? "Tệp .pdf • Tối đa 50MB" : ".pdf files • Up to 50MB")}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
