import Link from "next/link";
import { WorkspacePageHeader } from "@/components/workspace/shared";

export default function CaptainPage() {
  return (
    <section className="workspace-page">
      <WorkspacePageHeader
        eyebrow="SHAKH STORE / CAPTAIN"
        title="داشبۆردی کاپتن"
        description="ئەرکەکانی گەیاندن، زۆن، شوێنی GPS، داهات و کۆمسیۆنی گەیاندن لێرە بەڕێوە دەبرێن."
      />
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <span className="section-kicker">ناوەندی گەیاندن</span>
          <h2>ئامادەی وەرگرتنی داواکاری</h2>
          <p>داواکارییەکان بەپێی زۆن، دووری، بەردەستبوون و بارودۆخی کاپتن دابەش دەکرێن.</p>
        </div>
        <span className="dashboard-welcome-mark" aria-hidden="true">🛵</span>
      </div>

      <div className="dashboard-stat-grid">
        <article className="dashboard-stat"><div className="dashboard-stat-top"><small>داواکاریی بەردەست</small><span className="dashboard-stat-icon">📦</span></div><strong>—</strong><em>پێویستی بە داتای دابەشکردن هەیە</em></article>
        <article className="dashboard-stat"><div className="dashboard-stat-top"><small>گەیاندنی تەواوبوو</small><span className="dashboard-stat-icon">✓</span></div><strong>—</strong><em>لە مێژووی گەیاندنەوە</em></article>
        <article className="dashboard-stat"><div className="dashboard-stat-top"><small>باڵانسی جزدان</small><span className="dashboard-stat-icon">💳</span></div><strong>—</strong><em>جزدانی پریپەید</em></article>
        <article className="dashboard-stat"><div className="dashboard-stat-top"><small>کۆمسیۆنی پلاتفۆرم</small><span className="dashboard-stat-icon">٪</span></div><strong>20%</strong><em>لە کرێی گەیاندن، بەپێی ڕێککەوتنی ئێستا</em></article>
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading"><div><h2>نەخشەی زۆنی گەیاندن</h2><p>پێشبینینی شێوازی نمایشکردنی ڕێڕەو</p></div><span className="dashboard-module-state">GPS / Backend پێویستە</span></div>
        <div className="dashboard-map-preview" role="img" aria-label="پێشبینینی نەخشەی گەیاندن">
          <div className="dashboard-map-road dashboard-map-road--one" />
          <div className="dashboard-map-road dashboard-map-road--two" />
          <div className="dashboard-map-route" />
          <div className="dashboard-map-pin dashboard-map-pin--start"><span>🏪</span></div>
          <div className="dashboard-map-pin dashboard-map-pin--end"><span>⌂</span></div>
          <span className="dashboard-map-caption">نموونەی ڕێڕەو — نەک شوێنی ڕاستەقینە</span>
        </div>
        <div className="dashboard-note">GPS و شوێنی کاپتن تەنها دوای مۆڵەتی شوێن لە ئامێر، داتای ڕاستەقینە و سیستەمی دابەشکردنی داواکاری چالاک دەبن. ئەم نەخشەیە تەنها پێشبینینی دیزاینە.</div>
      </section>

      <p style={{ marginTop: 18 }}><Link className="dashboard-inline-link" href="/workspace/profile">تەواوکردنی پرۆفایلی کاپتن ←</Link></p>
    </section>
  );
}
