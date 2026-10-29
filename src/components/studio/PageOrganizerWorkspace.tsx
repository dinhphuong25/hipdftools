"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  RotateCw,
  RotateCcw,
  Trash2,
  Check,
  Download,
  Loader2,
  CheckCircle2,
  Scissors,
  Plus,
  FileText,
  Files,
  UploadCloud,
} from "lucide-react";
import { LoadedPdfFile, useAppStore } from "@/lib/store/useAppStore";
import { splitPdf, rotatePdf, extractOrDeletePages } from "@/lib/pdf/pdf-engine";
import { loadPdfDocInfo } from "@/lib/pdf/pdf-renderer";
import { PDFDocument, degrees } from "pdf-lib";

interface PageOrganizerWorkspaceProps {
  file: LoadedPdfFile;
  toolSlug: string;
  onComplete: (outputBlob: Blob, filename: string) => void;
  triggerDownload: (url: string, filename: string) => void;
}

interface FlatPage {
  globalIndex: number;
  docIndex: number;
  docName: string;
  pageInDoc: number;
  thumbnail?: string;
}

export function PageOrganizerWorkspace({
  file,
  toolSlug,
  onComplete,
  triggerDownload,
}: PageOrganizerWorkspaceProps) {
  const { addFiles } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMerge = toolSlug === "merge-pdf";
  const isSplit = toolSlug === "split-pdf";
  const isRotate = toolSlug === "rotate-pdf";
  const isExtractDelete = toolSlug === "extract-delete-pages";

  // Multi-document tracking
  const [docFiles, setDocFiles] = useState<LoadedPdfFile[]>([file]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({});
  const [deletedPages, setDeletedPages] = useState<number[]>([]);
  const [splitRange, setSplitRange] = useState("1-3, 5");
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);

  // Compute unified list of all pages across all loaded PDF files
  const allPages: FlatPage[] = useMemo(() => {
    const list: FlatPage[] = [];
    let gIdx = 1;
    docFiles.forEach((doc, dIdx) => {
      const count = doc.pageCount || 1;
      for (let p = 1; p <= count; p++) {
        list.push({
          globalIndex: gIdx++,
          docIndex: dIdx,
          docName: doc.name,
          pageInDoc: p,
          thumbnail: doc.pageThumbnails?.[p - 1],
        });
      }
    });
    return list;
  }, [docFiles]);

  const totalPages = allPages.length;

  // Handle adding more PDF files from outside
  const handleAppendPdfFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setProcessing(true);
    setProcessingMessage("Đang đọc và phân tích tệp PDF bổ sung...");

    const newDocs: LoadedPdfFile[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const f = selectedFiles[i];
      if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") continue;

      try {
        const arrayBuffer = await f.arrayBuffer();
        const objectUrl = URL.createObjectURL(f);
        let pageCount = 1;
        let pageThumbnails: string[] = [];

        try {
          const info = await loadPdfDocInfo(arrayBuffer);
          pageCount = info.numPages;
          pageThumbnails = info.pageThumbnails;
        } catch (err) {
          console.warn("Could not load pdf info for appended file", err);
        }

        newDocs.push({
          id: `append-file-${Date.now()}-${i}`,
          file: f,
          name: f.name,
          size: f.size,
          arrayBuffer,
          objectUrl,
          pageCount,
          pageThumbnails,
        });
      } catch (err) {
        console.error("Error reading appended file", err);
      }
    }

    if (newDocs.length > 0) {
      setDocFiles((prev) => [...prev, ...newDocs]);
      addFiles(newDocs);
    }

    setProcessing(false);
    setProcessingMessage("");
    e.target.value = "";
  };

  const toggleSelectPage = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum]
    );
  };

  const handleRotatePage = (pageNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPageRotations((prev) => ({
      ...prev,
      [pageNum]: ((prev[pageNum] || 0) + 90) % 360,
    }));
  };

  const handleDeletePage = (pageNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum]
    );
  };

  const handleRotateAll = (deg: number) => {
    const newRot: Record<number, number> = {};
    for (let i = 1; i <= totalPages; i++) {
      newRot[i] = ((pageRotations[i] || 0) + deg) % 360;
    }
    setPageRotations(newRot);
  };

  const handleSelectAll = () => {
    setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
  };

  const handleSelectEven = () => {
    setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 === 0));
  };

  const handleSelectOdd = () => {
    setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 !== 0));
  };

  const handleApply = async () => {
    setProcessing(true);
    setProcessingMessage("Đang tổng hợp và tạo tệp PDF hoàn chỉnh...");

    try {
      let outputBytes: Uint8Array | null = null;
      let filename = "";

      // Multi-file merge flow OR single file flow
      if (isMerge || docFiles.length > 1) {
        const mergedDoc = await PDFDocument.create();
        const keepPages = allPages.filter((p) => !deletedPages.includes(p.globalIndex));

        // Load all source PDF documents
        const loadedDocs: PDFDocument[] = [];
        for (const df of docFiles) {
          const d = await PDFDocument.load(df.arrayBuffer, { ignoreEncryption: true });
          loadedDocs.push(d);
        }

        // Copy each page in current visual order, applying custom rotation
        for (const page of keepPages) {
          const srcDoc = loadedDocs[page.docIndex];
          const [copiedPage] = await mergedDoc.copyPages(srcDoc, [page.pageInDoc - 1]);
          const rot = pageRotations[page.globalIndex] || 0;
          if (rot !== 0) {
            const cur = copiedPage.getRotation().angle;
            copiedPage.setRotation(degrees((cur + rot) % 360));
          }
          mergedDoc.addPage(copiedPage);
        }

        outputBytes = await mergedDoc.save();
        filename = `hipdf_ghep_${docFiles.length}_tep.pdf`;
      } else if (isSplit) {
        const range = splitRange.trim() || `1-${Math.min(totalPages, 3)}`;
        outputBytes = await splitPdf(file.arrayBuffer, range);
        filename = `${file.name.replace(".pdf", "")}_da_tach.pdf`;
      } else if (isRotate) {
        outputBytes = await rotatePdf(file.arrayBuffer, pageRotations);
        filename = `${file.name.replace(".pdf", "")}_da_xoay.pdf`;
      } else if (deletedPages.length > 0) {
        const keep = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
          (p) => !deletedPages.includes(p)
        );
        outputBytes = await extractOrDeletePages(file.arrayBuffer, keep.length > 0 ? keep : [1]);
        filename = `${file.name.replace(".pdf", "")}_da_chinh_sua_trang.pdf`;
      } else {
        outputBytes = await rotatePdf(file.arrayBuffer, pageRotations);
        filename = `${file.name.replace(".pdf", "")}_sap_xep.pdf`;
      }

      const blob = new Blob([outputBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ url, filename });
      onComplete(blob, filename);
      triggerDownload(url, filename);
    } catch (err: any) {
      console.error(err);
      alert(`Xử lý trang: ${err?.message || "Đã xảy ra lỗi khi tạo tệp PDF"}`);
    } finally {
      setProcessing(false);
      setProcessingMessage("");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC] dark:bg-[#0B1120] overflow-hidden">
      {/* Hidden File Input for Adding PDFs from Outside */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        onChange={handleAppendPdfFiles}
        className="hidden"
      />

      {/* 1. TOP BATCH ACTION TOOLBAR */}
      <div className="bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs z-20 shrink-0">
        {/* Left: Quick Selection, Rotation & ADD PDF Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Prominent "+ Thêm tệp PDF" Button in Toolbar */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/70 dark:hover:bg-sky-900/80 text-[#0284C7] dark:text-[#38BDF8] border-2 border-[#0284C7]/40 hover:border-[#0284C7] dark:border-[#38BDF8]/40 dark:hover:border-[#38BDF8] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="Bổ sung thêm tài liệu PDF từ máy tính"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm tệp PDF</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={() => handleRotateAll(90)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1E293B] dark:hover:bg-[#334155] text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Xoay tất cả 90°</span>
          </button>

          <button
            type="button"
            onClick={() => handleRotateAll(-90)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1E293B] dark:hover:bg-[#334155] text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xoay ngược 90°</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          <button
            type="button"
            onClick={handleSelectAll}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0284C7] cursor-pointer"
          >
            Tất cả
          </button>

          <button
            type="button"
            onClick={handleSelectEven}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0284C7] cursor-pointer"
          >
            Trang chẵn
          </button>

          <button
            type="button"
            onClick={handleSelectOdd}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0284C7] cursor-pointer"
          >
            Trang lẻ
          </button>

          {selectedPages.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedPages([])}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
            >
              Bỏ chọn ({selectedPages.length})
            </button>
          )}
        </div>

        {/* Right: Split Input (if Split tool) & Apply CTA */}
        <div className="flex items-center gap-3">
          {isSplit && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Khoảng trang:</span>
              <input
                type="text"
                value={splitRange}
                onChange={(e) => setSplitRange(e.target.value)}
                placeholder="Ví dụ: 1-3, 5, 8"
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 w-32 font-mono text-slate-800 dark:text-white"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleApply}
            disabled={processing}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0284C7]/25 flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{processingMessage || "Đang xử lý..."}</span>
              </>
            ) : isMerge || docFiles.length > 1 ? (
              <>
                <Files className="w-4 h-4" />
                <span>Ghép {docFiles.length} tệp PDF ngay</span>
              </>
            ) : isSplit ? (
              <>
                <Scissors className="w-4 h-4" />
                <span>Tách PDF ngay</span>
              </>
            ) : isExtractDelete ? (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Xóa & Trích xuất trang</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Áp dụng thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. MAIN VISUAL PAGE GRID */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 overscroll-contain">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Subheader Information */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-semibold px-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-200">
                Tổng số: {docFiles.length} tệp PDF
              </span>
              <span>•</span>
              <span>{totalPages} trang trong tài liệu</span>
              {docFiles.length > 1 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-[#0284C7] dark:text-[#38BDF8] border border-sky-200 dark:border-sky-800 font-bold">
                  Chế độ ghép đa tệp
                </span>
              )}
            </div>
            <span>Nhấp vào trang để chọn hoặc dùng các nút để xoay/xóa trực tiếp</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {allPages.map((page) => {
              const pageNum = page.globalIndex;
              const isSelected = selectedPages.includes(pageNum);
              const isDeleted = deletedPages.includes(pageNum);
              const rotation = pageRotations[pageNum] || 0;
              const thumbnail = page.thumbnail;

              return (
                <div
                  key={pageNum}
                  onClick={() => toggleSelectPage(pageNum)}
                  className={`group relative flex flex-col rounded-2xl bg-white dark:bg-[#111827] border-2 transition-all duration-200 cursor-pointer overflow-hidden shadow-xs hover:shadow-md ${
                    isDeleted
                      ? "opacity-35 grayscale border-slate-300 dark:border-slate-800"
                      : isSelected
                      ? "border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-md"
                      : "border-slate-200 dark:border-slate-800 hover:border-[#0284C7]/50"
                  }`}
                >
                  {/* Top Bar on Page Tile: Page Number & Source File Info */}
                  <div className="p-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#1E293B]/50 gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 font-mono">
                        #{pageNum}
                      </span>
                      {docFiles.length > 1 && (
                        <span
                          className="text-[9px] font-medium text-slate-400 dark:text-slate-500 truncate max-w-[80px]"
                          title={page.docName}
                        >
                          F{page.docIndex + 1}
                        </span>
                      )}
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-[#0284C7] bg-[#0284C7] text-white"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Thumbnail Container */}
                  <div className="p-4 flex items-center justify-center bg-slate-50/40 dark:bg-[#070D18] min-h-[170px] relative overflow-hidden">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={`Trang ${pageNum}`}
                        style={{ transform: `rotate(${rotation}deg)` }}
                        className="max-h-[140px] max-w-full object-contain rounded shadow-xs transition-transform duration-300"
                      />
                    ) : (
                      <div
                        style={{ transform: `rotate(${rotation}deg)` }}
                        className="w-24 h-32 rounded bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center p-2 text-center transition-transform duration-300"
                      >
                        <span className="text-[10px] font-mono text-slate-400">Trang {pageNum}</span>
                        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded mt-2" />
                        <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded mt-1" />
                        <div className="w-10 h-1 bg-slate-100 dark:bg-slate-800 rounded mt-1" />
                      </div>
                    )}

                    {/* Hover Floating Actions: Rotate & Delete */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-2xs">
                      <button
                        type="button"
                        onClick={(e) => handleRotatePage(pageNum, e)}
                        className="w-8 h-8 rounded-full bg-white text-slate-800 hover:text-[#0284C7] shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                        title="Xoay 90°"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeletePage(pageNum, e)}
                        className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                          isDeleted ? "text-slate-400" : "text-amber-600 hover:text-amber-700"
                        }`}
                        title={isDeleted ? "Khôi phục" : "Xóa trang này"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Footer on Tile: Source Filename & Rotation Indicator */}
                  <div className="p-1.5 px-2 bg-slate-50/90 dark:bg-[#161D2A] border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate max-w-[100px]" title={page.docName}>
                      {page.docName}
                    </span>
                    {rotation !== 0 && (
                      <span className="font-bold text-[#0284C7] dark:text-[#38BDF8]">
                        {rotation}°
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* "+ Thêm PDF" Interactive Card Tile in Grid */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#0284C7]/40 hover:border-[#0284C7] dark:border-[#38BDF8]/40 dark:hover:border-[#38BDF8] bg-sky-50/30 hover:bg-sky-50/70 dark:bg-sky-950/20 dark:hover:bg-sky-950/50 min-h-[220px] transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md select-none"
              title="Nhấp để chọn thêm file PDF từ máy tính"
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-sky-200 dark:border-sky-800 text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-0.5 transition-all mb-3 shadow-xs">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] transition-colors">
                + Thêm PDF
              </span>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 text-center px-4 mt-1 leading-relaxed">
                Bổ sung thêm tệp PDF từ bên ngoài
              </p>
              <span className="mt-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[#0284C7] dark:text-[#38BDF8] border border-sky-200/80 dark:border-sky-800/80 shadow-2xs">
                Chọn file .pdf
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RESULT SUCCESS BANNER */}
      {result && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Xử lý ghép tệp thành công! File: {result.filename}</span>
          </div>

          <button
            type="button"
            onClick={() => triggerDownload(result.url, result.filename)}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải tệp ngay</span>
          </button>
        </div>
      )}
    </div>
  );
}
