import { EmptyState, WorkspacePageHeader } from "@/components/workspace/shared";
export default function CustomerPage() {
  return (
    <section className="workspace-page">
      <WorkspacePageHeader eyebrow="CUSTOMER SPACE" title="هەژماری کڕیار" description="داواکارییەکان، ناونیشانەکان، جزدان و پاداشتەکان لێرە بەڕێوەدەبرێن." />
      <EmptyState icon="⌂" title="هێشتا داواکارییەک نییە" description="کاتێک بەشی کڕیار و خزمەتگوزارییەکانی داواکاری چالاک بن، ئەم شوێنە زانیارییە ڕاستەقینەکان نیشان دەدات." />
    </section>
  );
}
