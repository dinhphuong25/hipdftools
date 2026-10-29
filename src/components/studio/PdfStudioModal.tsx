"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Check,
  Download,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Type,
  PenTool,
  Highlighter,
  Image as ImageIcon,
  Stamp,
  Printer,
  Search,
  Layers,
  FileText,
  Sliders,
  Lock,
  Unlock,
  FileCode,
  FileSpreadsheet,
  Minimize2,
  Plus,
  Loader2,
  Mail,
  Undo2,
  Redo2,
  Maximize2,
  Eye,
  EyeOff,
  Move,
  Link as LinkIcon,
  MessageSquare,
  Sparkles,
  Languages,
} from "lucide-react";
import { useAppStore, LoadedPdfFile } from "@/lib/store/useAppStore";
import { BrandLogoIcon } from "@/components/ui/BrandLogo";
import { renderPdfPageToCanvas, extractAllPdfText } from "@/lib/pdf/pdf-renderer";
import {
  updatePdfMetadata,
  addWatermark,
  addPageNumbers,
  rotatePdf,
  compressPdf,
  protectPdf,
  unlockPdf,
  splitPdf,
  flattenPdf,
  extractOrDeletePages,
  pdfToDocx,
  pdfToExcel,
  pdfToImages,
  mergePdfs,
  reorderPdfPages,
  signPdf,
  ocrPdf,
  aiSummarizePdf,
  aiAskPdf,
} from "@/lib/pdf/pdf-engine";
import { TOOLS, getToolBySlug } from "@/lib/tools-registry";
import { AiTranslationWorkspace } from "./AiTranslationWorkspace";
import { CompressionWorkspace } from "./CompressionWorkspace";
import { ConversionWorkspace } from "./ConversionWorkspace";
import { PageOrganizerWorkspace } from "./PageOrganizerWorkspace";
import { SecurityWorkspace } from "./SecurityWorkspace";

interface PdfStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialToolSlug?: string;
  file?: LoadedPdfFile | null;
}

