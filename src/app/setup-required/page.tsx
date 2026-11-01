import Link from "next/link";

export default function SetupRequiredPage() {
  return (
    <main className="status-page">
      <section className="status-card">
        <span className="status-icon status-icon--warning">⚙</span>
        <span className="section-kicker">AUTH CONFIGURATION</span>
        <h1>پەیوەندی Supabase تەواو نەکراوە.</h1>
        <p>بۆ چالاککردنی چوونەژوورەوە، URL ـی پڕۆژە و Publishable Key پێویستن. کلیلە secret ـەکان نابێت لە کۆدی browser یان GitHub دابنرێن.</p>
        <Link className="button button--primary" href="/login">گەڕانەوە بۆ چوونەژوورەوە</Link>
      </section>
    </main>
  );
}
