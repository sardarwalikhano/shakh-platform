import Link from "next/link";
import { signIn, signUp } from "@/app/login/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

const ERRORS: Record<string, string> = {
  missing_fields: "تکایە ئیمەیڵ و وشەی نهێنی پڕبکەرەوە.",
  invalid_credentials: "زانیاری چوونەژوورەوە دروست نییە.",
  invalid_signup: "ناو و ئیمەیڵ پێویستن؛ وشەی نهێنی دەبێت لانیکەم ١٠ پیت بێت.",
  signup_failed: "تۆمارکردن سەرکەوتوو نەبوو. دووبارە هەوڵبدەرەوە.",
  confirmation_failed: "بەستەری پشتڕاستکردنەوە دروست نییە یان بەسەرچووە.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();
  const errorMessage = params.error ? ERRORS[params.error] : null;

  return (
    <main className="auth-page">
      <div className="auth-wrap">
        <Link className="auth-brand" href="/">
          <span className="brand-mark">ش</span>
          <span><strong>SHAKH</strong><small>بازاڕی یەکگرتوو</small></span>
        </Link>

        <div className="auth-grid">
          <section className="auth-aside">
            <span className="auth-aside-kicker">SHAKH ACCOUNT</span>
            <h1>بەخێربێیت بۆ شوێنی کار و بازاڕەکەت.</h1>
            <p>بە هەژمارەکەت بچۆرە ژوورەوە بۆ بەڕێوەبردنی داواکاری، فرۆشگا، گەیاندن و خزمەتگوزارییەکان.</p>
            <div className="auth-aside-mark">ش</div>
            <span className="auth-aside-foot">لە یەک شوێن، بۆ هەمووان.</span>
          </section>

          <section className="auth-panel">
            <div className="auth-panel-heading">
              <span className="section-kicker">هەژماری SHAKH</span>
              <h2>چوونەژوورەوە</h2>
              <p>زانیاری هەژمارەکەت بنووسە بۆ بەردەوامبوون.</p>
            </div>

            {!configured && (
              <div className="auth-alert auth-alert--warning" role="status">
                پەیوەندی Supabase تەواو نەکراوە. پێویستە publishable key زیاد بکرێت.
              </div>
            )}
            {errorMessage && <div className="auth-alert auth-alert--error" role="alert">{errorMessage}</div>}
            {params.message === "check_email" && (
              <div className="auth-alert auth-alert--success" role="status">
                ئیمەیڵێکت نێردراوە. بەستەری پشتڕاستکردنەوە بکەرەوە.
              </div>
            )}

            <form action={signIn} className="auth-form">
              <label htmlFor="email">ئیمەیڵ</label>
              <input id="email" name="email" type="email" autoComplete="email" required disabled={!configured} placeholder="name@example.com" />
              <label htmlFor="password">وشەی نهێنی</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required disabled={!configured} placeholder="وشەی نهێنییەکەت" />
              <button className="button button--primary auth-submit" type="submit" disabled={!configured}>
                چوونەژوورەوە <span aria-hidden="true">←</span>
              </button>
            </form>

            <div className="auth-divider"><span>یان هەژمارێکی نوێ دروست بکە</span></div>

            <form action={signUp} className="auth-form">
              <label htmlFor="full_name">ناوی تەواو</label>
              <input id="full_name" name="full_name" type="text" autoComplete="name" required disabled={!configured} />
              <label htmlFor="signup_email">ئیمەیڵ</label>
              <input id="signup_email" name="signup_email" type="email" autoComplete="email" required disabled={!configured} placeholder="name@example.com" />
              <label htmlFor="signup_password">وشەی نهێنی</label>
              <input id="signup_password" name="signup_password" type="password" autoComplete="new-password" minLength={10} required disabled={!configured} placeholder="لانیکەم ١٠ پیت" />
              <button className="button button--quiet auth-submit" type="submit" disabled={!configured}>دروستکردنی هەژمار</button>
            </form>

            <p className="auth-back"><Link href="/">گەڕانەوە بۆ پەڕەی سەرەکی</Link></p>
          </section>
        </div>
      </div>
    </main>
  );
}
