import { EmptyState, WorkspacePageHeader } from "@/components/workspace/shared";
export default function MerchantPage() {
  return (
    <section className="workspace-page">
      <WorkspacePageHeader eyebrow="MERCHANT WORKSPACE" title="بەڕێوەبردنی فرۆشگا" description="فرۆشیار تەنها بە فرۆشگا و جۆری بەشی خۆی دەگات." />
      <EmptyState icon="▤" title="بەشی فرۆشیار ئامادەیە بۆ پەرەپێدان" description="کۆگا، بەرهەم، نرخ، داواکاری و کۆمسیۆن دوای پەیوەستکردنی خزمەتگوزارییە ڕاستەقینەکان چالاک دەکرێن." />
    </section>
  );
}
