import Link from "next/link";
import { requireRoles } from "@/lib/auth/guards";
import { MERCHANT_ROLES } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { EmptyState, WorkspacePageHeader } from "@/components/workspace/shared";
import { createMerchantProduct, setMerchantProductStatus } from "./actions";
type Props={searchParams:Promise<{saved?:string;error?:string}>};
const statusLabel:Record<string,string>={draft:"ڕەشنووس",published:"بڵاوکراوە",archived:"ئەرشیف"};
export default async function MerchantProductsPage({searchParams}:Props){
 const user=await requireRoles(MERCHANT_ROLES),params=await searchParams,supabase=await createClient();
 const {data:store}=await supabase.from("stores").select("id,name,status").eq("owner_id",user.id).eq("is_platform_store",false).maybeSingle();
 if(!store)return <section className="workspace-page"><WorkspacePageHeader eyebrow="PRODUCT CATALOG" title="بەرهەمەکان" description="بەڕێوەبردنی بەرهەمەکانی فرۆشگاکەت."/><EmptyState icon="!" title="فرۆشگا نەدۆزرایەوە" description="پێویستە فرۆشگاکەت پەسەند و چالاک بێت." variant="warning"/></section>;
 const [{data:products},{data:categories}]=await Promise.all([
  supabase.from("products").select("id,name,sku,price_iqd,stock_quantity,unit,status,is_available,created_at").eq("store_id",store.id).order("created_at",{ascending:false}),
  supabase.from("catalog_categories").select("id,name_ckb").eq("is_active",true).order("sort_order")
 ]);
 return <section className="workspace-page">
  <WorkspacePageHeader eyebrow="M04 · PRODUCT CATALOG" title="بەرهەم و کۆگا" description="بەرهەم زیاد بکە، نرخ و بڕی کۆگا ڕێکبخە، و پاش پشکنین بڵاوی بکەرەوە."/>
  {params.saved==="1"&&<div className="m03-notice m03-notice--success" role="status">گۆڕانکارییەکان پاشەکەوت کران.</div>}
  {params.error&&<div className="m03-notice m03-notice--error" role="alert">{params.error==="invalid"?"زانیارییەکان بە دروستی پڕ بکەرەوە.":params.error==="sku_taken"?"SKU ـی ئەم بەرهەمە پێشتر بەکارهاتووە.":params.error==="store_unavailable"?"فرۆشگا چالاک نییە؛ پەیوەندی بە بەڕێوەبردنەوە بکە.":"پاشەکەوتکردن سەرکەوتوو نەبوو."}</div>}
  <section className="m03-panel"><div className="m03-panel-heading"><div><span className="section-kicker">ADD PRODUCT</span><h2>زیادکردنی بەرهەمی نوێ</h2></div></div>
  {store.status!=="active"?<p>فرۆشگا چالاک نییە؛ ناتوانیت بەرهەم زیاد بکەیت.</p>:<form action={createMerchantProduct} className="m03-form"><div className="m03-form-grid">
   <label className="m03-field"><span>ناوی بەرهەم *</span><input name="name" required minLength={2} maxLength={180}/></label>
   <label className="m03-field"><span>نرخ بە دیناری عێراقی *</span><input name="price_iqd" type="number" min="0" step="1" required inputMode="numeric"/></label>
   <label className="m03-field"><span>بڕی کۆگا</span><input name="stock_quantity" type="number" min="0" step="1" inputMode="numeric" placeholder="بەتاڵ = بڕی دیارینەکراو"/></label>
   <label className="m03-field"><span>یەکە</span><input name="unit" defaultValue="piece" maxLength={32}/></label>
   <label className="m03-field"><span>SKU (ئارەزوومەندانە)</span><input name="sku" maxLength={120} dir="ltr"/></label>
   <label className="m03-field"><span>پۆل</span><select name="category_id" defaultValue=""><option value="">پۆل هەڵبژێرە</option>{(categories??[]).map(c=><option key={c.id} value={c.id}>{c.name_ckb}</option>)}</select></label>
   <label className="m03-field m03-field--full"><span>وەسف</span><textarea name="description" rows={3} maxLength={2000}/></label>
  </div><div className="m03-form-footer"><p>بەرهەمە نوێیەکان سەرەتا وەک ڕەشنووس پاشەکەوت دەکرێن؛ بۆ بینینی گشتی پێویستە بڵاویان بکەیتەوە.</p><button className="button button--primary" type="submit">پاشەکەوتکردنی ڕەشنووس</button></div></form>}</section>
  <section className="m03-panel"><div className="m03-panel-heading"><div><span className="section-kicker">INVENTORY</span><h2>لیستی بەرهەمەکان ({products?.length??0})</h2></div></div>
  {!products?.length?<EmptyState icon="▤" title="هێشتا بەرهەمێک نییە" description="لە فۆڕمی سەرەوە یەکەم بەرهەم زیاد بکە."/>:<div className="m04-product-list">{products.map(p=><article className="m04-product-row" key={p.id}><div className="m04-product-info"><strong>{p.name}</strong><span dir="ltr">{Number(p.price_iqd).toLocaleString("en-US")} IQD</span><small>{p.stock_quantity===null?"کۆگا دیاری نەکراوە":"کۆگا: "+p.stock_quantity+" "+p.unit} · {statusLabel[p.status]??p.status}</small></div><form action={setMerchantProductStatus}><input type="hidden" name="product_id" value={p.id}/><input type="hidden" name="next_status" value={p.status==="published"?"draft":"published"}/><button className="button button--quiet button--small" type="submit">{p.status==="published"?"وەستاندنی بڵاوکردنەوە":"بڵاوکردنەوە"}</button></form></article>)}</div>}</section>
  <p className="m03-back-link"><Link href="/workspace/merchant">گەڕانەوە بۆ پێشخان</Link></p>
 </section>;
}