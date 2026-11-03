import Link from "next/link";
import { requireMerchantAccess } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { EmptyState, WorkspacePageHeader } from "@/components/workspace/shared";

export default async function MerchantPage() {
  const merchant = await requireMerchantAccess();
  const supabase = await createClient();
  const { data: store, error } = await supabase
    .from("stores")
    .select("id,name,slug,description,phone,city,district,status,merchant_category")
    .eq("id", merchant.storeId)
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
        <EmptyState icon="!" title="زانیاری فرۆشگا بەردەست نییە" description="پشکنینی داتای فرۆشگا سەرکەوتوو نەبوو. تکایە دووبارە هەوڵبدەرەوە." variant="error" />
      ) : (
        <section className="m03-store-summary">
          <div className="m03-store-summary-main">
            <span className="m03-status m03-status--active">فرۆشگا چالاکە</span>
            <h2>{store.name}</h2>
            <p>{store.description || "باسی فرۆشگاکەت زیاد بکە."}</p>
            <dl className="m03-store-facts">
              <div><dt>شار</dt><dd>{store.city || "تۆمار نەکراوە"}</dd></div>
              <div><dt>گەڕەک</dt><dd>{store.district || "تۆمار نەکراوە"}</dd></div>
              <div><dt>تەلەفۆن</dt><dd dir="ltr">{store.phone || "تۆمار نەکراوە"}</dd></div>
              <div><dt>ناونیشانی وێب</dt><dd dir="ltr">/{store.slug}</dd></div>
            </dl>
            <div className="hero-actions">
              <Link className="button button--primary" href="/workspace/merchant/store">دەستکاری زانیاری فرۆشگا</Link>
              <Link className="button button--quiet" href="/workspace/merchant/products">بەڕێوەبردنی بەرهەمەکان</Link>
            </div>
          </div>
          <div className="m03-store-summary-mark" aria-hidden="true">ش</div>
        </section>
      )}
    </section>
  );
}
