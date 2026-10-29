"use client";

import React, { useState, useRef, useEffect } from "react";
import { PenTool, Type, Upload, Trash2, Download, CheckCircle2, Loader2 } from "lucide-react";
import { signPdf } from "@/lib/pdf/pdf-engine";
import { LoadedPdfFile } from "@/lib/store/useAppStore";
import { PdfViewer } from "../../pdf/PdfViewer";

interface SignPdfWorkspaceProps {
  activeFile: LoadedPdfFile;
}

export function SignPdfWorkspace({ activeFile }: SignPdfWorkspaceProps) {
  const totalPages = activeFile.pageCount || 1;
  const [tab, setTab] = useState<"draw" | "type" | "upload">("draw");
  const [penColor, setPenColor] = useState<string>("#111827");
  const [typedName, setTypedName] = useState<string>("");
  const [targetPage, setTargetPage] = useState<number>(1);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  // Setup canvas
  useEffect(() => {
    if (tab !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = penColor;
  }, [tab, penColor]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureDataUrl(canvas.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };

  // Convert typed signature to image data URL
  const handleTypedSignature = (text: string) => {
    setTypedName(text);
    if (!text.trim()) {
      setSignatureDataUrl(null);
      return;
    }

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 400;
    tempCanvas.height = 150;
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.font = "italic 48px 'Brush Script MT', cursive, serif";
    ctx.fillStyle = penColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 200, 75);

    setSignatureDataUrl(tempCanvas.toDataURL("image/png"));
  };

  // Upload image signature
  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setSignatureDataUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleExecuteSign = async () => {
    if (!signatureDataUrl) {
      alert("Vui lòng tạo hoặc tải lên chữ ký trước khi thực hiện.");
      return;
    }

    setProcessing(true);
    try {
      const bytes = await signPdf(activeFile.arrayBuffer, signatureDataUrl, targetPage);
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("Error signing PDF:", err);
      alert("Có lỗi xảy ra khi ký tên lên tệp PDF.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Succeeded Result Card with Download */}
      {resultUrl && (
        <div className="p-6 rounded-3xl bg-[#EAF3EE] dark:bg-[#182620] border-2 border-[#2D5A4C]/60 dark:border-[#4E8A77] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2D5A4C] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827] dark:text-[#F9FAFB]">
                Đã chèn chữ ký lên tài liệu PDF thành công!
              </h3>
              <p className="text-xs text-[#4B5563] dark:text-[#9CA3AF] mt-0.5">
                Chữ ký của bạn đã được gắn cố định vào trang {targetPage} của tài liệu.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={resultUrl}
              download={`${activeFile.name.replace(".pdf", "")}_da_ky.pdf`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải tệp PDF đã ký về máy</span>
            </a>
          </div>
        </div>
      )}

      {/* Main 2-Column: Left Document Preview (60%) + Right Signature Creator (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Preview */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">
              Xem trước tài liệu ({activeFile.name})
            </span>
            <span className="text-xs text-[#9CA3AF]">
              Trang {targetPage} / {totalPages}
            </span>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-4 shadow-2xs relative">
            <PdfViewer
              arrayBuffer={activeFile.arrayBuffer}
              totalPages={totalPages}
            />

            {/* Signature Preview Stamp Overlay */}
            {signatureDataUrl && (
              <div className="mt-3 p-3 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#2D5A4C] dark:text-[#6BAF9A]">
                    Xem trước mẫu chữ ký:
                  </span>
                  <div className="h-10 px-3 bg-white dark:bg-[#161D1A] rounded-lg border border-[#CFE2D7] flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={signatureDataUrl} alt="Chữ ký" className="max-h-8 object-contain" />
                  </div>
                </div>
                <span className="text-[11px] text-[#6B7280]">Sẽ đóng dấu góc phải trang {targetPage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Signature Studio */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-6 shadow-2xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                Tạo chữ ký điện tử
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                Vẽ tay trực tiếp, gõ họ tên hoặc tải ảnh con dấu chữ ký.
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B]">
              <button
                type="button"
                onClick={() => setTab("draw")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  tab === "draw"
                    ? "bg-[#2D5A4C] text-white shadow-xs"
                    : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]"
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Vẽ tay</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("type")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  tab === "type"
                    ? "bg-[#2D5A4C] text-white shadow-xs"
                    : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]"
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Gõ họ tên</span>
              </button>

              <button
                type="button"
                onClick={() => setTab("upload")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  tab === "upload"
                    ? "bg-[#2D5A4C] text-white shadow-xs"
                    : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải ảnh</span>
              </button>
            </div>

            {/* Tab 1: Draw Pad */}
            {tab === "draw" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">Màu mực:</span>
                    {[
                      { color: "#111827", label: "Đen" },
                      { color: "#1E3A8A", label: "Xanh dương" },
                      { color: "#B91C1C", label: "Đỏ" },
                    ].map((item) => (
                      <button
                        key={item.color}
                        type="button"
                        onClick={() => setPenColor(item.color)}
                        className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                          penColor === item.color ? "scale-115 border-emerald-500" : "border-transparent"
                        }`}
                        style={{ backgroundColor: item.color }}
                        title={item.label}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Vẽ lại</span>
                  </button>
                </div>

                <div className="rounded-2xl border-2 border-dashed border-[#D1D5DB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-[#111722] overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={380}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-40 touch-none cursor-crosshair bg-white dark:bg-[#161D1A]"
                  />
                </div>
                <p className="text-[10px] text-center text-[#9CA3AF]">
                  Dùng chuột hoặc ngón tay để vẽ chữ ký của bạn vào khung trên.
                </p>
              </div>
            )}

            {/* Tab 2: Type Signature */}
            {tab === "type" && (
              <div className="space-y-3">
                <label className="text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF] block">
                  Nhập họ và tên của bạn:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={typedName}
                  onChange={(e) => handleTypedSignature(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
                />

                {typedName && (
                  <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-center">
                    <span
                      className="text-2xl italic font-serif"
                      style={{ color: penColor, fontFamily: "'Brush Script MT', cursive, serif" }}
                    >
                      {typedName}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Upload Image */}
            {tab === "upload" && (
              <div className="space-y-3">
                <label className="rounded-2xl border-2 border-dashed border-[#D1D5DB] dark:border-[#374151] hover:border-[#2D5A4C] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#F8FAFC] dark:bg-[#111722]">
                  <Upload className="w-6 h-6 text-[#2D5A4C] dark:text-[#6BAF9A] mb-2" />
                  <span className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Tải ảnh chữ ký hoặc con dấu (.png, .jpg)
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] mt-0.5">Khuyên dùng ảnh nền trong suốt</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleUploadSignature}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Target Page Selector */}
            <div className="space-y-2 pt-2 border-t border-[#E8EAED] dark:border-[#24312B]">
              <label className="text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF] block">
                Chèn chữ ký vào trang:
              </label>
              <select
                value={targetPage}
                onChange={(e) => setTargetPage(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
              >
                {Array.from({ length: totalPages }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Trang {i + 1} {i + 1 === totalPages ? "(Trang cuối cùng)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Execute Button */}
            <button
              type="button"
              onClick={handleExecuteSign}
              disabled={processing || !signatureDataUrl}
              className="w-full py-3.5 px-4 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {processing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PenTool className="w-4 h-4" />
              )}
              <span>{processing ? "Đang chèn chữ ký..." : "Ký tên & Xuất PDF"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
