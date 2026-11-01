import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "SHAKH | بازاڕی یەکگرتوو",
    short_name: "SHAKH",
    description:
      "بازاڕی یەکگرتوو بۆ خواردنگە، مارکێت، بەرهەمی تازە و گەیاندن.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    lang: "ckb",
    dir: "rtl",
    background_color: "#F8FAFC",
    theme_color: "#14532D",
    categories: ["shopping", "food", "lifestyle"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "کردنەوەی هەژمار",
        short_name: "هەژمار",
        url: "/workspace",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "پرۆفایل",
        short_name: "پرۆفایل",
        url: "/workspace/profile",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
