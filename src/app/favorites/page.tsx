"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ToolCard } from "@/components/tools/ToolCard";
import { TOOLS } from "@/lib/tools-registry";
import { useAppStore } from "@/lib/store/useAppStore";
import { Star } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites } = useAppStore();
  const favoriteTools = TOOLS.filter((t) => favorites.includes(t.slug));

  return (
    <AppShell hideRightSidebar={true}>
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-[3px] h-[18px] bg-[#2D5A4C] rounded-[2px]" />
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h1 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB]">
              Công cụ yêu thích
            </h1>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            Truy cập nhanh các công cụ PDF bạn thường xuyên sử dụng nhất.
          </p>
        </div>

        {favoriteTools.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#161D1A] rounded-2xl border border-[#E8EAED] dark:border-[#24312B] p-8 space-y-3">
            <Star className="w-8 h-8 mx-auto text-[#9CA3AF] opacity-50" />
            <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]">
              Chưa có công cụ yêu thích
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] max-w-sm mx-auto">
              Nhấp vào biểu tượng ngôi sao ở góc thẻ công cụ bất kỳ để ghim vào danh sách này.
            </p>
            <div className="pt-2">
              <Link
                href="/tools"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-semibold transition-all shadow-xs"
              >
                Xem tất cả công cụ
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
