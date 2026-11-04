import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پەیوەندی ئینتەرنێت نییە",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#F8FAFC",
        color: "#0F172A",
        fontFamily: "Tahoma, Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <section style={{ width: "min(100%, 440px)" }}>
        <div
          aria-hidden="true"
          style={{
            width: "76px",
            height: "76px",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 24px",
            borderRadius: "24px",
            background: "#14532D",
            color: "#FFFFFF",
            fontSize: "42px",
            fontWeight: 900,
          }}
        >
          ش
        </div>
        <p style={{ color: "#16A34A", fontSize: "11px", fontWeight: 900 }}>
          SHAKH • OFFLINE MODE
        </p>
        <h1 style={{ margin: "12px 0", fontSize: "28px", lineHeight: 1.7 }}>
          پەیوەندی ئینتەرنێت نییە
        </h1>
        <p style={{ color: "#64748B", fontSize: "14px", lineHeight: 2 }}>
          ئێستا ناتوانین پەیوەندی بە سێرڤەرەوە بکەین. پەیوەندی ئینتەرنێت بپشکنە
          و دووبارە هەوڵبدەرەوە.
        </p>
        <Link
          href="/"
          style={{
            minHeight: "46px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "18px",
            padding: "0 22px",
            borderRadius: "12px",
            background: "#16A34A",
            color: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          دووبارە هەوڵبدەرەوە
        </Link>
      </section>
    </main>
  );
}
