"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { TranslationOptions } from "../translation/TranslationOptions";
import { Lock, Unlock, FileCode, FileSpreadsheet, Minimize2 } from "lucide-react";

interface ToolOptionsRendererProps {
  slug: string;
}

export function ToolOptionsRenderer({ slug }: ToolOptionsRendererProps) {
  const {
    watermarkConfig,
    setWatermarkConfig,
    pageNumbersConfig,
    setPageNumbersConfig,
    protectConfig,
    setProtectConfig,
    metadataConfig,
    setMetadataConfig,
  } = useAppStore();

  const [compressLevel, setCompressLevel] = useState<"recommended" | "extreme" | "low">("recommended");
  const [imageFormat, setImageFormat] = useState<"png" | "jpg">("png");
  const [showPassword, setShowPassword] = useState(false);

  switch (slug) {
    case "translate-pdf":
      return <TranslationOptions />;

    case "compress-pdf":
      return (
        <div className="space-y-3 text-xs">
          <label className="text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
            Mức độ nén tối ưu:
          </label>
          <div className="space-y-2">
            {[
              {
                id: "recommended",
                label: "Nén khuyến nghị",
                badge: "Khuyên dùng",
                desc: "Cân bằng hoàn hảo giữa độ nét hình ảnh và giảm ~45% dung lượng.",
              },
              {
                id: "extreme",
                label: "Nén mạnh nhất",
                badge: "File nhẹ nhất",
                desc: "Giảm tới ~65% dung lượng, phù hợp gửi email và nộp hồ sơ trực tuyến.",
              },
              {
                id: "low",
                label: "Nén nhẹ giữ chất lượng",
                badge: "Độ nét cao",
                desc: "Tối ưu hóa các luồng nội dung và giữ nguyên độ phân giải hình ảnh gốc.",
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setCompressLevel(item.id as any)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  compressLevel === item.id
                    ? "border-[#2D5A4C] bg-[#EAF3EE] dark:bg-[#182620] text-[#111827] dark:text-[#F9FAFB]"
                    : "border-[#E8EAED] dark:border-[#24312B] text-[#4B5563] dark:text-[#9CA3AF] hover:border-[#2D5A4C]/50"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-xs">{item.label}</span>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-white dark:bg-[#111722] border border-[#CFE2D7] dark:border-[#253A31] text-[#2D5A4C] dark:text-[#6BAF9A]">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] leading-tight">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      );

    case "watermark-pdf":
      return (
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
              Nội dung hình mờ (Hỗ trợ tiếng Việt có dấu)
            </label>
            <input
              type="text"
              value={watermarkConfig.text}
              onChange={(e) => setWatermarkConfig({ text: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {["BẢN THẢO", "NỘI BỘ", "BẢN QUYỀN", "TUYỆT MẬT", "ĐÃ DUYỆT"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setWatermarkConfig({ text: preset })}
                  className="px-2 py-0.5 rounded-md bg-[#F3F4F6] dark:bg-[#202938] text-[10px] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] hover:bg-[#E5E7EB] cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] block mb-1">
                Cỡ chữ ({watermarkConfig.fontSize}pt)
              </label>
              <input
                type="range"
                min="18"
                max="80"
                value={watermarkConfig.fontSize}
                onChange={(e) =>
                  setWatermarkConfig({ fontSize: parseInt(e.target.value, 10) })
                }
                className="w-full accent-[#2D5A4C]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] block mb-1">
                Độ mờ ({Math.round(watermarkConfig.opacity * 100)}%)
              </label>
              <input
                type="range"
                min="0.05"
                max="0.9"
                step="0.05"
                value={watermarkConfig.opacity}
                onChange={(e) =>
                  setWatermarkConfig({ opacity: parseFloat(e.target.value) })
                }
                className="w-full accent-[#2D5A4C]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] block mb-1">
              Góc xoay ({watermarkConfig.rotation}°)
            </label>
            <div className="flex gap-1.5">
              {[0, 30, 45, -45].map((angle) => (
                <button
                  key={angle}
                  type="button"
                  onClick={() => setWatermarkConfig({ rotation: angle })}
                  className={`flex-1 py-1 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                    watermarkConfig.rotation === angle
                      ? "border-[#2D5A4C] bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] font-bold"
                      : "border-[#E8EAED] dark:border-[#24312B] text-[#6B7280] dark:text-[#9CA3AF]"
                  }`}
                >
                  {angle}°
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] block mb-1">
              Màu sắc dấu mờ:
            </label>
            <div className="flex gap-2">
              {[
                { hex: "#315C4F", label: "Xanh Hi PDF" },
                { hex: "#6B7280", label: "Xám tiêu chuẩn" },
                { hex: "#DC2626", label: "Đỏ cảnh báo" },
                { hex: "#2563EB", label: "Xanh dương" },
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setWatermarkConfig({ color: c.hex })}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-semibold border flex items-center justify-center gap-1.5 cursor-pointer ${
                    watermarkConfig.color === c.hex
                      ? "border-[#2D5A4C] bg-[#EAF3EE] dark:bg-[#182620] text-[#111827] dark:text-[#F9FAFB]"
                      : "border-[#E8EAED] dark:border-[#24312B] text-[#6B7280]"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case "page-numbers":
      return (
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
              Định dạng hiển thị
            </label>
            <select
              value={pageNumbersConfig.format}
              onChange={(e) =>
                setPageNumbersConfig({ format: e.target.value as any })
              }
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
            >
              <option value="page_x_of_y">Trang X / Y (Ví dụ: Trang 1 / 18)</option>
              <option value="x_slash_y">X / Y (Ví dụ: 1 / 18)</option>
              <option value="page_x">Trang X (Ví dụ: Trang 1)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
              Vị trí chèn trên trang:
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B]">
              {[
                { id: "top_left", label: "Đầu - Trái" },
                { id: "top_center", label: "Đầu - Giữa" },
                { id: "top_right", label: "Đầu - Phải" },
                { id: "bottom_left", label: "Cuối - Trái" },
                { id: "bottom_center", label: "Cuối - Giữa" },
                { id: "bottom_right", label: "Cuối - Phải" },
              ].map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setPageNumbersConfig({ position: pos.id as any })}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                    pageNumbersConfig.position === pos.id
                      ? "border-[#2D5A4C] bg-[#2D5A4C] text-white shadow-xs"
                      : "border-[#E8EAED] dark:border-[#24312B] bg-white dark:bg-[#161D1A] text-[#4B5563] dark:text-[#9CA3AF]"
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
                Bắt đầu từ số:
              </label>
              <input
                type="number"
                min="1"
                value={pageNumbersConfig.startNumber}
                onChange={(e) =>
                  setPageNumbersConfig({
                    startNumber: Math.max(1, parseInt(e.target.value, 10) || 1),
                  })
                }
                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
                Cỡ chữ ({pageNumbersConfig.fontSize}pt):
              </label>
              <input
                type="range"
                min="8"
                max="20"
                value={pageNumbersConfig.fontSize}
                onChange={(e) =>
                  setPageNumbersConfig({ fontSize: parseInt(e.target.value, 10) })
                }
                className="w-full accent-[#2D5A4C] mt-2"
              />
            </div>
          </div>
        </div>
      );

    case "protect-pdf":
      return (
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
              Mật khẩu mở tệp mới:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mạnh"
                value={protectConfig.password}
                onChange={(e) => setProtectConfig({ password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] text-[10px] cursor-pointer"
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] text-[11px] text-[#2D5A4C] dark:text-[#6BAF9A] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Bảo vệ bằng mật khẩu cục bộ</span>
            </div>
            <p className="opacity-80">
              Chỉ những người biết mật khẩu này mới có thể mở và đọc nội dung tài liệu.
            </p>
          </div>
        </div>
      );

    case "unlock-pdf":
      return (
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
              Mật khẩu hiện tại của tệp:
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu để gỡ bỏ"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-xs text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C]"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] text-[11px] text-[#2D5A4C] dark:text-[#6BAF9A] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Unlock className="w-3.5 h-3.5" />
              <span>Gỡ bỏ mật khẩu vĩnh viễn</span>
            </div>
            <p className="opacity-80">
              Lưu lại bản PDF không còn yêu cầu nhập mật khẩu mỗi lần mở tệp.
            </p>
          </div>
        </div>
      );

    case "pdf-to-image":
      return (
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="text-[11px] font-medium text-[#4B5563] dark:text-[#9CA3AF] block mb-1">
              Định dạng hình ảnh:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "png", label: "PNG", desc: "Độ nét cao nhất, trong suốt" },
                { id: "jpg", label: "JPG", desc: "Dung lượng nhỏ gọn, chuẩn web" },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setImageFormat(fmt.id as any)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    imageFormat === fmt.id
                      ? "border-[#2D5A4C] bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A]"
                      : "border-[#E8EAED] dark:border-[#24312B] text-[#4B5563]"
                  }`}
                >
                  <div className="font-bold text-xs">{fmt.label}</div>
                  <div className="text-[10px] opacity-75">{fmt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-[11px] text-[#6B7280] space-y-1">
            <div className="font-bold text-[#111827] dark:text-[#F9FAFB]">Tự động đóng gói ZIP:</div>
            <p>Tài liệu nhiều trang sẽ được render độ nét 2x DPI và nén thành 1 tệp .ZIP duy nhất.</p>
          </div>
        </div>
      );

    case "pdf-to-word":
      return (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] text-xs text-[#2D5A4C] dark:text-[#6BAF9A] space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <FileCode className="w-4 h-4" />
              <span>Chuyển đổi sang Microsoft Word (.docx)</span>
            </div>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Tái tạo cấu trúc bảng biểu, font chữ và các đoạn văn bản từ PDF sang tài liệu Word có thể chỉnh sửa tự do.
            </p>
          </div>
        </div>
      );

    case "pdf-to-excel":
      return (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] text-xs text-[#2D5A4C] dark:text-[#6BAF9A] space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Trích xuất bảng sang Excel (.csv)</span>
            </div>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Tự động nhận diện cấu trúc dòng cột và xuất dữ liệu sang tệp bảng tính CSV kèm mã hóa UTF-8 BOM chuẩn tiếng Việt.
            </p>
          </div>
        </div>
      );

    case "flatten-pdf":
      return (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] text-xs text-[#2D5A4C] dark:text-[#6BAF9A] space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <Minimize2 className="w-4 h-4" />
              <span>Làm phẳng biểu mẫu & chú thích</span>
            </div>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Khóa toàn bộ trường nhập liệu, checkbox và chữ ký thành đối tượng đồ họa cố định, đảm bảo hiển thị đồng nhất khi in ấn và lưu trữ.
            </p>
          </div>
        </div>
      );

    case "pdf-metadata":
      return (
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-[#374151] dark:text-[#E2E8F0] block mb-1">
              Tiêu đề tài liệu (Title)
            </label>
            <input
              type="text"
              placeholder="Nhập tiêu đề tài liệu mới..."
              value={metadataConfig.title}
              onChange={(e) => setMetadataConfig({ title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#111722] border border-[#CBD5E1] dark:border-[#24312B] text-xs font-medium text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C] focus:ring-1 focus:ring-[#2D5A4C]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#374151] dark:text-[#E2E8F0] block mb-1">
              Tác giả (Author)
            </label>
            <input
              type="text"
              placeholder="Tên tác giả hoặc cơ quan ban hành..."
              value={metadataConfig.author}
              onChange={(e) => setMetadataConfig({ author: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#111722] border border-[#CBD5E1] dark:border-[#24312B] text-xs font-medium text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C] focus:ring-1 focus:ring-[#2D5A4C]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#374151] dark:text-[#E2E8F0] block mb-1">
              Chủ đề (Subject)
            </label>
            <input
              type="text"
              placeholder="Chủ đề hoặc mô tả vắn tắt..."
              value={metadataConfig.subject}
              onChange={(e) => setMetadataConfig({ subject: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#111722] border border-[#CBD5E1] dark:border-[#24312B] text-xs font-medium text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C] focus:ring-1 focus:ring-[#2D5A4C]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#374151] dark:text-[#E2E8F0] block mb-1">
              Từ khóa (Keywords, phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              placeholder="vd: báo cáo, nghiên cứu, pdf"
              value={metadataConfig.keywords}
              onChange={(e) => setMetadataConfig({ keywords: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#111722] border border-[#CBD5E1] dark:border-[#24312B] text-xs font-medium text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:border-[#2D5A4C] focus:ring-1 focus:ring-[#2D5A4C]"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] text-[11px] text-[#2D5A4C] dark:text-[#6BAF9A]">
            <p className="font-semibold">✓ Nhấn nút xử lý để lưu siêu dữ liệu mới vào tệp PDF.</p>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-xs text-[#6B7280] dark:text-[#8B949E] space-y-2">
          <p>Công cụ này tự động áp dụng các thông số kỹ thuật tối ưu nhất.</p>
          <div className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B]">
            ✓ Giữ nguyên phân giải vector gốc
          </div>
        </div>
      );
  }
}
