"use client";

import React, { useEffect, use } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ToolOptionsRenderer } from "@/components/tools/ToolOptionsRenderer";
import { getToolBySlug } from "@/lib/tools-registry";
import { useAppStore } from "@/lib/store/useAppStore";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export default function DynamicToolPage({ params }: ToolPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const tool = getToolBySlug(slug);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    if (slug) addRecentTool(slug);
  }, [slug, addRecentTool]);

  if (!tool) {
    return (
      <AppShell hideRightSidebar={true}>
        <div className="py-20 text-center space-y-3">
          <h2 className="text-lg font-bold text-[#1F2937] dark:text-[#F0F6FC]">
            Không tìm thấy công cụ
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-[#8B949E]">
            Công cụ bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang đường dẫn khác.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell hideFooter={true}>
      <ToolWorkspace
        tool={tool}
        renderToolOptions={() => <ToolOptionsRenderer slug={tool.slug} />}
      />
    </AppShell>
  );
}
