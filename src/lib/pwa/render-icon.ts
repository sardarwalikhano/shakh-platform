import { createElement } from "react";
import { ImageResponse } from "next/og";

export function renderPwaIcon(size: number, maskable = false): ImageResponse {
  const inset = Math.round(size * (maskable ? 0.16 : 0.1));
  const borderRadius = Math.round(size * (maskable ? 0.12 : 0.2));
  const markSize = Math.round(size * (maskable ? 0.43 : 0.48));
  const wordmarkSize = Math.round(size * 0.09);

  const mark = createElement(
    "div",
    {
      style: {
        width: `${Math.round(size * 0.58)}px`,
        height: `${Math.round(size * 0.58)}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: `${Math.round(size * 0.14)}px`,
        backgroundColor: "rgba(255,255,255,0.1)",
        color: "#FFFFFF",
        fontSize: `${markSize}px`,
        fontWeight: 900,
        lineHeight: 1,
      },
    },
    "ش",
  );

  const wordmark = createElement(
    "div",
    {
      style: {
        color: "#FFFFFF",
        fontSize: `${wordmarkSize}px`,
        fontWeight: 800,
        letterSpacing: `${Math.round(size * 0.01)}px`,
      },
    },
    "SHAKH",
  );

  const accent = createElement("div", {
    style: {
      width: `${Math.round(size * 0.14)}px`,
      height: `${Math.max(4, Math.round(size * 0.022))}px`,
      borderRadius: "999px",
      backgroundColor: "#F59E0B",
    },
  });

  const inner = createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: `${Math.round(size * 0.035)}px`,
        border: `${Math.max(2, Math.round(size * 0.012))}px solid rgba(255,255,255,0.2)`,
        borderRadius: `${borderRadius}px`,
        backgroundColor: "#176536",
      },
    },
    mark,
    wordmark,
    accent,
  );

  const artwork = createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${inset}px`,
        boxSizing: "border-box",
        backgroundColor: "#14532D",
      },
    },
    inner,
  );

  return new ImageResponse(artwork, {
    width: size,
    height: size,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
