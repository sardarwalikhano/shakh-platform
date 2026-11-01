export default function AdminPage() {
  return (
    <section className="workspace-page">
      <span className="section-kicker">ADMIN</span>
      <h1>داشبۆردی بەڕێوەبەر</h1>
      <p>ئەرک و دەسەڵاتەکان بە پێی سنووری دیاریکراوی ئەم بەڕێوەبەرە دەستنیشان دەکرێن.</p>
      <div className="workspace-empty">
        <strong>هیچ داتایەک پیشان نادرێت</strong>
        <span>داتای بەڕێوەبردن دوای دانانی schema و RLS ـی Supabase زیاد دەکرێت.</span>
      </div>
    </section>
  );
}
