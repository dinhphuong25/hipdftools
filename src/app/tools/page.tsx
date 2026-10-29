"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { ToolCategory } from "@/lib/tools-registry";

function ToolsContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("category") as ToolCategory | null;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-[3px] h-[18px] bg-[#0284C7] rounded-[2px]" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Tất cả công cụ PDF
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Hệ sinh thái công cụ xử lý, chỉnh sửa, bảo mật và dịch thuật tài liệu toàn diện.
        </p>
      </div>

      <ToolGrid initialCategory={catParam || "all"} showSearch={true} />
    </div>
  );
}

export default function ToolsPage() {
  return (
    <AppShell hideRightSidebar={true}>
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#9CA3AF]">Đang tải danh mục...</div>}>
        <ToolsContent />
      </Suspense>
    </AppShell>
  );
}
