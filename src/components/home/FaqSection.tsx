"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { TRANSLATIONS } from "@/lib/i18n/translations";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language } = useAppStore();
  const t = TRANSLATIONS[language]?.faq || TRANSLATIONS.vi.faq;

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F9FAFB] tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#64748B] dark:text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Distinct bordered FAQ cards */}
        <div className="space-y-3.5 sm:space-y-4">
          {t.items.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#111827] border-2 border-[#CBD5E1] dark:border-[#1E293B] hover:border-[#0284C7] dark:hover:border-[#38BDF8] shadow-2xs hover:shadow-md card-hover-fx overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-5 sm:px-7 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <span className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-[#F9FAFB] group-hover:text-[#0284C7] dark:group-hover:text-[#38BDF8] transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#64748B] dark:text-[#94A3B8] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#0284C7] dark:text-[#38BDF8]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-7 pb-5 pt-2 text-xs sm:text-sm font-medium text-[#475569] dark:text-[#CBD5E1] leading-relaxed border-t border-[#E2E8F0] dark:border-[#1E293B] animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
