"use client";

import React from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { Languages, Layers, Cpu, FileText, Check } from "lucide-react";

export function TranslationOptions() {
  const { translationConfig, setTranslationConfig } = useAppStore();

  const languages = [
    { code: "auto", name: "Tự động phát hiện" },
    { code: "en", name: "Tiếng Anh (English)" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "zh", name: "Tiếng Trung (中文)" },
    { code: "ja", name: "Tiếng Nhật (日本語)" },
    { code: "ko", name: "Tiếng Hàn (한국어)" },
    { code: "fr", name: "Tiếng Pháp (Français)" },
    { code: "de", name: "Tiếng Đức (Deutsch)" },
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Language Pair Selection */}
      <div className="space-y-2">
        <label className="font-semibold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
          <span>Cặp ngôn ngữ</span>
        </label>

        <div className="space-y-2">
          <div>
            <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] block mb-1">
              Ngôn ngữ nguồn
            </span>
            <select
              value={translationConfig.sourceLang}
              onChange={(e) => setTranslationConfig({ sourceLang: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
            >
              {languages.map((l) => (
                <option key={`src-${l.code}`} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] block mb-1">
              Ngôn ngữ đích (Bản dịch)
            </span>
            <select
              value={translationConfig.targetLang}
              onChange={(e) => setTranslationConfig({ targetLang: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
            >
              {languages
                .filter((l) => l.code !== "auto")
                .map((l) => (
                  <option key={`tgt-${l.code}`} value={l.code}>
                    {l.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Mode Selection */}
      <div className="pt-2 border-t border-[#E8EAED] dark:border-[#24312B] space-y-2">
        <label className="font-semibold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
          <span>Chế độ dịch</span>
        </label>

        <div className="space-y-1.5">
          {[
            {
              id: "preserve_layout",
              title: "Giữ nguyên bố cục gốc",
              desc: "Thay thế chữ tại đúng vị trí, bảo toàn ảnh và bảng",
            },
            {
              id: "bilingual",
              title: "Đối chiếu song ngữ",
              desc: "Hiển thị trang gốc và trang dịch song song",
            },
            {
              id: "text_only",
              title: "Văn bản dễ đọc",
              desc: "Trích xuất và dịch chuỗi văn bản sạch",
            },
          ].map((modeItem) => {
            const isSelected = translationConfig.mode === modeItem.id;
            return (
              <div
                key={modeItem.id}
                onClick={() =>
                  setTranslationConfig({ mode: modeItem.id as any })
                }
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#2D5A4C] bg-[#EAF3EE] dark:bg-[#182620] shadow-2xs"
                    : "border-[#E8EAED] dark:border-[#24312B] bg-white dark:bg-[#161D1A] hover:bg-[#F3F6F4] dark:hover:bg-[#1A2420]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111827] dark:text-[#F9FAFB]">
                    {modeItem.title}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[#2D5A4C] text-white flex items-center justify-center shadow-2xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                  {modeItem.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Page Range */}
      <div className="pt-2 border-t border-[#E8EAED] dark:border-[#24312B] space-y-2">
        <label className="font-semibold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
          <span>Khoảng trang dịch</span>
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTranslationConfig({ pageRangeMode: "all" })}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              translationConfig.pageRangeMode === "all"
                ? "border-[#2D5A4C] bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] shadow-2xs"
                : "border-[#E8EAED] dark:border-[#24312B] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F6F4]"
            }`}
          >
            Tất cả các trang
          </button>
          <button
            type="button"
            onClick={() => setTranslationConfig({ pageRangeMode: "custom" })}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              translationConfig.pageRangeMode === "custom"
                ? "border-[#2D5A4C] bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] shadow-2xs"
                : "border-[#E8EAED] dark:border-[#24312B] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F6F4]"
            }`}
          >
            Tùy chọn trang
          </button>
        </div>

        {translationConfig.pageRangeMode === "custom" && (
          <input
            type="text"
            placeholder="Ví dụ: 1-3, 5"
            value={translationConfig.customPages}
            onChange={(e) => setTranslationConfig({ customPages: e.target.value })}
            className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
          />
        )}
      </div>

      {/* 4. Engine Provider info */}
      <div className="pt-2 border-t border-[#E8EAED] dark:border-[#24312B]">
        <div className="flex items-center justify-between text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
            <span>Bộ xử lý</span>
          </span>
          <span className="font-bold text-[#111827] dark:text-[#F9FAFB]">
            Hi PDF Layout Engine
          </span>
        </div>
        <p className="text-[10px] text-[#94A3B8] mt-1">
          Bảo toàn tọa độ khối chữ, bảng biểu và đồ họa bằng font Unicode Arial.
        </p>
      </div>
    </div>
  );
}
