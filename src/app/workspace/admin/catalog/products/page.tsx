import Link from "next/link";
import { requireRoles } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { EmptyState, WorkspacePageHeader } from "@/components/workspace/shared";
import { setAdminProductStatus } from "./actions";

type ProductStatus = "draft" | "published" | "archived";
type ProductAction = { status: ProductStatus; label: string; className: string };

const STATUS_LABELS: Record<string, string> = {
  draft: "ڕەشنووس",
  published: "بڵاوکراوە",
  archived: "ئەرشیفکراوە",
};

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "چێشتخانە",
  supermarket: "سوپەرمارکێت",
  fruits_vegetables: "میوە و سەوزە",
  meat_seafood: "گۆشت و ماسی",
};

const STATUS_ACTIONS: Record<string, ProductAction[]> = {
  draft: [
    { status: "published", label: "پەسەندکردن و بڵاوکردنەوە", className: "button button--primary" },
    { status: "archived", label: "ئەرشیفکردن", className: "m03-danger-button" },
  ],
  published: [
    { status: "draft", label: "گەڕاندنەوە بۆ ڕەشنووس", className: "button button--quiet" },
    { status: "archived", label: "ئەرشیفکردن", className: "m03-danger-button" },
  ],
  archived: [
    { status: "draft", label: "گەڕاندنەوە بۆ ڕەشنووس", className: "button button--quiet" },
  ],
};

