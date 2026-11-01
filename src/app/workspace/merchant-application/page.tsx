import Link from "next/link";
import { requireRoles } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { WorkspacePageHeader, EmptyState } from "@/components/workspace/shared";
import { submitMerchantApplication } from "./actions";

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "چێشتخانە",
  supermarket: "سوپەرمارکێت",
  fruits_vegetables: "میوە و سەوزە",
  meat_seafood: "گۆشت و ماسی",
};
const STATUS_LABELS: Record<string, string> = {
  submitted: "نێردراوە",
  under_review: "لە پشکنیندایە",
  approved: "پەسەندکراوە",
  rejected: "ڕەتکراوەتەوە",
};

export default async function MerchantApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string; error?: string }>;
}) {
  const applicant = await requireRoles(["customer"]);
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("merchant_applications")
    .select("id,business_name,merchant_category,status,review_note,submitted_at,reviewed_at")
    .eq("applicant_id", applicant.id)
    .order("created_at", { ascending: false });
  const params = await searchParams;
  const hasOpenApplication = (applications ?? []).some(
    (application) => application.status === "submitted" || application.status === "under_review",
  );
  return (
    <section className="workspace-page">
      <WorkspacePageHeader
        eyebrow="MERCHANT ONBOARDING"
        title="داواکاری بوون بە فرۆشیاری SHAKH"
        description="زانیاری بنەڕەتیی فرۆشگاکەت بنێرە. پێش پەسەندکردنی تیمی بەڕێوەبردن، هیچ فرۆشگایەک بڵاو ناکرێتەوە."
      />
      {params.submitted === "1" && (
        <div className="m03-notice m03-notice--success" role="status">
          داواکارییەکەت بە سەرکەوتوویی تۆمار کرا. دۆخی داواکارییەکەت لەم پەڕەیە چاودێری بکە.
        </div>
      )}
      {params.error === "invalid" && <div className="m03-notice m03-notice--error" role="alert">هەندێک زانیاری ناتەواو یان نادروستە. خانەکان بپشکنەوە.</div>}
      {params.error === "already_pending" && <div className="m03-notice m03-notice--error" role="alert">داواکارییەکی چالاکت هەیە؛ داواکارییەکی دووەم ناتوانرێت تۆمار بکرێت.</div>}
      {params.error === "submit_failed" && <div className="m03-notice m03-notice--error" role="alert">ناردنی داواکاری سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدە.</div>}

      {(applications ?? []).length > 0 && (
        <section className="m03-panel" aria-labelledby="m03-history-title">
          <div className="m03-panel-heading">
            <div>
              <span className="section-kicker">APPLICATION HISTORY</span>
              <h2 id="m03-history-title">دۆخی داواکارییەکان</h2>
            </div>
          </div>
          <div className="m03-history-list">
            {(applications ?? []).map((application) => (
              <article className="m03-history-row" key={application.id}>
                <div>
                  <strong>{application.business_name}</strong>
                  <p>{CATEGORY_LABELS[application.merchant_category] ?? application.merchant_category} · {new Date(application.submitted_at).toLocaleDateString("ckb-IQ")}</p>
                  {application.review_note && <small>تێبینی بەڕێوەبردن: {application.review_note}</small>}
                </div>
                <span className={`m03-status m03-status--${application.status}`}>{STATUS_LABELS[application.status] ?? application.status}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {applications?.some((application) => application.status === "approved") ? (
        <EmptyState
          icon="✓"
          title="داواکارییەکەت پەسەند کراوە"
          description="بۆ نوێکردنەوەی دەسەڵاتەکان، لە هەژمارەکەت بچۆ دەرەوە و دووبارە بچۆ ژوورەوە. پاشان بەشی فرۆشگاکەت دەست دەکەوێت."
          variant="neutral"
        />
      ) : hasOpenApplication ? (
        <EmptyState
          icon="◷"
          title="داواکارییەکەت لە چاوەڕوانییە"
          description="تا کۆتایی پشکنین، داواکارییەکی نوێ تۆمار ناکرێت. پاش نوێبوونەوەی دۆخ، ئەم پەڕەیە بپشکنەوە."
        />
      ) : (
        <section className="m03-panel">
          <div className="m03-panel-heading">
            <div>
              <span className="section-kicker">NEW APPLICATION</span>
              <h2>زانیاری فرۆشگا</h2>
            </div>
            <span className="m03-required-note">* خانەی پێویست</span>
          </div>
          <form action={submitMerchantApplication} className="m03-form">
            <div className="m03-form-grid">
              <label className="m03-field">
                <span>ناوی فرۆشگا *</span>
                <input name="business_name" required minLength={2} maxLength={160} placeholder="ناوی بازرگانی" />
              </label>
              <label className="m03-field">
                <span>جۆری چالاکی *</span>
                <select name="merchant_category" required defaultValue="">
                  <option value="" disabled>جۆرێک هەڵبژێرە</option>
                  <option value="restaurant">چێشتخانە</option>
                  <option value="supermarket">سوپەرمارکێت</option>
                  <option value="fruits_vegetables">میوە و سەوزە</option>
                  <option value="meat_seafood">گۆشت و ماسی</option>
                </select>
              </label>
              <label className="m03-field">
                <span>ناوی پەیوەندیکار *</span>
                <input name="contact_person" required minLength={2} maxLength={120} autoComplete="name" />
              </label>
              <label className="m03-field">
                <span>ژمارەی تەلەفۆن *</span>
                <input name="phone" required minLength={7} maxLength={32} inputMode="tel" autoComplete="tel" dir="ltr" />
              </label>
              <label className="m03-field">
                <span>شار *</span>
                <input name="city" required minLength={2} maxLength={100} defaultValue="هەولێر" />
              </label>
              <label className="m03-field">
                <span>گەڕەک / ناوچە *</span>
                <input name="district" required minLength={2} maxLength={120} />
              </label>
              <label className="m03-field m03-field--full">
                <span>ناونیشانی ورد *</span>
                <input name="address_line" required minLength={3} maxLength={240} autoComplete="street-address" />
              </label>
              <label className="m03-field">
                <span>ناونیشانی وێبی فرۆشگا (Slug)</span>
                <input name="proposed_slug" maxLength={80} dir="ltr" placeholder="my-store" />
                <small>تەنها پیتی لاتینی، ژمارە، هێڵی ناوەڕاست یان ژێرهێڵ.</small>
              </label>
              <label className="m03-field m03-field--full">
                <span>کورتە باس</span>
                <textarea name="description" rows={4} maxLength={2000} placeholder="جۆری بەرهەم و خزمەتگوزارییەکان..." />
              </label>
            </div>
            <div className="m03-form-footer">
              <p>ناردنی داواکاری بە مانای پەسەندکردنی خۆکار نییە. دەسەڵات و فرۆشگا دوای پشکنینی بەڕێوەبردن چالاک دەبن.</p>
              <button className="button button--primary" type="submit">ناردنی داواکاری</button>
            </div>
          </form>
        </section>
      )}
      <p className="m03-back-link"><Link href="/workspace/customer">گەڕانەوە بۆ پێشخان</Link></p>
    </section>
  );
}
