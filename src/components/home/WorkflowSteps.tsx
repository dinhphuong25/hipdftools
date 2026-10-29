"use client";

import { UploadCloud, Sliders, Download, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { TRANSLATIONS } from "@/lib/i18n/translations";

export function WorkflowSteps() {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language]?.workflow || TRANSLATIONS.vi.workflow;

  const steps = [
    {
      step: "01",
      icon: UploadCloud,
      title: t.step1Title,
      desc: t.step1Desc,
    },
    {
      step: "02",
      icon: Sliders,
      title: t.step2Title,
      desc: t.step2Desc,
    },
    {
      step: "03",
      icon: Download,
      title: t.step3Title,
      desc: t.step3Desc,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#111827]/40 border-y border-[#E2E8F0] dark:border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F0F9FF] dark:bg-[#0C2438] border border-[#BAE6FD] dark:border-[#075985] text-xs font-bold text-[#0284C7] dark:text-[#38BDF8]">
            <Zap className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#38BDF8]" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F9FAFB] tracking-tight">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#94A3B8]">
            {t.desc}
          </p>
        </div>

        {/* 3 Steps Cards with sleek animated connecting line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Subtle animated desktop track */}
          <div className="hidden md:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-[#0284C7]/10 via-[#38BDF8]/50 to-[#0284C7]/10 animate-gradient-flow -translate-y-6 -z-0 pointer-events-none" />

          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="group relative z-10 rounded-3xl bg-white dark:bg-[#111827] border-2 border-[#CBD5E1] dark:border-[#1E293B] p-7 sm:p-8 space-y-5 shadow-xs hover:shadow-xl hover:border-[#0284C7] dark:hover:border-[#38BDF8] hover:-translate-y-2 card-hover-fx"
              >
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#F0F9FF] dark:bg-[#0C2438] text-[#0284C7] dark:text-[#38BDF8] border border-[#BAE6FD] dark:border-[#075985] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#0284C7] group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-4xl font-black text-gray-200 dark:text-gray-800 font-mono group-hover:text-[#0284C7]/30 dark:group-hover:text-[#38BDF8]/30 transition-colors">
                    {s.step}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-[#F9FAFB] tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
