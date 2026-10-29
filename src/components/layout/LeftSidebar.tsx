"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Star,
  Clock,
  Layers,
  RefreshCw,
  Edit3,
  Lock,
  ScanLine,
  Bot,
  Languages,
  HelpCircle,
  Settings,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

export function LeftSidebar() {
  const pathname = usePathname();
  const {
    leftSidebarCollapsed,
    toggleLeftSidebar,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useAppStore();

  const mainNav = [
    { label: "Trang chủ", href: "/", icon: Home },
    { label: "Tất cả công cụ", href: "/tools", icon: LayoutGrid },
    { label: "Yêu thích", href: "/favorites", icon: Star },
    { label: "Gần đây", href: "/recent", icon: Clock },
  ];

  const categoryNav = [
    { label: "Tổ chức PDF", href: "/tools?category=organize", icon: Layers },
    { label: "Chuyển đổi", href: "/tools?category=convert_to_pdf", icon: RefreshCw },
    { label: "Chỉnh sửa", href: "/tools?category=edit", icon: Edit3 },
    { label: "Bảo mật & ký", href: "/tools?category=security", icon: Lock },
    { label: "OCR & quét", href: "/tools?category=ocr", icon: ScanLine },
    { label: "Công cụ AI", href: "/tools?category=ai_translate", icon: Bot },
    {
      label: "Dịch PDF",
      href: "/tools/translate-pdf",
      icon: Languages,
      isFocal: true,
      badge: "AI",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen flex flex-col justify-between bg-white dark:bg-[#111722] border-r border-[#E8EAED] dark:border-[#1E293B] transition-all duration-200 select-none ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${leftSidebarCollapsed ? "w-16" : "w-[230px]"}`}
      >
        {/* Top Header & Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-4">
            <Link
              href="/"
              className={`flex items-center gap-2.5 transition-all ${
                leftSidebarCollapsed ? "justify-center w-full" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#EAF3EE] dark:bg-[#182620] border border-[#CFE2D7] dark:border-[#253A31] flex items-center justify-center text-[#2D5A4C] dark:text-[#6BAF9A] shrink-0">
                <FileText className="w-4 h-4 stroke-[2.5]" />
              </div>
              {!leftSidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-extrabold text-base leading-none text-[#111827] dark:text-[#F9FAFB] tracking-tight">
                    Hi PDF
                  </span>
                  <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                    Không gian tài liệu
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Main Links */}
          <div className="px-3 pt-2 space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  title={leftSidebarCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] font-semibold shadow-2xs"
                      : "text-[#4B5563] dark:text-[#9CA3AF] hover:bg-[#F3F6F4] dark:hover:bg-[#1A2420] hover:text-[#111827] dark:hover:text-[#F9FAFB]"
                  } ${leftSidebarCollapsed ? "justify-center px-0 py-2.5" : ""}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#2D5A4C] dark:text-[#6BAF9A]" : ""}`} />
                  {!leftSidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {/* Section: CÔNG CỤ PDF */}
          <div className="px-3 pt-6 space-y-1">
            {!leftSidebarCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-bold text-[#9CA3AF] dark:text-[#6B7280] uppercase tracking-wider">
                CÔNG CỤ PDF
              </div>
            )}

            {categoryNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  title={leftSidebarCollapsed ? item.label : undefined}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A] font-semibold shadow-2xs"
                      : "text-[#4B5563] dark:text-[#9CA3AF] hover:bg-[#F3F6F4] dark:hover:bg-[#1A2420] hover:text-[#111827] dark:hover:text-[#F9FAFB]"
                  } ${item.isFocal && !isActive ? "hover:bg-[#EAF3EE]/60 dark:hover:bg-[#182620]/60" : ""} ${
                    leftSidebarCollapsed ? "justify-center px-0 py-2.5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${item.isFocal ? "text-[#2D5A4C] dark:text-[#6BAF9A]" : ""}`} />
                    {!leftSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!leftSidebarCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#D7E9DE] dark:bg-[#253A31] text-[#2D5A4C] dark:text-[#6BAF9A]">
                          {item.badge}
                        </span>
                      )}
                      {!item.isFocal && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] opacity-60" />
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Help, Settings, Collapse */}
        <div className="p-3 border-t border-[#E8EAED] dark:border-[#24312B] space-y-1">
          <Link
            href="/help"
            onClick={() => setMobileMenuOpen(false)}
            title={leftSidebarCollapsed ? "Hướng dẫn" : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#4B5563] dark:text-[#9CA3AF] hover:bg-[#F3F6F4] dark:hover:bg-[#1A2420] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-colors ${
              leftSidebarCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!leftSidebarCollapsed && <span>Hướng dẫn</span>}
          </Link>

          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            title={leftSidebarCollapsed ? "Cài đặt" : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#4B5563] dark:text-[#9CA3AF] hover:bg-[#F3F6F4] dark:hover:bg-[#1A2420] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-colors ${
              leftSidebarCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!leftSidebarCollapsed && <span>Cài đặt</span>}
          </Link>

          <button
            onClick={toggleLeftSidebar}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F6F4] dark:hover:bg-[#1A2420] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-colors cursor-pointer ${
              leftSidebarCollapsed ? "justify-center px-0" : ""
            }`}
          >
            {leftSidebarCollapsed ? (
              <ChevronsRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronsLeft className="w-4 h-4" />
                <span>Thu gọn</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
