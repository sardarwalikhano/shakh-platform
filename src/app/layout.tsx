import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { PwaClient } from "@/components/pwa/pwa-client";
import "./globals.css";
import "./shakh-store.css";

export const metadata: Metadata = {
  title: {
    default: "Shakh Store | بازاڕ و گەیاندن",
    template: "%s | Shakh Store",
  },
  description:
    "Shakh Store پلاتفۆرمێکی یەکگرتووی فرۆشتن و گەیاندنە بۆ چێشتخانە، سوپەرمارکێت، گۆشت و سپیاتی، سەوزە و میوە.",
  applicationName: "Shakh Store",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Shakh Store",
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
  themeColor: "#F26B21",
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
