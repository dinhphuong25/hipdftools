"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ToolCard } from "@/components/tools/ToolCard";
import { TOOLS } from "@/lib/tools-registry";
import { useAppStore } from "@/lib/store/useAppStore";
import { Clock } from "lucide-react";
import Link from "next/link";

export default function RecentPage() {
  const { recentTools } = useAppStore();
  const recentToolItems = TOOLS.filter((t) => recentTools.includes(t.slug));

  return (
    <AppShell hideRightSidebar={true}>
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-[3px] h-[18px] bg-[#2D5A4C] rounded-[2px]" />
            <Clock className="w-5 h-5 text-[#2D5A4C] dark:text-[#6BAF9A]" />
            <h1 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB]">
              Công cụ đã mở gần đây
            </h1>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            Lịch sử các công cụ bạn đã truy cập trong phiên làm việc trên trình duyệt này.
          </p>
        </div>

        {recentToolItems.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#161D1A] rounded-2xl border border-[#E8EAED] dark:border-[#24312B] p-8 space-y-3">
            <Clock className="w-8 h-8 mx-auto text-[#9CA3AF] opacity-50" />
            <h3 className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]">
              Chưa có lịch sử công cụ
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] max-w-sm mx-auto">
              Khi bạn mở và làm việc với bất kỳ công cụ nào, lịch sử sẽ được lưu cục bộ tại đây.
            </p>
            <div className="pt-2">
              <Link
                href="/tools"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-semibold transition-all shadow-xs"
              >
                Khám phá công cụ
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentToolItems.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