export function PdfStudioModal({
  isOpen,
  onClose,
  initialToolSlug = "pdf-metadata",
  file,
}: PdfStudioModalProps) {
  const {
    files,
    activeFileIndex,
    metadataConfig,
    setMetadataConfig,
    watermarkConfig,
    setWatermarkConfig,
    pageNumbersConfig,
    setPageNumbersConfig,
    setProtectConfig,
    rotateConfig,
    setRotateConfig,
  } = useAppStore();

  const activeFile = file || files[activeFileIndex] || files[0];
  const [currentToolSlug, setCurrentToolSlug] = useState(initialToolSlug);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.15);
  const [loadingPage, setLoadingPage] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [completedUrl, setCompletedUrl] = useState<string | null>(null);
  const [completedFilename, setCompletedFilename] = useState<string | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const bannerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showToolDropdown, setShowToolDropdown] = useState(false);
  const [activeRibbonTool, setActiveRibbonTool] = useState<string>("cursor");

  // Auto-hide success notification after 4 seconds
  const displaySuccessBanner = () => {
    setShowSuccessBanner(true);
    if (bannerTimerRef.current) {
      clearTimeout(bannerTimerRef.current);
    }
    bannerTimerRef.current = setTimeout(() => {
      setShowSuccessBanner(false);
    }, 4000);
  };

  useEffect(() => {
    if (completedUrl) {
      displaySuccessBanner();
    } else {
      setShowSuccessBanner(false);
    }
    return () => {
      if (bannerTimerRef.current) {
        clearTimeout(bannerTimerRef.current);
      }
    };
  }, [completedUrl]);

  // Specialized Tool States
  const [compressLevel, setCompressLevel] = useState<"recommended" | "extreme" | "low">("recommended");
  const [stripMetadata, setStripMetadata] = useState(true);
  const [protectPassword, setProtectPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [pageRangeInput, setPageRangeInput] = useState("");
  const [imageFormat, setImageFormat] = useState<"png" | "jpg">("png");
  const [targetLang, setTargetLang] = useState("vi");
  const [ocrLang, setOcrLang] = useState("vie+eng");
  const [summaryStyle, setSummaryStyle] = useState("key_points");
  const [showJumpDropdown, setShowJumpDropdown] = useState(false);
  const [isPanActive, setIsPanActive] = useState(false);

  // Canvas ref & viewport container
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const totalPages = activeFile?.pageCount || 1;

  // Sync tool slug
  useEffect(() => {
    if (initialToolSlug) {
      setCurrentToolSlug(initialToolSlug);
    }
  }, [initialToolSlug]);

  // Pre-fill metadata title if empty
  useEffect(() => {
    if (activeFile && !metadataConfig.title) {
      const cleanName = activeFile.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      setMetadataConfig({
        title: cleanName,
        author: metadataConfig.author || "Tác giả",
      });
    }
  }, [activeFile, metadataConfig.title, metadataConfig.author, setMetadataConfig]);

  // Render current PDF page on canvas
  useEffect(() => {
    if (!isOpen || !activeFile?.arrayBuffer || !canvasRef.current) return;

    let cancelled = false;
    setLoadingPage(true);

    renderPdfPageToCanvas(activeFile.arrayBuffer, currentPage, canvasRef.current, scale)
      .catch((err) => {
        if (!cancelled) console.warn("Failed to render studio page canvas", err);
      })
      .finally(() => {
        if (!cancelled) setLoadingPage(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, activeFile, currentPage, scale]);

  // Lock body & html scroll to ensure only the inner studio area can scroll ("chỉ sử dụng scroll trong")
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflowHtml = document.documentElement.style.overflow;
    const originalOverflowBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalOverflowHtml;
      document.body.style.overflow = originalOverflowBody;
    };
  }, [isOpen]);

  if (!isOpen || !activeFile) return null;

  const currentTool = getToolBySlug(currentToolSlug) || TOOLS[0];

  const isAiTranslate = [
    "translate-pdf",
    "ai_translate",
    "ai-ask",
    "ai-summary",
    "ocr-pdf",
  ].includes(currentToolSlug);

  const isCompress = currentToolSlug === "compress-pdf";

  const isConvert = [
    "pdf-to-word",
    "pdf-to-excel",
    "pdf-to-ppt",
    "pdf-to-image",
    "word-to-pdf",
    "excel-to-pdf",
    "ppt-to-pdf",
    "jpg-to-pdf",
  ].includes(currentToolSlug);

  const isOrganizeOrSplit = [
    "split-pdf",
    "rotate-pdf",
    "organize-pdf",
    "reorder-pages",
    "extract-delete-pages",
    "merge-pdf",
  ].includes(currentToolSlug);

  const isSecurity = ["protect-pdf", "unlock-pdf"].includes(currentToolSlug);

  const isEditOrSign = ["edit", "sign-pdf"].includes(currentToolSlug);

  const isWatermarkOrMeta = [
    "watermark-pdf",
    "page-numbers",
    "pdf-metadata",
    "flatten-pdf",
  ].includes(currentToolSlug);

  // Execution handler
  const handleComplete = async () => {
    setProcessing(true);
    try {
      let outputBytes: Uint8Array | null = null;
      let filename = `hipdf_${currentToolSlug}_${activeFile.name}`;

      if (currentToolSlug === "pdf-metadata") {
        outputBytes = await updatePdfMetadata(activeFile.arrayBuffer, metadataConfig);
        filename = `${activeFile.name.replace(".pdf", "")}_metadata.pdf`;
      } else if (currentToolSlug === "watermark-pdf") {
        outputBytes = await addWatermark(activeFile.arrayBuffer, watermarkConfig);
        filename = `${activeFile.name.replace(".pdf", "")}_watermark.pdf`;
      } else if (currentToolSlug === "page-numbers") {
        outputBytes = await addPageNumbers(activeFile.arrayBuffer, pageNumbersConfig);
        filename = `${activeFile.name.replace(".pdf", "")}_danh_so.pdf`;
      } else if (currentToolSlug === "rotate-pdf") {
        outputBytes = await rotatePdf(activeFile.arrayBuffer, rotateConfig.angle || 90);
        filename = `${activeFile.name.replace(".pdf", "")}_xoay.pdf`;
      } else if (currentToolSlug === "compress-pdf") {
        const res = await compressPdf(activeFile.arrayBuffer, compressLevel);
        outputBytes = res.bytes;
        filename = `${activeFile.name.replace(".pdf", "")}_da_nen.pdf`;
      } else if (currentToolSlug === "protect-pdf") {
        outputBytes = await protectPdf(activeFile.arrayBuffer, protectPassword || "123456");
        filename = `${activeFile.name.replace(".pdf", "")}_bao_ve.pdf`;
      } else if (currentToolSlug === "unlock-pdf") {
        outputBytes = await unlockPdf(activeFile.arrayBuffer, unlockPassword);
        filename = `${activeFile.name.replace(".pdf", "")}_mo_khoa.pdf`;
      } else if (currentToolSlug === "flatten-pdf") {
        outputBytes = await flattenPdf(activeFile.arrayBuffer);
        filename = `${activeFile.name.replace(".pdf", "")}_lam_phang.pdf`;
      } else if (currentToolSlug === "split-pdf") {
        const range = pageRangeInput.trim() || `${currentPage}`;
        outputBytes = await splitPdf(activeFile.arrayBuffer, range);
        filename = `${activeFile.name.replace(".pdf", "")}_chia_nho.pdf`;
      } else if (currentToolSlug === "extract-delete-pages") {
        const pages = pageRangeInput.trim()
          ? pageRangeInput
              .split(/[, -]+/)
              .map((n) => parseInt(n.trim(), 10))
              .filter((n) => !isNaN(n))
          : [currentPage];
        outputBytes = await extractOrDeletePages(activeFile.arrayBuffer, pages.length > 0 ? pages : [1]);
        filename = `${activeFile.name.replace(".pdf", "")}_trich_xuat.pdf`;
      } else if (currentToolSlug === "pdf-to-word") {
        const docxBlob = await pdfToDocx(activeFile.arrayBuffer);
        const docxUrl = URL.createObjectURL(docxBlob);
        const docxName = `${activeFile.name.replace(/\.[^/.]+$/, "")}.docx`;
        setCompletedUrl(docxUrl);
        setCompletedFilename(docxName);
        triggerDownload(docxUrl, docxName);
        setProcessing(false);
        return;
      } else if (currentToolSlug === "pdf-to-excel") {
        const excelBlob = await pdfToExcel(activeFile.arrayBuffer);
        const excelUrl = URL.createObjectURL(excelBlob);
        const excelName = `${activeFile.name.replace(/\.[^/.]+$/, "")}_bang_bieu.csv`;
        setCompletedUrl(excelUrl);
        setCompletedFilename(excelName);
        triggerDownload(excelUrl, excelName);
        setProcessing(false);
        return;
      } else if (currentToolSlug === "pdf-to-image") {
        const imgRes = await pdfToImages(activeFile.arrayBuffer, imageFormat);
        const imgUrl = URL.createObjectURL(imgRes.blob);
        setCompletedUrl(imgUrl);
        setCompletedFilename(imgRes.filename);
        triggerDownload(imgUrl, imgRes.filename);
        setProcessing(false);
        return;
      } else if (currentToolSlug === "merge-pdf") {
        const buffers = files.length > 1 ? files.map((f) => f.arrayBuffer) : [activeFile.arrayBuffer, activeFile.arrayBuffer];
        outputBytes = await mergePdfs(buffers);
        filename = `hipdf_da_ghep_${activeFile.name}`;
      } else if (currentToolSlug === "reorder-pages" || currentToolSlug === "organize-pdf") {
        const total = totalPages || 1;
        const order = Array.from({ length: total }, (_, i) => i + 1);
        outputBytes = await reorderPdfPages(activeFile.arrayBuffer, order);
        filename = `${activeFile.name.replace(".pdf", "")}_da_sap_xep.pdf`;
      } else if (currentToolSlug === "ocr-pdf") {
        const ocrText = await ocrPdf(activeFile.arrayBuffer);
        const textBlob = new Blob([ocrText], { type: "text/plain;charset=utf-8" });
        const textUrl = URL.createObjectURL(textBlob);
        const textName = `${activeFile.name.replace(/\.[^/.]+$/, "")}_ocr.txt`;
        setCompletedUrl(textUrl);
        setCompletedFilename(textName);
        triggerDownload(textUrl, textName);
        setProcessing(false);
        return;
      } else if (currentToolSlug === "ai-summary") {
        const summary = await aiSummarizePdf(activeFile.arrayBuffer);
        const sumBlob = new Blob([summary], { type: "text/markdown;charset=utf-8" });
        const sumUrl = URL.createObjectURL(sumBlob);
        const sumName = `${activeFile.name.replace(/\.[^/.]+$/, "")}_tom_tat.md`;
        setCompletedUrl(sumUrl);
        setCompletedFilename(sumName);
        triggerDownload(sumUrl, sumName);
        setProcessing(false);
        return;
      } else if (currentToolSlug === "ai-ask") {
        const askRes = await aiAskPdf(activeFile.arrayBuffer, "Tóm tắt các điểm quan trọng");
        const askBlob = new Blob([askRes.answer], { type: "text/plain;charset=utf-8" });
        const askUrl = URL.createObjectURL(askBlob);
        const askName = `hipdf_hoi_dap_trang_${askRes.relevantPage}.txt`;
        setCompletedUrl(askUrl);
        setCompletedFilename(askName);
        triggerDownload(askUrl, askName);
        setProcessing(false);
        return;
      } else if (currentToolSlug === "extract-text") {
        const text = await extractAllPdfText(activeFile.arrayBuffer);
        const textBlob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const textUrl = URL.createObjectURL(textBlob);
        const textName = `${activeFile.name.replace(/\.[^/.]+$/, "")}_van_ban.txt`;
        setCompletedUrl(textUrl);
        setCompletedFilename(textName);
        triggerDownload(textUrl, textName);
        setProcessing(false);
        return;
      } else if (currentToolSlug === "sign-pdf") {
        const sigCanvas = document.createElement("canvas");
        sigCanvas.width = 300;
        sigCanvas.height = 100;
        const ctx = sigCanvas.getContext("2d");
        if (ctx) {
          ctx.font = "italic bold 28px Arial";
          ctx.fillStyle = "#0284c7";
          ctx.fillText("Đã Ký Số • Hi PDF", 20, 50);
          ctx.font = "12px Arial";
          ctx.fillStyle = "#64748b";
          ctx.fillText(new Date().toLocaleDateString("vi-VN"), 20, 75);
        }
        const sigDataUrl = sigCanvas.toDataURL("image/png");
        outputBytes = await signPdf(activeFile.arrayBuffer, sigDataUrl, currentPage);
        filename = `${activeFile.name.replace(".pdf", "")}_da_ky.pdf`;
      } else {
        // Generic fallback / standard editing export
        outputBytes = new Uint8Array(activeFile.arrayBuffer);
        filename = `${activeFile.name.replace(".pdf", "")}_hoan_tat.pdf`;
      }

      if (outputBytes) {
        const blob = new Blob([outputBytes as unknown as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setCompletedUrl(url);
        setCompletedFilename(filename);
        triggerDownload(url, filename);
      }
    } catch (err: any) {
      console.error("Studio execution error:", err);
      alert(`Lỗi khi xử lý tài liệu: ${err?.message || "Không thể lưu tệp"}`);
    } finally {
      setProcessing(false);
    }
  };

  const triggerDownload = (url: string, filename: string) => {
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      displaySuccessBanner();
    } catch (e) {
      console.warn("Auto download prevented", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F1F3F5] dark:bg-[#0E1411] flex flex-col overflow-hidden select-none animate-in fade-in duration-200">
      {/* 1. TOP HEADER (Matching pdfaid.com /document/create) */}
      <header className="h-14 sm:h-16 bg-white dark:bg-[#161D1A] border-b border-[#E2E8F0] dark:border-[#24312B] px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 shadow-xs z-30">
        {/* Left: Logo & Tool Title Switcher */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Brand Logo with matching brand vector */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowToolDropdown(!showToolDropdown)}>
            <BrandLogoIcon className="w-7 h-7" />
            <span className="font-black text-lg tracking-tight text-[#0F172A] dark:text-[#F9FAFB] hidden sm:inline">
              Hi<span className="text-[#0284C7] dark:text-[#38BDF8]">PDF</span>
            </span>
          </div>

          <span className="text-[#CBD5E1] dark:text-[#334155]">/</span>

          {/* Active Tool Badge with dropdown picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowToolDropdown(!showToolDropdown)}
              className="px-3 py-1.5 rounded-xl bg-[#F1F3F5] dark:bg-[#1E293B] hover:bg-[#E2E8F0] text-[#1E293B] dark:text-[#F1F5F9] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{currentTool.name}</span>
              <span className="text-[10px] text-[#64748B]">▾</span>
            </button>

            {showToolDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowToolDropdown(false)}
                />
                <div className="absolute left-0 top-full mt-1.5 w-72 max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-[#111827] border border-[#CBD5E1] dark:border-[#1E293B] shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                    Chuyển sang công cụ PDF khác
                  </div>
                  {TOOLS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      data-dropdown-tool={t.slug}
                      onClick={() => {
                        setCurrentToolSlug(t.slug);
                        setShowToolDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                        currentToolSlug === t.slug
                          ? "bg-[#0284C7] text-white"
                          : "text-[#1E293B] dark:text-[#F1F5F9] hover:bg-[#F1F5F9] dark:hover:bg-[#1F2937]"
                      }`}
                    >
                      <span className="truncate">{t.name}</span>
                      {currentToolSlug === t.slug && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8] truncate hidden md:inline">
            • {activeFile.name} ({totalPages} trang)
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: activeFile.name, url: window.location.href });
              } else {
                alert("Đã sao chép liên kết tài liệu vào bộ nhớ tạm!");
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] text-xs font-bold text-[#374151] dark:text-[#CBD5E1] transition-all cursor-pointer shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Gửi đến email</span>
          </button>

          {/* Primary Action Button: Hoàn thành ✓ / Tải về (Matching reference styling) */}
          <button
            type="button"
            onClick={() => {
              if (completedUrl && completedFilename) {
                triggerDownload(completedUrl, completedFilename);
                displaySuccessBanner();
              } else {
                handleComplete();
              }
            }}
            disabled={processing}
            className="px-5 sm:px-6 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-sky-500/25 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Đang xử lý...</span>
              </>
            ) : completedUrl ? (
              <>
                <Download className="w-4 h-4" />
                <span>Tải tệp về máy (.pdf)</span>
              </>
            ) : (
              <>
                <span>Hoàn thành</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>

          {/* Close Studio Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white dark:bg-[#1A2420] border border-[#CBD5E1] dark:border-[#24312B] hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#24312B] dark:hover:text-white text-[#64748B] transition-colors cursor-pointer"
            title="Đóng giao diện studio (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. DEDICATED TOOL WORKSPACE BASED ON TOOL ARCHETYPE */}
      {isAiTranslate ? (
        <AiTranslationWorkspace
          file={activeFile}
          toolSlug={currentToolSlug}
          onComplete={(blob, filename) => {
            const url = URL.createObjectURL(blob);
            setCompletedUrl(url);
            setCompletedFilename(filename);
          }}
          triggerDownload={triggerDownload}
        />
      ) : isCompress ? (
        <CompressionWorkspace
          file={activeFile}
          onComplete={(blob, filename) => {
            const url = URL.createObjectURL(blob);
            setCompletedUrl(url);
            setCompletedFilename(filename);
          }}
          triggerDownload={triggerDownload}
        />
      ) : isConvert ? (
        <ConversionWorkspace
          file={activeFile}
          initialFormat={
            currentToolSlug === "pdf-to-word"
              ? "docx"
              : currentToolSlug === "pdf-to-excel"
              ? "xlsx"
              : currentToolSlug === "pdf-to-image"
              ? "png"
              : "docx"
          }
          onComplete={(blob, filename) => {
            const url = URL.createObjectURL(blob);
            setCompletedUrl(url);
            setCompletedFilename(filename);
          }}
          triggerDownload={triggerDownload}
        />
      ) : isOrganizeOrSplit ? (
        <PageOrganizerWorkspace
          file={activeFile}
          toolSlug={currentToolSlug}
          onComplete={(blob, filename) => {
            const url = URL.createObjectURL(blob);
            setCompletedUrl(url);
            setCompletedFilename(filename);
          }}
          triggerDownload={triggerDownload}
        />
      ) : isSecurity ? (
        <SecurityWorkspace
          file={activeFile}
          toolSlug={currentToolSlug}
          onComplete={(blob, filename) => {
            const url = URL.createObjectURL(blob);
            setCompletedUrl(url);
            setCompletedFilename(filename);
          }}
          triggerDownload={triggerDownload}
        />
      ) : (
        /* Fallback: Document Canvas & Annotation/Stamping Studio */
        <>
          {/* MAIN HORIZONTAL ACTION RIBBON: ONLY for edit and sign-pdf */}
          {isEditOrSign && (
            <div className="bg-white dark:bg-[#141A17] border-b border-[#E2E8F0] dark:border-[#24312B] px-3 sm:px-4 py-1.5 shadow-2xs overflow-x-auto scrollbar-none z-20 flex items-center gap-1 sm:gap-2">
        {/* Left Segment: Add Page button */}
        <button
          type="button"
          onClick={() => alert("Chức năng thêm trang mới vào PDF đã sẵn sàng!")}
          className="px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#1E2923] hover:bg-[#E2E8F0] border border-[#CBD5E1] dark:border-[#2E4A3F] text-xs font-bold text-[#1E293B] dark:text-[#F1F5F9] flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm trang</span>
          <span className="text-[10px] text-[#64748B]">▾</span>
        </button>

        <div className="h-6 w-px bg-[#E2E8F0] dark:bg-[#24312B] mx-1 shrink-0" />

        {/* Undo / Redo */}
        <button
          type="button"
          className="p-1.5 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E2923] text-[#64748B] text-[10px] flex flex-col items-center gap-0.5 cursor-pointer shrink-0"
          title="Hoàn tác"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Hoàn tác</span>
        </button>

        <button
          type="button"
          className="p-1.5 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E2923] text-[#64748B] text-[10px] flex flex-col items-center gap-0.5 cursor-pointer shrink-0"
          title="Làm lại"
        >
          <Redo2 className="w-3.5 h-3.5" />
          <span>Làm lại</span>
        </button>

        <div className="h-6 w-px bg-[#E2E8F0] dark:bg-[#24312B] mx-1 shrink-0" />

        {/* Text / Edit / Sign / Draw / Line */}
        <button
          type="button"
          onClick={() => setActiveRibbonTool("text")}
          className={`px-2 py-1 rounded-lg text-[11px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shrink-0 transition-colors ${
            activeRibbonTool === "text"
              ? "bg-[#2D5A4C] text-white"
              : "hover:bg-[#EAF3EE] text-[#1E293B] dark:text-[#F1F5F9]"
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Thêm văn bản</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveRibbonTool("edit")}
          className={`px-2 py-1 rounded-lg text-[11px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shrink-0 transition-colors ${
            activeRibbonTool === "edit"
              ? "bg-[#2D5A4C] text-white"
              : "hover:bg-[#EAF3EE] text-[#1E293B] dark:text-[#F1F5F9]"
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Chỉnh sửa văn bản</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveRibbonTool("sign")}
          className={`px-2 py-1 rounded-lg text-[11px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shrink-0 transition-colors ${
            activeRibbonTool === "sign"
              ? "bg-[#2D5A4C] text-white"
              : "hover:bg-[#EAF3EE] text-[#1E293B] dark:text-[#F1F5F9]"
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Ký</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveRibbonTool("draw")}
          className={`px-2 py-1 rounded-lg text-[11px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shrink-0 transition-colors ${
            activeRibbonTool === "draw"
              ? "bg-[#2D5A4C] text-white"
              : "hover:bg-[#EAF3EE] text-[#1E293B] dark:text-[#F1F5F9]"
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Vẽ</span>
        </button>

        <button
          type="button"
          className="px-2 py-1 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E2923] text-[#64748B] text-[11px] font-medium flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>Đường thẳng</span>
          <span className="text-[10px]">▾</span>
        </button>

        <div className="h-6 w-px bg-[#E2E8F0] dark:bg-[#24312B] mx-1 shrink-0" />

        {/* Highlight / Image / Stamp / Link / Note */}
        <button
          type="button"
          onClick={() => setActiveRibbonTool("highlight")}
          className={`px-2 py-1 rounded-lg text-[11px] font-bold flex flex-col items-center gap-0.5 cursor-pointer shrink-0 transition-colors ${
            activeRibbonTool === "highlight"
              ? "bg-[#2D5A4C] text-white"
              : "hover:bg-[#EAF3EE] text-[#475569] dark:text-[#CBD5E1]"
          }`}
        >
          <Highlighter className="w-3.5 h-3.5" />
          <span>Bôi đậm văn bản</span>
        </button>

        <button
          type="button"
          className="px-2 py-1 rounded-lg hover:bg-[#EAF3EE] text-[#475569] dark:text-[#CBD5E1] text-[11px] font-medium flex flex-col items-center gap-0.5 cursor-pointer shrink-0"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Ảnh</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentToolSlug("watermark-pdf")}
          className="px-2 py-1 rounded-lg hover:bg-[#EAF3EE] text-[#475569] dark:text-[#CBD5E1] text-[11px] font-medium flex flex-col items-center gap-0.5 cursor-pointer shrink-0"
        >
          <Stamp className="w-3.5 h-3.5" />
          <span>Con dấu</span>
        </button>

        <button
          type="button"
          className="px-2 py-1 rounded-lg hover:bg-[#EAF3EE] text-[#475569] dark:text-[#CBD5E1] text-[11px] font-medium flex flex-col items-center gap-0.5 cursor-pointer shrink-0"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Liên kết</span>
        </button>

        <button
          type="button"
          className="px-2 py-1 rounded-lg hover:bg-[#EAF3EE] text-[#475569] dark:text-[#CBD5E1] text-[11px] font-medium flex flex-col items-center gap-0.5 cursor-pointer shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ghi chú</span>
        </button>

        <div className="h-6 w-px bg-[#E2E8F0] dark:bg-[#24312B] mx-1 shrink-0" />

        {/* Organize / Print / Search */}
        <button
          type="button"
          onClick={() => setCurrentToolSlug("reorder-pages")}
          className="px-2 py-1 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] text-[11px] font-medium flex flex-col items-center gap-0.5 cursor-pointer shrink-0"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Quản lý trang</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-2 py-1 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] text-[11px] font-medium flex flex-col items-center gap-0.5 cursor-pointer shrink-0"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>In</span>
        </button>

        <button
          type="button"
          className="px-2 py-1 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] text-[11px] font-medium flex flex-col items-center gap-0.5 cursor-pointer shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Tìm kiếm</span>
        </button>
      </div>
      )}

      {/* 3. DEDICATED TOOL CONTEXTUAL BAR for watermark / page numbers / metadata */}
      {isWatermarkOrMeta && (
      <div className="bg-[#FAFBFB] dark:bg-[#121715] border-b border-[#E2E8F0] dark:border-[#24312B] px-4 sm:px-6 py-2.5 shadow-2xs overflow-x-auto scrollbar-none z-10">
        {/* Tool: pdf-metadata */}
        {currentToolSlug === "pdf-metadata" && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A]">
              <Sliders className="w-3.5 h-3.5" />
              <span>Chỉnh sửa siêu dữ liệu:</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#64748B]">Tiêu đề:</span>
              <input
                type="text"
                value={metadataConfig.title}
                onChange={(e) => setMetadataConfig({ title: e.target.value })}
                placeholder="Tiêu đề tài liệu..."
                className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F] focus:outline-none focus:border-[#2D5A4C] w-48 sm:w-60 font-medium text-[#111827] dark:text-[#F9FAFB]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#64748B]">Tác giả:</span>
              <input
                type="text"
                value={metadataConfig.author}
                onChange={(e) => setMetadataConfig({ author: e.target.value })}
                placeholder="Tên tác giả..."
                className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F] focus:outline-none focus:border-[#2D5A4C] w-40 sm:w-48 font-medium text-[#111827] dark:text-[#F9FAFB]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#64748B]">Chủ đề:</span>
              <input
                type="text"
                value={metadataConfig.subject}
                onChange={(e) => setMetadataConfig({ subject: e.target.value })}
                placeholder="Chủ đề..."
                className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F] focus:outline-none focus:border-[#2D5A4C] w-36 sm:w-44 font-medium text-[#111827] dark:text-[#F9FAFB]"
              />
            </div>

            <div className="text-[11px] text-[#2D5A4C] dark:text-[#6BAF9A] font-semibold ml-auto flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Tự động đồng bộ</span>
            </div>
          </div>
        )}

        {/* Tool: watermark-pdf */}
        {currentToolSlug === "watermark-pdf" && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A]">
              <Stamp className="w-3.5 h-3.5" />
              <span>Chữ Watermark:</span>
            </div>

            <input
              type="text"
              value={watermarkConfig.text}
              onChange={(e) => setWatermarkConfig({ text: e.target.value })}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F] font-bold w-40"
            />

            <div className="flex items-center gap-1">
              {["BẢN THẢO", "NỘI BỘ", "BẢN QUYỀN", "TUYỆT MẬT"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setWatermarkConfig({ text: chip })}
                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] hover:bg-[#D7E9DE] cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-2">
              <span className="text-[11px] text-[#64748B]">Cỡ: {watermarkConfig.fontSize}pt</span>
              <input
                type="range"
                min="20"
                max="72"
                value={watermarkConfig.fontSize}
                onChange={(e) => setWatermarkConfig({ fontSize: parseInt(e.target.value, 10) })}
                className="w-20 accent-[#2D5A4C]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#64748B]">Mờ: {Math.round(watermarkConfig.opacity * 100)}%</span>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={watermarkConfig.opacity}
                onChange={(e) => setWatermarkConfig({ opacity: parseFloat(e.target.value) })}
                className="w-20 accent-[#2D5A4C]"
              />
            </div>
          </div>
        )}

        {/* Tool: rotate-pdf */}
        {currentToolSlug === "rotate-pdf" && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Góc xoay tài liệu:</span>
            </span>

            <div className="flex items-center gap-2">
              {[
                { angle: 90, label: "Xoay phải 90°", icon: RotateCw },
                { angle: 180, label: "Lật 180°", icon: RotateCw },
                { angle: 270, label: "Xoay trái 90°", icon: RotateCcw },
              ].map((opt) => (
                <button
                  key={opt.angle}
                  type="button"
                  onClick={() => setRotateConfig({ angle: opt.angle as any })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    rotateConfig.angle === opt.angle
                      ? "bg-[#2D5A4C] text-white shadow-2xs"
                      : "bg-white dark:bg-[#1E2923] text-[#475569] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#2E4A3F] hover:bg-[#E2E8F0]"
                  }`}
                >
                  <opt.icon className="w-3 h-3" />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="text-[11px] text-[#64748B] ml-auto">
              Áp dụng cho tất cả {totalPages} trang
            </div>
          </div>
        )}

        {/* Tool: page-numbers */}
        {currentToolSlug === "page-numbers" && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Đánh số trang:</span>
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#64748B]">Định dạng:</span>
              {[
                { format: "page_x_of_y", label: "Trang 1 / 18" },
                { format: "page_x", label: "Trang 1" },
                { format: "x_slash_y", label: "1 / 18" },
              ].map((fmt) => (
                <button
                  key={fmt.format}
                  type="button"
                  onClick={() => setPageNumbersConfig({ format: fmt.format as any })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    pageNumbersConfig.format === fmt.format
                      ? "bg-[#2D5A4C] text-white"
                      : "bg-white dark:bg-[#1E2923] text-[#475569] border border-[#CBD5E1] dark:border-[#2E4A3F]"
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-[11px] text-[#64748B]">Vị trí:</span>
              <select
                value={pageNumbersConfig.position}
                onChange={(e) => setPageNumbersConfig({ position: e.target.value as any })}
                className="px-2 py-1 text-xs rounded-lg bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F]"
              >
                <option value="bottom_center">Góc dưới - Ở giữa</option>
                <option value="bottom_right">Góc dưới - Bên phải</option>
                <option value="top_right">Góc trên - Bên phải</option>
                <option value="bottom_left">Góc dưới - Bên trái</option>
              </select>
            </div>
          </div>
        )}

        {/* Tool: compress-pdf */}
        {currentToolSlug === "compress-pdf" && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Chế độ nén:</span>
            </span>

            {[
              { id: "recommended", label: "Khuyên dùng (~65%)" },
              { id: "extreme", label: "Nén tối đa (~80%)" },
              { id: "low", label: "Nén nhẹ (~35%)" },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setCompressLevel(lvl.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  compressLevel === lvl.id
                    ? "bg-[#2D5A4C] text-white"
                    : "bg-white dark:bg-[#1E2923] text-[#475569] border border-[#CBD5E1] dark:border-[#2E4A3F]"
                }`}
              >
                {lvl.label}
              </button>
            ))}

            <label className="flex items-center gap-1.5 text-xs text-[#475569] dark:text-[#CBD5E1] cursor-pointer ml-2">
              <input
                type="checkbox"
                checked={stripMetadata}
                onChange={(e) => setStripMetadata(e.target.checked)}
                className="rounded accent-[#2D5A4C]"
              />
              <span>Loại bỏ siêu dữ liệu ẩn</span>
            </label>

            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 ml-auto">
              ✓ Tiết kiệm ước tính: ~65% dung lượng
            </span>
          </div>
        )}

        {/* Tool: protect-pdf */}
        {currentToolSlug === "protect-pdf" && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Đặt mật khẩu bảo vệ:</span>
            </span>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={protectPassword}
                onChange={(e) => {
                  setProtectPassword(e.target.value);
                  setProtectConfig({ password: e.target.value, confirmPassword: e.target.value });
                }}
                placeholder="Nhập mật khẩu..."
                className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F] w-48 pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Mã hóa AES-256 Bit chuẩn quân sự</span>
            </span>
          </div>
        )}

        {/* Tool: unlock-pdf */}
        {currentToolSlug === "unlock-pdf" && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <Unlock className="w-3.5 h-3.5" />
              <span>Mở khóa tệp PDF:</span>
            </span>

            <input
              type="password"
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              placeholder="Nhập mật khẩu nếu tệp yêu cầu..."
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F] w-64"
            />

            <span className="text-[11px] text-[#64748B]">
              Xóa bỏ mật khẩu và gỡ toàn bộ giới hạn in ấn, sao chép
            </span>
          </div>
        )}

        {/* Tool: split-pdf / extract-delete-pages */}
        {(currentToolSlug === "split-pdf" || currentToolSlug === "extract-delete-pages") && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Dải trang cần trích xuất:</span>
            </span>

            <input
              type="text"
              value={pageRangeInput}
              onChange={(e) => setPageRangeInput(e.target.value)}
              placeholder={`Ví dụ: 1-3, 5 (Mặc định: Trang ${currentPage})`}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F] w-56 font-mono"
            />

            <button
              type="button"
              onClick={() => setPageRangeInput(`${currentPage}`)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EAF3EE] text-[#2D5A4C] hover:bg-[#D7E9DE] cursor-pointer"
            >
              Chỉ chọn trang {currentPage}
            </button>

            <button
              type="button"
              onClick={() => setPageRangeInput(`1-${totalPages}`)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EAF3EE] text-[#2D5A4C] hover:bg-[#D7E9DE] cursor-pointer"
            >
              Tất cả 1-{totalPages}
            </button>
          </div>
        )}

        {/* Tool: pdf-to-word */}
        {currentToolSlug === "pdf-to-word" && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5" />
              <span>Xuất sang Microsoft Word (.docx):</span>
            </span>
            <span className="text-xs text-[#475569] dark:text-[#CBD5E1]">
              Giữ nguyên 100% bố cục, hình ảnh và định dạng văn bản gốc. Bấm <b>Hoàn thành</b> để tải về.
            </span>
          </div>
        )}

        {/* Tool: pdf-to-excel */}
        {currentToolSlug === "pdf-to-excel" && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Xuất sang Bảng tính Excel (.csv / .xlsx):</span>
            </span>
            <span className="text-xs text-[#475569] dark:text-[#CBD5E1]">
              Trích xuất tự động toàn bộ bảng biểu và các trường số liệu. Bấm <b>Hoàn thành</b> để tải về.
            </span>
          </div>
        )}

        {/* Tool: pdf-to-image */}
        {currentToolSlug === "pdf-to-image" && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Định dạng ảnh xuất:</span>
            </span>

            {[
              { id: "png", label: "PNG (Sắc nét)" },
              { id: "jpg", label: "JPEG (Nhẹ)" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setImageFormat(f.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  imageFormat === f.id
                    ? "bg-[#2D5A4C] text-white"
                    : "bg-white dark:bg-[#1E2923] text-[#475569] border border-[#CBD5E1] dark:border-[#2E4A3F]"
                }`}
              >
                {f.label}
              </button>
            ))}

            <span className="text-[11px] text-[#64748B] ml-2">
              Xuất tệp nén .ZIP chứa toàn bộ {totalPages} trang với độ phân giải cao 2x DPI
            </span>
          </div>
        )}

        {/* Tool: translate-pdf */}
        {currentToolSlug === "translate-pdf" && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" />
              <span>Dịch tài liệu sang:</span>
            </span>

            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F] font-bold"
            >
              <option value="vi">Tiếng Việt 🇻🇳</option>
              <option value="en">Tiếng Anh 🇬🇧</option>
              <option value="ja">Tiếng Nhật 🇯🇵</option>
              <option value="zh">Tiếng Trung 🇨🇳</option>
              <option value="ko">Tiếng Hàn 🇰🇷</option>
              <option value="fr">Tiếng Pháp 🇫🇷</option>
              <option value="de">Tiếng Đức 🇩🇪</option>
            </select>

            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ Giữ nguyên 100% tọa độ khung chữ và kiểu phông ban đầu
            </span>
          </div>
        )}

        {/* Tool: ocr-pdf */}
        {currentToolSlug === "ocr-pdf" && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ngôn ngữ nhận dạng OCR:</span>
            </span>

            <select
              value={ocrLang}
              onChange={(e) => setOcrLang(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F] font-bold"
            >
              <option value="vie+eng">Tiếng Việt + Tiếng Anh</option>
              <option value="vie">Chỉ Tiếng Việt</option>
              <option value="eng">Chỉ Tiếng Anh</option>
            </select>

            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ Xuất tài liệu PDF có thể tìm kiếm và sao chép văn bản
            </span>
          </div>
        )}

        {/* Tool: ai-summary */}
        {currentToolSlug === "ai-summary" && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kiểu tóm tắt AI:</span>
            </span>

            <select
              value={summaryStyle}
              onChange={(e) => setSummaryStyle(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F] font-bold"
            >
              <option value="key_points">Gạch đầu dòng ý chính</option>
              <option value="concise">Tóm tắt ngắn gọn 1 đoạn</option>
              <option value="detailed">Bản phân tích chi tiết</option>
            </select>

            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ Sử dụng mô hình AI tích hợp phân tích nội dung
            </span>
          </div>
        )}

        {/* Fallback for other tools */}
        {![
          "pdf-metadata",
          "watermark-pdf",
          "rotate-pdf",
          "page-numbers",
          "compress-pdf",
          "protect-pdf",
          "unlock-pdf",
          "split-pdf",
          "extract-delete-pages",
          "pdf-to-word",
          "pdf-to-excel",
          "pdf-to-image",
          "translate-pdf",
          "ocr-pdf",
          "ai-summary",
        ].includes(currentToolSlug) && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#475569] dark:text-[#CBD5E1]">
            <Sparkles className="w-3.5 h-3.5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
            <span>Công cụ <b>{currentTool.name}</b> đã sẵn sàng. Bạn có thể xem trước trang hoặc bấm <b>Hoàn thành</b> để xuất kết quả.</span>
          </div>
        )}
      </div>
      )}

      {/* 4. MAIN WORKSPACE: LEFT THUMBNAILS (Exact match to pdfaid.com) + CENTER CANVAS VIEWPORT */}
      <div className="flex-1 flex overflow-hidden">
        {/* A. LEFT THUMBNAIL STRIP */}
        <aside className="w-36 sm:w-44 bg-white dark:bg-[#141A17] border-r border-[#E2E8F0] dark:border-[#24312B] flex flex-col shrink-0 overflow-hidden">
          {/* Vertical Page List with Divider + icon between pages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              const thumbUrl = activeFile.pageThumbnails?.[idx];

              return (
                <div key={pageNum} className="flex flex-col items-center">
                  {/* Thumbnail Card matching reference: active card has clear blue/brand border */}
                  <div
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative w-28 sm:w-32 h-36 sm:h-40 rounded-lg bg-white dark:bg-[#1E2923] border-2 cursor-pointer transition-all shadow-xs flex items-center justify-center overflow-hidden ${
                      isActive
                        ? "border-[#1677FF] ring-2 ring-[#1677FF]/20 shadow-md scale-[1.02]"
                        : "border-[#E2E8F0] dark:border-[#2E4A3F] hover:border-[#1677FF]/50"
                    }`}
                  >
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={`Trang ${pageNum}`}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <FileText className="w-6 h-6 text-[#94A3B8] mx-auto mb-1" />
                        <span className="text-[10px] font-bold text-[#64748B]">Trang {pageNum}</span>
                      </div>
                    )}
                  </div>

                  {/* Page number below card */}
                  <span
                    className={`text-[11px] font-extrabold mt-1 ${
                      isActive
                        ? "text-[#1677FF] dark:text-[#4096FF]"
                        : "text-[#64748B] dark:text-[#94A3B8]"
                    }`}
                  >
                    {pageNum}
                  </span>

                  {/* Divider line with small '+' circle in between cards (matching pdfaid.com reference) */}
                  {pageNum < totalPages && (
                    <div className="relative w-full flex items-center justify-center my-2 group/add">
                      <div className="absolute inset-x-2 h-px bg-[#E2E8F0] dark:bg-[#2E4A3F]" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Thêm trang mới vào giữa trang ${pageNum} và trang ${pageNum + 1}`);
                        }}
                        title="Thêm trang vào đây"
                        className="relative z-10 w-4 h-4 rounded-full bg-white dark:bg-[#1E2923] border border-[#CBD5E1] dark:border-[#2E4A3F] hover:border-[#2D5A4C] hover:bg-[#EAF3EE] text-[#64748B] hover:text-[#2D5A4C] flex items-center justify-center text-[9px] transition-all cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* B. CENTER DOCUMENT CANVAS VIEWPORT */}
        <main
          ref={viewportRef}
          className={`flex-1 min-h-0 relative flex flex-col items-center justify-start overflow-auto p-4 sm:p-8 bg-[#ECEEF0] dark:bg-[#0D1210] overscroll-contain ${
            isPanActive ? "cursor-grab active:cursor-grabbing" : "cursor-default"
          }`}
        >
          {/* Main PDF Page Sheet */}
          <div className="relative my-auto transition-transform duration-150">
            {loadingPage && (
              <div className="absolute inset-0 bg-white/70 dark:bg-black/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#2D5A4C]" />
              </div>
            )}

            {/* Document Canvas Sheet with realistic paper elevation */}
            <div className="rounded-sm overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 bg-white">
              <canvas ref={canvasRef} className="block max-w-full h-auto" />
            </div>
          </div>

          {/* FLOATING BOTTOM CONTROL CAPSULE (Exact match to pdfaid.com /document/create) */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-full bg-[#22272E]/90 dark:bg-[#0F1713]/95 backdrop-blur-md text-white shadow-2xl flex items-center gap-3 sm:gap-4 text-xs font-semibold border border-white/10">
            {/* Page navigation with jump dropdown */}
            <div className="relative flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowJumpDropdown(!showJumpDropdown)}
                className="px-2 py-0.5 rounded hover:bg-white/20 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Trang: {currentPage}/{totalPages}</span>
                <span className="text-[10px] opacity-70">▾</span>
              </button>

              {showJumpDropdown && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 max-h-48 overflow-y-auto rounded-xl bg-[#22272E] border border-white/20 p-1.5 shadow-2xl space-y-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      type="button"
                      onClick={() => {
                        setCurrentPage(i + 1);
                        setShowJumpDropdown(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                        currentPage === i + 1 ? "bg-[#2D5A4C] text-white font-bold" : "hover:bg-white/15"
                      }`}
                    >
                      Trang {i + 1}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                title="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="h-4 w-px bg-white/20" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.5, s - 0.15))}
                className="p-1 rounded-full hover:bg-white/20 cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-mono px-1 font-bold">
                {Math.round(scale * 100)}%
              </span>

              <button
                type="button"
                onClick={() => setScale((s) => Math.min(2.5, s + 0.15))}
                className="p-1 rounded-full hover:bg-white/20 cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-4 w-px bg-white/20" />

            {/* Hand Pan Tool */}
            <button
              type="button"
              onClick={() => setIsPanActive(!isPanActive)}
              className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                isPanActive ? "bg-white text-black" : "hover:bg-white/20"
              }`}
              title="Công cụ di chuyển bàn tay (Pan)"
            >
              <Move className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-white/20" />

            {/* Fit page toggle */}
            <button
              type="button"
              onClick={() => setScale(1.0)}
              className="px-2 py-0.5 rounded hover:bg-white/20 text-[11px] font-bold cursor-pointer flex items-center gap-1"
              title="Đặt lại kích thước chuẩn vừa khung"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Vừa trang</span>
            </button>
          </div>
        </main>
      </div>
      </>
      )}

      {/* 5. SUCCESS BANNER OVERLAY WHEN DOWNLOAD IS READY (AUTO-HIDES) */}
      {showSuccessBanner && completedUrl && (
        <div className="absolute top-20 right-6 z-50 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#161D1A] border-2 border-[#2D5A4C] shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-9 h-9 rounded-xl bg-[#2D5A4C] text-white flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="min-w-0 pr-1">
            <div className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB]">
              Tài liệu đã xử lý thành công!
            </div>
            <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate max-w-[220px]">
              Đang tự động tải về: {completedFilename}
            </div>
          </div>
          <a
            href={completedUrl}
            download={completedFilename || "hipdf_output.pdf"}
            onClick={displaySuccessBanner}
            className="ml-1 px-3 py-1.5 rounded-lg bg-[#2D5A4C] text-white text-xs font-bold hover:bg-[#23473C] transition-colors shrink-0"
          >
            Tải lại
          </a>
          <button
            type="button"
            onClick={() => setShowSuccessBanner(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-1"
            title="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
