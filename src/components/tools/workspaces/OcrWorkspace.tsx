"use client";

import React, { useState } from "react";
import { ScanText, Copy, Check, Download, Loader2, Languages } from "lucide-react";
import { ocrPdf } from "@/lib/pdf/pdf-engine";
import { LoadedPdfFile } from "@/lib/store/useAppStore";
import { PdfViewer } from "../../pdf/PdfViewer";

interface OcrWorkspaceProps {
  activeFile: LoadedPdfFile;
}

export function OcrWorkspace({ activeFile }: OcrWorkspaceProps) {
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRunOcr = async () => {
    setLoading(true);
    setProgress(5);
    setStatusMessage("Đang khởi động nhân OCR Tesseract WebAssembly...");

    try {
      const text = await ocrPdf(activeFile.arrayBuffer, (p, msg) => {
        setProgress(p);
        setStatusMessage(msg);
      });
      setOcrText(text);
    } catch (err) {
      console.error(err);
      alert("Xảy ra lỗi trong quá trình nhận dạng ký tự quang học.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!ocrText) return;
    navigator.clipboard.writeText(ocrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!ocrText) return;
    const blob = new Blob([ocrText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeFile.name.replace(".pdf", "")}_ocr.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: PDF Viewer */}
      <div className="lg:col-span-6 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">
            Tài liệu Scan: {activeFile.name}
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

      {/* Right Column: OCR Studio */}
      <div className="lg:col-span-6 space-y-4">
        <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
              <ScanText className="w-4 h-4 text-[#2D5A4C] dark:text-[#6BAF9A]" />
              <span>Nhận dạng ký tự quang học (OCR)</span>
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
              Chuyển đổi hình ảnh tài liệu scan thành văn bản có thể sao chép và tìm kiếm.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] text-xs text-[#2D5A4C] dark:text-[#6BAF9A] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" />
              <span>Hỗ trợ song ngữ Tiếng Việt & Tiếng Anh chuẩn Unicode</span>
            </div>
            <p className="text-[11px] opacity-80">
              Nhận dạng trực tiếp trong trình duyệt qua WebAssembly, đảm bảo bí mật tuyệt đối thông tin.
            </p>
          </div>

          {/* Progress bar during run */}
          {loading && (
            <div className="space-y-2 p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B]">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-[#2D5A4C] dark:text-[#6BAF9A]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{statusMessage}</span>
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E5E7EB] dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-[#2D5A4C] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {!ocrText && !loading && (
            <button
              type="button"
              onClick={handleRunOcr}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <ScanText className="w-4 h-4" />
              <span>Bắt đầu nhận dạng OCR ngay</span>
            </button>
          )}

          {/* OCR Result */}
          {ocrText && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB]">
                  Văn bản đã nhận dạng ({ocrText.length.toLocaleString()} ký tự):
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
                    <span>Tải về (.txt)</span>
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={ocrText}
                className="w-full h-80 p-3.5 rounded-2xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-mono text-[#111827] dark:text-[#F9FAFB] leading-relaxed resize-none focus:outline-none"
              />

              <button
                type="button"
                onClick={handleRunOcr}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-[#CFE2D7] dark:border-[#253A31] text-[#2D5A4C] dark:text-[#6BAF9A] text-xs font-semibold hover:bg-[#EAF3EE] transition-colors cursor-pointer"
              >
                Nhận dạng lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
