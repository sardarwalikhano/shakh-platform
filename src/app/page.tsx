import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getRoleFromClaims, ROLE_HOME } from "@/lib/auth/roles";

const categories = [
  { value: "restaurant", icon: "🍽️", title: "چێشتخانە و خواردن", subtitle: "خواردنی ئامادە و ژەمی تازە", index: "01" },
  { value: "supermarket", icon: "🛒", title: "سوپەرمارکێت", subtitle: "کاڵای ڕۆژانە و پێداویستی ماڵ", index: "02" },
  { value: "meat_seafood", icon: "🥩", title: "گۆشت و سپیاتی", subtitle: "گۆشت و بەرهەمە تازەکان", index: "03" },
  { value: "fruits_vegetables", icon: "🥑", title: "سەوزە و میوە", subtitle: "بەرهەمی تازە و وەرزی", index: "04" },
];

const categoryDetails: Record<string, { label: string; icon: string }> = {
  restaurant: { label: "چێشتخانە", icon: "🍽️" },
  supermarket: { label: "سوپەرمارکێت", icon: "🛒" },
  meat_seafood: { label: "گۆشت و سپیاتی", icon: "🥩" },
  fruits_vegetables: { label: "سەوزە و میوە", icon: "🥑" },
};

type HomePageProps = {
  searchParams?: Promise<{ q?: string; category?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = (await searchParams) ?? {};
  const searchTerm = (params.q ?? "").trim().replace(/[%_]/g, "").slice(0, 80);
  const category = categories.some((item) => item.value === params.category) ? params.category : "";

  const supabase = await createClient();
  const [{ data: auth }, storesResult] = await Promise.all([
    supabase.auth.getClaims(),
    (async () => {
      let query = supabase
        .from("stores")
        .select("id,name,slug,merchant_category,description,logo_url")
        .eq("status", "active")
        .eq("is_platform_store", false);
      if (category) query = query.eq("merchant_category", category);
      if (searchTerm) query = query.ilike("name", `%${searchTerm}%`);
      return query.order("created_at", { ascending: false }).limit(9);
    })(),
  ]);

  const role = getRoleFromClaims(auth?.claims);
  const workspaceHref = role ? ROLE_HOME[role] : null;
  const stores = storesResult.data ?? [];

  return (
    <main className="storefront" dir="rtl">
      <header className="storefront-header">
        <div className="storefront-container storefront-header-inner">
          <Link className="storefront-brand" href="/" aria-label="Shakh Store - پەڕەی سەرەکی">
            <span className="storefront-brand-mark">ش</span>
            <span className="storefront-brand-copy">
              <strong>SHAKH STORE</strong>
              <small>بازاڕ و گەیاندنی یەکگرتوو</small>
            </span>
          </Link>

          <form className="storefront-search" action="/" method="get" role="search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              name="q"
              defaultValue={searchTerm}
              placeholder="بە ناوی فرۆشگا بگەڕێ..."
              aria-label="گەڕان بە ناوی فرۆشگا"
            />
            {category ? <input type="hidden" name="category" value={category} /> : null}
          </form>

          <div className="storefront-header-actions">
            <div className="storefront-location">
              <small>شوێنی گەیاندن</small>
              <strong>ناونیشان دیاری بکە</strong>
            </div>
            {workspaceHref ? (
              <Link className="storefront-header-button storefront-header-button--solid" href={workspaceHref}>
                پێشخان
              </Link>
            ) : (
              <>
                <Link className="storefront-header-button storefront-header-button--text" href="/login">چوونەژوورەوە</Link>
                <Link className="storefront-header-button storefront-header-button--solid" href="/signup">هەژمار دروست بکە</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="storefront-hero">
        <div className="storefront-container storefront-hero-grid">
          <div className="storefront-hero-copy">
            <span className="storefront-kicker"><i className="storefront-kicker-dot" /> بازاڕکردن لە یەک شوێن</span>
            <h1>هەموو پێداویستییەکانت، <span>بە ئاسانی بگەیەنە ماڵەوە.</span></h1>
            <p className="storefront-hero-description">
              لە خواردنی چێشتخانەوە تا کاڵای سوپەرمارکێت، گۆشت و سپیاتی، سەوزە و میوە؛
              بە ئاسانی هەڵبژێرە و داواکارییەکانت لە Shakh Store بەڕێوەببە.
            </p>
            <div className="storefront-hero-actions">
              <Link className="button button--primary" href="#categories">بینینی بەشەکان <span aria-hidden="true">←</span></Link>
              <Link className="button button--quiet" href="/signup">دەستپێکردنی کڕین</Link>
            </div>
            <div className="storefront-promise-row">
              <span><b>✓</b> چەند فرۆشگا لە یەک زەمبیل</span>
              <span><b>✓</b> کاش یان جزدان</span>
              <span><b>✓</b> بەدواداچوونی گەیاندن</span>
            </div>
          </div>
          <div className="storefront-hero-visual" aria-label="وێنەی هێمایی بازاڕ و گەیاندن">
            <div className="storefront-hero-orbit" />
            <div className="storefront-hero-basket"><span aria-hidden="true">🛍️</span></div>
            <div className="storefront-float-card storefront-float-card--top">
              <span aria-hidden="true">🥬</span><div><strong>بەرهەمی تازە</strong><small>لە فرۆشگای ناوخۆیی</small></div>
            </div>
            <div className="storefront-float-card storefront-float-card--left">
              <span aria-hidden="true">🚴</span><div><strong>گەیاندنی ڕێکخراو</strong><small>بەدواداچوونی داواکاری</small></div>
            </div>
            <div className="storefront-float-card storefront-float-card--right">
              <span aria-hidden="true">🍔</span><div><strong>خواردنی دڵخواز</strong><small>چێشتخانە و ژەم</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="storefront-section storefront-section--white" id="categories">
        <div className="storefront-container">
          <div className="storefront-section-heading">
            <div><span className="storefront-section-kicker">بەشەکانی Shakh Store</span><h2>چی پێویستتە ئەمڕۆ؟</h2></div>
            <p>بەشی دڵخوازت هەڵبژێرە، پاشان فرۆشگا و بەرهەمە بەردەستەکان ببینە.</p>
          </div>
          <div className="storefront-category-grid">
            {categories.map((item) => (
              <Link className="storefront-category-card" key={item.value} href={`/?category=${item.value}#stores`}>
                <div className="storefront-category-top">
                  <span className="storefront-category-icon" aria-hidden="true">{item.icon}</span>
                  <span className="storefront-category-index">{item.index}</span>
                </div>
                <div className="storefront-category-name"><strong>{item.title}</strong><small>{item.subtitle}</small></div>
                <span className="storefront-category-arrow" aria-hidden="true">←</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="storefront-section" id="stores">
        <div className="storefront-container">
          <div className="storefront-section-heading">
            <div><span className="storefront-section-kicker">فرۆشگا چالاکەکان</span><h2>{category ? categoryDetails[category].label : "فرۆشگا بەردەستەکان"}</h2></div>
            <p>{searchTerm ? `ئەنجامی گەڕان بۆ «${searchTerm}»` : "فرۆشگا چالاکەکان لەم بەشەدا پیشان دەدرێن."}</p>
          </div>
          {stores.length > 0 ? (
            <div className="storefront-store-grid">
              {stores.map((store) => {
                const detail = categoryDetails[store.merchant_category ?? ""] ?? { label: "فرۆشگا", icon: "🏪" };
                return (
                  <article className="storefront-store-card" key={store.id}>
                    <div className="storefront-store-logo" aria-hidden="true">{detail.icon}</div>
                    <div className="storefront-store-info">
                      <strong>{store.name}</strong>
                      <small>{store.description || "فرۆشگایەکی چالاک لە Shakh Store"}</small>
                      <span className="storefront-store-category">{detail.label}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="storefront-empty-stores">
              <span aria-hidden="true">🏪</span>
              <div>
                <strong>{storesResult.error ? "نەتوانرا فرۆشگاکان باربکرێن" : searchTerm || category ? "هیچ فرۆشگایەک نەدۆزرایەوە" : "فرۆشگای چالاک هێشتا تۆمار نەکراوە"}</strong>
                <p>{storesResult.error ? "دووبارە هەوڵ بدەوە یان پەیوەندی بە پاڵپشتی بکە." : "کاتێک فرۆشگا پەسەند و چالاک بکرێت، لێرە پیشان دەدرێت."}</p>
              </div>
            </div>
          )}
          {(category || searchTerm) ? <p style={{ marginTop: 16 }}><Link className="dashboard-inline-link" href="/#stores">بینینی هەموو فرۆشگاکان</Link></p> : null}
        </div>
      </section>

      <section className="storefront-section storefront-section--white">
        <div className="storefront-container">
          <div className="storefront-section-heading">
            <div><span className="storefront-section-kicker">ئەزموونی کڕین</span><h2>هەموو شتێک ڕوون و ئاسان</h2></div>
            <p>داواکاری و گەیاندن لە سیستەمێکی یەکگرتوو بەڕێوەدەبرێن.</p>
          </div>
          <div className="storefront-feature-band">
            <article className="storefront-feature"><span className="storefront-feature-icon">🧺</span><div><strong>زەمبیلی یەکگرتوو</strong><p>بەرهەم لە چەند فرۆشگا کۆبکەرەوە و داواکارییەکان بە پێی فرۆشگا جیا دەکرێنەوە.</p></div></article>
            <article className="storefront-feature"><span className="storefront-feature-icon">💳</span><div><strong>دوو شێوازی پارەدان</strong><p>پارەدان بە کاش لە کاتی گەیاندن یان لە ڕێگەی جزدانی Shakh.</p></div></article>
            <article className="storefront-feature"><span className="storefront-feature-icon">📍</span><div><strong>گەیاندن و شوێن</strong><p>زۆنی خزمەتگوزاری و بەدواداچوونی گەیاندن بە GPS.</p></div></article>
          </div>
        </div>
      </section>

      <section className="storefront-section" id="join">
        <div className="storefront-container">
          <div className="storefront-join">
            <div><h2>بەشێک بە لە Shakh Store</h2><p>وەک دوکاندار یان کاپتن بەشداری بکە و لە پلاتفۆرمێکی یەکگرتوودا کاروبارەکەت گەشە پێبدە.</p></div>
            <Link className="button" href="/signup">دروستکردنی هەژمار <span aria-hidden="true">←</span></Link>
          </div>
        </div>
      </section>

      <footer className="storefront-footer">
        <div className="storefront-container storefront-footer-inner">
          <Link className="storefront-brand" href="/"><span className="storefront-brand-mark">ش</span><span className="storefront-brand-copy"><strong>SHAKH STORE</strong><small>بازاڕ و گەیاندنی یەکگرتوو</small></span></Link>
          <p>© {new Date().getFullYear()} Shakh Store. هەموو مافەکان پارێزراون.</p>
          <Link href="/login">چوونەژوورەوە</Link>
        </div>
      </footer>
    </main>
  );
}
