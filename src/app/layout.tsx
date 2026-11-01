import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SHAKH | بازاڕی یەکگرتوو",
    template: "%s | SHAKH",
  },
  description:
    "SHAKH پلاتفۆرمێکی یەکگرتووی فرۆشتن و گەیاندنە بۆ خواردنگە، مارکێت و فرۆشیارە ناوخۆییەکان.",
  applicationName: "SHAKH",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ckb" dir="rtl">
      <body>{children}</body>
    </html>
  );
}