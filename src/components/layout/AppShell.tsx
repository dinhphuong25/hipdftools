"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PolicyModal } from "../modals/PolicyModal";

interface AppShellProps {
  children: React.ReactNode;
  toolSlug?: string;
  toolName?: string;
  onExecute?: () => void;
  actionButtonLabel?: string;
  renderToolOptions?: () => React.ReactNode;
  hideRightSidebar?: boolean;
  hideFooter?: boolean;
}

export function AppShell({ children, hideFooter = false }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0D1411] text-[#111827] dark:text-[#F9FAFB] transition-colors">
      {/* 1. Sleek Navigation Header (Identical to landing page) */}
      <Navbar />

      {/* 2. Main Page Container (Expansive Full-Width Layout) */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10">
        {children}
      </main>

      {/* 3. Modern Human-Crafted SaaS Footer */}
      {!hideFooter ? <Footer /> : <PolicyModal />}
    </div>
  );
}
