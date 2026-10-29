"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  ShieldCheck,
  Mail,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

export function PolicyModal() {
  const { policyModal, closePolicyModal, language } = useAppStore();
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const isVi = language === "vi";

  // Reset contact form state when modal opens
  useEffect(() => {
    if (policyModal.isOpen) {
      setContactSubmitted(false);
    }
  }, [policyModal.isOpen]);

  // Lock outer page scroll so modal is cleanly focused
  useEffect(() => {
    if (!policyModal.isOpen) return;

    const originalOverflowHtml = document.documentElement.style.overflow;
    const originalOverflowBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePolicyModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.style.overflow = originalOverflowHtml;
      document.body.style.overflow = originalOverflowBody;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [policyModal.isOpen, closePolicyModal]);

  if (!policyModal.isOpen) return null;

  const currentTab = policyModal.tab || "privacy";

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.message.trim()) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 cursor-pointer"
      onClick={closePolicyModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[440px] bg-white dark:bg-[#121620] text-slate-900 dark:text-white rounded-[24px] border border-slate-200 dark:border-white/10 shadow-2xl p-6 flex flex-col animate-in zoom-in-95 duration-150 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* 1. ĐIỀU KHOẢN DỊCH VỤ (TERMS OF SERVICE)                   */}
        {/* ========================================================= */}
        {currentTab === "terms" && (
          <>
            {/* Header: Inline icon + title, X on right matching hiphim */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#0284C7] dark:text-[#38BDF8] shrink-0" />
                <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">
                  {isVi ? "Điều Khoản Dịch Vụ" : "Terms of Service"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closePolicyModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Intro text */}
            <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {isVi
                ? "Hi PDF cung cấp bộ công cụ xử lý tài liệu miễn phí và cam kết bảo vệ dữ liệu người dùng tối đa:"
                : "Hi PDF provides free browser-based PDF utilities with full privacy commitment:"}
            </p>

            {/* Clean numbered sections - NO boxed cards, NO pills */}
            <div className="space-y-3.5 mb-5">
              <div>
                <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-slate-100 mb-1">
                  1. {isVi ? "Quyền sở hữu tài liệu" : "Document Ownership"}
                </h3>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isVi
                    ? "Tất cả tài liệu bạn đưa vào xử lý hoàn toàn thuộc quyền sở hữu của bạn. Hệ thống không lưu trữ, không sao chép và không có quyền truy cập nội dung."
                    : "All documents remain exclusively yours. We never store, copy, or access your file contents."}
                </p>
              </div>

              <div>
                <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-slate-100 mb-1">
                  2. {isVi ? "Dịch vụ miễn phí & Phi lợi nhuận" : "Free & Non-Profit"}
                </h3>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isVi
                    ? "Hi PDF là dự án tiện ích phi lợi nhuận do Kim Đình Phương phát triển. Dịch vụ hoàn toàn miễn phí, không chèn watermark quảng cáo và không yêu cầu đăng ký tài khoản."
                    : "Hi PDF is a free non-profit utility developed by Kim Đình Phương. No forced watermarks, paywalls, or accounts."}
                </p>
              </div>

              <div>
                <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-slate-100 mb-1">
                  3. {isVi ? "Xử lý an toàn tại thiết bị" : "Client-Side Processing"}
                </h3>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isVi
                    ? "Các tác vụ xử lý PDF được thực thi trực tiếp trong bộ nhớ RAM trình duyệt của bạn. Tệp tin không bao giờ bị gửi ra máy chủ bên ngoài."
                    : "Tasks execute directly in your browser's RAM via WebAssembly. Your files are never uploaded to external servers."}
                </p>
              </div>
            </div>

            {/* Bottom action button: Single "Đã hiểu" pill matching hiphim */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={closePolicyModal}
                className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                {isVi ? "Đã hiểu" : "Got it"}
              </button>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* 2. CHÍNH SÁCH BẢO MẬT (PRIVACY POLICY)                     */}
        {/* ========================================================= */}
        {currentTab === "privacy" && (
          <>
            {/* Header: Inline icon + title, X on right matching hiphim */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#0284C7] dark:text-[#38BDF8] shrink-0" />
                <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">
                  {isVi ? "Chính Sách Bảo Mật" : "Privacy Policy"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closePolicyModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Intro text */}
            <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {isVi
                ? "Hi PDF coi trọng quyền riêng tư của người dùng và cam kết bảo mật thông tin tối đa:"
                : "Hi PDF respects user privacy and commits to absolute data protection:"}
            </p>

            {/* Clean numbered sections - NO boxed cards, NO pills */}
            <div className="space-y-3.5 mb-5">
              <div>
                <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-slate-100 mb-1">
                  1. {isVi ? "Dữ liệu cá nhân & Tệp tin" : "Personal Data & Files"}
                </h3>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isVi
                    ? "Chúng tôi không bắt buộc người dùng phải cung cấp thông tin cá nhân. Bạn hoàn toàn có thể sử dụng tất cả công cụ PDF trực tiếp với tư cách Khách."
                    : "No registration or personal data required. You can freely use all PDF tools directly as a guest."}
                </p>
              </div>

              <div>
                <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-slate-100 mb-1">
                  2. {isVi ? "Lưu trữ cục bộ & Cookie" : "Local Storage & Cookies"}
                </h3>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isVi
                    ? "Dữ liệu cài đặt ngôn ngữ và danh sách công cụ yêu thích được lưu trữ an toàn trong trình duyệt (LocalStorage) của thiết bị bạn đang dùng để mang lại trải nghiệm tiện lợi nhất."
                    : "Language settings and favorite tools are stored securely in your browser (LocalStorage) for optimal user experience."}
                </p>
              </div>

              <div>
                <h3 className="text-[13.5px] font-bold text-slate-900 dark:text-slate-100 mb-1">
                  3. {isVi ? "Cam kết an toàn" : "Safety Commitment"}
                </h3>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isVi
                    ? "Hi PDF cam kết không bán, trao đổi hoặc chia sẻ bất kỳ dữ liệu cá nhân nào của bạn cho bên thứ ba vì mục đích quảng cáo hoặc theo dõi người dùng."
                    : "Hi PDF pledges never to sell, exchange, or share any of your personal data with third parties for advertising or tracking."}
                </p>
              </div>
            </div>

            {/* Bottom action button: Single "Đã hiểu" pill matching hiphim */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={closePolicyModal}
                className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                {isVi ? "Đã hiểu" : "Got it"}
              </button>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* 3. LIÊN HỆ & GÓP Ý (CONTACT & SUPPORT)                    */}
        {/* ========================================================= */}
        {currentTab === "contact" && (
          <>
            {/* Header: Inline icon + title, X on right */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-[#0284C7] dark:text-[#38BDF8] shrink-0" />
                <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">
                  {isVi ? "Liên Hệ & Góp Ý" : "Contact & Support"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closePolicyModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Intro text */}
            <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {isVi
                ? "Hi PDF luôn lắng nghe mọi ý kiến đóng góp, đề xuất tính năng mới hoặc báo lỗi từ bạn:"
                : "We welcome all feedback, feature suggestions, and bug reports:"}
            </p>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-3">
              {contactSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{isVi ? "Cảm ơn bạn! Phản hồi đã được gửi thành công." : "Thank you! Your feedback has been received."}</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {isVi ? "Họ tên" : "Name"}
                      </label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder={isVi ? "Tùy chọn" : "Optional"}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {isVi ? "Email" : "Email"}
                      </label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder={isVi ? "Tùy chọn" : "Optional"}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0284C7]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {isVi ? "Nội dung phản hồi" : "Message"}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder={isVi ? "Ý kiến đóng góp, góp ý giao diện hoặc báo lỗi..." : "Your suggestions, feedback, or bug report..."}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0284C7] resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isVi ? "Gửi phản hồi" : "Send message"}</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
