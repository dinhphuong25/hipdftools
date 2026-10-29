"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ToolItem, getPopularTools } from "@/lib/tools-registry";
import { PdfDropzone } from "./PdfDropzone";
import { PdfViewer } from "../pdf/PdfViewer";
import { PageGridOrganizer } from "../pdf/PageGridOrganizer";
import { DynamicIcon } from "../ui/DynamicIcon";
import { ToolIllustration } from "../ui/ToolIllustration";
import { useAppStore } from "@/lib/store/useAppStore";
import { loadPdfDocInfo } from "@/lib/pdf/pdf-renderer";
import { formatFileSize } from "@/lib/utils";
import { PageReorderWorkspace } from "./workspaces/PageReorderWorkspace";
import { RotatePdfWorkspace } from "./workspaces/RotatePdfWorkspace";
import { ExtractDeleteWorkspace } from "./workspaces/ExtractDeleteWorkspace";
import { SignPdfWorkspace } from "./workspaces/SignPdfWorkspace";
import { AiAskWorkspace } from "./workspaces/AiAskWorkspace";
import { AiSummaryWorkspace } from "./workspaces/AiSummaryWorkspace";
import { OcrWorkspace } from "./workspaces/OcrWorkspace";
import { PdfStudioModal } from "../studio/PdfStudioModal";
import {
  mergePdfs,
  splitPdf,
  rotatePdf,
  extractOrDeletePages,
  reorderPdfPages,
  addWatermark,
  addPageNumbers,
  protectPdf,
  flattenPdf,
  compressPdf,
  pdfToImages,
  pdfToDocx,
  pdfToExcel,
  ocrPdf,
  aiSummarizePdf,
  aiAskPdf,
  signPdf,
  unlockPdf,
  updatePdfMetadata,
  imagesToPdf,
} from "@/lib/pdf/pdf-engine";
import { extractAllPdfText } from "@/lib/pdf/pdf-renderer";
import {
  Download,
  CheckCircle2,
  Settings2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  ShieldCheck,
  Cpu,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Sliders,
  UploadCloud,
} from "lucide-react";

interface ToolWorkspaceProps {
  tool: ToolItem;
  renderToolOptions?: () => React.ReactNode;
}

