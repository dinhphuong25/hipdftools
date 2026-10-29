"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MasterHeroDropzone } from "@/components/home/MasterHeroDropzone";
import { BilingualSpotlight } from "@/components/home/BilingualSpotlight";
import { WorkflowSteps } from "@/components/home/WorkflowSteps";
import { ToolCatalog } from "@/components/home/ToolCatalog";
import { SecurityFeatureGrid } from "@/components/home/SecurityFeatureGrid";
import { FaqSection } from "@/components/home/FaqSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0D1411] text-[#111827] dark:text-[#F9FAFB] transition-colors">
      {/* 1. Sleek Frosted Glass Header */}
      <Navbar />

      {/* 2. Main Page Content */}
      <main className="flex-1">
        {/* Master Hero & Instant Drag-and-Drop Dropzone */}
        <MasterHeroDropzone />

        {/* 3-Step Clear Workflow Overview */}
        <WorkflowSteps />

        {/* Flagship Spotlight: Bảo toàn bố cục khi Dịch PDF */}
        <BilingualSpotlight />

        {/* Comprehensive Tool Directory with Instant Search & Filters */}
        <ToolCatalog />

        {/* Security & Client-Side Privacy Standards */}
        <SecurityFeatureGrid />

        {/* FAQ Section matching hidownload.one */}
        <FaqSection />
      </main>

      {/* 3. Modern Floating Card SaaS Footer */}
      <Footer />
    </div>
  );
}
