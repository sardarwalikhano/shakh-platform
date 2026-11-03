import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Props = { searchParams: Promise<{ category?: string }> };

const categories = [
  { slug: "restaurant", label: "خواردنگەکان", icon: "🍽️" },
  { slug: "supermarket", label: "مارکێتەکان", icon: "🛒" },
  { slug: "fruits_vegetables", label: "میوە و سەوزە", icon: "🥬" },
  { slug: "meat_seafood", label: "گۆشت و ماسی", icon: "🥩" },
] as const;

const categoryLabels: Record<string, string> = Object.fromEntries(
  categories.map((category) => [category.slug, category.label]),
);

export const dynamic = "force-dynamic";

export default async function MarketplacePage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedCategory = categories.some((category) => category.slug === params.category)
    ? params.category
    : undefined;
  const supabase = await createClient();
  const { data: stores, error } = await supabase
    .from("stores")
    .select("id,name,slug,merchant_category,description,city,district")
    .eq("status", "active")
    .eq("is_platform_store", false)
    .order("name", { ascending: true });

  if (error) console.error("Public marketplace store query failed:", error.code);
  const visibleStores = (stores ?? []).filter((store) => !selectedCategory || store.merchant_category === selectedCategory);

  return (
    <main className="min-h-screen bg-[#fff8f0] px-4 py-10 text-slate-900 sm:px-6" dir="rtl">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link className="inline-flex items-center gap-3" href="/">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#9a4f1f] text-2xl font-black text-white">ش</span>
            <span><strong className="block text-lg tracking-[0.16em] text-[#9a4f1f]">SHAKH</strong><small className="text-xs text-slate-500">بازاڕی یەکگرتوو</small></span>
          </Link>
          <Link className="rounded-xl border border-[#ead9ca] bg-white px-4 py-2.5 text-sm font-bold text-[#7b4527]" href="/login">چوونەژوورەوە</Link>
        </header>

        <section className="space-y-3">
          <span className="text-xs font-extrabold tracking-wider text-[#a84f16]">SHAKH MARKETPLACE</span>
          <h1 className="text-3xl font-black sm:text-4xl">فرۆشگاکانی چالاک</h1>
          <p className="max-w-2xl text-sm leading-8 text-slate-600">تەنها فرۆشگا چالاکەکان لە داتابەیسی SHAKH نیشان دەدرێن. بەرهەمەکان تەنها دوای بڵاوکردنەوە لە لاپەڕەی فرۆشگا دەردەکەون.</p>
        </section>

        <nav className="flex flex-wrap gap-2" aria-label="فلتەری جۆری فرۆشگا">
          <Link
            className={`rounded-full border px-4 py-2 text-xs font-bold ${!selectedCategory ? "border-[#9a4f1f] bg-[#9a4f1f] text-white" : "border-[#ead9ca] bg-white text-slate-700"}`}
            href="/marketplace"
            aria-current={!selectedCategory ? "page" : undefined}
          >هەموو فرۆشگاکان</Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              className={`rounded-full border px-4 py-2 text-xs font-bold ${selectedCategory === category.slug ? "border-[#9a4f1f] bg-[#9a4f1f] text-white" : "border-[#ead9ca] bg-white text-slate-700"}`}
              href={`/marketplace?category=${category.slug}`}
              aria-current={selectedCategory === category.slug ? "page" : undefined}
            >{category.icon} {category.label}</Link>
          ))}
        </nav>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm leading-7 text-red-800" role="alert">ئێستا نەتوانرا زانیاری فرۆشگاکان باربکرێت. تکایە دواتر دووبارە هەوڵبدەرەوە.</div>
        ) : visibleStores.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dfc7b1] bg-white/80 p-10 text-center">
            <span className="text-3xl" aria-hidden="true">⌂</span>
            <h2 className="mt-3 text-lg font-black">فرۆشگایەکی چالاک لەم بەشەدا نەدۆزرایەوە</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">کاتێک فرۆشگای زیاتر پەسەند و چالاک بکرێت، لێرە پیشان دەدرێت.</p>
          </div>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="لیستی فرۆشگا چالاکەکان">
            {visibleStores.map((store) => (
              <article key={store.id} className="rounded-2xl border border-[#ead9ca] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0df] text-2xl" aria-hidden="true">🏪</span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">چالاک</span>
                </div>
                <h2 className="mt-5 text-lg font-black">{store.name}</h2>
                <p className="mt-2 min-h-12 text-sm leading-7 text-slate-600">{store.description || "فرۆشگایەکی بەشدار لە بازاڕی SHAKH."}</p>
                <p className="mt-2 text-xs text-slate-500">{categoryLabels[store.merchant_category ?? ""] ?? "فرۆشگای گشتی"}{store.city ? ` · ${store.city}` : ""}{store.district ? `، ${store.district}` : ""}</p>
                <Link className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#a84f16] px-4 text-sm font-extrabold text-white hover:bg-[#853d10]" href={`/stores/${store.slug}`}>بینینی فرۆشگا</Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
