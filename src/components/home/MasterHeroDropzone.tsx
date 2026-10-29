"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  Check,
  CheckCircle2,
  Loader2,
  UploadCloud,
  Sparkles,
  Layers,
  Scissors,
  Minimize2,
  PenTool,
  ArrowRight,
  LayoutGrid,
  RefreshCw,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { loadPdfDocInfo } from "@/lib/pdf/pdf-renderer";
import { formatFileSize } from "@/lib/utils";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { DropzoneIllustration } from "../ui/DropzoneIllustration";
import { PdfStudioModal } from "../studio/PdfStudioModal";
import { ToolSelectorModal } from "../studio/ToolSelectorModal";
import { UploadProgressModal } from "../modals/UploadProgressModal";
import { TRANSLATIONS } from "@/lib/i18n/translations";

export function MasterHeroDropzone() {
  const { files, activeFileIndex, addFiles, removeFile, language } = useAppStore();
  const [loadingSample, setLoadingSample] = useState(false);
  const [toolPickerOpen, setToolPickerOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [selectedStudioTool, setSelectedStudioTool] = useState<string>("pdf-to-word");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileInfo, setUploadingFileInfo] = useState<{ name: string; size: number } | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[language].hero;
  const activeFile = files[activeFileIndex] || files[0];

  const quickActions = useMemo(
    () => [
      {
        slug: "translate-pdf",
        title: language === "vi" ? "Dịch PDF AI" : "AI Translate",
        desc: language === "vi" ? "Giữ 100% bố cục" : "Preserve layout",
        icon: Sparkles,
        colorClass: "bg-sky-100 text-[#0284C7] dark:bg-sky-950/70 dark:text-[#38BDF8]",
      },
      {
        slug: "pdf-to-word",
        title: language === "vi" ? "PDF sang Word" : "PDF to Word",
        desc: language === "vi" ? "Chuyển file DOCX" : "Export to DOCX",
        icon: FileText,
        colorClass: "bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300",
      },
      {
        slug: "merge-pdf",
        title: language === "vi" ? "Ghép PDF" : "Merge PDF",
        desc: language === "vi" ? "Gộp & thêm tệp" : "Combine files",
        icon: Layers,
        colorClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300",
      },
      {
        slug: "split-pdf",
        title: language === "vi" ? "Tách PDF" : "Split PDF",
        desc: language === "vi" ? "Chia nhỏ trang" : "Extract pages",
        icon: Scissors,
        colorClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      },
      {
        slug: "compress-pdf",
        title: language === "vi" ? "Nén PDF" : "Compress PDF",
        desc: language === "vi" ? "Giảm dung lượng" : "Optimize size",
        icon: Minimize2,
        colorClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
      },
      {
        slug: "sign-pdf",
        title: language === "vi" ? "Ký & Ghi chú" : "Sign & Edit",
        desc: language === "vi" ? "Chữ ký điện tử" : "Digital signature",
        icon: PenTool,
        colorClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
      },
    ],
    [language]
  );

  // Process files dropped or selected with realistic, smooth upload modal
  const handleFiles = useCallback(
    async (fileList: File[]) => {
      if (!fileList || fileList.length === 0) return;
      const file = fileList[0];
      setUploadingFileInfo({ name: file.name, size: file.size });
      setUploadProgress(12);
      setUploadModalOpen(true);

      const startTime = Date.now();
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          const inc = Math.floor(Math.random() * 20) + 12;
          return Math.min(92, prev + inc);
        });
      }, 150);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const objectUrl = URL.createObjectURL(file);
        let pageCount = 1;
        let pageThumbnails: string[] = [];

        if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
          try {
            const info = await loadPdfDocInfo(arrayBuffer);
            pageCount = info.numPages;
            pageThumbnails = info.pageThumbnails;
          } catch (err) {
            console.warn("Could not read pdf info", err);
          }
        }

        // Keep upload progress visible for smooth UX (at least 800ms)
        const elapsed = Date.now() - startTime;
        if (elapsed < 800) {
          await new Promise((r) => setTimeout(r, 800 - elapsed));
        }

        clearInterval(progressTimer);
        setUploadProgress(100);

        addFiles([
          {
            id: `hero-file-${Date.now()}-0`,
            file,
            name: file.name,
            size: file.size,
            arrayBuffer,
            objectUrl,
            pageCount,
            pageThumbnails,
          },
        ]);

        // Pause briefly at 100% to display completion, then smoothly reveal the active document card on homepage!
        setTimeout(() => {
          setUploadModalOpen(false);
        }, 400);
      } catch (err) {
        clearInterval(progressTimer);
        console.error("Error loading file in hero:", err);
        setUploadModalOpen(false);
      }
    },
    [addFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFiles,
    multiple: false,
    noClick: !!activeFile,
  });

  // Generate an instant bilingual academic PDF sample
  const handleLoadSample = async () => {
    setLoadingSample(true);
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

      const page1 = doc.addPage([595, 842]);
      const { width, height } = page1.getSize();

      page1.drawText("Deep Learning Approaches to Document Translation", {
        x: 50,
        y: height - 70,
        size: 16,
        font: fontBold,
        color: rgb(0.1, 0.2, 0.18),
      });

      page1.drawText("Preserving Coordinates, Typography & Visual Artifacts", {
        x: 50,
        y: height - 90,
        size: 11,
        font,
        color: rgb(0.3, 0.35, 0.4),
      });

      const abstract =
        "Abstract—Traditional PDF translation engines discard original coordinate data, causing translated words to overflow bounding boxes and corrupt figures. This study introduces a semantic layout preservation engine that dynamically calculates bounding boxes and scales typography proportionally.";
      page1.drawText(abstract, {
        x: 50,
        y: height - 130,
        size: 9.5,
        font,
        color: rgb(0.2, 0.25, 0.3),
        maxWidth: width - 100,
        lineHeight: 14,
      });

      // Sample table
      const tableY = height - 250;
      page1.drawRectangle({
        x: 50,
        y: tableY,
        width: width - 100,
        height: 65,
        borderColor: rgb(0.8, 0.85, 0.9),
        borderWidth: 1,
        color: rgb(0.96, 0.98, 0.97),
      });

      page1.drawText("Document Metric            Original Score       Retained Layout", {
        x: 65,
        y: tableY + 45,
        size: 9,
        font: fontBold,
        color: rgb(0.8, 0.2, 0.2),
      });

      page1.drawText("Semantic Structure           94.8%                 99.4%", {
        x: 65,
        y: tableY + 25,
        size: 9,
        font,
        color: rgb(0.2, 0.25, 0.3),
      });

      page1.drawText("Coordinate Bounding Box      98.2%                 99.8%", {
        x: 65,
        y: tableY + 10,
        size: 9,
        font,
        color: rgb(0.2, 0.25, 0.3),
      });

      const bytes = await doc.save();
      const sampleBlob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const sampleFile = new File([sampleBlob], "Bao_cao_nghien_cuu_mau.pdf", {
        type: "application/pdf",
      });

      await handleFiles([sampleFile]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <section className="relative pt-3 sm:pt-5 pb-14 sm:pb-20 overflow-hidden">
      {/* Ambient background glow for high-end SaaS feel with floating animations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[460px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-b from-[#0284C7]/20 via-[#0284C7]/5 to-transparent blur-3xl rounded-full animate-float-slow" />
        <div className="absolute top-[60px] left-1/4 w-[320px] h-[200px] bg-gradient-to-tr from-sky-500/15 to-blue-400/10 blur-2xl rounded-full animate-pulse-glow" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 2-Column Split Hero Layout - Always Spacious, Balanced & Premium */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Title, Subtitle, 4 Checkmarks */}
          <div className="lg:col-span-6 space-y-6 text-left flex flex-col justify-center animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#0F172A] dark:text-[#F9FAFB] tracking-tight leading-[1.2]">
              {t.headline}
            </h1>

            <p className="text-sm sm:text-base font-medium text-[#475569] dark:text-[#CBD5E1] leading-relaxed max-w-lg">
              {t.subtitle}
            </p>

            {/* 4 Bullet Points with Blue Checkmarks */}
            <ul className="space-y-3.5 pt-1">
              {t.bullets.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-sm sm:text-[15px] font-semibold text-[#1E293B] dark:text-[#E2E8F0] hover:translate-x-1 transition-transform duration-200"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#F0F9FF] dark:bg-[#0C2438] text-[#0284C7] dark:text-[#38BDF8] shrink-0 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8] stroke-[3]" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Dropzone card */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="relative p-0.5 rounded-3xl bg-gradient-to-b from-[#0284C7]/20 via-[#E2E8F0]/50 to-transparent dark:from-[#0284C7]/25 dark:via-[#1E293B]/40 dark:to-transparent shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] card-hover-fx">
              <div className="bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md rounded-[22px] p-6 sm:p-7 border border-white/60 dark:border-white/5">
                {!activeFile ? (
                  /* Standard Dropzone State */
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer group ${
                      isDragActive
                        ? "border-[#0284C7] bg-[#F0F9FF] dark:bg-[#0C2438] scale-[1.02]"
                        : "border-[#CBD5E1] dark:border-[#334155] hover:border-[#0284C7] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/50"
                    }`}
                  >
                    <input {...getInputProps()} />

                    <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-[#F9FAFB] tracking-tight mb-2">
                      {t.dropzone.title}
                    </h2>

                    <DropzoneIllustration className="w-32 h-24 sm:w-36 sm:h-28 mx-auto my-3 animate-float" />

                    <h3 className="text-sm sm:text-base font-bold text-[#334155] dark:text-[#D1D5DB] mb-2 group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] transition-colors">
                      {isDragActive ? t.dropzone.dragActive : t.dropzone.dropText}
                    </h3>

                    {/* Divider with HOẶC / OR */}
                    <div className="relative my-3.5 max-w-[220px] mx-auto">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                      </div>
                      <div className="relative flex justify-center text-[10px]">
                        <span className="bg-white dark:bg-[#111827] px-2.5 font-bold text-gray-400 tracking-wider">
                          {t.dropzone.or}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm sm:text-base font-bold transition-all shadow-md shadow-[#0284C7]/25 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                      >
                        {t.dropzone.uploadBtn}
                      </button>

                      <button
                        type="button"
                        data-testid="sample-pdf-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadSample();
                        }}
                        disabled={loadingSample}
                        className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white dark:bg-[#1E293B] hover:bg-[#F1F5F9] dark:hover:bg-[#334155] text-[#334155] dark:text-[#CBD5E1] border-2 border-[#CBD5E1] dark:border-[#334155] text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 shadow-2xs"
                      >
                        {loadingSample ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#0284C7]" />
                        ) : (
                          <FileText className="w-4 h-4 text-[#0284C7]" />
                        )}
                        <span>{loadingSample ? t.dropzone.sampleGenerating : t.dropzone.sampleBtn}</span>
                      </button>
                    </div>

                    {/* Supported format badges */}
                    <div className="mt-4 pt-3.5 border-t border-[#F1F5F9] dark:border-[#1E293B] flex flex-wrap items-center justify-center gap-1.5 text-xs text-gray-500">
                      <span className="font-bold text-[#334155] dark:text-[#E2E8F0]">{t.dropzone.supportedFormats}</span>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 font-semibold text-gray-700 dark:text-gray-300 text-[11px]">PDF</span>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 font-semibold text-gray-700 dark:text-gray-300 text-[11px]">Word</span>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 font-semibold text-gray-700 dark:text-gray-300 text-[11px]">Excel</span>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 font-semibold text-gray-700 dark:text-gray-300 text-[11px]">PowerPoint</span>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 font-semibold text-gray-700 dark:text-gray-300 text-[11px]">JPG/PNG</span>
                    </div>
                  </div>
                ) : (
                  /* Modern Active File Loaded State in Hero Card */
                  <div
                    {...getRootProps()}
                    className="relative border-2 border-[#BAE6FD] dark:border-[#0369A1]/60 bg-[#F0F9FF]/40 dark:bg-[#0B1522] rounded-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-300 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <input {...getInputProps()} />
                    <input
                      ref={replaceInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const fileList = e.target.files;
                        if (fileList && fileList.length > 0) {
                          handleFiles([fileList[0]]);
                        }
                        e.target.value = "";
                      }}
                    />

                    {/* Drag & drop overlay to replace */}
                    {isDragActive && (
                      <div className="absolute inset-0 bg-[#F0F9FF]/95 dark:bg-[#0B1522]/95 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-[#0284C7] z-30 animate-in fade-in-50 duration-200">
                        <UploadCloud className="w-12 h-12 text-[#0284C7] dark:text-[#38BDF8] animate-bounce mb-2" />
                        <p className="text-sm sm:text-base font-bold text-[#0284C7] dark:text-[#38BDF8]">
                          {t.activeFile.dragToReplace || "Thả tệp mới vào đây để thay thế"}
                        </p>
                      </div>
                    )}

                    {/* Top Status & Quick Actions Bar */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping-subtle absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.activeFile.uploadedSuccess}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => replaceInputRef.current?.click()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0284C7] dark:hover:text-[#38BDF8] hover:bg-[#F0F9FF] dark:hover:bg-[#0C2438] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                          title={t.activeFile.changeFile}
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{t.activeFile.changeFile}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFile(activeFile.id)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title={t.activeFile.removeFile || "Xóa tệp"}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Document Preview & Details Box */}
                    <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                      {/* Real Thumbnail Preview */}
                      <div className="relative w-16 h-22 sm:w-18 sm:h-24 shrink-0 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center group/thumb">
                        {activeFile.pageThumbnails && activeFile.pageThumbnails.length > 0 ? (
                          <img
                            src={activeFile.pageThumbnails[0]}
                            alt={`Trang 1 của ${activeFile.name}`}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/thumb:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white">
                            <FileText className="w-7 h-7 stroke-[2]" />
                            <span className="text-[9px] font-black uppercase mt-1 tracking-wider">PDF</span>
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/75 backdrop-blur-xs text-[9px] font-bold text-white leading-tight">
                          P.1
                        </span>
                      </div>

                      {/* File Info Details */}
                      <div className="flex-1 min-w-0 space-y-1.5 text-left">
                        <h3
                          className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate"
                          title={activeFile.name}
                        >
                          {activeFile.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          {activeFile.pageCount && (
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                              <Layers className="w-3 h-3 text-[#0284C7] dark:text-[#38BDF8]" />
                              {activeFile.pageCount} {t.activeFile.pages}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                            {formatFileSize(activeFile.size)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick 1-Click Action Tools Grid */}
                    <div className="space-y-2 text-left pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                        <span>{t.activeFile.quickToolsTitle || "CÔNG CỤ PHỔ BIẾN"}</span>
                        <span className="text-[#0284C7] dark:text-[#38BDF8] font-semibold">1-Click mở xử lý ngay</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {quickActions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={action.slug}
                              type="button"
                              onClick={() => {
                                setSelectedStudioTool(action.slug);
                                setStudioOpen(true);
                              }}
                              className="group p-2.5 rounded-xl bg-white dark:bg-[#1E293B]/70 hover:bg-[#F0F9FF] dark:hover:bg-[#0C2438] border border-slate-200 dark:border-slate-700 hover:border-[#0284C7] dark:hover:border-[#38BDF8] transition-all duration-200 text-left flex flex-col justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${action.colorClass}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] group-hover:translate-x-0.5 transition-all" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] transition-colors leading-tight">
                                  {action.title}
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">
                                  {action.desc}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Full Tools Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setToolPickerOpen(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#0284C7]/20 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 group"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        <span>{t.activeFile.viewAllTools || "Xem tất cả 50+ công cụ PDF"}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 0. Upload Progress Modal (opens during upload, matching PDFAid) */}
      <UploadProgressModal
        isOpen={uploadModalOpen}
        fileName={uploadingFileInfo?.name}
        fileSize={uploadingFileInfo?.size}
        progress={uploadProgress}
      />

      {/* 1. Tool Selection Category Popup (opens automatically upon uploading a file) */}
      {activeFile && (
        <ToolSelectorModal
          isOpen={toolPickerOpen}
          onClose={() => setToolPickerOpen(false)}
          file={activeFile}
          onSelectTool={(slug) => {
            setSelectedStudioTool(slug);
            setToolPickerOpen(false);
            setStudioOpen(true);
          }}
          onChangeFile={(newFile) => {
            handleFiles([newFile]);
          }}
        />
      )}

      {/* 2. Full-Screen Interactive PDF Processing Studio Modal */}
      {activeFile && (
        <PdfStudioModal
          isOpen={studioOpen}
          onClose={() => setStudioOpen(false)}
          initialToolSlug={selectedStudioTool}
          file={activeFile}
        />
      )}
    </section>
  );
}
