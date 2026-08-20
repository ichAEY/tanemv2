import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TANEM — цифровой офис",
  description: "Персональные сайты для частных мастеров: работы, цены, отзывы, контакты и запись в одном месте.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
