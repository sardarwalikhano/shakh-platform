import Link from "next/link";

export default function AccessPendingPage() {
  return (
    <main className="status-page">
      <section className="status-card">
        <span className="status-icon">⌛</span>
        <span className="section-kicker">SHAKH ACCESS</span>
        <h1>هەژمارەکەت چاوەڕێی پێدانی ڕۆڵە.</h1>
        <p>هەژمارەکەت دروست بووە، بەڵام دەستگەیشتن بە داشبۆرد پێویستی بە دیاریکردنی ڕۆڵ لەلایەن بەڕێوەبەری پلاتفۆرمەوە هەیە.</p>
        <p className="status-note">ڕۆڵەکان تەنها لە لایەن بەڕێوەبەری متمانەپێکراوەوە لە <code>app_metadata</code> دیاری دەکرێن.</p>
        <Link className="button button--primary" href="/">گەڕانەوە بۆ سەرەکی</Link>
      </section>
    </main>
  );
}
