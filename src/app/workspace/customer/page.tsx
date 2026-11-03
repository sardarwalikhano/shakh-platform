import Link from "next/link";
import { WorkspacePageHeader } from "@/components/workspace/shared";

const categories = [
  { icon: "🍽️", title: "چێشتخانە و خواردن", detail: "ژەم و خواردنی ئامادە", href: "/?category=restaurant#stores" },
  { icon: "🛒", title: "سوپەرمارکێت", detail: "کاڵا و پێداویستی ماڵ", href: "/?category=supermarket#stores" },
  { icon: "🥩", title: "گۆشت و سپیاتی", detail: "فرۆشگای گۆشت و سپیاتی", href: "/?category=meat_seafood#stores" },
  { icon: "🥑", title: "سەوزە و میوە", detail: "بەرهەمی تازە و وەرزی", href: "/?category=fruits_vegetables#stores" },
];

export default function CustomerPage() {
  return (
    <section className="workspace-page">
      <WorkspacePageHeader
        eyebrow="SHAKH STORE / CUSTOMER"
        title="هەژماری کڕیار"
        description="بەشەکانی بازاڕ ببینە، ناونیشانی گەیاندن ڕێکبخە و داواکارییەکانت لە یەک شوێن بەڕێوەببە."
      />
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <span className="section-kicker">بازاڕکردن بە شێوەیەکی ئاسان</span>
          <h2>بەخێربێیت بۆ Shakh Store</h2>
          <p>فرۆشگای دڵخوازت هەڵبژێرە؛ دەتوانیت لە چەند فرۆشگا بە یەکجار داواکاری بکەیت و داواکارییەکان بە پێی فرۆشگا جیا دەکرێنەوە.</p>
        </div>
        <span className="dashboard-welcome-mark" aria-hidden="true">🛍️</span>
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading"><div><h2>بەشەکانی بازاڕ</h2><p>بۆ بینینی فرۆشگا چالاکەکان بەشێک هەڵبژێرە</p></div><Link className="dashboard-inline-link" href="/">پەڕەی سەرەکی ←</Link></div>
        <div className="dashboard-module-grid">
          {categories.map((item) => (
            <Link className="dashboard-module" href={item.href} key={item.title}>
              <span className="dashboard-module-icon">{item.icon}</span>
              <span className="dashboard-module-copy"><strong>{item.title}</strong><small>{item.detail}</small><span className="dashboard-module-state dashboard-module-state--ready">بینینی فرۆشگا ←</span></span>
            </Link>
          ))}
        </div>
      </section>

      <div className="dashboard-stat-grid" style={{ marginTop: 18 }}>
        <article className="dashboard-stat"><div className="dashboard-stat-top"><small>جزدانی Shakh</small><span className="dashboard-stat-icon">💳</span></div><strong>—</strong><em>باڵانس دوای پەیوەستکردنی سیستەمی جزدان پیشان دەدرێت</em></article>
        <article className="dashboard-stat"><div className="dashboard-stat-top"><small>خاڵی خەڵات</small><span className="dashboard-stat-icon">🎁</span></div><strong>—</strong><em>لە دوای تەواوبوونی داواکاری زیاد دەکرێت</em></article>
        <article className="dashboard-stat"><div className="dashboard-stat-top"><small>داواکارییەکان</small><span className="dashboard-stat-icon">🧾</span></div><strong>—</strong><em>مێژووی داواکاری دوای چالاککردنی Orders</em></article>
        <article className="dashboard-stat"><div className="dashboard-stat-top"><small>ناونیشانی گەیاندن</small><span className="dashboard-stat-icon">📍</span></div><strong>—</strong><em>شوێنی کڕیار لە پرۆفایلدا ڕێکدەخرێت</em></article>
      </div>
      <div className="workspace-empty-state" role="status" style={{ marginTop: 20 }}>
        <span className="workspace-empty-icon">🧺</span>
        <div className="workspace-empty-copy"><strong>هێشتا داواکارییەک تۆمار نەکراوە</strong><p>کاتێک یەکەم داواکاری تەواو بکەیت، دۆخ، کۆی نرخ و مێژووی داواکارییەکانت لێرە پیشان دەدرێن.</p></div>
      </div>
    </section>
  );
}