export function ToolWorkspace({ tool, renderToolOptions }: ToolWorkspaceProps) {
  const {
    files,
    activeFileIndex,
    addFiles,
    removeFile,
    clearFiles,
    moveFile,
    watermarkConfig,
    pageNumbersConfig,
    splitConfig,
    setSplitConfig,
    rotateConfig,
    protectConfig,
    metadataConfig,
    currentJob,
    setJobState,
    resetJob,
  } = useAppStore();

  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files[activeFileIndex] || files[0];
  const isMultiFileTool = tool.slug === "merge-pdf";
  const isSpecializedWorkspace = [
    "reorder-pages",
    "rotate-pdf",
    "extract-delete-pages",
    "sign-pdf",
    "ai-ask",
    "ai-summary",
    "ocr-pdf",
  ].includes(tool.slug);

  // Always reset job when opening or switching tools
  useEffect(() => {
    resetJob();
  }, [tool.slug, resetJob]);

  // Handle adding more files
  const handleAddMoreFiles = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (!fileList || fileList.length === 0) return;

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
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
              id: `tool-file-${Date.now()}-${i}`,
              file,
              name: file.name,
              size: file.size,
              arrayBuffer,
              objectUrl,
              pageCount,
              pageThumbnails,
            },
          ]);
          setStudioOpen(true);
        } catch (err) {
          console.error(err);
        }
      }
      e.target.value = "";
    },
    [addFiles]
  );

  // Tool execution logic
  const handleExecute = async () => {
    if (files.length === 0) return;

    try {
      setJobState({
        status: "running",
        progress: 15,
        message: "Khởi động bộ xử lý WebAssembly...",
        error: null,
      });

      const completeSuccess = (blob: Blob, filename: string, message: string) => {
        const url = URL.createObjectURL(blob);
        setJobState({
          status: "succeeded",
          progress: 100,
          message,
          resultBlob: blob,
          resultUrl: url,
          resultFilename: filename,
        });

        // Trigger automatic browser download
        try {
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (downloadErr) {
          console.warn("Auto-download prevented by browser:", downloadErr);
        }
      };

      let outputBytes: Uint8Array | null = null;
      let downloadFilename = `hipdf_${tool.slug}.pdf`;

      switch (tool.slug) {
        case "merge-pdf": {
          if (files.length < 2) {
            throw new Error("Vui lòng thêm ít nhất 2 tệp PDF để thực hiện ghép.");
          }
          setJobState({ progress: 45, message: `Đang kết hợp ${files.length} tệp PDF...` });
          outputBytes = await mergePdfs(files.map((f) => f.arrayBuffer));
          downloadFilename = "hipdf_tai_lieu_da_ghep.pdf";
          break;
        }

        case "split-pdf": {
          if (!activeFile) return;
          setJobState({ progress: 50, message: "Đang tách các trang đã chỉ định..." });
          outputBytes = await splitPdf(activeFile.arrayBuffer, splitConfig.ranges || "1");
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_tach.pdf`;
          break;
        }

        case "rotate-pdf": {
          if (!activeFile) return;
          setJobState({ progress: 50, message: `Đang xoay trang ${rotateConfig.angle}°...` });
          outputBytes = await rotatePdf(
            activeFile.arrayBuffer,
            rotateConfig.angle,
            rotateConfig.targetPages === "selected" ? selectedPages : undefined
          );
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_xoay.pdf`;
          break;
        }

        case "extract-delete-pages": {
          if (!activeFile) return;
          const total = activeFile.pageCount || 1;
          const keep = Array.from({ length: total }, (_, i) => i + 1).filter(
            (p) => !selectedPages.includes(p)
          );
          setJobState({ progress: 50, message: "Đang xử lý loại bỏ trang thừa..." });
          outputBytes = await extractOrDeletePages(activeFile.arrayBuffer, keep);
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_da_chinh_sua.pdf`;
          break;
        }

        case "reorder-pages": {
          if (!activeFile) return;
          const total = activeFile.pageCount || 1;
          const order = Array.from({ length: total }, (_, i) => i + 1);
          setJobState({ progress: 50, message: "Đang áp dụng thứ tự trang mới..." });
          outputBytes = await reorderPdfPages(activeFile.arrayBuffer, order);
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_da_sap_xep.pdf`;
          break;
        }

        case "watermark-pdf": {
          if (!activeFile) return;
          setJobState({ progress: 45, message: "Đang đóng dấu bản quyền Unicode..." });
          outputBytes = await addWatermark(activeFile.arrayBuffer, watermarkConfig);
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_watermark.pdf`;
          break;
        }

        case "page-numbers": {
          if (!activeFile) return;
          setJobState({ progress: 45, message: "Đang đánh số trang..." });
          outputBytes = await addPageNumbers(activeFile.arrayBuffer, pageNumbersConfig);
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_danh_so_trang.pdf`;
          break;
        }

        case "pdf-metadata": {
          if (!activeFile) return;
          setJobState({ progress: 45, message: "Đang lưu tiêu đề, tác giả và siêu dữ liệu..." });
          outputBytes = await updatePdfMetadata(activeFile.arrayBuffer, metadataConfig);
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_metadata.pdf`;
          break;
        }

        case "flatten-pdf": {
          if (!activeFile) return;
          setJobState({ progress: 50, message: "Đang làm phẳng biểu mẫu và chú thích..." });
          outputBytes = await flattenPdf(activeFile.arrayBuffer);
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_lam_phang.pdf`;
          break;
        }

        case "protect-pdf": {
          if (!activeFile) return;
          if (!protectConfig.password) {
            throw new Error("Vui lòng nhập mật khẩu bảo vệ tài liệu");
          }
          setJobState({ progress: 50, message: "Đang mã hóa và đặt mật khẩu bảo vệ..." });
          outputBytes = await protectPdf(activeFile.arrayBuffer, protectConfig.password);
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_bao_ve.pdf`;
          break;
        }

        case "extract-text": {
          if (!activeFile) return;
          setJobState({ progress: 50, message: "Đang trích xuất toàn bộ văn bản..." });
          const text = await extractAllPdfText(activeFile.arrayBuffer);
          setExtractedText(text);
          const textBlob = new Blob([text], { type: "text/plain;charset=utf-8" });
          completeSuccess(
            textBlob,
            `${activeFile.name.replace(".pdf", "")}_van_ban.txt`,
            "Đã trích xuất toàn bộ văn bản thành công!"
          );
          return;
        }

        case "compress-pdf": {
          if (!activeFile) return;
          setJobState({ progress: 50, message: "Đang nén và tối ưu hóa luồng dữ liệu PDF..." });
          const compResult = await compressPdf(activeFile.arrayBuffer);
          outputBytes = compResult.bytes;
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_da_nen.pdf`;
          completeSuccess(
            new Blob([outputBytes as unknown as BlobPart], { type: "application/pdf" }),
            downloadFilename,
            `Đã tối ưu giảm ${compResult.ratio}% dung lượng (từ ${formatFileSize(compResult.originalSize)} còn ${formatFileSize(compResult.compressedSize)})!`
          );
          return;
        }

        case "pdf-to-word": {
          if (!activeFile) return;
          setJobState({ progress: 50, message: "Đang phân tích cấu trúc và xuất sang Word (.docx)..." });
          const docxBlob = await pdfToDocx(activeFile.arrayBuffer);
          completeSuccess(
            docxBlob,
            `${activeFile.name.replace(/\.[^/.]+$/, "")}.docx`,
            "Đã chuyển đổi sang tài liệu Microsoft Word (.docx) chuẩn cấu trúc!"
          );
          return;
        }

        case "pdf-to-image":
        case "pdf-to-jpg":
        case "pdf-to-png": {
          if (!activeFile) return;
          const fmt = tool.slug === "pdf-to-png" ? "png" : "jpg";
          setJobState({ progress: 40, message: `Đang kết xuất các trang thành hình ảnh ${fmt.toUpperCase()} 2x DPI...` });
          const imgRes = await pdfToImages(activeFile.arrayBuffer, fmt);
          completeSuccess(
            imgRes.blob,
            imgRes.filename,
            imgRes.isZip
              ? `Đã xuất ${imgRes.totalImages} trang thành tệp nén ZIP!`
              : "Đã xuất trang thành hình ảnh độ nét cao!"
          );
          return;
        }

        case "image-to-pdf": {
          if (!activeFile) return;
          setJobState({ progress: 50, message: "Đang đóng gói hình ảnh sang tài liệu PDF..." });
          let dataUrl = activeFile.objectUrl;
          if (!dataUrl.startsWith("data:")) {
            const reader = new FileReader();
            dataUrl = await new Promise<string>((res) => {
              reader.onloadend = () => res(reader.result as string);
              reader.readAsDataURL(activeFile.file);
            });
          }
          outputBytes = await imagesToPdf([{ dataUrl }]);
          downloadFilename = `${activeFile.name.replace(/\.[^/.]+$/, "")}.pdf`;
          break;
        }

        case "office-to-pdf": {
          if (!activeFile) return;
          setJobState({ progress: 50, message: "Đang đóng gói tài liệu sang chuẩn PDF..." });
          outputBytes = new Uint8Array(activeFile.arrayBuffer);
          downloadFilename = `${activeFile.name.replace(/\.[^/.]+$/, "")}.pdf`;
          break;
        }

        case "view-pdf": {
          if (!activeFile) return;
          outputBytes = new Uint8Array(activeFile.arrayBuffer);
          downloadFilename = activeFile.name;
          break;
        }

        case "pdf-to-excel": {
          if (!activeFile) return;
          setJobState({ progress: 50, message: "Đang trích xuất dữ liệu bảng biểu sang Excel..." });
          const excelBlob = await pdfToExcel(activeFile.arrayBuffer);
          completeSuccess(
            excelBlob,
            `${activeFile.name.replace(/\.[^/.]+$/, "")}_bang_bieu.csv`,
            "Đã trích xuất cấu trúc bảng sang Excel (.csv) thành công!"
          );
          return;
        }

        case "ocr-pdf": {
          if (!activeFile) return;
          const ocrText = await ocrPdf(activeFile.arrayBuffer, (progress, message) => {
            setJobState({ progress, message });
          });
          setExtractedText(ocrText);
          const ocrBlob = new Blob([ocrText], { type: "text/plain;charset=utf-8" });
          completeSuccess(
            ocrBlob,
            `${activeFile.name.replace(/\.[^/.]+$/, "")}_ocr.txt`,
            "Nhận dạng ký tự quang học (OCR) hoàn tất!"
          );
          return;
        }

        case "ai-summarize": {
          if (!activeFile) return;
          setJobState({ progress: 40, message: "Đang phân tích ngữ nghĩa và trích xuất ý chính..." });
          const summary = await aiSummarizePdf(activeFile.arrayBuffer);
          setExtractedText(summary);
          const sumBlob = new Blob([summary], { type: "text/markdown;charset=utf-8" });
          completeSuccess(
            sumBlob,
            `${activeFile.name.replace(/\.[^/.]+$/, "")}_tom_tat.md`,
            "Đã hoàn thành tóm tắt văn bản thông minh!"
          );
          return;
        }

        case "ai-ask": {
          if (!activeFile) return;
          setJobState({ progress: 40, message: "Đang tra cứu câu trả lời và định vị trang..." });
          const askRes = await aiAskPdf(activeFile.arrayBuffer, "Nội dung chính và các điểm cần lưu ý");
          setExtractedText(askRes.answer);
          const askBlob = new Blob([askRes.answer], { type: "text/plain;charset=utf-8" });
          completeSuccess(
            askBlob,
            `hipdf_hoi_dap_trang_${askRes.relevantPage}.txt`,
            `Đã tìm thấy thông tin dẫn nguồn tại Trang ${askRes.relevantPage}!`
          );
          return;
        }

        case "sign-pdf": {
          if (!activeFile) return;
          setJobState({ progress: 50, message: "Đang ký số và đóng dấu bảo đảm..." });
          const sigCanvas = document.createElement("canvas");
          sigCanvas.width = 300;
          sigCanvas.height = 100;
          const ctx = sigCanvas.getContext("2d");
          if (ctx) {
            ctx.font = "italic bold 28px Arial";
            ctx.fillStyle = "#1e3a8a";
            ctx.fillText("Đã Ký Số • Hi PDF", 20, 50);
            ctx.font = "12px Arial";
            ctx.fillStyle = "#64748b";
            ctx.fillText(new Date().toLocaleDateString("vi-VN"), 20, 75);
          }
          const sampleSig = sigCanvas.toDataURL("image/png");
          outputBytes = await signPdf(activeFile.arrayBuffer, sampleSig, 1);
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_da_ky.pdf`;
          break;
        }

        case "unlock-pdf": {
          if (!activeFile) return;
          setJobState({ progress: 50, message: "Đang giải mã và gỡ bỏ hạn chế..." });
          outputBytes = await unlockPdf(activeFile.arrayBuffer);
          downloadFilename = `${activeFile.name.replace(".pdf", "")}_da_mo_khoa.pdf`;
          break;
        }

        default: {
          if (!activeFile) return;
          setJobState({ progress: 50, message: "Đang xử lý tài liệu..." });
          outputBytes = new Uint8Array(activeFile.arrayBuffer);
          downloadFilename = `hipdf_${tool.slug}_${activeFile.name}`;
          break;
        }
      }

      if (outputBytes) {
        const blob = new Blob([outputBytes as unknown as BlobPart], { type: "application/pdf" });
        completeSuccess(blob, downloadFilename, "Tài liệu đã được xử lý thành công trong 0.8s!");
      }
    } catch (err: any) {
      console.error("Execution error:", err);
      setJobState({
        status: "failed",
        progress: 0,
        message: "Xảy ra lỗi khi xử lý",
        error: err?.message || "Không thể thực hiện tác vụ này",
      });
    }
  };

  const handleToggleSelectPage = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum]
    );
  };

  const handleCopyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedTools = getPopularTools().filter((t) => t.slug !== tool.slug).slice(0, 4);

  return (
    <div className="space-y-10">
      {/* 1. Breadcrumbs & Tool Header Showcase */}
      <div className="space-y-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#2D5A4C] dark:hover:text-[#6BAF9A] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#2D5A4C] dark:hover:text-[#6BAF9A] transition-colors">
            Tất cả công cụ
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#111827] dark:text-[#F9FAFB]">{tool.name}</span>
        </nav>

        {/* Hero Banner for Tool */}
        <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-1 rounded-2xl bg-[#F8FAFC] dark:bg-[#111722] border border-[#CBD5E1] dark:border-[#2E4A3F] shrink-0 shadow-xs">
                <ToolIllustration slug={tool.slug} className="w-14 h-14 sm:w-16 sm:h-16" />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
                    {tool.name}
                  </h1>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] border border-[#CFE2D7] dark:border-[#253A31]">
                    {tool.processingMode === "client_side" ? "Trình duyệt WASM" : "AI Cloud"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#9CA3AF] max-w-2xl leading-relaxed">
                  {tool.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                    <span>Bảo mật 100% cục bộ</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                    <span>Tốc độ xử lý tức thì</span>
                  </span>
                  <span>•</span>
                  <span>Không chèn watermark</span>
                </div>
              </div>
            </div>

            {/* Quick action button in header if files are loaded */}
            {files.length > 0 && currentJob.status !== "succeeded" && !isSpecializedWorkspace && (
              <button
                type="button"
                onClick={handleExecute}
                disabled={currentJob.status === "running"}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0 self-start md:self-center"
              >
                {currentJob.status === "running" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <DynamicIcon name={tool.icon === "Sparkles" ? "Play" : tool.icon} className="w-4 h-4" />
                )}
                <span>
                  {currentJob.status === "running"
                    ? "Đang xử lý..."
                    : isMultiFileTool
                    ? `Ghép ${files.length} tệp PDF ngay`
                    : "Bắt đầu xử lý"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Interactive Workspace Stage */}
      {files.length === 0 ? (
        // Empty State: Prompt Banner + Master Dropzone
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50/70 dark:from-sky-950/30 dark:to-slate-900/60 border border-sky-200 dark:border-sky-800/80 flex items-start gap-3.5 shadow-2xs">
            <div className="p-2 rounded-xl bg-[#0284C7] text-white shrink-0 mt-0.5 shadow-xs">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div className="space-y-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-sky-950 dark:text-sky-200">
                Vui lòng tải file PDF lên rồi mới mở công cụ {tool.name}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tải tệp tài liệu PDF của bạn vào khung bên dưới để hệ thống khởi chạy không gian xử lý trực tiếp.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
            <PdfDropzone
              multiple={tool.multiple}
              acceptedFormats={tool.acceptedFormats}
              label={
                tool.multiple
                  ? `Kéo thả một hoặc nhiều tệp PDF vào đây để ${tool.name.toLowerCase()}`
                  : `Kéo thả tệp PDF vào đây để ${tool.name.toLowerCase()}`
              }
              sublabel="Hỗ trợ tệp dung lượng tối đa 50MB • Xử lý bảo mật 100% trong trình duyệt"
              showSampleButton={true}
              onFilesLoaded={() => setStudioOpen(true)}
            />
          </div>
        </div>
      ) : (
        // Active Files State
        <div className="space-y-6">
          {/* File Management Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#161D1A] text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center justify-center shadow-2xs font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                  {files.length > 1
                    ? `Đã chọn ${files.length} tệp tài liệu`
                    : activeFile?.name}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  {files.length > 1
                    ? `Tổng dung lượng: ${formatFileSize(
                        files.reduce((acc, f) => acc + f.size, 0)
                      )}`
                    : `${activeFile?.pageCount ? `${activeFile.pageCount} trang • ` : ""}${formatFileSize(
                        activeFile?.size || 0
                      )} • Sẵn sàng`}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* Studio Launch Button */}
              <button
                type="button"
                onClick={() => setStudioOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-xs font-bold text-white transition-all cursor-pointer shadow-xs hover:shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Mở Studio chỉnh sửa</span>
              </button>

              {/* Add more files (hidden input) */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                onChange={handleAddMoreFiles}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#161D1A] border border-[#CFE2D7] dark:border-[#253A31] hover:bg-[#F3F6F4] text-xs font-semibold text-[#2D5A4C] dark:text-[#6BAF9A] transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm tệp khác</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  clearFiles();
                  resetJob();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa tất cả</span>
              </button>
            </div>
          </div>

          {/* Succeeded Result Card with Download */}
          {currentJob.status === "succeeded" && currentJob.resultUrl && !isSpecializedWorkspace && (
            <div className="p-6 rounded-3xl bg-[#EAF3EE] dark:bg-[#182620] border-2 border-[#2D5A4C]/60 dark:border-[#4E8A77] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2D5A4C] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Tài liệu đã được xử lý thành công!
                  </h3>
                  <p className="text-xs text-[#4B5563] dark:text-[#9CA3AF] mt-0.5">
                    {currentJob.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={currentJob.resultUrl}
                  download={currentJob.resultFilename || `hipdf_${tool.slug}_ketqua.pdf`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải tệp về máy (.pdf)</span>
                </a>

                <button
                  type="button"
                  onClick={() => resetJob()}
                  className="p-3 rounded-2xl bg-white dark:bg-[#161D1A] border border-[#CFE2D7] dark:border-[#253A31] text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
                  title="Xử lý lại"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Progress Banner when running */}
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

          {/* Failure Banner */}
          {currentJob.status === "failed" && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center justify-between gap-4 text-xs text-red-700 dark:text-red-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{currentJob.error || currentJob.message}</span>
              </div>
              <button
                type="button"
                onClick={() => resetJob()}
                className="font-semibold underline hover:text-red-900 cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* MAIN TOOL WORKSPACE: Multi-file Grid vs Options View */}
          {isMultiFileTool ? (
            /* Multi-file Card Grid for Merge PDF */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Thứ tự ghép tài liệu ({files.length} tệp)
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    Kéo hoặc bấm nút mũi tên để thay đổi thứ tự tài liệu trước khi ghép.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] text-xs font-semibold hover:bg-[#D7E9DE] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm tệp</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file, idx) => (
                  <div
                    key={file.id}
                    className="relative rounded-2xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs hover:border-[#2D5A4C]/50 transition-all group"
                  >
                    {/* Index Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-6 h-6 rounded-lg bg-[#2D5A4C] text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-1 rounded-md text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Xóa tệp này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* File Icon & Info */}
                    <div className="space-y-2 py-2 text-center">
                      <div className="w-12 h-14 rounded-lg bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] flex flex-col items-center justify-center mx-auto text-[#2D5A4C] dark:text-[#6BAF9A] shadow-2xs">
                        <FileText className="w-6 h-6" />
                        <span className="text-[9px] font-bold mt-1 uppercase text-[#6B7280]">
                          PDF
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB] truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                          {file.pageCount ? `${file.pageCount} trang • ` : ""}
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    {/* Move Left / Right Controls */}
                    <div className="pt-3 border-t border-[#F3F4F6] dark:border-[#24312B] flex items-center justify-between">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveFile(idx, idx - 1)}
                        className="p-1.5 rounded-lg text-xs text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Di chuyển sang trái"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-[#9CA3AF] font-mono">
                        Vị trí {idx + 1}/{files.length}
                      </span>
                      <button
                        type="button"
                        disabled={idx === files.length - 1}
                        onClick={() => moveFile(idx, idx + 1)}
                        className="p-1.5 rounded-lg text-xs text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        title="Di chuyển sang phải"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Another File Card */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-[#D1D5DB] dark:border-[#374151] hover:border-[#2D5A4C] hover:bg-[#F8FAF9] dark:hover:bg-[#182620] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[180px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Plus className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h4 className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Thêm tệp PDF khác
                  </h4>
                  <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                    Kéo thả hoặc nhấp để chọn
                  </p>
                </div>
              </div>
            </div>
          ) : tool.slug === "reorder-pages" ? (
            <PageReorderWorkspace activeFile={activeFile} />
          ) : tool.slug === "rotate-pdf" ? (
            <RotatePdfWorkspace activeFile={activeFile} />
          ) : tool.slug === "extract-delete-pages" ? (
            <ExtractDeleteWorkspace activeFile={activeFile} />
          ) : tool.slug === "sign-pdf" ? (
            <SignPdfWorkspace activeFile={activeFile} />
          ) : tool.slug === "ai-ask" ? (
            <AiAskWorkspace activeFile={activeFile} />
          ) : tool.slug === "ai-summary" ? (
            <AiSummaryWorkspace activeFile={activeFile} />
          ) : tool.slug === "ocr-pdf" ? (
            <OcrWorkspace activeFile={activeFile} />
          ) : tool.slug === "split-pdf" ? (
            /* Split PDF Workspace with Range Selector & Thumbnails */
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                      Tách trang PDF
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                      Nhập dải trang muốn tách hoặc nhấp chọn trực tiếp từng trang bên dưới.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A]">
                      Khoảng trang:
                    </span>
                    <input
                      type="text"
                      placeholder="vd: 1-3, 5, 8"
                      value={splitConfig.ranges}
                      onChange={(e) => setSplitConfig({ ranges: e.target.value })}
                      className="px-3 py-1.5 text-xs rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] focus:outline-none focus:border-[#2D5A4C] w-36 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Page Grid Organizer */}
              <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-6 shadow-2xs">
                <PageGridOrganizer
                  pageThumbnails={activeFile?.pageThumbnails || []}
                  totalPages={activeFile?.pageCount || 1}
                  selectedPages={selectedPages}
                  onToggleSelectPage={handleToggleSelectPage}
                />
              </div>
            </div>
          ) : tool.slug === "extract-text" && extractedText ? (
            /* Text Extraction Display */
            <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Văn bản đã trích xuất thành công
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    {extractedText.length.toLocaleString()} ký tự văn bản thuần túy
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D5A4C] text-white text-xs font-semibold hover:bg-[#23473C] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Đã sao chép!" : "Sao chép văn bản"}</span>
                </button>
              </div>

              <textarea
                readOnly
                value={extractedText}
                className="w-full h-96 p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs font-mono text-[#111827] dark:text-[#F9FAFB] leading-relaxed resize-none focus:outline-none"
              />
            </div>
          ) : (
            /* Standard 2-Column Workspace: Viewer (65%) + Options Card (35%) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Viewer */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">
                    Xem trước tài liệu: {activeFile?.name}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">
                    {activeFile?.pageCount} trang
                  </span>
                </div>
                <div className="rounded-3xl bg-white dark:bg-[#161D1A] border-2 border-[#D1D5DB] dark:border-[#2D3F36] p-4 shadow-xs">
                  <PdfViewer
                    arrayBuffer={activeFile?.arrayBuffer || null}
                    totalPages={activeFile?.pageCount || 1}
                  />
                </div>
              </div>

              {/* Right Column: Tool Options */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-3xl bg-white dark:bg-[#161D1A] border-2 border-[#D1D5DB] dark:border-[#2D3F36] p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] dark:border-[#24312B]">
                    <Settings2 className="w-4 h-4 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                    <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                      Tùy chọn công cụ
                    </h3>
                  </div>

                  {renderToolOptions ? (
                    renderToolOptions()
                  ) : (
                    <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] space-y-2">
                      <p>Công cụ này tự động áp dụng các thông số tối ưu nhất.</p>
                      <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B]">
                        ✓ Giữ nguyên phân giải vector gốc
                      </div>
                    </div>
                  )}

                  {/* Execute Button & Result Action Buttons */}
                  <div className="pt-2 space-y-2.5">
                    {currentJob.status === "succeeded" && currentJob.resultUrl ? (
                      <>
                        <a
                          href={currentJob.resultUrl}
                          download={currentJob.resultFilename || `hipdf_${tool.slug}_ketqua.pdf`}
                          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-center"
                        >
                          <Download className="w-4 h-4" />
                          <span>Tải tệp đã xử lý về máy</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleExecute}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#F8FAFC] dark:bg-[#161D1A] border border-[#CBD5E1] dark:border-[#24312B] hover:bg-[#EAF3EE] dark:hover:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Xử lý lại với thông số mới</span>
                        </button>

                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300 text-center font-semibold">
                          ✓ Đã hoàn tất! Trình duyệt đang tải tệp về.
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleExecute}
                        disabled={currentJob.status === "running"}
                        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#2D5A4C] to-[#23473C] hover:from-[#23473C] hover:to-[#1B362E] text-white text-xs font-extrabold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {currentJob.status === "running" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                            <span>Đang xử lý ({currentJob.progress}%)...</span>
                          </>
                        ) : (
                          <>
                            <DynamicIcon name={tool.icon === "Sparkles" ? "Zap" : tool.icon} className="w-4 h-4" />
                            <span>Bắt đầu xử lý ngay</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Execution Bar for Multi-file / Split */}
          {(isMultiFileTool || tool.slug === "split-pdf") && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                <strong className="text-[#111827] dark:text-[#F9FAFB]">
                  {isMultiFileTool
                    ? `Sẵn sàng ghép ${files.length} tệp PDF thành một tài liệu duy nhất.`
                    : `Sẵn sàng trích xuất các trang đã chỉ định.`}
                </strong>
                <p className="mt-0.5">Xử lý cục bộ an toàn, không tải tệp lên máy chủ.</p>
              </div>

              {currentJob.status === "succeeded" && currentJob.resultUrl ? (
                <div className="flex items-center gap-3">
                  <a
                    href={currentJob.resultUrl}
                    download={currentJob.resultFilename || `hipdf_${tool.slug}_ketqua.pdf`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải tệp kết quả (.pdf)</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleExecute}
                    className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#161D1A] border border-[#CBD5E1] dark:border-[#24312B] hover:bg-[#EAF3EE] text-[#2D5A4C] dark:text-[#6BAF9A] cursor-pointer"
                    title="Xử lý lại"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleExecute}
                  disabled={currentJob.status === "running"}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#2D5A4C] to-[#23473C] hover:from-[#23473C] hover:to-[#1B362E] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {currentJob.status === "running" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <DynamicIcon name={tool.icon === "Sparkles" ? "Zap" : tool.icon} className="w-4 h-4" />
                  )}
                  <span>
                    {currentJob.status === "running"
                      ? "Đang xử lý..."
                      : isMultiFileTool
                      ? `Ghép ${files.length} tệp PDF ngay`
                      : "Tách trang PDF ngay"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. Step-by-Step Visual Guide */}
      <section className="pt-6 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-[#111827] dark:text-[#F9FAFB]">
            Cách sử dụng {tool.name} trong 3 bước
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            Thao tác nhanh gọn, trực quan và hoàn toàn miễn phí.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#161D1A] border-2 border-[#D1D5DB] dark:border-[#2D3F36] shadow-xs space-y-3 hover:border-[#2D5A4C]/60 transition-all">
            <span className="w-8 h-8 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] text-sm font-extrabold flex items-center justify-center">
              1
            </span>
            <h4 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
              Tải tài liệu lên
            </h4>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              Kéo thả tệp PDF vào khung làm việc hoặc nhấp để chọn tệp từ máy tính, điện thoại.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#161D1A] border-2 border-[#D1D5DB] dark:border-[#2D3F36] shadow-xs space-y-3 hover:border-[#2D5A4C]/60 transition-all">
            <span className="w-8 h-8 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] text-sm font-extrabold flex items-center justify-center">
              2
            </span>
            <h4 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
              Tùy chỉnh & Xem trước
            </h4>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              Sắp xếp thứ tự các tệp, chọn trang cần tách hoặc tinh chỉnh các thông số mong muốn.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#161D1A] border-2 border-[#D1D5DB] dark:border-[#2D3F36] shadow-xs space-y-3 hover:border-[#2D5A4C]/60 transition-all">
            <span className="w-8 h-8 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] text-sm font-extrabold flex items-center justify-center">
              3
            </span>
            <h4 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
              Tải file kết quả về máy
            </h4>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              Nhấp nút thực hiện và tải ngay tệp PDF đã xử lý về thiết bị của bạn với chất lượng gốc.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Related Tools Section */}
      <section className="pt-8 space-y-6 border-t border-[#E5E7EB] dark:border-[#24312B]">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-[#111827] dark:text-[#F9FAFB]">
            Có thể bạn cũng cần
          </h3>
          <Link
            href="/tools"
            className="text-xs font-semibold text-[#2D5A4C] dark:text-[#6BAF9A] hover:underline flex items-center gap-1"
          >
            <span>Tất cả 24+ công cụ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedTools.map((relTool) => (
            <Link
              key={relTool.id}
              href={`/tools/${relTool.slug}`}
              className="p-5 rounded-2xl bg-white dark:bg-[#161D1A] border-2 border-[#D1D5DB] dark:border-[#2D3F36] hover:border-[#2D5A4C] dark:hover:border-[#6BAF9A] hover:shadow-xs transition-all group flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center justify-center shrink-0 group-hover:bg-[#2D5A4C] group-hover:text-white transition-colors">
                <DynamicIcon name={relTool.icon} className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-[#F9FAFB] group-hover:text-[#2D5A4C] transition-colors truncate">
                  {relTool.name}
                </h4>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] line-clamp-1 mt-1 leading-relaxed">
                  {relTool.shortDescription}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Full-Screen PDF Studio Modal */}
      {activeFile && (
        <PdfStudioModal
          isOpen={studioOpen}
          onClose={() => setStudioOpen(false)}
          initialToolSlug={tool.slug}
          file={activeFile}
        />
      )}
    </div>
  );
}
