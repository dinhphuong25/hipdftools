"use client";

import React, { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TranslationWorkspace } from "@/components/translation/TranslationWorkspace";
import { useAppStore } from "@/lib/store/useAppStore";

export default function TranslatePdfPage() {
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool("translate-pdf");
  }, [addRecentTool]);

  return (
    <AppShell hideFooter={true}>
      <TranslationWorkspace />
    </AppShell>
  );
}
