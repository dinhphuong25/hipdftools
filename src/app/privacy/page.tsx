"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  ShieldCheck,
  HardDrive,
  Cpu,
  EyeOff,
  Lock,
  CheckCircle2,
  XCircle,
  Zap,
  FileCheck,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

export default function PrivacyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const securityFaqs = [
    {
      q: "Tài liệu của tôi có bị lưu lại trên máy chủ sau khi xử lý không?",
      a: "Hoàn toàn không. Đối với các công cụ thao tác PDF (Ghép, Tách, Xoay, Nén, Ký tên, Xóa trang, Đánh số trang), toàn bộ quá trình xử lý 100% diễn ra trong bộ nhớ RAM trình duyệt của bạn qua WebAssembly. Không có một byte dữ liệu nào bị truyền đến bất kỳ máy chủ nào.",
    },
    {
      q: "Khi tôi sử dụng tính năng Dịch PDF hoặc AI, dữ liệu được gửi đi đâu?",
      a: "Chỉ các đoạn văn bản thô (text blocks) trích xuất được mới được mã hóa bằng TLS 1.3 và gửi đến mô hình AI / API dịch thuật để chuyển ngữ sang tiếng Việt. Toàn bộ hình ảnh, chữ ký, vector và bảng số liệu đều được giữ nguyên trên máy bạn. Sau khi dịch xong, dữ liệu trong bộ đệm lập tức bị hủy bỏ hoàn toàn (Zero-Retention Policy).",
    },
    {
      q: "Hi PDF có sử dụng tài liệu của tôi để huấn luyện (train) AI không?",
      a: "Tuyệt đối không. Chúng tôi sử dụng các API dành cho doanh nghiệp với điều khoản bảo mật nghiêm ngặt không lưu trữ (no-logging) và không cho phép sử dụng dữ liệu khách hàng để huấn luyện mô hình. Ngoài ra, bạn hoàn toàn có thể tự kết nối API Key cá nhân trong trang Cài đặt để kiểm soát 100% đường truyền.",
    },
    {
      q: "Bộ nhớ đệm trình duyệt (Cache / localStorage) lưu trữ những gì?",
      a: "Chúng tôi chỉ lưu trữ các cài đặt cá nhân (chế độ Sáng/Tối, danh sách công cụ yêu thích, khóa API cá nhân nếu bạn tự nhập). Nội dung tệp PDF hoặc ảnh chụp trang không bao giờ được ghi vào localStorage hoặc IndexedDB vĩnh viễn.",
    },
  ];

  return (
    <AppShell hideRightSidebar={true}>
      <div className="space-y-12 w-full">
        {/* 1. Immersive Hero Header with Ambient Lighting */}
        <div className="relative rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] p-8 sm:p-12 shadow-sm overflow-hidden text-center space-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-b from-[#2D5A4C]/15 via-[#2D5A4C]/5 to-transparent blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] text-xs font-black text-[#2D5A4C] dark:text-[#6BAF9A]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tiêu chuẩn bảo mật dữ liệu khách hàng</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight leading-tight">
              Bảo mật cục bộ. Không lưu trữ.{" "}
              <span className="text-[#2D5A4C] dark:text-[#6BAF9A] underline decoration-[#CFE2D7] dark:decoration-[#253A31] underline-offset-8">
                Dữ liệu thuộc về bạn
              </span>
              .
            </h1>

            <p className="text-xs sm:text-base font-semibold text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed">
              Cam kết minh bạch tuyệt đối: 100% tài liệu của bạn được xử lý trực tiếp trong bộ nhớ RAM trình duyệt thông qua công nghệ WebAssembly. Chúng tôi không bao giờ lưu trữ, xem trộm hay bán dữ liệu của bạn.
            </p>
          </div>

          {/* Quick Stats Metric Bar */}
          <div className="relative z-10 pt-6 mt-6 border-t border-[#F3F4F6] dark:border-[#24312B] grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#141E19] border border-[#E5E7EB] dark:border-[#24312B] space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-[#2D5A4C] dark:text-[#6BAF9A]">0 Giây</span>
              <p className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF]">Thời gian lưu trữ máy chủ</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#141E19] border border-[#E5E7EB] dark:border-[#24312B] space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-[#2D5A4C] dark:text-[#6BAF9A]">100%</span>
              <p className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF]">Xử lý trên RAM máy khách</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#141E19] border border-[#E5E7EB] dark:border-[#24312B] space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-[#2D5A4C] dark:text-[#6BAF9A]">TLS 1.3</span>
              <p className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF]">Mã hóa đường truyền tối tân</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#141E19] border border-[#E5E7EB] dark:border-[#24312B] space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-[#2D5A4C] dark:text-[#6BAF9A]">0 Ads</span>
              <p className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF]">Không quảng cáo & tracker</p>
            </div>
          </div>
        </div>

        {/* 2. 4 Core Pillars Grid (Tràn màn 2x2 rộng rãi) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight">
              4 Nguyên tắc bảo vệ quyền riêng tư cốt lõi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] p-6 sm:p-8 space-y-4 shadow-2xs hover:shadow-md hover:border-[#2D5A4C]/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-xs">
                  <HardDrive className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                  WebAssembly First
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-[#111827] dark:text-[#F9FAFB]">
                  1. Xử lý trực tiếp trên trình duyệt (Client-Side Only)
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
                  Các công cụ chỉnh sửa bao gồm: Ghép PDF, Tách trang, Xoay hướng, Nén dung lượng, Đánh số trang, Đóng dấu Watermark, Sắp xếp lại thứ tự và Ký tên điện tử được thực thi 100% trong trình duyệt web của bạn thông qua WebAssembly và engine pdf-lib.
                </p>
              </div>
              <ul className="pt-3 border-t border-[#F3F4F6] dark:border-[#24312B] space-y-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tài liệu không bị truyền lên máy chủ hay lưu trữ đám mây.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tốc độ xử lý tức thì, hoàn toàn bảo mật cho báo cáo tài chính và hợp đồng pháp lý.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] p-6 sm:p-8 space-y-4 shadow-2xs hover:shadow-md hover:border-[#2D5A4C]/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shadow-xs">
                  <Cpu className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                  Zero-Retention
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-[#111827] dark:text-[#F9FAFB]">
                  2. Cơ chế Zero-Retention cho Dịch thuật & AI
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
                  Khi bạn sử dụng công cụ Dịch PDF giữ bố cục hoặc OCR, chỉ các đoạn văn bản (text blocks) cần dịch mới được gửi qua kết nối mã hóa TLS 1.3 để chuyển ngữ sang tiếng Việt. Toàn bộ hình ảnh, chữ ký và cấu trúc đồ họa vẫn được giữ lại tại máy tính của bạn.
                </p>
              </div>
              <ul className="pt-3 border-t border-[#F3F4F6] dark:border-[#24312B] space-y-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Văn bản chuyển ngữ lập tức bị xóa bỏ khỏi bộ nhớ đệm ngay khi hoàn tất.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tuyệt đối không sử dụng dữ liệu khách hàng để huấn luyện mô hình AI.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] p-6 sm:p-8 space-y-4 shadow-2xs hover:shadow-md hover:border-[#2D5A4C]/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center shadow-xs">
                  <EyeOff className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40">
                  RAM Management
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-[#111827] dark:text-[#F9FAFB]">
                  3. Quản lý bộ nhớ đệm & Giải phóng RAM tự động
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
                  Hi PDF không bao giờ lưu trữ tệp tin nhị phân của tài liệu trong localStorage. Chỉ có các cài đặt giao diện và khóa API do chính bạn cung cấp được lưu cục bộ. Khi bạn đóng tab hoặc bấm xóa file, mọi Object URL bộ nhớ đệm sẽ bị thu hồi và xóa sạch.
                </p>
              </div>
              <ul className="pt-3 border-t border-[#F3F4F6] dark:border-[#24312B] space-y-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tự động thu hồi URL và dọn dẹp RAM khi kết thúc phiên làm việc.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Người dùng có toàn quyền xóa toàn bộ dữ liệu lịch sử bất cứ lúc nào.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] p-6 sm:p-8 space-y-4 shadow-2xs hover:shadow-md hover:border-[#2D5A4C]/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-xs">
                  <Lock className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
                  Clean & Ad-Free
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-[#111827] dark:text-[#F9FAFB]">
                  4. Nền tảng phi lợi nhuận: Không quảng cáo, Không bán data
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed">
                  Hi PDF là dự án tiện ích vì cộng đồng, được xây dựng phi lợi nhuận. Chúng tôi không thu thập thông tin định danh, không bắt buộc tạo tài khoản, không chèn banner quảng cáo độc hại và không bán dữ liệu cho bất kỳ bên thứ ba nào.
                </p>
              </div>
              <ul className="pt-3 border-t border-[#F3F4F6] dark:border-[#24312B] space-y-2 text-xs font-semibold text-[#374151] dark:text-[#D1D5DB]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Trải nghiệm sạch 100% không quảng cáo gây rối mắt hay mã độc.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sử dụng ngay lập tức không cần đăng ký tài khoản hay để lại email.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Bảng so sánh đối chiếu kiến trúc an toàn tràn màn */}
        <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] p-6 sm:p-8 space-y-6 shadow-xs overflow-hidden">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight">
              Bảng so sánh: Hi PDF vs Các công cụ PDF trực tuyến khác
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
              Tại sao kiến trúc WebAssembly Client-Side là tương lai của bảo mật dữ liệu văn phòng.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#24312B] bg-[#F8F9FA] dark:bg-[#1A2420]">
                  <th className="py-3.5 px-4 font-black text-[#111827] dark:text-[#F9FAFB]">Tiêu chuẩn bảo mật</th>
                  <th className="py-3.5 px-4 font-black text-[#2D5A4C] dark:text-[#6BAF9A]">
                    Hi PDF (Client-Side WASM)
                  </th>
                  <th className="py-3.5 px-4 font-bold text-[#6B7280] dark:text-[#9CA3AF]">
                    Các web PDF đám mây thông thường
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6] dark:divide-[#24312B]">
                <tr>
                  <td className="py-4 px-4 font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Vị trí xử lý tệp tin
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Trực tiếp trong RAM trình duyệt của bạn</span>
                  </td>
                  <td className="py-4 px-4 text-[#6B7280] dark:text-[#9CA3AF]">
                    Tải lên máy chủ trung gian của bên thứ 3
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Nguy cơ rò rỉ tài liệu mật
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>0% (Tệp không rời khỏi máy)</span>
                  </td>
                  <td className="py-4 px-4 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-medium">
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>Có nguy cơ nếu server bị tấn công</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Thời gian lưu file trên đĩa cứng
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>0 giây (Không lưu trữ bất kỳ file nào)</span>
                  </td>
                  <td className="py-4 px-4 text-[#6B7280] dark:text-[#9CA3AF]">
                    Lưu từ 1 giờ đến vài ngày trên server
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Huấn luyện mô hình AI trên dữ liệu
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Tuyệt đối không bao giờ</span>
                  </td>
                  <td className="py-4 px-4 text-amber-600 dark:text-amber-400 font-medium">
                    Thường có điều khoản sử dụng data để train
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold text-[#111827] dark:text-[#F9FAFB]">
                    Quảng cáo độc hại & Tracker
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sạch 100%, không quảng cáo</span>
                  </td>
                  <td className="py-4 px-4 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-medium">
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>Dày đặc quảng cáo pop-up & tracker</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. FAQ Accordion Section */}
        <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E5E7EB] dark:border-[#24312B] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight">
              Giải đáp thắc mắc về Bảo mật & Quyền riêng tư
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF]">
              Các câu hỏi kỹ thuật thường gặp về tính an toàn của công cụ.
            </p>
          </div>

          <div className="divide-y divide-[#E5E7EB] dark:divide-[#24312B] border-t border-[#E5E7EB] dark:border-[#24312B]">
            {securityFaqs.map((faq, idx) => {
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
