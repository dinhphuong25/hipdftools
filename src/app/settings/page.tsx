"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  Settings,
  Key,
  Save,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Trash2,
  Lock,
  Database,
  RefreshCw,
  HardDrive,
} from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings, clearFiles, files } = useAppStore();
  const [azureKey, setAzureKey] = useState(settings.azureApiKey);
  const [azureRegion, setAzureRegion] = useState(settings.azureRegion);
  const [googleKey, setGoogleKey] = useState(settings.googleCloudApiKey);
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey);
  const [saved, setSaved] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      azureApiKey: azureKey.trim(),
      azureRegion: azureRegion.trim(),
      googleCloudApiKey: googleKey.trim(),
      geminiApiKey: geminiKey.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClearCache = () => {
    clearFiles();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  return (
    <AppShell hideRightSidebar={true}>
      <div className="space-y-8 w-full">
        {/* Header */}
        <div className="relative rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] p-6 sm:p-8 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] text-xs font-black text-[#2D5A4C] dark:text-[#6BAF9A]">
                <Settings className="w-3.5 h-3.5" />
                <span>Không gian cấu hình hệ thống</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight">
                Cài đặt & Tích hợp Khóa API
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
                Tùy chọn tự kết nối API cá nhân để nâng hạn ngạch dịch thuật và kiểm soát dữ liệu bộ nhớ đệm.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] px-3 py-1.5 rounded-xl bg-[#F8F9FA] dark:bg-[#141E19] border border-[#E5E7EB] dark:border-[#24312B]">
                Bộ nhớ RAM: <span className="text-[#2D5A4C] dark:text-[#6BAF9A] font-extrabold">{files.length} tệp đang nạp</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Wide Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main API Form (2 Cols) */}
          <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
            {/* Azure Document Translation */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
                    <Key className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#111827] dark:text-[#F9FAFB]">
                      Microsoft Azure Document Translation
                    </h3>
                    <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                      Khóa API dịch vụ Azure Translator dùng cho dịch thuật chuyên sâu.
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  azureKey ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  {azureKey ? "Đã nhập khóa" : "Chưa cấu hình"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
                    Azure API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập khóa Azure Translator"
                    value={azureKey}
                    onChange={(e) => setAzureKey(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFAFC] dark:bg-[#182620] border border-[#E8EAED] dark:border-[#24312B] text-xs font-medium text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
                    Khu vực (Region)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: southeastasia, eastus"
                    value={azureRegion}
                    onChange={(e) => setAzureRegion(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAFAFC] dark:bg-[#182620] border border-[#E8EAED] dark:border-[#24312B] text-xs font-medium text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
                  />
                </div>
              </div>
            </div>

            {/* Google Cloud Translation API */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                    <Key className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#111827] dark:text-[#F9FAFB]">
                      Google Cloud Translation v3 API
                    </h3>
                    <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                      Khóa Google Cloud Translation v3 dùng cho luồng dịch văn bản và tài liệu.
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  googleKey ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  {googleKey ? "Đã nhập khóa" : "Chưa cấu hình"}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
                  Google Cloud API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={googleKey}
                  onChange={(e) => setGoogleKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAFAFC] dark:bg-[#182620] border border-[#E8EAED] dark:border-[#24312B] text-xs font-medium text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
                />
              </div>
            </div>

            {/* Google Gemini API */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <Cpu className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#111827] dark:text-[#F9FAFB]">
                      Google Gemini 2.5 API (Document AI)
                    </h3>
                    <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                      Sử dụng cho tính năng Tóm tắt tài liệu và Hỏi đáp PDF có trích xuất trang nguồn.
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  geminiKey ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  {geminiKey ? "Đã nhập khóa" : "Chưa cấu hình"}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAFAFC] dark:bg-[#182620] border border-[#E8EAED] dark:border-[#24312B] text-xs font-medium text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
                />
              </div>
            </div>

            {/* Save Action */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs sm:text-sm font-extrabold transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Đã lưu cài đặt thành công!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-white" />
                    <span>Lưu tất cả khóa API</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Sidebar Info & Storage Management (1 Col) */}
          <div className="space-y-6">
            {/* Storage Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] space-y-4 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-5 h-5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                <h3 className="text-sm font-black text-[#111827] dark:text-[#F9FAFB]">
                  Bộ nhớ tạm thời (RAM)
                </h3>
              </div>
              <p className="text-xs font-medium text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
                Tệp tin PDF bạn tải lên được lưu trong bộ nhớ RAM trình duyệt dưới dạng Blob URL tạm thời. Bạn có thể xóa ngay lập tức để giải phóng RAM.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClearCache}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{cacheCleared ? "Đã dọn dẹp sạch sẽ!" : "Dọn dẹp bộ nhớ đệm tệp"}</span>
                </button>
              </div>
            </div>

            {/* Privacy Guarantee Card */}
            <div className="p-6 rounded-3xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#2D5A4C] dark:text-[#6BAF9A]" />
                <h4 className="text-xs font-extrabold text-[#2D5A4C] dark:text-[#6BAF9A] uppercase tracking-wider">
                  Cam kết an toàn khóa API
                </h4>
              </div>
              <p className="text-xs font-medium text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed">
                Khóa API của bạn được lưu trữ 100% cục bộ trong trình duyệt (localStorage). Hệ thống không truyền tải khóa lên máy chủ của Hi PDF. Mọi yêu cầu dịch thuật đều được gửi thẳng từ trình duyệt tới máy chủ Google hoặc Azure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
