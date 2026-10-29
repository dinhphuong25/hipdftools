"use client";

import React, { useState } from "react";
import { BookOpen, Copy, Check, Download, Loader2 } from "lucide-react";
import { aiSummarizePdf } from "@/lib/pdf/pdf-engine";
import { LoadedPdfFile } from "@/lib/store/useAppStore";
import { PdfViewer } from "../../pdf/PdfViewer";

interface AiSummaryWorkspaceProps {
  activeFile: LoadedPdfFile;
}

export function AiSummaryWorkspace({ activeFile }: AiSummaryWorkspaceProps) {
  const [summaryType, setSummaryType] = useState<"executive" | "key_points" | "faq">("executive");
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const result = await aiSummarizePdf(activeFile.arrayBuffer);
      setSummaryResult(result);
    } catch (err) {
      console.error(err);
      alert("Xảy ra lỗi khi tóm tắt tài liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryResult) return;
    navigator.clipboard.writeText(summaryResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!summaryResult) return;
    const blob = new Blob([summaryResult], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeFile.name.replace(".pdf", "")}_tom_tat.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: PDF Viewer */}
      <div className="lg:col-span-6 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">
            Tài liệu nguồn: {activeFile.name}
          </span>
          <span className="text-xs text-[#9CA3AF]">{activeFile.pageCount || 1} trang</span>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-4 shadow-2xs">
          <PdfViewer
            arrayBuffer={activeFile.arrayBuffer}
            totalPages={activeFile.pageCount || 1}
          />
        </div>
      </div>

      {/* Right Column: AI Summary Studio */}
      <div className="lg:col-span-6 space-y-4">
        <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2D5A4C] dark:text-[#6BAF9A]" />
              <span>Tóm tắt văn bản thông minh</span>
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
              Tự động trích xuất các ý chính, số liệu và kết luận quan trọng nhất.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "executive", label: "Tóm tắt điều hành", desc: "Tổng quan & kết luận" },
              { id: "key_points", label: "Luận điểm chính", desc: "Bullet points chi tiết" },
              { id: "faq", label: "Hỏi đáp ôn tập", desc: "Câu hỏi trắc nghiệm" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSummaryType(item.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  summaryType === item.id
                    ? "border-[#2D5A4C] bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A]"
                    : "border-[#E8EAED] dark:border-[#24312B] text-[#4B5563] dark:text-[#9CA3AF] hover:border-[#2D5A4C]/40"
                }`}
              >
                <div className="text-xs font-bold leading-tight">{item.label}</div>
                <div className="text-[10px] opacity-75 mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>

          {/* Summarize Action Button */}
          {!summaryResult && (
            <button
              type="button"
              onClick={handleSummarize}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <BookOpen className="w-4 h-4" />
              )}
              <span>{loading ? "Đang phân tích và tóm tắt..." : "Bắt đầu tóm tắt ngay"}</span>
            </button>
          )}

          {/* Result Card */}
          {summaryResult && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB]">
                  Kết quả tóm tắt:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-semibold text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Đã sao chép" : "Sao chép"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2D5A4C] text-white text-xs font-semibold hover:bg-[#23473C] cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về (.md)</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] max-h-[380px] overflow-y-auto text-xs leading-relaxed text-[#111827] dark:text-[#F9FAFB] whitespace-pre-wrap font-sans">
                {summaryResult}
              </div>

              <button
                type="button"
                onClick={handleSummarize}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-[#CFE2D7] dark:border-[#253A31] text-[#2D5A4C] dark:text-[#6BAF9A] text-xs font-semibold hover:bg-[#EAF3EE] transition-colors cursor-pointer"
              >
                {loading ? "Đang tóm tắt lại..." : "Tóm tắt lại theo phong cách khác"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
