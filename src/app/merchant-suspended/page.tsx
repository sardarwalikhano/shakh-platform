import Link from "next/link";

export default function MerchantSuspendedPage() {
  return (
    <main className="status-page" dir="rtl">
      <section className="status-card">
        <span className="status-icon" aria-hidden="true">!</span>
        <span className="section-kicker">SHAKH MERCHANT ACCESS</span>
        <h1>دەستگەیشتن بە داشبۆردی فرۆشگا وەستێنراوە.</h1>
        <p>دۆخی فرۆشگاکەت لەلایەن بەڕێوەبردنی SHAKH ـەوە وەستێنراوە. لەم کاتەدا ناتوانیت بەڕێوەبردنی فرۆشگا بەردەوام بکەیت.</p>
        <p className="status-note">بۆ زانیاری زیاتر یان پێداچوونەوە، تکایە پەیوەندی بە بەڕێوەبردنی پلاتفۆرمەوە بکە.</p>
        <Link className="button button--primary" href="/">گەڕانەوە بۆ سەرەکی</Link>
      </section>
    </main>
  );
}
