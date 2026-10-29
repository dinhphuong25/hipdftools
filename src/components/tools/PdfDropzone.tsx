"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, AlertCircle, Loader2, FileText } from "lucide-react";
import { DropzoneIllustration } from "../ui/DropzoneIllustration";
import { useAppStore, LoadedPdfFile } from "@/lib/store/useAppStore";
import { loadPdfDocInfo } from "@/lib/pdf/pdf-renderer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface PdfDropzoneProps {
  acceptedFormats?: string[];
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
  sublabel?: string;
  onFilesLoaded?: (files: LoadedPdfFile[]) => void;
  showSampleButton?: boolean;
}

export function PdfDropzone({
  acceptedFormats: _ = [".pdf"],
  multiple = false,
  maxSizeMB = 50,
  label = "Chọn tệp PDF hoặc kéo thả vào đây",
  sublabel = "Hỗ trợ tệp PDF dung lượng tối đa 50MB • Bảo mật 100% trong trình duyệt",
  onFilesLoaded,
  showSampleButton = true,
}: PdfDropzoneProps) {
  const { addFiles } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = useCallback(
    async (filesToProcess: File[]) => {
      setError(null);
      setLoading(true);

      const loadedList: LoadedPdfFile[] = [];

      for (const file of filesToProcess) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const objectUrl = URL.createObjectURL(file);

          let pageCount = 1;
          let pageThumbnails: string[] = [];
          let dimensions = { width: 595, height: 842 };

          if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
            try {
              const info = await loadPdfDocInfo(arrayBuffer);
              pageCount = info.numPages;
              pageThumbnails = info.pageThumbnails;
              dimensions = info.firstPageDimensions;
            } catch (pdfErr) {
              console.warn("Could not parse pdf info", pdfErr);
            }
          }

          const loadedItem: LoadedPdfFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            file,
            name: file.name,
            size: file.size,
            arrayBuffer,
            objectUrl,
            pageCount,
            pageThumbnails,
            dimensions,
          };

          loadedList.push(loadedItem);
        } catch (err: any) {
          setError(`Lỗi khi đọc tệp ${file.name}: ${err?.message || "Định dạng không hợp lệ"}`);
        }
      }

      setLoading(false);
      if (loadedList.length > 0) {
        addFiles(loadedList);
        onFilesLoaded?.(loadedList);
      }
    },
    [addFiles, onFilesLoaded]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      await processFiles(acceptedFiles);
    },
    [processFiles]
  );

  // Generate a realistic sample research paper PDF
  const handleLoadSamplePdf = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

      // Page 1: Academic Paper Layout
      const page1 = doc.addPage([595.28, 841.89]); // A4
      const { width, height } = page1.getSize();

      // Title
      page1.drawText("Artificial Intelligence in Modern Document Processing", {
        x: 50,
        y: height - 70,
        size: 18,
        font: fontBold,
        color: rgb(0.1, 0.15, 0.2),
      });

      // Authors
      page1.drawText("Dr. John Anderson, Dr. Emily Watson - Stanford University", {
        x: 50,
        y: height - 95,
        size: 10,
        font,
        color: rgb(0.4, 0.45, 0.5),
      });

      // Abstract Section Header
      page1.drawText("Abstract", {
        x: 50,
        y: height - 130,
        size: 13,
        font: fontBold,
        color: rgb(0.17, 0.35, 0.3),
      });

      // Abstract Paragraph
      const abstractText =
        "Document translation requires preserving original layout, column alignments, and tables. In this paper, we demonstrate a semantic bounding-box reconstruction pipeline that preserves typography, images, and reading order while translating content into target languages with high fidelity.";
      page1.drawText(abstractText, {
        x: 50,
        y: height - 150,
        size: 9.5,
        font,
        color: rgb(0.2, 0.25, 0.3),
        maxWidth: width - 100,
        lineHeight: 14,
      });

      // Introduction Section Header
      page1.drawText("1. Introduction", {
        x: 50,
        y: height - 215,
        size: 12,
        font: fontBold,
        color: rgb(0.17, 0.35, 0.3),
      });

      // Intro Paragraph
      const introText =
        "Recent advancements in deep learning have significantly improved machine translation. However, formatting degradation remains a critical obstacle in academic and legal publishing. Our approach establishes coordinate bounding boxes for every paragraph and table cell.";
      page1.drawText(introText, {
        x: 50,
        y: height - 235,
        size: 9.5,
        font,
        color: rgb(0.2, 0.25, 0.3),
        maxWidth: width - 100,
        lineHeight: 14,
      });

      // Mock Table Outline
      const tableY = height - 370;
      page1.drawRectangle({
        x: 50,
        y: tableY,
        width: width - 100,
        height: 70,
        borderColor: rgb(0.8, 0.85, 0.9),
        borderWidth: 1,
        color: rgb(0.97, 0.98, 0.99),
      });

      page1.drawText("Table 1: Benchmark Results across Document Types", {
        x: 50,
        y: tableY + 80,
        size: 10,
        font: fontBold,
        color: rgb(0.2, 0.25, 0.3),
      });

      page1.drawText("Model Name              BLEU Score       Layout Retention", {
        x: 65,
        y: tableY + 45,
        size: 9,
        font: fontBold,
        color: rgb(0.25, 0.3, 0.35),
      });

      page1.drawText("Hi PDF Semantic           94.8%                 99.4%", {
        x: 65,
        y: tableY + 25,
        size: 9,
        font,
        color: rgb(0.17, 0.35, 0.3),
      });

      page1.drawText("Traditional Pipeline       82.1%                 73.5%", {
        x: 65,
        y: tableY + 10,
        size: 9,
        font,
        color: rgb(0.4, 0.45, 0.5),
      });

      // Conclusion Header
      page1.drawText("2. Conclusion and Future Work", {
        x: 50,
        y: tableY - 35,
        size: 12,
        font: fontBold,
        color: rgb(0.17, 0.35, 0.3),
      });

      const conclusionText =
        "Experimental evaluations show that coordinate clustering preserves 100% of figures and tables without overflowing margins. This provides researchers and professionals with ready-to-use bilingual translations.";
      page1.drawText(conclusionText, {
        x: 50,
        y: tableY - 55,
        size: 9.5,
        font,
        color: rgb(0.2, 0.25, 0.3),
        maxWidth: width - 100,
        lineHeight: 14,
      });

      const pdfBytes = await doc.save();
      const sampleBlob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const sampleFile = new File([sampleBlob], "sample_academic_paper.pdf", {
        type: "application/pdf",
      });

      await processFiles([sampleFile]);
    } catch (err: any) {
      setError(`Không thể tạo file mẫu: ${err?.message}`);
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxSize: maxSizeMB * 1024 * 1024,
  });

  return (
    <div className="w-full space-y-3">
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
          isDragActive
            ? "border-[#2D5A4C] bg-[#EAF3EE] dark:bg-[#182620] scale-[0.99] shadow-md"
            : "border-[#B8D3C4] dark:border-[#335345] bg-white dark:bg-[#161D1A] hover:border-[#2D5A4C] hover:bg-[#FAFDFB] dark:hover:bg-[#182620] shadow-xs hover:shadow-sm"
        }`}
      >
        <input {...getInputProps()} />

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="w-9 h-9 animate-spin text-[#2D5A4C] dark:text-[#6BAF9A]" />
            <p className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB]">
              Đang phân tích cấu trúc trang và khối văn bản...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center max-w-md">
            <DropzoneIllustration className="w-28 h-24 mb-3.5 hover:scale-105 transition-transform" />

            <p className="text-sm sm:text-base font-bold text-[#111827] dark:text-[#F9FAFB]">
              {isDragActive ? "Thả tệp vào đây ngay!" : label}
            </p>

            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1.5 leading-relaxed">
              {sublabel}
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2D5A4C] hover:bg-[#23473C] transition-all shadow-xs cursor-pointer"
              >
                Chọn tệp từ máy tính
              </button>

              {showSampleButton && (
                <button
                  type="button"
                  onClick={handleLoadSamplePdf}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#2D5A4C] dark:text-[#6BAF9A] bg-[#EAF3EE] hover:bg-[#D7E9DE] dark:bg-[#182620] dark:hover:bg-[#253A31] border border-[#CFE2D7] dark:border-[#253A31] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                  <span>Dùng tài liệu mẫu</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
