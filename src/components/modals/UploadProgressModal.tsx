"use client";

import React from "react";
import { FileText, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { formatFileSize } from "@/lib/utils";

interface UploadProgressModalProps {
  isOpen: boolean;
  fileName?: string;
  fileSize?: number;
  progress: number;
}

export function UploadProgressModal({
  isOpen,
  fileName,
  fileSize,
  progress,
}: UploadProgressModalProps) {
  const { language } = useAppStore();
  const isVi = language === "vi";

  if (!isOpen) return null;

  const isComplete = progress >= 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Title */}
        <h3 className="text-base font-bold text-center text-slate-900 dark:text-slate-100">
          {isComplete
            ? (isVi ? "Tải lên hoàn tất" : "Upload Complete")
            : (isVi ? "Đang xử lý tệp..." : "Processing file...")}
        </h3>

        {/* File name & size */}
        {fileName && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 mb-4 truncate max-w-xs mx-auto">
            <FileText className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8] shrink-0" />
            <span className="truncate">{fileName}</span>
            {fileSize ? <span>• {formatFileSize(fileSize)}</span> : null}
          </div>
        )}

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 p-0.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-200 ease-out ${
              isComplete
                ? "bg-emerald-500"
                : "bg-[#0284C7] dark:bg-[#38BDF8]"
            }`}
            style={{ width: `${Math.min(100, Math.max(6, progress))}%` }}
          />
        </div>

        {/* Percentage text */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium mt-2">
          <span>{isVi ? "Tiến trình" : "Progress"}</span>
          <div className="flex items-center gap-1">
            {isComplete && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
