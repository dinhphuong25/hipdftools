import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Hi PDF — Nền tảng công cụ PDF & Dịch thuật bảo toàn bố cục",
  description:
    "Mọi công cụ PDF, trong một không gian. Chuyển đổi, chỉnh sửa, ký và dịch tài liệu dễ dàng mà không làm mất định dạng gốc.",
  keywords: [
    "Hi PDF",
    "dịch PDF giữ định dạng",
    "ghép PDF",
    "tách PDF",
    "nén PDF",
    "công cụ PDF tiếng Việt",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="hipdf_theme_v2"
        >
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
