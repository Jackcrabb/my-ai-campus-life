import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的AI校園生活",
  description: "Explore a Hong Kong campus and practise ethical and inclusive AI.",
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
    <html lang="zh-Hant">
      <body className="antialiased">{children}</body>
    </html>
  );
}
