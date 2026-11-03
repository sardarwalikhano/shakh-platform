import Link from "next/link";
import { requireMerchantAccess } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { WorkspacePageHeader, EmptyState } from "@/components/workspace/shared";
import { updateMerchantStoreProfile } from "./actions";

export default async function MerchantStoreProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const merchant = await requireMerchantAccess();
  const supabase = await createClient();
  const { data: store, error } = await supabase
    .from("stores")
    .select("id,name,slug,description,phone,contact_person,city,district,address_line,merchant_category,status")
    .eq("id", merchant.storeId)
    .eq("owner_id", merchant.id)
    .maybeSingle();
  if (error) console.error("Merchant store profile lookup failed:", error.code);
  const params = await searchParams;

  if (!store) {
    return (
      <section className="workspace-page">
        <WorkspacePageHeader eyebrow="STORE PROFILE" title="زانیاری فرۆشگا" description="تەنها خاوەنی فرۆشگاکە دەتوانێت زانیارییەکانی ببینێت و دەستکاری بکات." />
        <EmptyState icon="!" title="زانیاری فرۆشگا بەردەست نییە" description="پشکنینی داتای فرۆشگا سەرکەوتوو نەبوو." variant="error" />
      </section>
    );
  }

  return (
    <section className="workspace-page">
      <WorkspacePageHeader eyebrow="STORE PROFILE" title="زانیاری فرۆشگا" description="زانیاری پەیوەندی و ناونیشانی فرۆشگاکەت نوێ بکەرەوە. دۆخی چالاکی تەنها لەلایەن بەڕێوەبردنەوە دەگۆڕدرێت." />
      {params.saved === "1" && <div className="m03-notice m03-notice--success" role="status">گۆڕانکارییەکان پاشەکەوت کران.</div>}
      {params.error === "invalid" && <div className="m03-notice m03-notice--error" role="alert">زانیارییەکان بە دروستی پڕ بکەرەوە.</div>}
      {params.error === "slug_taken" && <div className="m03-notice m03-notice--error" role="alert">ئەم ناونیشانەی وێب بەکارهاتووە؛ ناونیشانێکی تر هەڵبژێرە.</div>}
      {params.error === "save_failed" && <div className="m03-notice m03-notice--error" role="alert">پاشەکەوتکردن سەرکەوتوو نەبوو.</div>}
      <section className="m03-panel">
        <div className="m03-panel-heading">
          <div><span className="section-kicker">STORE SETTINGS</span><h2>{store.name}</h2></div>
          <span className="m03-status m03-status--active">چالاک</span>
        </div>
        <form action={updateMerchantStoreProfile} className="m03-form">
          <div className="m03-form-grid">
            <label className="m03-field"><span>ناوی فرۆشگا *</span><input name="name" required minLength={2} maxLength={160} defaultValue={store.name} /></label>
            <label className="m03-field"><span>Slug *</span><input name="slug" required minLength={2} maxLength={80} dir="ltr" defaultValue={store.slug} /></label>
            <label className="m03-field"><span>ناوی پەیوەندیکار *</span><input name="contact_person" required minLength={2} maxLength={120} defaultValue={store.contact_person ?? ""} /></label>
            <label className="m03-field"><span>ژمارەی تەلەفۆن *</span><input name="phone" required minLength={7} maxLength={32} inputMode="tel" dir="ltr" defaultValue={store.phone ?? ""} /></label>
            <label className="m03-field"><span>شار *</span><input name="city" required minLength={2} maxLength={100} defaultValue={store.city ?? ""} /></label>
            <label className="m03-field"><span>گەڕەک / ناوچە *</span><input name="district" required minLength={2} maxLength={120} defaultValue={store.district ?? ""} /></label>
            <label className="m03-field m03-field--full"><span>ناونیشانی ورد *</span><input name="address_line" required minLength={3} maxLength={240} defaultValue={store.address_line ?? ""} /></label>
            <label className="m03-field m03-field--full"><span>کورتە باس</span><textarea name="description" rows={4} maxLength={2000} defaultValue={store.description ?? ""} /></label>
          </div>
          <div className="m03-form-footer">
            <p>جۆری فرۆشگا: {store.merchant_category}. گۆڕینی جۆر و دۆخی چالاکی بۆ پاراستنی مۆڵەتەکان لەلایەن بەڕێوەبردنەوە دەکرێت.</p>
            <button className="button button--primary" type="submit">پاشەکەوتکردن</button>
          </div>
        </form>
      </section>
      <p className="m03-back-link"><Link href="/workspace/merchant">گەڕانەوە بۆ پێشخان</Link></p>
    </section>
  );
}
