"use client";

import React, { useState } from "react";
import { Send, Bot, User, Loader2, BookOpen } from "lucide-react";
import { aiAskPdf } from "@/lib/pdf/pdf-engine";
import { LoadedPdfFile } from "@/lib/store/useAppStore";
import { PdfViewer } from "../../pdf/PdfViewer";

interface AiAskWorkspaceProps {
  activeFile: LoadedPdfFile;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  pageRef?: number;
}

export function AiAskWorkspace({ activeFile }: AiAskWorkspaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `Xin chào! Tôi là trợ lý AI phân tích tài liệu của Hi PDF. Tôi đã đọc toàn bộ nội dung tệp "${activeFile.name}". Bạn có thể đặt câu hỏi về các sự kiện, số liệu hoặc yêu cầu giải thích nội dung trong tài liệu này!`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Tài liệu này nói về chủ đề gì?",
    "Những luận điểm và số liệu chính?",
    "Tóm tắt các kết luận quan trọng?",
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuery).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      const response = await aiAskPdf(activeFile.arrayBuffer, q);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: response.answer,
        pageRef: response.relevantPage,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "Xin lỗi, đã xảy ra lỗi khi phân tích tài liệu. Vui lòng thử lại.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: PDF Viewer (50%) */}
      <div className="lg:col-span-6 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">
            Tài liệu nguồn: {activeFile.name}
          </span>
          <span className="text-xs text-[#9CA3AF]">{activeFile.pageCount || 1} trang</span>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] p-4 shadow-2xs">
          <PdfViewer
            arrayBuffer={activeFile.arrayBuffer}
            totalPages={activeFile.pageCount || 1}
          />
        </div>
      </div>

      {/* Right Column: AI Chatbot (50%) */}
      <div className="lg:col-span-6 flex flex-col h-[680px] rounded-3xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] shadow-2xs overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#E8EAED] dark:border-[#24312B] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#111722]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2D5A4C] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
                <span>Trợ lý AI hỏi đáp tài liệu</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                Tự động định vị số trang và trích xuất câu trả lời chuẩn xác
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="p-3 bg-[#F8FAFC]/50 dark:bg-[#111722]/50 border-b border-[#E8EAED] dark:border-[#24312B] flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold text-[#6B7280] mr-1">Gợi ý câu hỏi:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#2D5A4C] dark:hover:text-[#6BAF9A] hover:border-[#2D5A4C] transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  msg.sender === "user"
                    ? "bg-[#2D5A4C] text-white"
                    : "bg-[#EAF3EE] dark:bg-[#182620] text-[#2D5A4C] dark:text-[#6BAF9A]"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  msg.sender === "user"
                    ? "bg-[#2D5A4C] text-white rounded-tr-xs"
                    : "bg-[#F8F9FA] dark:bg-[#111722] border border-[#E8EAED] dark:border-[#24312B] text-[#111827] dark:text-[#F9FAFB] rounded-tl-xs"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.pageRef && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#EAF3EE] dark:bg-[#182620] text-[10px] font-bold text-[#2D5A4C] dark:text-[#6BAF9A]">
                    <BookOpen className="w-3 h-3" />
                    <span>Dẫn chứng tại Trang {msg.pageRef}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF] p-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#2D5A4C] dark:text-[#6BAF9A]" />
              <span>AI đang tra cứu tài liệu...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#E8EAED] dark:border-[#24312B] bg-[#F8FAFC] dark:bg-[#111722]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Đặt câu hỏi về nội dung tài liệu này..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-[#161D1A] border border-[#E8EAED] dark:border-[#24312B] text-[#111827] dark:text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2D5A4C]"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#2D5A4C] hover:bg-[#23473C] text-white text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
