"use client";

import React from "react";

interface ToolIllustrationProps {
  slug: string;
  className?: string;
}

export function ToolIllustration({ slug, className = "w-16 h-16" }: ToolIllustrationProps) {
  // 1. PDF to Word (DOCX)
  if (slug === "pdf-to-word") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Base Paper Sheet */}
          <rect x="12" y="8" width="38" height="52" rx="7" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M20 20H36M20 28H42M20 36H32" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Microsoft Word Royal Blue Badge */}
          <g filter="drop-shadow(0 6px 12px rgba(37, 99, 235, 0.35))">
            <rect x="28" y="24" width="34" height="34" rx="10" fill="url(#grad-word)" />
            <text x="45" y="47" fill="white" fontSize="19" fontWeight="900" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif">
              W
            </text>
          </g>
          {/* Transition indicator arrow */}
          <circle cx="24" cy="50" r="8" fill="#2563EB" />
          <path d="M21.5 50H26.5M25 47.5L27.5 50L25 52.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="grad-word" x1="28" y1="24" x2="62" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 2. Office to PDF (Word / Excel / PPT sang PDF)
  if (slug === "office-to-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Word Blue Sheet */}
          <rect x="8" y="14" width="24" height="32" rx="5" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
          <text x="20" y="34" fill="#2563EB" fontSize="12" fontWeight="900" textAnchor="middle">W</text>
          {/* Excel Green Sheet */}
          <rect x="18" y="22" width="24" height="32" rx="5" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
          <text x="30" y="42" fill="#059669" fontSize="12" fontWeight="900" textAnchor="middle">X</text>
          {/* PDF Target Document Front */}
          <g filter="drop-shadow(0 6px 12px rgba(45, 90, 76, 0.3))">
            <rect x="32" y="10" width="32" height="46" rx="8" fill="#FFFFFF" stroke="#2D5A4C" strokeWidth="2.5" />
            <path d="M46 10L64 28H50C47.79 28 46 26.21 46 24V10Z" fill="#EAF3EE" />
            <rect x="38" y="32" width="20" height="12" rx="4" fill="#2D5A4C" />
            <text x="48" y="41" fill="white" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="0.5">PDF</text>
          </g>
        </svg>
      </div>
    );
  }

  // 3. Image to PDF (JPG / PNG to PDF)
  if (slug === "image-to-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Target PDF sheet behind */}
          <rect x="22" y="8" width="38" height="52" rx="7" fill="#FFFFFF" stroke="#2D5A4C" strokeWidth="2" />
          <path d="M30 20H48M30 28H44" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          {/* Vibrant Purple Gallery / Photo Badge */}
          <g filter="drop-shadow(0 6px 14px rgba(139, 92, 246, 0.35))">
            <rect x="10" y="24" width="34" height="34" rx="10" fill="url(#grad-img-to-pdf)" />
            {/* Sun & Mountain */}
            <circle cx="21" cy="33" r="3" fill="#FDE047" />
            <path d="M15 48L24 38L32 48H15Z" fill="white" />
            <path d="M28 48L34 40L41 48H28Z" fill="#DDD6FE" />
          </g>
          {/* Arrow pointing to PDF */}
          <circle cx="50" cy="46" r="8" fill="#2D5A4C" />
          <path d="M47.5 46H52.5M51 43.5L53.5 46L51 48.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="grad-img-to-pdf" x1="10" y1="24" x2="44" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#6D28D9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 4. PDF to Image (PDF sang Hình ảnh)
  if (slug === "pdf-to-image") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Base PDF Document */}
          <rect x="10" y="10" width="34" height="48" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="16" y="18" width="16" height="8" rx="2" fill="#2D5A4C" />
          <text x="24" y="24.5" fill="white" fontSize="6.5" fontWeight="900" textAnchor="middle">PDF</text>
          {/* Vibrant Output Photo Card in foreground */}
          <g filter="drop-shadow(0 6px 14px rgba(139, 92, 246, 0.35))">
            <rect x="28" y="24" width="36" height="34" rx="10" fill="url(#grad-pdf-to-img)" />
            <circle cx="39" cy="34" r="3.5" fill="#FDE047" />
            <path d="M33 50L43 39L52 50H33Z" fill="white" />
            <path d="M47 50L54 42L61 50H47Z" fill="#C4B5FD" />
          </g>
          <defs>
            <linearGradient id="grad-pdf-to-img" x1="28" y1="24" x2="64" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333EA" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 5. Merge PDF (Ghép PDF)
  if (slug === "merge-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Back document */}
          <rect x="10" y="18" width="30" height="42" rx="6" fill="#E2E8F0" opacity="0.6" />
          {/* Middle document */}
          <rect x="18" y="13" width="30" height="42" rx="6" fill="#CBD5E1" opacity="0.8" />
          {/* Front document */}
          <rect x="26" y="8" width="32" height="44" rx="6" fill="#FFFFFF" stroke="#2D5A4C" strokeWidth="2" />
          <path d="M32 18H48M32 25H45M32 32H40" stroke="#2D5A4C" strokeWidth="2.2" strokeLinecap="round" />
          {/* Vibrant Emerald Plus Badge */}
          <g filter="drop-shadow(0 6px 12px rgba(45, 90, 76, 0.35))">
            <circle cx="50" cy="48" r="14" fill="url(#grad-merge)" />
            <path d="M50 41V55M43 48H57" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </g>
          <defs>
            <linearGradient id="grad-merge" x1="36" y1="34" x2="64" y2="62" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2D5A4C" />
              <stop offset="1" stopColor="#1B382F" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 6. Split PDF (Tách PDF)
  if (slug === "split-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Left Split Leaf */}
          <rect x="10" y="10" width="21" height="48" rx="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M15 22H24M15 29H22M15 36H24" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
          {/* Right Split Leaf */}
          <rect x="41" y="10" width="21" height="48" rx="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M46 22H55M46 29H53M46 36H55" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
          {/* Scissor / Cut Separation Line */}
          <line x1="36" y1="8" x2="36" y2="60" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
          {/* Vibrant Scissors Cut Badge */}
          <g filter="drop-shadow(0 4px 10px rgba(239, 68, 68, 0.35))">
            <circle cx="36" cy="35" r="11" fill="url(#grad-split)" />
            {/* Scissor Icon */}
            <circle cx="32" cy="38" r="2" stroke="white" strokeWidth="1.4" fill="none" />
            <circle cx="40" cy="38" r="2" stroke="white" strokeWidth="1.4" fill="none" />
            <path d="M33 36L39 30M39 36L33 30" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <defs>
            <linearGradient id="grad-split" x1="25" y1="24" x2="47" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EF4444" />
              <stop offset="1" stopColor="#B91C1C" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 7. Rotate PDF (Xoay trang PDF)
  if (slug === "rotate-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Tilted Center Sheet */}
          <g transform="rotate(-8 36 36)">
            <rect x="20" y="15" width="32" height="42" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <path d="M26 25H44M26 32H40M26 39H36" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          {/* Dynamic 3D Orbit Circular Arrow */}
          <g filter="drop-shadow(0 4px 10px rgba(2, 132, 199, 0.35))">
            <path
              d="M56 36C56 47.0457 47.0457 56 36 56C24.9543 56 16 47.0457 16 36C16 24.9543 24.9543 16 36 16"
              stroke="url(#grad-rotate)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <polygon points="36,9 45,16 36,23" fill="#0284C7" />
          </g>
          {/* Degree angle pill */}
          <rect x="27" y="44" width="18" height="11" rx="4" fill="#0284C7" />
          <text x="36" y="52" fill="white" fontSize="7" fontWeight="900" textAnchor="middle">90°</text>
          <defs>
            <linearGradient id="grad-rotate" x1="16" y1="16" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284C7" />
              <stop offset="1" stopColor="#0369A1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 8. Delete / Extract Pages (Xóa & Trích xuất trang)
  if (slug === "extract-delete-pages") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* 4 Mini Page Grid */}
          <rect x="12" y="12" width="20" height="22" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.8" />
          <path d="M16 19H26M16 24H23" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

          <rect x="40" y="12" width="20" height="22" rx="4" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.8" />
          {/* Red Delete Mark */}
          <path d="M46 19L54 27M54 19L46 27" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />

          <rect x="12" y="38" width="20" height="22" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.8" />
          <path d="M16 45H26M16 50H23" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

          <rect x="40" y="38" width="20" height="22" rx="4" fill="#EAF3EE" stroke="#2D5A4C" strokeWidth="1.8" />
          {/* Green Extract Check/Arrow */}
          <path d="M46 51L49 54L55 46" stroke="#2D5A4C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  // 9. Reorder Pages (Sắp xếp lại thứ tự trang)
  if (slug === "reorder-pages") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Top Sheet with #1 */}
          <rect x="12" y="10" width="34" height="20" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.8" />
          <rect x="16" y="14" width="10" height="10" rx="2" fill="#EAF3EE" />
          <text x="21" y="21.5" fill="#2D5A4C" fontSize="7" fontWeight="900" textAnchor="middle">1</text>
          <path d="M30 17H40M30 22H36" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Bottom Sheet with #2 */}
          <rect x="12" y="42" width="34" height="20" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.8" />
          <rect x="16" y="46" width="10" height="10" rx="2" fill="#EAF3EE" />
          <text x="21" y="53.5" fill="#2D5A4C" fontSize="7" fontWeight="900" textAnchor="middle">2</text>
          <path d="M30 49H40M30 54H36" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Large Vertical Swap Arrows Badge */}
          <g filter="drop-shadow(0 6px 12px rgba(45, 90, 76, 0.35))">
            <circle cx="53" cy="36" r="14" fill="url(#grad-reorder)" />
            {/* Up arrow */}
            <path d="M49 39V30M46 33L49 30L52 33" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Down arrow */}
            <path d="M57 33V42M54 39L57 42L60 39" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <linearGradient id="grad-reorder" x1="39" y1="22" x2="67" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2D5A4C" />
              <stop offset="1" stopColor="#1B382F" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 10. Page Numbers (Thêm số trang)
  if (slug === "page-numbers") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Document Sheet */}
          <rect x="14" y="8" width="44" height="56" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M22 18H50M22 26H46M22 34H40" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          {/* Highlighted Footer Number Badge */}
          <g filter="drop-shadow(0 4px 10px rgba(13, 148, 136, 0.35))">
            <rect x="22" y="44" width="28" height="14" rx="5" fill="url(#grad-page-num)" />
            <text x="36" y="54" fill="white" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace">
              1 / N
            </text>
          </g>
          <defs>
            <linearGradient id="grad-page-num" x1="22" y1="44" x2="50" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0D9488" />
              <stop offset="1" stopColor="#0F766E" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 11. Watermark PDF (Đóng dấu Watermark)
  if (slug === "watermark-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="14" y="8" width="44" height="56" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M22 18H50M22 26H44M22 34H48" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          {/* Angled Rubber Stamp Badge */}
          <g transform="rotate(-18 36 38)" filter="drop-shadow(0 6px 12px rgba(217, 119, 6, 0.35))">
            <rect x="14" y="27" width="44" height="22" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
            <text x="36" y="42" fill="#B45309" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="system-ui" letterSpacing="1">
              HI PDF
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 12. PDF Metadata (Xem & Sửa Metadata)
  if (slug === "pdf-metadata") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="14" y="8" width="44" height="56" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          {/* Tag Pills */}
          <rect x="22" y="16" width="18" height="6" rx="2" fill="#E2E8F0" />
          <rect x="22" y="26" width="28" height="6" rx="2" fill="#E2E8F0" />
          <rect x="22" y="36" width="22" height="6" rx="2" fill="#E2E8F0" />
          {/* Metadata Info Magnifier Badge */}
          <g filter="drop-shadow(0 6px 12px rgba(99, 102, 241, 0.35))">
            <circle cx="46" cy="46" r="14" fill="url(#grad-meta)" />
            {/* Info 'i' symbol */}
            <circle cx="46" cy="40" r="1.5" fill="white" />
            <path d="M46 44V51" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <defs>
            <linearGradient id="grad-meta" x1="32" y1="32" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#4338CA" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 13. Protect PDF (Đặt mật khẩu PDF)
  if (slug === "protect-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="14" y="8" width="44" height="56" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M22 18H50M22 26H42" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          {/* Solid Golden Padlock Badge */}
          <g filter="drop-shadow(0 6px 14px rgba(245, 158, 11, 0.4))">
            {/* Shackle */}
            <path d="M30 33V25C30 21.6863 32.6863 19 36 19C39.3137 19 42 21.6863 42 25V33" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Body */}
            <rect x="25" y="32" width="22" height="20" rx="6" fill="url(#grad-lock)" />
            <circle cx="36" cy="41" r="2.5" fill="#78350F" />
            <path d="M36 43.5V47" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          <defs>
            <linearGradient id="grad-lock" x1="25" y1="32" x2="47" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 14. Unlock PDF (Mở khóa PDF)
  if (slug === "unlock-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="14" y="8" width="44" height="56" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M22 18H50M22 26H42" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
          {/* Opened Green Lock Badge */}
          <g filter="drop-shadow(0 6px 14px rgba(16, 185, 129, 0.4))">
            {/* Opened Shackle */}
            <path d="M30 31V23C30 19.6863 32.6863 17 36 17C39.3137 17 42 19.6863 42 23V25" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <rect x="25" y="32" width="22" height="20" rx="6" fill="url(#grad-unlock)" />
            {/* Checkmark inside */}
            <path d="M31 42L34.5 45.5L41 38" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <linearGradient id="grad-unlock" x1="25" y1="32" x2="47" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 15. Sign PDF (Ký tên lên PDF)
  if (slug === "sign-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="14" y="8" width="44" height="56" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M22 18H44M22 25H36" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          {/* Signature Line */}
          <line x1="20" y1="52" x2="52" y2="52" stroke="#94A3B8" strokeWidth="1.8" strokeDasharray="3 2" />
          {/* Swirling Signature */}
          <path d="M22 47C26 43 28 50 33 45C38 40 43 47 48 44" stroke="#2D5A4C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Floating Luxury Fountain Pen */}
          <g transform="rotate(-42 46 28)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.25))">
            <rect x="42" y="10" width="9" height="24" rx="2" fill="#1E293B" />
            <polygon points="42,34 51,34 46.5,44" fill="#F59E0B" />
            <circle cx="46.5" cy="38" r="1.2" fill="#1E293B" />
          </g>
        </svg>
      </div>
    );
  }

  // 16. Extract Text (Trích xuất văn bản TXT)
  if (slug === "extract-text") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="12" y="8" width="36" height="52" rx="7" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M18 18H36M18 25H42M18 32H32" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          {/* TXT Cyan Document in foreground */}
          <g filter="drop-shadow(0 6px 12px rgba(2, 132, 199, 0.35))">
            <rect x="28" y="24" width="34" height="34" rx="10" fill="url(#grad-txt)" />
            <text x="45" y="45" fill="white" fontSize="13" fontWeight="900" textAnchor="middle" letterSpacing="0.8">
              TXT
            </text>
            <path d="M35 49H55" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </g>
          <defs>
            <linearGradient id="grad-txt" x1="28" y1="24" x2="62" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284C7" />
              <stop offset="1" stopColor="#0369A1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 17. Flatten PDF (Làm phẳng PDF)
  if (slug === "flatten-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="14" y="10" width="44" height="52" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          {/* Form checkbox fields */}
          <rect x="22" y="20" width="10" height="10" rx="2" fill="#EAF3EE" stroke="#2D5A4C" strokeWidth="1.5" />
          <path d="M24 25L26 27L30 22" stroke="#2D5A4C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 25H48" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          {/* Flatten Press Lock Badge */}
          <g filter="drop-shadow(0 6px 12px rgba(71, 85, 105, 0.35))">
            <rect x="20" y="38" width="38" height="16" rx="6" fill="#334155" />
            <text x="39" y="49" fill="white" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="0.8">
              FLATTEN
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // 18. Compress PDF (Nén & Giảm dung lượng PDF)
  if (slug === "compress-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="14" y="10" width="44" height="52" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M22 20H50M22 28H44M22 36H36" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          {/* Inward Incline Compression Arrows */}
          <g filter="drop-shadow(0 6px 12px rgba(234, 88, 12, 0.35))">
            <circle cx="36" cy="36" r="15" fill="url(#grad-compress)" />
            {/* 4 Inward Arrowheads */}
            <path d="M36 25V30M36 47V42M25 36H30M47 36H42" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="36" cy="36" r="3.5" fill="white" />
          </g>
          <defs>
            <linearGradient id="grad-compress" x1="21" y1="21" x2="51" y2="51" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" />
              <stop offset="1" stopColor="#C2410C" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 19. OCR PDF (Nhận dạng chữ Scan)
  if (slug === "ocr-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="14" y="8" width="44" height="56" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M22 18H50M22 26H50M22 34H42M22 42H50M22 50H36" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          {/* High-tech Scanning Reticles */}
          <path d="M10 16V10H16M56 10H62V16M10 56V62H16M56 62H62V56" stroke="#2D5A4C" strokeWidth="3" strokeLinecap="round" />
          {/* Glowing Neon Laser Beam */}
          <line x1="8" y1="34" x2="64" y2="34" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" filter="drop-shadow(0 0 8px #10B981)" />
        </svg>
      </div>
    );
  }

  // 20. View PDF (Trình đọc & Kiểm tra PDF)
  if (slug === "view-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="14" y="8" width="44" height="56" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          {/* Bookmark ribbon */}
          <path d="M44 8V24L48 21L52 24V8H44Z" fill="#2D5A4C" />
          <path d="M22 22H38M22 30H48M22 38H42" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          {/* Magnifying Glass Badge */}
          <g filter="drop-shadow(0 6px 12px rgba(59, 130, 246, 0.35))">
            <circle cx="36" cy="44" r="11" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="3" />
            <path d="M44 52L52 60" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="33" cy="41" r="2" fill="#93C5FD" />
          </g>
        </svg>
      </div>
    );
  }

  // 21. AI Summary (Tóm tắt tài liệu bằng AI)
  if (slug === "ai-summary") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="14" y="8" width="44" height="56" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          {/* Summary bullet lines */}
          <circle cx="22" cy="22" r="2" fill="#8B5CF6" />
          <path d="M28 22H48" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
          <circle cx="22" cy="30" r="2" fill="#8B5CF6" />
          <path d="M28 30H42" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
          {/* Gemini AI Glowing 4-point Sparkle Star */}
          <g filter="drop-shadow(0 6px 14px rgba(139, 92, 246, 0.45))">
            <circle cx="46" cy="46" r="14" fill="url(#grad-ai-spark)" />
            <path
              d="M46 38C46 42.4 49.6 46 54 46C49.6 46 46 49.6 46 54C46 49.6 42.4 46 38 46C42.4 46 46 42.4 46 38Z"
              fill="white"
            />
          </g>
          <defs>
            <linearGradient id="grad-ai-spark" x1="32" y1="32" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A855F7" />
              <stop offset="1" stopColor="#7E22CE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 22. AI Ask (Hỏi đáp tài liệu có dẫn trang)
  if (slug === "ai-ask") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <rect x="14" y="8" width="44" height="56" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M22 18H50M22 26H42" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          {/* Speech Bubble with citation pill */}
          <g filter="drop-shadow(0 6px 14px rgba(2, 132, 199, 0.4))">
            <path
              d="M26 30C26 26.6863 28.6863 24 32 24H52C55.3137 24 58 26.6863 58 30V42C58 45.3137 55.3137 48 52 48H36L28 54V48H32C28.6863 48 26 45.3137 26 42V30Z"
              fill="url(#grad-ask)"
            />
            {/* Citation inside bubble */}
            <text x="42" y="38" fill="white" fontSize="9" fontWeight="900" textAnchor="middle">
              p. 12
            </text>
          </g>
          <defs>
            <linearGradient id="grad-ask" x1="26" y1="24" x2="58" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284C7" />
              <stop offset="1" stopColor="#075985" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 23. Translate PDF (Dịch PDF giữ nguyên định dạng)
  if (slug === "translate-pdf") {
    return (
      <div className={`relative shrink-0 select-none ${className}`}>
        <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Left doc sheet: EN */}
          <rect x="8" y="14" width="28" height="42" rx="5" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
          <text x="22" y="36" fill="#475569" fontSize="13" fontWeight="900" textAnchor="middle">EN</text>
          {/* Right doc sheet: VI */}
          <rect x="36" y="14" width="28" height="42" rx="5" fill="#FFFFFF" stroke="#2D5A4C" strokeWidth="2.5" />
          <text x="50" y="36" fill="#2D5A4C" fontSize="13" fontWeight="900" textAnchor="middle">VI</text>
          {/* Center Exchange Capsule Badge */}
          <g filter="drop-shadow(0 6px 12px rgba(45, 90, 76, 0.4))">
            <rect x="24" y="42" width="24" height="18" rx="9" fill="url(#grad-trans)" />
            <path d="M29 51H43M40 48L43 51L40 54" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <linearGradient id="grad-trans" x1="24" y1="42" x2="48" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2D5A4C" />
              <stop offset="1" stopColor="#1B382F" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Fallback Generic PDF Tool Document Illustration
  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Crisp Folded Document */}
        <rect x="16" y="8" width="40" height="56" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
        <path d="M40 8L56 24H44C41.7909 24 40 22.2091 40 20V8Z" fill="#EAF3EE" />
        <path d="M24 28H34M24 36H48M24 44H42" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        {/* Emerald Tool Pill */}
        <rect x="22" y="42" width="28" height="14" rx="5" fill="#2D5A4C" filter="drop-shadow(0 2px 4px rgba(45, 90, 76, 0.3))" />
        <text x="36" y="52" fill="white" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="system-ui" letterSpacing="0.5">
          PDF
        </text>
      </svg>
    </div>
  );
}
