import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { PwaClient } from "@/components/pwa/pwa-client";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SHAKH | بازاڕی یەکگرتوو",
    template: "%s | SHAKH",
  },
  description:
    "SHAKH پلاتفۆرمێکی یەکگرتووی فرۆشتن و گەیاندنە بۆ خواردنگە، مارکێت و فرۆشیارە ناوخۆییەکان.",
  applicationName: "SHAKH",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SHAKH",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14532D",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ckb" dir="rtl">
      <body>
        {children}
        <PwaClient />
      </body>
    </html>
  );
}