export default async function AdminProductModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string; error?: string }>;
}) {
  await requireRoles(["admin", "super_admin"]);
  const supabase = await createClient();

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id,store_id,name,description,sku,category_id,price_iqd,stock_quantity,unit,status,is_available,updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  const storeIds = [...new Set((products ?? []).map((product) => product.store_id))];
  let stores: Array<{
    id: string;
    name: string;
    status: string;
    merchant_category: string | null;
    is_platform_store: boolean;
  }> = [];

  if (storeIds.length > 0) {
    const { data: storeRows } = await supabase
      .from("stores")
      .select("id,name,status,merchant_category,is_platform_store")
      .in("id", storeIds);
    stores = storeRows ?? [];
  }

  const [categoriesResult, eventsResult] = await Promise.all([
    supabase
      .from("catalog_categories")
      .select("id,name_ckb")
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_moderation_events")
      .select("id,product_id,actor_role,previous_status,new_status,reviewed_updated_at,reason,created_at")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const storesById = new Map(stores.map((store) => [store.id, store]));
  const categoriesById = new Map((categoriesResult.data ?? []).map((category) => [category.id, category.name_ckb]));
  const productsById = new Map((products ?? []).map((product) => [product.id, product.name]));
  const params = await searchParams;

  const errorMessages: Record<string, string> = {
    invalid: "داواکارییەکە نادروستە.",
    note_required: "هۆکاری گۆڕینی دۆخ بنووسە؛ لانیکەم ٢ پیت.",
    not_allowed: "ئەم کردارە بۆ ئەم هەژمارە ڕێگەپێدراو نییە.",
    super_admin_required: "بڵاوکردنەوەی بەرهەمی SHAKH STORE تەنها بۆ بەڕێوەبەری گشتییە.",
    not_found: "بەرهەمەکە نەدۆزرایەوە.",
    store_not_active: "فرۆشگاکە چالاک نییە؛ بەرهەم ناتوانرێت بڵاو بکرێتەوە.",
    product_incomplete: "بەرهەمەکە تەواو نییە. نرخ، پۆل و بەردەستبوونی بپشکنە.",
    category_inactive: "پۆلی بەرهەم چالاک نییە.",
    stale_review: "زانیاری بەرهەم دوای کردنەوەی پەڕە گۆڕدراوە. پەڕەکە نوێ بکەرەوە و دووبارە پشکنین بکە.",
    invalid_transition: "ئەم گۆڕینی دۆخە ڕێگەپێدراو نییە. بەرهەمی ئەرشیفکراو سەرەتا بگەڕێنەوە بۆ ڕەشنووس.",
    update_failed: "گۆڕینی دۆخی بەرهەم سەرکەوتوو نەبوو.",
  };

  const resultMessages: Record<string, string> = {
    published: "بەرهەم پەسەند کرا و بڵاوکرایەوە. تۆماری پشکنینیش زیاد کرا.",
    draft: "بەرهەم گەڕێندرایەوە بۆ ڕەشنووس.",
    archived: "بەرهەم بە هۆکاری تۆمارکراو ئەرشیف کرا.",
  };

  return (
    <section className="workspace-page">
      <WorkspacePageHeader
        eyebrow="M04 · CATALOG GOVERNANCE"
        title="پشکنینی بەرهەمەکان"
        description="بەرهەمەکان پێش بڵاوکردنەوە بپشکنە. گۆڕینی دۆخ لە ڕێگەی RPC ـی پارێزراوەوە دەکرێت و هەر کردارێک لە مێژووی پشکنین تۆمار دەبێت."
      />

      {params.result && resultMessages[params.result] && (
        <div className="m03-notice m03-notice--success" role="status">
          {resultMessages[params.result]}
        </div>
      )}
      {params.error && (
        <div className="m03-notice m03-notice--error" role="alert">
          {errorMessages[params.error] ?? errorMessages.update_failed}
        </div>
      )}

      {productsError ? (
        <EmptyState
          icon="!"
          title="لیستی بەرهەمەکان بارنەبوو"
          description="مافی دەستگەیشتن، RLS یان پەیوەندی بنکەدراوە بپشکنە."
          variant="error"
        />
      ) : (products ?? []).length === 0 ? (
        <EmptyState
          icon="▦"
          title="هیچ بەرهەمێک بۆ پشکنین نییە"
          description="بەرهەمە نوێیەکان لە فرۆشگاکان وەک ڕەشنووس دروست دەکرێن و لێرە بۆ پەسەندکردن دەردەکەون."
        />
      ) : (
        <div className="m03-review-list">
          {(products ?? []).map((product) => {
            const store = storesById.get(product.store_id);
            const actions = STATUS_ACTIONS[product.status] ?? [];
            return (
              <article className="m03-panel m03-review-card" key={product.id}>
                <div className="m03-review-top">
                  <div>
                    <span className="section-kicker">
                      {CATEGORY_LABELS[store?.merchant_category ?? ""] ?? store?.merchant_category ?? "SHAKH STORE"}
                    </span>
                    <h2>{product.name}</h2>
                    <p>{product.description || "هیچ وەسفێک تۆمار نەکراوە."}</p>
                  </div>
                  <span className={`m03-status m03-status--${product.status}`}>
                    {STATUS_LABELS[product.status] ?? product.status}
                  </span>
                </div>

                <dl className="m03-review-details">
                  <div><dt>فرۆشگا</dt><dd>{store?.name ?? "فرۆشگا نەدۆزرایەوە"}</dd></div>
                  <div><dt>دۆخی فرۆشگا</dt><dd>{store?.status ?? "نەزانراو"}</dd></div>
                  <div><dt>نرخ</dt><dd>{Number(product.price_iqd).toLocaleString("en-US")} IQD</dd></div>
                  <div><dt>کۆگا</dt><dd>{product.stock_quantity === null ? "بڕ دیاری نەکراوە" : `${product.stock_quantity} ${product.unit}`}</dd></div>
                  <div><dt>پۆل</dt><dd>{product.category_id ? categoriesById.get(product.category_id) ?? "پۆل نەدۆزرایەوە" : "پۆل دیاری نەکراوە"}</dd></div>
                  <div><dt>SKU</dt><dd dir="ltr">{product.sku || "—"}</dd></div>
                  <div><dt>بەردەستبوون</dt><dd>{product.is_available ? "بەردەستە" : "بەردەست نییە"}</dd></div>
                  <div><dt>دوایین نوێکردنەوە</dt><dd>{new Date(product.updated_at).toLocaleString("ckb-IQ")}</dd></div>
                </dl>

                {actions.length > 0 && (
                  <form action={setAdminProductStatus} className="m03-review-form">
                    <input type="hidden" name="product_id" value={product.id} />
                    <input type="hidden" name="expected_updated_at" value={product.updated_at} />
                    <label className="m03-field">
                      <span>هۆکاری پەسەندکردن / گۆڕینی دۆخ *</span>
                      <textarea
                        name="reason"
                        rows={2}
                        minLength={2}
                        maxLength={1200}
                        required
                        placeholder="کورتەی ئەنجامی پشکنین یان هۆکاری ئەرشیفکردن..."
                      />
                    </label>
                    <div className="m03-review-actions">
                      {actions.map((item) => (
                        <button
                          className={item.className}
                          key={item.status}
                          type="submit"
                          name="new_status"
                          value={item.status}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </form>
                )}
              </article>
            );
          })}
        </div>
      )}

      <section className="m03-panel">
        <div className="m03-panel-heading">
          <div>
            <span className="section-kicker">AUDIT TRAIL</span>
            <h2>مێژووی پشکنینی بەرهەم</h2>
            <p>دووازدە گۆڕینی دۆخی کۆتایی؛ تۆمارەکان زیادکراو-تەنها و ناتوانرێت دەستکاری یان بسڕدرێنەوە.</p>
          </div>
        </div>
        {eventsResult.error ? (
          <EmptyState
            icon="!"
            title="مێژووی پشکنین بارنەبوو"
            description="مافی خوێندنەوەی Audit Log بپشکنە."
            variant="error"
          />
        ) : (eventsResult.data ?? []).length === 0 ? (
          <EmptyState
            icon="◷"
            title="هێشتا هیچ کردارێکی پشکنین تۆمار نەکراوە"
            description="دوای یەکەم بڵاوکردنەوە یان گۆڕینی دۆخ، مێژووی کردارەکان لێرە دەردەکەوێت."
          />
        ) : (
          <div className="m03-history-list">
            {(eventsResult.data ?? []).map((event) => (
              <article className="m03-history-row" key={event.id}>
                <div>
                  <strong>{productsById.get(event.product_id) ?? `بەرهەم ${event.product_id.slice(0, 8)}`}</strong>
                  <p>
                    {STATUS_LABELS[event.previous_status] ?? event.previous_status}
                    {" → "}
                    {STATUS_LABELS[event.new_status] ?? event.new_status}
                    {" · "}
                    {event.actor_role === "super_admin" ? "بەڕێوەبەری گشتی" : "بەڕێوەبەر"}
                  </p>
                  <small>{event.reason}</small>
                  <small>{new Date(event.created_at).toLocaleString("ckb-IQ")}</small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="m03-back-link">
        <Link href="/workspace/admin">گەڕانەوە بۆ پێشخانی بەڕێوەبەر</Link>
      </p>
    </section>
  );
}
