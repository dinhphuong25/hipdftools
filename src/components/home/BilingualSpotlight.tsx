"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Languages,
  ArrowRight,
  FileCheck,
  Columns,
  Eye,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { TRANSLATIONS } from "@/lib/i18n/translations";

export function BilingualSpotlight() {
  const [activeTab, setActiveTab] = useState<"compare" | "original" | "translated">("compare");
  const { language } = useAppStore();
  const t = TRANSLATIONS[language]?.spotlight || TRANSLATIONS.vi.spotlight;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F9FF] dark:bg-[#0C2438] border border-[#BAE6FD] dark:border-[#075985] text-[#0284C7] dark:text-[#38BDF8] text-xs font-bold">
            <Languages className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F9FAFB] tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base font-semibold text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Interactive Showcase Card */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border-2 border-[#CBD5E1] dark:border-[#1E293B] shadow-sm overflow-hidden">
          {/* Showcase Control Bar */}
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC]/90 dark:bg-[#0F172A]/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                {t.viewMode}
              </span>
              <div className="inline-flex rounded-xl bg-white dark:bg-[#1E293B] p-1 border border-[#CBD5E1] dark:border-[#334155] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("compare")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "compare"
                      ? "bg-[#0284C7] text-white shadow-2xs"
                      : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A]"
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>{t.compare}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("original")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "original"
                      ? "bg-[#0284C7] text-white shadow-2xs"
                      : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A]"
                  }`}
                >
                  {t.original}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("translated")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "translated"
                      ? "bg-[#0284C7] text-white shadow-2xs"
                      : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A]"
                  }`}
                >
                  {t.translated}
                </button>
              </div>
            </div>

            {/* CTA in bar */}
            <Link
              href="/tools/translate-pdf"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold transition-all shadow-xs"
            >
              <Languages className="w-4 h-4" />
              <span>{t.tryNow}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Document Preview Stage */}
          <div className="p-6 sm:p-8 bg-[#F8FAFC] dark:bg-[#0B0F17]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Left Column: English Original */}
              {(activeTab === "compare" || activeTab === "original") && (
                <div
                  className={`rounded-2xl bg-white dark:bg-[#111827] border border-[#CBD5E1] dark:border-[#1E293B] p-5 sm:p-6 shadow-sm flex flex-col justify-between ${
                    activeTab === "original" ? "md:col-span-2 max-w-2xl mx-auto w-full" : ""
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Document Label */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-[#0F172A] dark:text-[#F9FAFB] uppercase tracking-wider">
                          {language === "en" ? "English Original • Paper #2026-X" : "Tài liệu gốc tiếng Anh • Paper #2026-X"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8]">
                        Bounding Box: Lock
                      </span>
                    </div>

                    {/* Paper Title */}
                    <div className="relative p-2 rounded-lg border border-dashed border-sky-300 dark:border-sky-700 bg-sky-50/40 dark:bg-sky-950/20">
                      <span className="absolute -top-2.5 right-2 text-[9px] font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/80 px-1.5 py-0.2 rounded">
                        Title Box [H: 42px]
                      </span>
                      <h3 className="text-base font-extrabold text-[#0F172A] dark:text-[#F9FAFB] leading-snug">
                        Deep Learning Approaches to Document Layout Analysis and OCR
                      </h3>
                    </div>

                    {/* Authors & Abstract */}
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] italic">
                      Nguyen Van A, Tran B, Le C — Department of AI Systems
                    </p>

                    <div className="relative p-2.5 rounded-lg border border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20 text-xs text-[#334155] dark:text-[#D1D5DB] leading-relaxed">
                      <span className="absolute -top-2.5 right-2 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/80 px-1.5 py-0.2 rounded">
                        Text Paragraph Box
                      </span>
                      <strong className="text-[#0F172A] dark:text-[#F9FAFB]">Abstract—</strong> Modern document processing demands preservation of typographic hierarchy. We propose a coordinate-aware pipeline that tracks every glyph bounding box and maps translated strings back with zero displacement.
                    </div>

                    {/* Vector Table Preview */}
                    <div className="border border-[#E2E8F0] dark:border-[#334155] rounded-xl overflow-hidden">
                      <div className="bg-[#F8FAFC] dark:bg-[#1E293B] px-3 py-1.5 text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] border-b border-[#E2E8F0] dark:border-[#334155]">
                        Table 1: Benchmark Accuracy on Technical Manuals
                      </div>
                      <div className="divide-y divide-[#E2E8F0] dark:divide-[#334155] text-xs">
                        <div className="grid grid-cols-3 px-3 py-1.5 font-semibold text-[#0F172A] dark:text-[#F9FAFB] bg-[#FAFAFA] dark:bg-[#111827]">
                          <span>Method</span>
                          <span>BLEU Score</span>
                          <span>Layout Retention</span>
                        </div>
                        <div className="grid grid-cols-3 px-3 py-1.5 text-[#475569] dark:text-[#94A3B8]">
                          <span>Generic AI</span>
                          <span>28.4</span>
                          <span className="text-rose-500 font-medium">34% (Distorted)</span>
                        </div>
                        <div className="grid grid-cols-3 px-3 py-1.5 text-[#0F172A] dark:text-[#F9FAFB] bg-[#F0F9FF] dark:bg-[#0C2438]">
                          <span className="font-semibold text-[#0284C7] dark:text-[#38BDF8]">Hi PDF Engine</span>
                          <span className="font-semibold text-[#0284C7] dark:text-[#38BDF8]">39.8</span>
                          <span className="font-semibold text-[#0284C7] dark:text-[#38BDF8]">99.2% (Preserved)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    <span>Original Font: Helvetica / Inter</span>
                    <span className="text-sky-600 dark:text-sky-400 font-semibold">14 Bounding Boxes Detected</span>
                  </div>
                </div>
              )}

              {/* Right Column: Vietnamese Translated */}
              {(activeTab === "compare" || activeTab === "translated") && (
                <div
                  className={`rounded-2xl bg-white dark:bg-[#111827] border-2 border-[#0284C7]/60 dark:border-[#38BDF8] p-5 sm:p-6 shadow-sm flex flex-col justify-between ${
                    activeTab === "translated" ? "md:col-span-2 max-w-2xl mx-auto w-full" : ""
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Document Label */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                        <span className="text-xs font-bold text-[#0284C7] dark:text-[#38BDF8] uppercase tracking-wider">
                          {language === "en" ? "Vietnamese Translation • Full Unicode" : "Bản dịch tiếng Việt • Chuẩn Unicode"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F9FF] dark:bg-[#0C2438] text-[#0284C7] dark:text-[#38BDF8] font-bold">
                        Font Auto-Fit: OK
                      </span>
                    </div>

                    {/* Paper Title (Vietnamese) */}
                    <div className="relative p-2 rounded-lg border border-[#0284C7]/40 bg-[#F0F9FF]/60 dark:bg-[#0C2438]/80">
                      <span className="absolute -top-2.5 right-2 text-[9px] font-bold text-[#0284C7] dark:text-[#38BDF8] bg-[#BAE6FD] dark:bg-[#075985] px-1.5 py-0.2 rounded">
                        {language === "en" ? "Exact coordinates & scaling" : "Giữ nguyên toạ độ & tỷ lệ"}
                      </span>
                      <h3 className="text-base font-extrabold text-[#0F172A] dark:text-[#F9FAFB] leading-snug">
                        Các Phương Pháp Học Sâu trong Phân Tích Bố Cục Tài Liệu và OCR
                      </h3>
                    </div>

                    {/* Authors & Abstract (Vietnamese) */}
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] italic">
                      Nguyễn Văn A, Trần B, Lê C — Bộ phận Hệ thống AI
                    </p>

                    <div className="relative p-2.5 rounded-lg border border-[#BAE6FD] dark:border-[#075985] bg-[#F0F9FF]/30 dark:bg-[#0C2438]/40 text-xs text-[#334155] dark:text-[#D1D5DB] leading-relaxed">
                      <span className="absolute -top-2.5 right-2 text-[9px] font-bold text-[#0284C7] dark:text-[#38BDF8] bg-[#F0F9FF] dark:bg-[#0C2438] px-1.5 py-0.2 rounded">
                        {language === "en" ? "100% boundary match" : "Khớp khung 100%"}
                      </span>
                      <strong className="text-[#0F172A] dark:text-[#F9FAFB]">{language === "en" ? "Abstract—" : "Tóm tắt—"}</strong> Xử lý tài liệu hiện đại đòi hỏi sự bảo toàn phân cấp kiểu chữ. Chúng tôi đề xuất quy trình nhận biết tọa độ, theo dõi từng khung bao ký tự và ánh xạ chuỗi dịch về vị trí chuẩn xác mà không bị lệch lề.
                    </div>

                    {/* Vector Table Preview (Vietnamese) */}
                    <div className="border border-[#BAE6FD] dark:border-[#075985] rounded-xl overflow-hidden">
                      <div className="bg-[#F0F9FF] dark:bg-[#0C2438] px-3 py-1.5 text-[11px] font-bold text-[#0284C7] dark:text-[#38BDF8] border-b border-[#BAE6FD] dark:border-[#075985]">
                        {language === "en" ? "Table 1: Benchmark Accuracy on Technical Manuals" : "Bảng 1: Điểm chuẩn độ chính xác trên tài liệu kỹ thuật"}
                      </div>
                      <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-xs">
                        <div className="grid grid-cols-3 px-3 py-1.5 font-semibold text-[#0F172A] dark:text-[#F9FAFB] bg-[#FAFAFA] dark:bg-[#111827]">
                          <span>{language === "en" ? "Method" : "Phương pháp"}</span>
                          <span>BLEU Score</span>
                          <span>{language === "en" ? "Layout Retention" : "Bảo toàn bố cục"}</span>
                        </div>
                        <div className="grid grid-cols-3 px-3 py-1.5 text-[#475569] dark:text-[#94A3B8]">
                          <span>Generic AI</span>
                          <span>28.4</span>
                          <span className="text-rose-500 font-medium">{language === "en" ? "34% (Distorted)" : "34% (Bị vỡ layout)"}</span>
                        </div>
                        <div className="grid grid-cols-3 px-3 py-1.5 text-[#0F172A] dark:text-[#F9FAFB] bg-[#F0F9FF] dark:bg-[#0C2438]">
                          <span className="font-semibold text-[#0284C7] dark:text-[#38BDF8]">Hi PDF Engine</span>
                          <span className="font-semibold text-[#0284C7] dark:text-[#38BDF8]">39.8</span>
                          <span className="font-semibold text-[#0284C7] dark:text-[#38BDF8]">{language === "en" ? "99.2% (Preserved)" : "99.2% (Nguyên bản)"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#0284C7] dark:text-[#38BDF8] font-semibold">
                    <span>{language === "en" ? "Embedded Font: Full Vietnamese Unicode" : "Font nhúng: Unicode tiếng Việt đầy đủ dấu"}</span>
                    <span>{language === "en" ? "Match rate: 99.8%" : "Tỷ lệ khớp: 99.8%"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3 Tech Highlights Footer with Hover Animations */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#111827]">
            <div className="group p-5 flex items-start gap-3.5 hover:bg-[#F0F9FF]/50 dark:hover:bg-[#1E293B]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] dark:bg-[#0C2438] text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all duration-300 shadow-2xs">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F9FAFB] group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] transition-colors">
                  {t.feature1Title}
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  {t.feature1Desc}
                </p>
              </div>
            </div>

            <div className="group p-5 flex items-start gap-3.5 hover:bg-[#F0F9FF]/50 dark:hover:bg-[#1E293B]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] dark:bg-[#0C2438] text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all duration-300 shadow-2xs">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F9FAFB] group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] transition-colors">
                  {t.feature2Title}
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  {t.feature2Desc}
                </p>
              </div>
            </div>

            <div className="group p-5 flex items-start gap-3.5 hover:bg-[#F0F9FF]/50 dark:hover:bg-[#1E293B]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] dark:bg-[#0C2438] text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#0284C7] group-hover:text-white transition-all duration-300 shadow-2xs">
                <Eye className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F9FAFB] group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] transition-colors">
                  {t.feature3Title}
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  {t.feature3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
