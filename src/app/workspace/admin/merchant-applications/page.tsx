import { requireRoles } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { WorkspacePageHeader, EmptyState } from "@/components/workspace/shared";
import { reviewMerchantApplication } from "./actions";

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "چێشتخانە",
  supermarket: "سوپەرمارکێت",
  fruits_vegetables: "میوە و سەوزە",
  meat_seafood: "گۆشت و ماسی",
};

export default async function MerchantApplicationsReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string; error?: string }>;
}) {
  await requireRoles(["admin", "super_admin"]);
  const supabase = await createClient();
  const { data: applications, error } = await supabase
    .from("merchant_applications")
    .select("id,applicant_id,business_name,proposed_slug,merchant_category,description,contact_person,phone,city,district,address_line,status,review_note,submitted_at")
    .in("status", ["submitted", "under_review"])
    .order("submitted_at", { ascending: true });
  const params = await searchParams;
  if (error) console.error("Merchant application queue failed:", error.code);

  return (
    <section className="workspace-page">
      <WorkspacePageHeader
        eyebrow="MERCHANT GOVERNANCE"
        title="داواکارییەکانی فرۆشیاران"
        description="داواکارییەکان بپشکنە، زانیاری بازرگانی و ناونیشان پشتڕاست بکەرەوە، پاشان پەسەند یان ڕەت بکەرەوە. پەسەندکردن ڕۆڵی فرۆشیار و فرۆشگای چالاک دروست دەکات."
      />
      {params.result && (
        <div className="m03-notice m03-notice--success" role="status">
          {params.result === "approve" ? "داواکاری پەسەند کرا." : params.result === "reject" ? "داواکاری ڕەتکرایەوە." : "داواکاری بۆ پشکنین دیاریکرا."}
        </div>
      )}
      {params.error === "note_required" && <div className="m03-notice m03-notice--error" role="alert">بۆ ڕەتکردنەوە، تێبینییەکی کورت بنووسە.</div>}
      {params.error && params.error !== "note_required" && <div className="m03-notice m03-notice--error" role="alert">کرداری داواکاری تەواو نەبوو. پەڕەکە نوێ بکەرەوە و دووبارە هەوڵ بدە.</div>}
      {error ? (
        <EmptyState icon="!" title="داواکارییەکان نەهاتنەوە" description="مافی دەستگەیشتن یان پەیوەندی بنکەدراوە بپشکنە." variant="error" />
      ) : (applications ?? []).length === 0 ? (
        <EmptyState icon="✓" title="هیچ داواکارییەکی چاوەڕوان نییە" description="هەموو داواکارییەکان پشکنراون؛ لێرە هیچ داتای دیمۆ یان نموونەیی نییە." />
      ) : (
        <div className="m03-review-list">
          {(applications ?? []).map((application) => (
            <article className="m03-panel m03-review-card" key={application.id}>
              <div className="m03-review-top">
                <div>
                  <span className="section-kicker">{CATEGORY_LABELS[application.merchant_category] ?? application.merchant_category}</span>
                  <h2>{application.business_name}</h2>
                  <p>{application.description || "هیچ باسێکی زیادە تۆمار نەکراوە."}</p>
                </div>
                <span className={`m03-status m03-status--${application.status}`}>{application.status === "submitted" ? "نوێ" : "لە پشکنیندایە"}</span>
              </div>
              <dl className="m03-review-details">
                <div><dt>پەیوەندیکار</dt><dd>{application.contact_person}</dd></div>
                <div><dt>تەلەفۆن</dt><dd dir="ltr">{application.phone}</dd></div>
                <div><dt>شار</dt><dd>{application.city}</dd></div>
                <div><dt>گەڕەک</dt><dd>{application.district}</dd></div>
                <div className="m03-review-address"><dt>ناونیشان</dt><dd>{application.address_line}</dd></div>
                <div><dt>Slug</dt><dd dir="ltr">{application.proposed_slug || "خۆکار دروست دەکرێت"}</dd></div>
                <div><dt>بەرواری ناردن</dt><dd>{new Date(application.submitted_at).toLocaleString("ckb-IQ")}</dd></div>
              </dl>
              <form action={reviewMerchantApplication} className="m03-review-form">
                <input type="hidden" name="application_id" value={application.id} />
                <label className="m03-field">
                  <span>تێبینی پشکنین / هۆکاری ڕەتکردنەوە</span>
                  <textarea name="review_note" rows={2} maxLength={1200} defaultValue={application.review_note ?? ""} placeholder="ئەگەر پێویستە، داواکاری بۆ زانیاری زیاتر ڕوون بکەرەوە..." />
                </label>
                <div className="m03-review-actions">
                  {application.status === "submitted" && <button className="button button--quiet" type="submit" name="decision" value="start_review">دەستپێکردنی پشکنین</button>}
                  <button className="button button--primary" type="submit" name="decision" value="approve">پەسەندکردن و چالاککردن</button>
                  <button className="m03-danger-button" type="submit" name="decision" value="reject">ڕەتکردنەوە</button>
                </div>
              </form>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
