import { EmptyState, WorkspacePageHeader } from "@/components/workspace/shared";
export default function SuperAdminPage() {
  return (
    <section className="workspace-page">
      <WorkspacePageHeader eyebrow="SUPER ADMIN" title="بەڕێوەبردنی گشتی SHAKH" description="چاودێری پلاتفۆرم، ڕۆڵەکان و هەموو بەشەکانی بازاڕ." />
      <EmptyState icon="▦" title="بنەمای داشبۆرد ئامادەیە" description="بەشەکانی بەڕێوەبردن و ئامار دوای دانانی خزمەتگوزارییە ڕاستەقینەکان زیاد دەکرێن." />
    </section>
  );
}
