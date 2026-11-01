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
        eyebrow="MERCHANT WORKSPACE"
        title="بەڕێوەبردنی فرۆشگا"
        description="ئەم ناوەندە تەنها زانیاری و فرۆشگای پەیوەست بە هەژماری خۆت پیشان دەدات."
      />
      {!store ? (
        <EmptyState icon="!" title="فرۆشگایەکی پەیوەست نەدۆزرایەوە" description="ڕۆڵی هەژمارەکەت بە ڕێکخستنی فرۆشگا ناگونجێت. پەیوەندی بە بەڕێوەبردنەوە بکە." variant="warning" />
      ) : (
        <section className="m03-store-summary">
          <div className="m03-store-summary-main">
            <span className={`m03-status m03-status--${store.status}`}>{store.status === "active" ? "فرۆشگا چالاکە" : store.status}</span>
            <h2>{store.name}</h2>
            <p>{store.description || "باسی فرۆشگاکەت زیاد بکە."}</p>
            <dl className="m03-store-facts">
              <div><dt>شار</dt><dd>{store.city || "تۆمار نەکراوە"}</dd></div>
              <div><dt>گەڕەک</dt><dd>{store.district || "تۆمار نەکراوە"}</dd></div>
              <div><dt>تەلەفۆن</dt><dd dir="ltr">{store.phone || "تۆمار نەکراوە"}</dd></div>
              <div><dt>ناونیشانی وێب</dt><dd dir="ltr">/{store.slug}</dd></div>
            </dl>
            <Link className="button button--primary" href="/workspace/merchant/store">دەستکاری زانیاری فرۆشگا</Link>
          </div>
          <div className="m03-store-summary-mark" aria-hidden="true">ش</div>
        </section>
      )}
    </section>
  );
}
