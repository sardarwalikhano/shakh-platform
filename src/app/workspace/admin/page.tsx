import { EmptyState, WorkspacePageHeader } from "@/components/workspace/shared";
export default function AdminPage() {
  return (
    <section className="workspace-page">
      <WorkspacePageHeader eyebrow="ADMIN" title="داشبۆردی بەڕێوەبەر" description="ئەرک و دەسەڵاتەکان بە پێی سنووری دیاریکراوی ئەم بەڕێوەبەرە دەستنیشان دەکرێن." />
      <EmptyState icon="▤" title="داتای بەڕێوەبردن ئامادە نییە" description="پانێڵەکانی چاودێری دوای پەیوەستکردنی داتای ڕاستەقینە و RLS ـی Supabase چالاک دەبن." />
    </section>
  );
}
