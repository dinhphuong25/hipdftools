"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#0F172A] dark:bg-[#0284C7] hover:bg-[#1E293B] dark:hover:bg-[#0369A1] text-white shadow-xl shadow-black/20 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center group border border-white/20 animate-in fade-in zoom-in-75"
      title="Cuộn lên đầu trang"
      aria-label="Cuộn lên đầu trang"
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5] group-hover:-translate-y-1 transition-transform duration-200" />
    </button>
  );
}
