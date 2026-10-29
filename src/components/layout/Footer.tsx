"use client";

import React from "react";
import { Mail, Scale, Shield } from "lucide-react";
import { BrandLogoIcon } from "../ui/BrandLogo";
import { useAppStore } from "@/lib/store/useAppStore";
import { TRANSLATIONS } from "@/lib/i18n/translations";
import { PolicyModal } from "../modals/PolicyModal";

export function Footer() {
  const { language, openPolicyModal } = useAppStore();
  const t = TRANSLATIONS[language]?.footer || TRANSLATIONS.vi.footer;

  return (
    <footer className="pb-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 bg-transparent transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Floating Modern Card matching hidownload.one with bold crisp border */}
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#111827] border-2 border-slate-300 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Top Row: Brand Info + Nav Links */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-slate-200 dark:border-slate-700">
            {/* Left Brand info */}
            <div className="flex items-center gap-3.5">
              <BrandLogoIcon className="w-11 h-11" />
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-[#F9FAFB] tracking-tight">
                  Hi <span className="text-[#0284C7] dark:text-[#38BDF8]">PDF</span>
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                  {t.tagline}
                </p>
              </div>
            </div>

            {/* Right Navigation links opening popup modals */}
            <div className="flex items-center gap-4 sm:gap-6 text-sm font-bold text-[#1E293B] dark:text-[#F1F5F9] shrink-0">
              <button
                type="button"
                onClick={() => openPolicyModal("contact")}
                className="flex items-center gap-1.5 hover:text-[#0284C7] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
                <span>{t.contact}</span>
              </button>
              <span className="text-[#CBD5E1] dark:text-[#334155]">|</span>
              <button
                type="button"
                onClick={() => openPolicyModal("terms")}
                className="flex items-center gap-1.5 hover:text-[#0284C7] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                <Scale className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
                <span>{t.terms}</span>
              </button>
              <span className="text-[#CBD5E1] dark:text-[#334155]">|</span>
              <button
                type="button"
                onClick={() => openPolicyModal("privacy")}
                className="flex items-center gap-1.5 hover:text-[#0284C7] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                <Shield className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
                <span>{t.privacy}</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Hi Tech Attribution + Copyright + Founder Credit */}
          <div className="text-center space-y-1.5 text-xs pt-1">
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {t.ecosystem} Hi Tech
            </p>

            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.copyright}
            </p>

            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {t.foundedBy}{" "}
              <a
                href="https://www.facebook.com/dinhphuong205"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#0284C7] dark:text-[#38BDF8] hover:underline cursor-pointer"
              >
                Kim Đình Phương
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Terms / Privacy / Contact Modal Popup */}
      <PolicyModal />
    </footer>
  );
}
