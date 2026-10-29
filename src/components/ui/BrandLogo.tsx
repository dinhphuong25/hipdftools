"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  showText?: boolean;
}

export function BrandLogoIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden transition-transform group-hover:scale-105 shrink-0 select-none ${className}`}
      style={{ aspectRatio: "1/1" }}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          {/* Main Document Body Gradient: Electric Sky to Ocean Blue */}
          <linearGradient id="hipdf-doc-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* 3D Glossy Origami Fold Flap Gradient */}
          <linearGradient id="hipdf-doc-fold" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>

          {/* Badge Drop Shadow */}
          <filter id="hipdf-doc-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0369A1" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Document Body with Rounded Corners & Top-Right Origami Fold Cut */}
        <path
          d="M6.5 7C6.5 5.07 8.07 3.5 10 3.5H21L29.5 12V29C29.5 30.93 27.93 32.5 26 32.5H10C8.07 32.5 6.5 30.93 6.5 29V7Z"
          fill="url(#hipdf-doc-body)"
        />

        {/* Top-Left Subtle Gloss Highlight */}
        <path
          d="M7 7.5C7 5.8 8.3 4.5 10 4.5H20.5L14 11H8C7.4 11 7 10.6 7 10V7.5Z"
          fill="#FFFFFF"
          opacity="0.22"
        />

        {/* Top-Right 3D Fold Shadow Under Flap */}
        <path d="M21 12H29.5L21 20.5V12Z" fill="#0369A1" opacity="0.28" />

        {/* Origami Fold Flap */}
        <path
          d="M21 3.5V10.5C21 11.33 21.67 12 22.5 12H29.5L21 3.5Z"
          fill="url(#hipdf-doc-fold)"
        />

        {/* Document Header Text Lines */}
        <rect x="10.5" y="8.5" width="7" height="2" rx="1" fill="#FFFFFF" opacity="0.6" />
        <rect x="10.5" y="12.5" width="14" height="2" rx="1" fill="#FFFFFF" opacity="0.35" />

        {/* Floating High-Contrast Crisp White PDF Badge */}
        <g filter="url(#hipdf-doc-shadow)">
          <rect x="8.5" y="17.5" width="19" height="10.5" rx="3" fill="#FFFFFF" />
          {/* Bold Geometric 'PDF' Glyph Outlines */}
          {/* Letter P */}
          <path
            d="M11.5 20H14.1C14.95 20 15.55 20.5 15.55 21.25C15.55 22 14.95 22.5 14.1 22.5H12.7V25H11.5V20ZM12.7 20.9V21.65H14C14.35 21.65 14.5 21.5 14.5 21.25C14.5 21 14.35 20.9 14 20.9H12.7Z"
            fill="#0284C7"
          />
          {/* Letter D */}
          <path
            d="M16.5 20H18.3C19.6 20 20.5 20.85 20.5 22.45C20.5 24.05 19.6 24.95 18.3 24.95H16.5V20ZM17.7 20.9V24.05H18.3C19.05 24.05 19.4 23.45 19.4 22.45C19.4 21.45 19.05 20.9 18.3 20.9H17.7Z"
            fill="#0284C7"
          />
          {/* Letter F */}
          <path
            d="M21.5 20H24.5V20.9H22.7V21.9H24.2V22.8H22.7V25H21.5V20Z"
            fill="#0284C7"
          />
        </g>

        {/* Accent Sky Dot */}
        <circle cx="25.5" cy="17.5" r="1.4" fill="#38BDF8" />
      </svg>
    </div>
  );
}

export function BrandLogo({
  size = "md",
  href = "/",
  className = "",
  showText = true,
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-9 h-9 sm:w-10 sm:h-10",
    lg: "w-11 h-11 sm:w-12 sm:h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Brand Icon */}
      <BrandLogoIcon className={iconSizes[size]} />

      {/* Brand Wordmark */}
      {showText && (
        <span
          className={`font-black tracking-tight text-[#0F172A] dark:text-[#F9FAFB] transition-colors leading-none ${textSizes[size]}`}
        >
          Hi <span className="text-[#0284C7] dark:text-[#38BDF8]">PDF</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
