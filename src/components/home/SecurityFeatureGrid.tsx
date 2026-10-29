"use client";

import React from "react";
import {
  ShieldCheck,
  Cpu,
  Type,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { TRANSLATIONS } from "@/lib/i18n/translations";

export function SecurityFeatureGrid() {
  const { language, openPolicyModal } = useAppStore();
  const t = TRANSLATIONS[language]?.security || TRANSLATIONS.vi.security;

  const icons = [Cpu, ShieldCheck, Type];

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] dark:bg-[#0B0F17] border-y border-[#E2E8F0] dark:border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] dark:text-[#38BDF8] uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F9FAFB] tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base font-semibold text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.pillars.map((pillar, idx) => {
            const Icon = icons[idx] || Cpu;
            return (
              <div
                key={idx}
                className="group rounded-3xl bg-white dark:bg-[#111827] border-2 border-[#CBD5E1] dark:border-[#1E293B] hover:border-[#0284C7] dark:hover:border-[#38BDF8] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-2 card-hover-fx"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#F0F9FF] dark:bg-[#0C2438] text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#0284C7] group-hover:text-white transition-all duration-300 shadow-2xs">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#F1F5F9] dark:bg-[#1E293B] text-[#334155] dark:text-[#CBD5E1]">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#0F172A] dark:text-[#F9FAFB]">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    {pillar.description}
                  </p>

                  <div className="pt-2 space-y-2 border-t border-[#F1F5F9] dark:border-[#1E293B]">
                    {pillar.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F1F5F9] dark:border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => openPolicyModal("privacy")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8] hover:underline cursor-pointer"
                  >
                    <span>{language === "en" ? "Read full privacy policy" : "Tìm hiểu chi tiết chính sách"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
