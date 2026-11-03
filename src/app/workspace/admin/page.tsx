import Link from "next/link";
import { WorkspacePageHeader } from "@/components/workspace/shared";

const stats = [
  { label: "داواکاریی فرۆشگا", value: "—", detail: "داتای ڕاستەقینەی M03/M04", icon: "🏪" },
  { label: "فرۆشگای چالاک", value: "—", detail: "لە داتابەیسەوە نوێ دەکرێتەوە", icon: "✓" },
  { label: "داواکاریی گەیاندن", value: "—", detail: "پێویستی بە مۆدیولی داواکاری هەیە", icon: "🛵" },
  { label: "کۆی کۆمسیۆن", value: "—", detail: "پێویستی بە لێدجەری دارایی هەیە", icon: "💳" },
];

const modules = [
  { icon: "🏬", title: "فرۆشگا و داواکاری بەشداربوون", description: "پشکنین، پەسەندکردن و چاودێری داواکاریی دوکانداران.", state: "ready", label: "بەردەست", href: "/workspace/admin/merchant-applications" },
  { icon: "🧾", title: "بەڕێوەبردنی پۆست و بەرهەم", description: "چاودێری پۆست، نرخ، یەکەی فرۆشتن و دۆخی بەرهەم.", state: "planned", label: "قۆناغی داهاتوو" },
  { icon: "🛵", title: "کاپتن و گەیاندن", description: "دابەشکردنی کاپتن، ڕێڕەوی GPS و دۆخی گەیاندن.", state: "planned", label: "قۆناغی داهاتوو" },
  { icon: "💰", title: "جزدان و کۆمسیۆن", description: "پریپەید، کۆمسیۆنی کیلۆیی دوکاندار و 20% لە کرێی گەیاندن.", state: "planned", label: "قۆناغی داهاتوو" },
  { icon: "📊", title: "حسابداری و ڕاپۆرت", description: "لێدجەری مامەڵە، داهات، گەڕاندنەوە و هەناردەی ڕاپۆرت.", state: "planned", label: "قۆناغی داهاتوو" },
  { icon: "🛡️", title: "چاودێری و پاراستن", description: "Audit log، مۆڵەتی ڕۆڵەکان، هەڵە و Backup.", state: "planned", label: "قۆناغی داهاتوو" },
];

export default function AdminPage() {
  return (
    <section className="workspace-page">
      <WorkspacePageHeader
        eyebrow="SHAKH STORE / CONTROL CENTER"
        title="داشبۆردی سوپەر ئەدمین"
        description="ناوەندی چاودێری شاخ ستۆر؛ فرۆشگا، بەرهەم، کاپتن، گەیاندن و دارایی لە یەک شوێن بەڕێوە ببە."
      />
      <div className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <span className="section-kicker">بەخێربێیت بۆ ناوەندی بەڕێوەبردن</span>
          <h2>کۆنترۆڵی تەواوی Shakh Store</h2>
          <p>تەنها مۆدیولە پەیوەستکراوەکان داتای ڕاستەقینە پیشان دەدەن. بەشەکانی تر بە شێوەی دیزاین ئامادەن و پێویستیان بە Backend و ڕێپۆی دارایی هەیە.</p>
        </div>
        <span className="dashboard-welcome-mark" aria-hidden="true">ش</span>
      </div>

      <div className="dashboard-stat-grid">
        {stats.map((stat) => (
          <article className="dashboard-stat" key={stat.label}>
            <div className="dashboard-stat-top"><small>{stat.label}</small><span className="dashboard-stat-icon">{stat.icon}</span></div>
            <strong>{stat.value}</strong><em>{stat.detail}</em>
          </article>
        ))}
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div><h2>مۆدیولەکانی سیستەم</h2><p>دۆخی ئامادەبوونی هەر بەشێک</p></div>
          <Link className="dashboard-inline-link" href="/workspace/admin/merchant-applications">داواکاریی فرۆشگا ←</Link>
        </div>
        <div className="dashboard-module-grid">
          {modules.map((module) => (
            <article className="dashboard-module" key={module.title}>
              <span className="dashboard-module-icon">{module.icon}</span>
              <div className="dashboard-module-copy">
                <strong>{module.title}</strong>
                <small>{module.description}</small>
                <span className={`dashboard-module-state ${module.state === "ready" ? "dashboard-module-state--ready" : ""}`}>{module.label}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="dashboard-note">تێبینی دارایی: کۆمسیۆنی دوکاندار بە هەر کیلۆیەک حساب دەکرێت؛ کۆمسیۆنی کاپتن 20% لە کرێی گەیاندنە. پارەدانی کڕیار بە کاش یان جزدانی Shakh پشتگیری دەکرێت. تا لێدجەر و transaction ـەکان جێبەجێ نەکرێن، ژمارەی دارایی نیشان نادرێت.</div>
    </section>
  );
}
