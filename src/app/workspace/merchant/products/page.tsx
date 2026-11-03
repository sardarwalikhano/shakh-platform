import Link from "next/link";
import { requireMerchantAccess } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { EmptyState, WorkspacePageHeader } from "@/components/workspace/shared";
import { createMerchantProduct, setMerchantProductAvailability } from "./actions";

type Props = { searchParams: Promise<{ saved?: string; error?: string }> };
const statusLabel: Record<string, string> = { draft: "ڕەشنووس", published: "بڵاوکراوە", archived: "ئەرشیف" };

export default async function MerchantProductsPage({ searchParams }: Props) {
  const merchant = await requireMerchantAccess();
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: store, error: storeError }, productsResult, categoriesResult] = await Promise.all([
    supabase.from("stores").select("name").eq("id", merchant.storeId).maybeSingle(),
    supabase.from("products").select("id,name,sku,price_iqd,stock_quantity,unit,status,is_available,created_at").eq("store_id", merchant.storeId).order("created_at", { ascending: false }),
    supabase.from("catalog_categories").select("id,name_ckb").eq("is_active", true).order("sort_order"),
  ]);

  if (storeError) console.error("Merchant product store lookup failed:", storeError.code);
  if (productsResult.error) console.error("Merchant product list lookup failed:", productsResult.error.code);
  if (categoriesResult.error) console.error("Merchant category lookup failed:", categoriesResult.error.code);

  const products = productsResult.data ?? [];
  const categories = categoriesResult.data ?? [];

  return (
    <section className="workspace-page">
      <WorkspacePageHeader eyebrow="M04 · PRODUCT CATALOG" title="بەرهەم و کۆگا" description="بەرهەمەکانی فرۆشگاکەت زیاد بکە و دۆخی بەردەستبوونی بەرهەمە بڵاوکراوەکان بەڕێوەببە." />
      {params.saved === "1" && <div className="m03-notice m03-notice--success" role="status">گۆڕانکارییەکان پاشەکەوت کران.</div>}
      {params.error === "invalid" && <div className="m03-notice m03-notice--error" role="alert">زانیارییەکان بە دروستی پڕ بکەرەوە.</div>}
      {params.error === "sku_taken" && <div className="m03-notice m03-notice--error" role="alert">SKU ـی ئەم بەرهەمە پێشتر بەکارهاتووە.</div>}
      {params.error === "save_failed" && <div className="m03-notice m03-notice--error" role="alert">پاشەکەوتکردنی بەرهەم سەرکەوتوو نەبوو.</div>}
      {params.error === "availability_failed" && <div className="m03-notice m03-notice--error" role="alert">گۆڕینی دۆخی بەردەستبوون سەرکەوتوو نەبوو.</div>}

      <section className="m03-panel">
        <div className="m03-panel-heading"><div><span className="section-kicker">ADD PRODUCT</span><h2>زیادکردنی بەرهەمی نوێ</h2></div></div>
        {!store ? (
          <EmptyState icon="!" title="زانیاری فرۆشگا بەردەست نییە" description="نەتوانرا زانیاری فرۆشگا بخوێندرێتەوە." variant="error" />
        ) : (
          <form action={createMerchantProduct} className="m03-form">
            <div className="m03-form-grid">
              <label className="m03-field"><span>ناوی بەرهەم *</span><input name="name" required minLength={2} maxLength={180} /></label>
              <label className="m03-field"><span>نرخ بە دیناری عێراقی *</span><input name="price_iqd" type="number" min="0" step="1" required inputMode="numeric" /></label>
              <label className="m03-field"><span>بڕی کۆگا</span><input name="stock_quantity" type="number" min="0" step="1" inputMode="numeric" placeholder="بەتاڵ = بڕی دیارینەکراو" /></label>
              <label className="m03-field"><span>یەکە</span><input name="unit" defaultValue="piece" maxLength={32} /></label>
              <label className="m03-field"><span>SKU (ئارەزوومەندانە)</span><input name="sku" maxLength={120} dir="ltr" /></label>
              <label className="m03-field"><span>پۆل</span><select name="category_id" defaultValue=""><option value="">پۆل هەڵبژێرە</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name_ckb}</option>)}</select></label>
              <label className="m03-field m03-field--full"><span>وەسف</span><textarea name="description" rows={3} maxLength={2000} /></label>
            </div>
            <div className="m03-form-footer">
              <p>بەرهەمە نوێیەکان وەک ڕەشنووس پاشەکەوت دەکرێن. گۆڕینی دۆخی بڵاوکردنەوە لەم پانێڵەدا بەردەست نییە.</p>
              <button className="button button--primary" type="submit">پاشەکەوتکردنی ڕەشنووس</button>
            </div>
          </form>
        )}
      </section>

      <section className="m03-panel">
        <div className="m03-panel-heading"><div><span className="section-kicker">INVENTORY</span><h2>لیستی بەرهەمەکان ({products.length})</h2></div></div>
        {productsResult.error ? (
          <EmptyState icon="!" title="خوێندنەوەی بەرهەمەکان سەرکەوتوو نەبوو" description="تکایە دواتر دووبارە هەوڵبدەرەوە." variant="error" />
        ) : products.length === 0 ? (
          <EmptyState icon="▤" title="هێشتا بەرهەمێک نییە" description="لە فۆڕمی سەرەوە یەکەم بەرهەمی خۆت زیاد بکە." />
        ) : (
          <div className="m04-product-list">
            {products.map((product) => (
              <article className="m04-product-row" key={product.id}>
                <div className="m04-product-info">
                  <strong>{product.name}</strong>
                  <span dir="ltr">{Number(product.price_iqd).toLocaleString("en-US")} IQD</span>
                  <small>
                    {product.stock_quantity === null ? "کۆگا دیاری نەکراوە" : "کۆگا: " + product.stock_quantity + " " + product.unit}
                    {" · "}{statusLabel[product.status] ?? product.status}
                    {product.status === "published" ? (product.is_available ? " · بەردەستە" : " · بەردەست نییە") : ""}
                  </small>
                </div>
                {product.status === "published" ? (
                  <form action={setMerchantProductAvailability}>
                    <input type="hidden" name="product_id" value={product.id} />
                    <input type="hidden" name="next_available" value={product.is_available ? "false" : "true"} />
                    <button className="button button--quiet button--small" type="submit">{product.is_available ? "وەستاندنی فرۆشتن" : "چالاککردنی فرۆشتن"}</button>
                  </form>
                ) : (
                  <span className="m03-status">دۆخی بڵاوکردنەوە لێرە ناگۆڕدرێت</span>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
      <p className="m03-back-link"><Link href="/workspace/merchant">گەڕانەوە بۆ پێشخان</Link></p>
    </section>
  );
}
