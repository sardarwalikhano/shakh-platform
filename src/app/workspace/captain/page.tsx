import { EmptyState, WorkspacePageHeader } from "@/components/workspace/shared";
export default function CaptainPage() {
  return (
    <section className="workspace-page">
      <WorkspacePageHeader eyebrow="CAPTAIN WORKSPACE" title="داشبۆردی کاپتن" description="ئەرکەکانی گەیاندن، شوێن، داهات و ڕێڕەوی داواکارییەکان." />
      <EmptyState icon="↗" title="هیچ گەیاندنێک لە ئێستادا نییە" description="ئەرکەکانی گەیاندن دوای دامەزراندنی سیستەمی دابەشکردن و داتای ڕاستەقینە پیشان دەدرێن." />
    </section>
  );
}
