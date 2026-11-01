import { EmptyState, WorkspacePageHeader } from "@/components/workspace/shared";
export default function SuperAdminPage() {
  return (
    <section className="workspace-page">
      <WorkspacePageHeader eyebrow="SUPER ADMIN" title="بەڕێوەبردنی گشتی SHAKH" description="چاودێری پلاتفۆرم، ڕۆڵەکان و هەموو بەشەکانی بازاڕ." />
      <div className="workspace-quick-grid" aria-label="بەشە بەردەستەکان">
<a className="workspace-quick-card" href="/workspace/admin/merchant-applications"><span className="workspace-quick-icon" aria-hidden="true">✓</span><span className="workspace-quick-copy"><strong>داواکاری فرۆشیاران</strong><small>پشکنین و بڕیاردان لەسەر داواکارییە نوێکان</small></span><span className="workspace-quick-arrow" aria-hidden="true">←</span></a>
<a className="workspace-quick-card" href="/workspace/profile"><span className="workspace-quick-icon" aria-hidden="true">◎</span><span className="workspace-quick-copy"><strong>پرۆفایلی هەژمار</strong><small>زانیاری و ڕێکخستنی هەژماری بەڕێوەبەر</small></span><span className="workspace-quick-arrow" aria-hidden="true">←</span></a>
<a className="workspace-quick-card" href="/workspace/security"><span className="workspace-quick-icon" aria-hidden="true">⌑</span><span className="workspace-quick-copy"><strong>ئاسایشی هەژمار</strong><small>گۆڕینی وشەی نهێنی و دانیشتنەکان</small></span><span className="workspace-quick-arrow" aria-hidden="true">←</span></a>
</div>
    </section>
  );
}
