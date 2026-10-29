"use client";

import React from "react";

interface DropzoneIllustrationProps {
  className?: string;
}

export function DropzoneIllustration({ className = "w-28 h-24" }: DropzoneIllustrationProps) {
  return (
    <div className={`relative mx-auto select-none transition-transform duration-500 ease-out hover:scale-105 ${className}`}>
      <svg
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="dropzone-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="dropzone-fold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>
          <linearGradient id="dropzone-cloud" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>

        {/* Decorative Sparkles with subtle glow */}
        <path d="M22 28L24 22L26 28L32 30L26 32L24 38L22 32L16 30L22 28Z" fill="#38BDF8" opacity="0.9" />
        <path d="M96 22L97.5 17L99 22L104 23.5L99 25L97.5 30L96 25L91 23.5L96 22Z" fill="#0284C7" opacity="0.85" />
        <path d="M102 62L103 58L104 62L108 63L104 64L103 68L102 64L98 63L102 62Z" fill="#38BDF8" opacity="0.75" />

        {/* Back Document Sheet (Angled to the left) */}
        <g transform="rotate(-7 46 50)">
          <rect
            x="24"
            y="14"
            width="50"
            height="66"
            rx="7"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="2"
          />
          <path d="M32 26H56M32 34H62M32 42H50" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Front Document Sheet (Slightly angled to the right) */}
        <g transform="rotate(5 68 50)">
          <rect
            x="44"
            y="12"
            width="52"
            height="68"
            rx="7"
            fill="#FFFFFF"
            stroke="#0284C7"
            strokeWidth="2.5"
          />
          {/* Folded Corner in Ocean Cyan */}
          <path d="M78 12L96 30H82C79.7909 30 78 28.2091 78 26V12Z" fill="url(#dropzone-fold)" />
          <path d="M78 12L96 30" stroke="#0284C7" strokeWidth="2" />

          {/* Bold PDF Typography */}
          <text
            x="68"
            y="44"
            fill="#0284C7"
            fontSize="14"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.8"
            textAnchor="middle"
          >
            PDF
          </text>

          {/* Document Content Lines */}
          <path d="M52 54H86M52 61H80M52 68H72" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Floating Cloud Upload Badge in Center */}
        <g filter="drop-shadow(0 8px 16px rgba(2, 132, 199, 0.28))">
          <ellipse cx="60" cy="74" rx="26" ry="17" fill="#FFFFFF" />
          <path
            d="M45 76C44 76 40 73 40 68C40 63 45 61 48 61C49 55 54 50 61 50C67 50 72 54 74 59C77 59 81 62 81 67C81 72 77 76 72 76H45Z"
            fill="url(#dropzone-cloud)"
          />
          {/* White Upload Arrow */}
          <circle cx="60" cy="67" r="7.5" fill="#FFFFFF" />
          <path
            d="M60 71V62M57 65L60 62L63 65"
            stroke="#0284C7"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
