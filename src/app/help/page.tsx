"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Languages,
  ChevronDown,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const steps = [
    {
      num: "01",
      title: "Trích xuất & Phân tích tọa độ hình học (Bounding Boxes)",
      desc: "Hệ thống quét từng ký tự, từ ngữ và dòng kẻ vector từ file gốc. Xác định chính xác tọa độ góc (X, Y, Width, Height) của từng khối văn bản và bảng biểu.",
    },
    {
      num: "02",
      title: "Dịch thuật & Thuật toán Auto Text-Fitting",
      desc: "Văn bản sau khi dịch sang tiếng Việt thường có độ dài biến thiên so với tiếng Anh. Thuật toán tự động tính toán tỷ lệ co giãn font chữ (font-scaling) và dàn dòng để vừa vặn 100% vào khung ban đầu mà không bị tràn ô.",
    },
    {
      num: "03",
      title: "Nhúng Font Unicode & Bảo tồn đồ họa",
      desc: "Nhúng chuẩn font Arial Unicode hỗ trợ toàn diện 134 ký tự dấu tiếng Việt, bảo toàn trọn vẹn hình ảnh nền, con dấu, chữ ký và đồ họa vector với độ phân giải nguyên bản.",
    },
  ];

  const faqs = [
    {
      q: "Dịch PDF giữ nguyên định dạng hoạt động như thế nào?",
      a: "Khác với các công cụ dịch thông thường chỉ trích xuất văn bản thô rồi in ra file trắng, Hi PDF phân tích tọa độ của từng khối chữ, dòng kẻ và hình ảnh từ tài liệu gốc. Sau khi dịch, hệ thống tự động tính toán tỷ lệ co giãn font chữ tiếng Việt (font-scaling) và dàn dòng (text-wrapping) để nội dung dịch nằm gọn chính xác trong bounding-box ban đầu, giữ nguyên 100% hình ảnh, bảng biểu và màu sắc nền.",
    },
    {
      q: "Tài liệu của tôi có bị tải lên máy chủ ngoài không?",
      a: "Phần lớn các tác vụ cốt lõi (ghép, tách, xoay, thêm số trang, watermark, trích xuất trang, làm phẳng, mã hóa) được xử lý 100% trực tiếp trong trình duyệt bằng WebAssembly và pdf-lib. Dữ liệu tệp không bao giờ rời khỏi thiết bị của bạn trừ khi bạn kích hoạt các adapter dịch đám mây hoặc AI.",
    },
    {
      q: "Tại sao tiếng Việt không bị lỗi font hoặc ô vuông?",
      a: "Hi PDF nhúng trực tiếp font Unicode tiêu chuẩn (Arial Unicode) hỗ trợ toàn diện bảng mã tiếng Việt có dấu vào file PDF đầu ra, loại bỏ hoàn toàn hiện tượng mất dấu hoặc biến thành ký tự lạ thường gặp ở các công cụ quốc tế.",
    },
    {
      q: "Làm thế nào để sử dụng API Azure, Google hoặc Gemini riêng?",
      a: "Bạn có thể vào trang Cài đặt (Settings), nhập API Key và Endpoint cá nhân của Microsoft Azure Translator, Google Cloud Translation hoặc Google Gemini. Thông tin này được lưu cục bộ trên trình duyệt của bạn.",
    },
  ];

  return (
    <AppShell hideRightSidebar={true}>
      <div className="space-y-12 w-full">
        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] p-8 sm:p-12 shadow-sm overflow-hidden text-center space-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-b from-[#2D5A4C]/15 via-[#2D5A4C]/5 to-transparent blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] text-xs font-black text-[#2D5A4C] dark:text-[#6BAF9A]">
              <BookOpen className="w-4 h-4" />
              <span>Trung tâm tài liệu & Hướng dẫn kỹ thuật</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight leading-tight">
              Làm chủ mọi công cụ.{" "}
              <span className="text-[#2D5A4C] dark:text-[#6BAF9A] underline decoration-[#CFE2D7] dark:decoration-[#253A31] underline-offset-8">
                Tối ưu hóa năng suất
              </span>
              .
            </h1>

            <p className="text-xs sm:text-base font-semibold text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed">
              Khám phá nguyên lý hoạt động của công nghệ bảo toàn bố cục, cơ chế WebAssembly client-side và cách tận dụng tối đa 23+ tiện ích PDF miễn phí.
            </p>
          </div>
        </div>

        {/* 3 Pillars of Layout Preservation Engine */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-black text-[#2D5A4C] dark:text-[#6BAF9A] uppercase tracking-wider">
                Công nghệ cốt lõi
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight">
                Cơ chế Dịch PDF giữ nguyên 100% bố cục gốc
              </h2>
            </div>
            <Link
              href="/tools/translate-pdf"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Languages className="w-4 h-4" />
              <span>Thử công cụ dịch ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] p-7 space-y-4 shadow-2xs hover:shadow-md hover:border-[#2D5A4C]/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-[#2D5A4C] dark:text-[#6BAF9A] font-mono">
                      {st.num}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <h3 className="text-base font-black text-[#111827] dark:text-[#F9FAFB] leading-snug">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comprehensive FAQ Accordion matching hidownload.one */}
        <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight">
              Câu hỏi thường gặp về kỹ thuật
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
              Giải đáp chi tiết về thuật toán, font chữ tiếng Việt và bảo mật tài liệu.
            </p>
          </div>

          <div className="divide-y divide-[#E5E7EB] dark:divide-[#24312B] border-t border-[#E5E7EB] dark:border-[#24312B]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#111827] dark:text-[#F9FAFB] group-hover:text-[#2D5A4C] dark:group-hover:text-[#6BAF9A] transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#2D5A4C] dark:text-[#6BAF9A]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 pt-1 text-xs sm:text-sm font-medium text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
