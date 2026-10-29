"use client";

import React, { useState } from "react";
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Download,
  Loader2,
  KeyRound,
} from "lucide-react";
import { LoadedPdfFile } from "@/lib/store/useAppStore";
import { formatFileSize } from "@/lib/utils";
import { protectPdf, unlockPdf } from "@/lib/pdf/pdf-engine";

interface SecurityWorkspaceProps {
  file: LoadedPdfFile;
  toolSlug: string;
  onComplete: (outputBlob: Blob, filename: string) => void;
  triggerDownload: (url: string, filename: string) => void;
}

export function SecurityWorkspace({
  file,
  toolSlug,
  onComplete,
  triggerDownload,
}: SecurityWorkspaceProps) {
  const isUnlock = toolSlug === "unlock-pdf";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);

  // Strength calculation
  const getStrength = (pass: string) => {
    if (!pass) return { label: "Chưa nhập", color: "bg-slate-200", percent: 0 };
    if (pass.length < 6) return { label: "Yếu", color: "bg-sky-400", percent: 33 };
    if (pass.length < 10) return { label: "Khá", color: "bg-amber-400", percent: 66 };
    return { label: "Rất mạnh", color: "bg-emerald-500", percent: 100 };
  };

  const strength = getStrength(password);

  const handleExecute = async () => {
    if (!isUnlock && (!password || password !== confirmPassword)) {
      alert("Vui lòng nhập mật khẩu và xác nhận mật khẩu trùng khớp!");
      return;
    }
    setProcessing(true);
    try {
      let outputBytes: Uint8Array | null = null;
      let filename = "";

      if (isUnlock) {
        outputBytes = await unlockPdf(file.arrayBuffer, password);
        filename = `${file.name.replace(".pdf", "")}_da_mo_khoa.pdf`;
      } else {
        outputBytes = await protectPdf(file.arrayBuffer, password);
        filename = `${file.name.replace(".pdf", "")}_bao_ve.pdf`;
      }

      const blob = new Blob([outputBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResult({ url, filename });
      onComplete(blob, filename);
      triggerDownload(url, filename);
    } catch (err: any) {
      console.error(err);
      alert(`Bảo mật PDF: ${err?.message || "Đã xảy ra lỗi khi thiết lập mật khẩu"}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC] dark:bg-[#0B1120] p-4 sm:p-8 overflow-y-auto overscroll-contain">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* 1. DOCUMENT INFO & SECURITY BADGE */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0284C7]/20">
            {isUnlock ? <Unlock className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-[#0284C7] dark:text-[#38BDF8] uppercase tracking-wider">
              {isUnlock ? "Mở khóa bảo mật" : "Thiết lập bảo vệ PDF"}
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {file.name}
            </h3>
            <p className="text-xs text-slate-500">
              {file.pageCount || 1} trang • {formatFileSize(file.size)}
            </p>
          </div>
        </div>

        {/* 2. PASSWORD FORM */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>{isUnlock ? "Mật khẩu hiện tại của PDF:" : "Nhập mật khẩu mở tệp mới:"}</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#0284C7] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength meter for protect */}
            {!isUnlock && password && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Độ mạnh mật khẩu:</span>
                  <span className="font-bold">{strength.label}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${strength.percent}%` }}
                    className={`h-full transition-all duration-300 ${strength.color}`}
                  />
                </div>
              </div>
            )}
          </div>

          {!isUnlock && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Xác nhận lại mật khẩu:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          )}

          {/* Permissions for protect */}
          {!isUnlock && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                Quyền hạn người xem:
              </span>

              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={allowPrinting}
                    onChange={(e) => setAllowPrinting(e.target.checked)}
                    className="accent-[#0284C7] rounded"
                  />
                  <span>Cho phép in tài liệu</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={allowCopying}
                    onChange={(e) => setAllowCopying(e.target.checked)}
                    className="accent-[#0284C7] rounded"
                  />
                  <span>Cho phép sao chép nội dung văn bản và hình ảnh</span>
                </label>
              </div>
            </div>
          )}

          {/* Military grade encryption badge */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Mã hóa AES-256 Bit chuẩn quân đội. Mật khẩu không bao giờ được lưu trữ trên máy chủ.</span>
          </div>

          {/* Action CTA */}
          <button
            type="button"
            onClick={handleExecute}
            disabled={processing || (!isUnlock && (!password || password !== confirmPassword))}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white text-sm font-bold shadow-md shadow-[#0284C7]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý mã hóa...</span>
              </>
            ) : isUnlock ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>Gỡ bỏ mật khẩu & Mở khóa</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Khóa & Đặt mật khẩu cho PDF</span>
              </>
            )}
          </button>
        </div>

        {/* 3. RESULT SUCCESS BANNER */}
        {result && (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-100">
                  {isUnlock ? "Đã gỡ mật khẩu thành công!" : "Tài liệu đã được bảo vệ bằng mật khẩu!"}
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">{result.filename}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerDownload(result.url, result.filename)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
