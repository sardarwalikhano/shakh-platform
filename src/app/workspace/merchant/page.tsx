import Link from "next/link";
import { requireRoles } from "@/lib/auth/guards";
import { MERCHANT_ROLES } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { EmptyState, WorkspacePageHeader } from "@/components/workspace/shared";

export default async function MerchantPage() {
  const merchant = await requireRoles(MERCHANT_ROLES);
  const supabase = await createClient();
  const { data: store, error } = await supabase
    .from("stores")
    .select("id,name,slug,description,phone,city,district,status,merchant_category")
    .eq("owner_id", merchant.id)
    .eq("is_platform_store", false)
    .maybeSingle();

  if (error) console.error("Merchant workspace store lookup failed:", error.code);

  return (
    <section className="workspace-page">
      <WorkspacePageHeader
        eyebrow="SHAKH STORE / MERCHANT"
        title="داشبۆردی دوکاندار"
        description="فرۆشگا، بەرهەم، کۆگا، داواکاری و جزدانی کۆمسیۆن لە یەک شوێن بەڕێوە ببە."
      />
      {!store ? (
        <EmptyState icon="!" title="فرۆشگایەکی پەیوەست نەدۆزرایەوە" description="ڕۆڵی هەژمارەکەت بە ڕێکخستنی فرۆشگا ناگونجێت. پەیوەندی بە بەڕێوەبردنەوە بکە." variant="warning" />
      ) : (
        <>
          <div className="dashboard-welcome">
            <div className="dashboard-welcome-copy">
              <span className="section-kicker">ناوەندی کاروبار</span>
              <h2>{store.name}</h2>
              <p>{store.description || "بەخێربێیت بۆ بەڕێوەبردنی فرۆشگاکەت لە Shakh Store."}</p>
            </div>
            <span className="dashboard-welcome-mark" aria-hidden="true">🏪</span>
          </div>

          <div className="dashboard-stat-grid">
            <article className="dashboard-stat"><div className="dashboard-stat-top"><small>دۆخی فرۆشگا</small><span className="dashboard-stat-icon">🏬</span></div><strong>{store.status === "active" ? "چالاک" : store.status === "pending" ? "چاوەڕێی پەسەندکردن" : store.status}</strong><em>دۆخی فەرمی فرۆشگا</em></article>
            <article className="dashboard-stat"><div className="dashboard-stat-top"><small>بەرهەمەکان</small><span className="dashboard-stat-icon">📦</span></div><strong>—</strong><em>ژمارەی بەرهەم لە کۆگاوە</em></article>
            <article className="dashboard-stat"><div className="dashboard-stat-top"><small>داواکارییەکان</small><span className="dashboard-stat-icon">🧾</span></div><strong>—</strong><em>Orders backend پێویستە</em></article>
            <article className="dashboard-stat"><div className="dashboard-stat-top"><small>کۆمسیۆنی دوکاندار</small><span className="dashboard-stat-icon">💳</span></div><strong>350 IQD</strong><em>بۆ هەر کیلۆیەک، بەپێی ڕێککەوتنی ئێستا</em></article>
          </div>

          <section className="dashboard-panel">
            <div className="dashboard-panel-heading"><div><h2>بەڕێوەبردنی فرۆشگا</h2><p>بەشە پەیوەستەکان بە هەژماری خۆت</p></div><span className={`m03-status m03-status--${store.status}`}>{store.status === "active" ? "فرۆشگا چالاکە" : store.status}</span></div>
            <div className="dashboard-module-grid">
              <Link className="dashboard-module" href="/workspace/merchant/store"><span className="dashboard-module-icon">⚙️</span><span className="dashboard-module-copy"><strong>زانیاری فرۆشگا</strong><small>ناونیشان، تەلەفۆن و وردەکارییەکان</small><span className="dashboard-module-state dashboard-module-state--ready">بەڕێوەبردن ←</span></span></Link>
              <Link className="dashboard-module" href="/workspace/merchant/products"><span className="dashboard-module-icon">📦</span><span className="dashboard-module-copy"><strong>بەرهەم و کۆگا</strong><small>زیادکردن و دەستکاریکردنی بەرهەمەکان</small><span className="dashboard-module-state dashboard-module-state--ready">کردنەوە ←</span></span></Link>
              <article className="dashboard-module"><span className="dashboard-module-icon">💰</span><span className="dashboard-module-copy"><strong>جزدان و کۆمسیۆن</strong><small>کۆمسیۆنی جێگیر بۆ هەر کیلۆیەک؛ باڵانس لە جزدانی پریپەید کەم دەکرێتەوە.</small><span className="dashboard-module-state">قۆناغی دارایی</span></span></article>
            </div>
          </section>
          <div className="dashboard-note">کۆمسیۆن بەپێی کیلۆی ڕاستەقینەی فرۆشراو حساب دەکرێت. بڕی کۆتایی کاتێک لە داشبۆرد پیشان دەدرێت کە Orders و Wallet Ledger بە شێوەی پارێزراو پەیوەست بکرێن.</div>
        </>
      )}
    </section>
  );
}
