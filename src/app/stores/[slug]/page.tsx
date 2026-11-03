import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

const categoryLabels: Record<string, string> = {
  restaurant: "خواردنگە",
  supermarket: "مارکێت",
  fruits_vegetables: "میوە و سەوزە",
  meat_seafood: "گۆشت و ماسی",
};

export const dynamic = "force-dynamic";

export default async function StoreDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id,name,slug,merchant_category,description,city,district")
    .eq("slug", slug)
    .eq("status", "active")
    .eq("is_platform_store", false)
    .maybeSingle();

  if (storeError) {
    console.error("Public store detail lookup failed:", storeError.code);
    return (
      <main className="min-h-screen bg-[#fff8f0] p-6" dir="rtl">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-white p-8 text-red-800">نەتوانرا زانیاری فرۆشگاکە باربکرێت.</div>
      </main>
    );
  }
  if (!store) notFound();

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id,name,description,price_iqd,stock_quantity,unit")
    .eq("store_id", store.id)
    .eq("status", "published")
    .eq("is_available", true)
    .order("name", { ascending: true });

  if (productsError) console.error("Public store product lookup failed:", productsError.code);

  return (
    <main className="min-h-screen bg-[#fff8f0] px-4 py-10 text-slate-900 sm:px-6" dir="rtl">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link className="inline-flex items-center gap-2 text-sm font-bold text-[#9a4f1f]" href="/marketplace">← گەڕانەوە بۆ بازاڕ</Link>
        <header className="rounded-3xl border border-[#ead9ca] bg-white p-7 shadow-sm sm:p-10">
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">فرۆشگای چالاک</span>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">{store.name}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">{store.description || "بەخێربێیت بۆ فرۆشگای ئەم بەشە لە SHAKH."}</p>
          <p className="mt-4 text-xs text-slate-500">{categoryLabels[store.merchant_category ?? ""] ?? "فرۆشگای گشتی"}{store.city ? ` · ${store.city}` : ""}{store.district ? `، ${store.district}` : ""}</p>
        </header>

        <section className="space-y-4">
          <div><span className="text-xs font-extrabold tracking-wider text-[#a84f16]">AVAILABLE PRODUCTS</span><h2 className="mt-2 text-2xl font-black">بەرهەمە بەردەستەکان</h2></div>
          {productsError ? (
            <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-800" role="alert">خوێندنەوەی بەرهەمەکان سەرکەوتوو نەبوو.</div>
          ) : !products?.length ? (
            <div className="rounded-2xl border border-dashed border-[#dfc7b1] bg-white p-9 text-center">
              <h3 className="text-lg font-black">هێشتا بەرهەمی بڵاوکراوە بەردەست نییە</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">بەرهەمەکان دوای زیادکردن و بڵاوکردنەوە لەلایەن فرۆشگا لێرە دەردەکەون.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article key={product.id} className="rounded-2xl border border-[#ead9ca] bg-white p-5">
                  <h3 className="text-base font-black">{product.name}</h3>
                  {product.description && <p className="mt-2 text-sm leading-7 text-slate-600">{product.description}</p>}
                  <p className="mt-4 text-lg font-black text-[#9a4f1f]" dir="ltr">{Number(product.price_iqd).toLocaleString("en-US")} IQD</p>
                  <p className="mt-1 text-xs text-slate-500">{product.stock_quantity === null ? "کۆگا دیاری نەکراوە" : `بڕی بەردەست: ${product.stock_quantity} ${product.unit}`}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
