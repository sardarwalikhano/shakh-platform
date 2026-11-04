import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAuthenticatedContext } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

type SecurityState = { error?: string; message?: string };

async function changePassword(formData: FormData) {
  "use server";
  const context = await getAuthenticatedContext();
  if (!context) redirect("/login");

  const value = (name: string) => {
    const item = formData.get(name);
    return typeof item === "string" ? item : "";
  };
  const currentPassword = value("current_password");
  const newPassword = value("new_password");
  const confirmation = value("new_password_confirmation");
  const length = Array.from(newPassword).length;

  if (!currentPassword || length < 12 || length > 128 || newPassword !== confirmation || currentPassword === newPassword) {
    redirect("/workspace/security?error=invalid_password");
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user?.email) redirect("/login");

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: currentPassword,
  });
  if (reauthError) redirect("/workspace/security?error=wrong_current_password");

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  if (updateError) {
    console.error("Authenticated password change failed:", updateError.code);
    redirect("/workspace/security?error=update_failed");
  }

  const { error: revokeError } = await supabase.auth.signOut({ scope: "others" });
  if (revokeError) {
    console.error("Other-session revocation failed:", revokeError.code);
    redirect("/workspace/security?message=password_updated");
  }
  revalidatePath("/workspace/security");
  redirect("/workspace/security?message=password_and_sessions_updated");
}

async function revokeOtherSessions() {
  "use server";
  const context = await getAuthenticatedContext();
  if (!context) redirect("/login");
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "others" });
  if (error) redirect("/workspace/security?error=sessions_revoke_failed");
  redirect("/workspace/security?message=sessions_revoked");
}

export default async function AccountSecurityPage({ searchParams }: { searchParams: Promise<SecurityState> }) {
  const user = await getAuthenticatedContext();
  if (!user) redirect("/login");
  const params = await searchParams;

  const errors: Record<string, string> = {
    invalid_password: "وشەی نهێنیی نوێ دەبێت لانیکەم ١٢ پیت بێت، دووبارەکردنەوەکەی یەکسان و لە وشەی ئێستا جیاواز بێت.",
    wrong_current_password: "وشەی نهێنیی ئێستا دروست نییە.",
    update_failed: "گۆڕینی وشەی نهێنی سەرکەوتوو نەبوو. تکایە دواتر هەوڵبدەرەوە.",
    sessions_revoke_failed: "دانیشتنەکانی تر نەخرانە دەرەوە. دووبارە هەوڵبدەرەوە.",
    local_signout_failed: "چوونەدەرەوە لەم ئامێرە سەرکەوتوو نەبوو. تکایە دووبارە هەوڵبدەرەوە.",
    global_signout_failed: "چوونەدەرەوە لە هەموو ئامێرەکان پشتڕاست نەکرا. تکایە دووبارە هەوڵبدەرەوە.",
  };
  const messages: Record<string, string> = {
    password_updated: "وشەی نهێنی نوێکرایەوە. دانیشتنەکانی تر داخراون بەڵام دەرکردنیان پشتڕاست نەکرا.",
    password_and_sessions_updated: "وشەی نهێنی نوێکرایەوە و دانیشتنەکانی تری هەژمارەکەت داخراون.",
    sessions_revoked: "دانیشتنەکانی تری هەژمارەکەت داخراون.",
  };

  return (
    <section className="workspace-page">
      <div className="profile-page-heading">
        <div>
          <span className="section-kicker">IDENTITY & ACCESS CONTROL</span>
          <h1>ئاسایشی هەژمار</h1>
          <p>وشەی نهێنی و دانیشتنەکانی هەژمارەکەت بە شێوەی پارێزراو بەڕێوەببە.</p>
        </div>
        <span className="profile-page-index">02 / SECURITY</span>
      </div>

      <div className="security-intro profile-card">
        <span className="profile-security-icon" aria-hidden="true">⌑</span>
        <div>
          <h2>هەژماری پشتڕاستکراو</h2>
          <p>ئەم ڕێکارانە بۆ پاراستنی چوونەژوورەوە و مافی دەستگەیشتن دانراون. هیچ دەستکارییەک لە ڕۆڵ یان دەسەڵاتی بەکارهێنەر ناکرێت.</p>
        </div>
      </div>

      <div className="security-stack">
        <section className="profile-card security-card">
          <div className="profile-section-heading">
            <div>
              <span className="section-kicker">PASSWORD MANAGEMENT</span>
              <h2>گۆڕینی وشەی نهێنی</h2>
              <p>بۆ پشتڕاستکردنەوە، سەرەتا وشەی نهێنیی ئێستات داوا دەکرێت.</p>
            </div>
            <span className="profile-section-number">01</span>
          </div>

          {params.error && errors[params.error] && <p className="profile-form-message profile-form-message--error" role="alert">{errors[params.error]}</p>}
          {params.message && messages[params.message] && <p className="profile-form-message profile-form-message--success" role="status">{messages[params.message]}</p>}

          <form action={changePassword} className="profile-form">
            <div className="profile-form-grid">
              <div className="profile-field profile-field--full">
                <label htmlFor="current-password">وشەی نهێنیی ئێستا</label>
                <input id="current-password" name="current_password" type="password" autoComplete="current-password" required maxLength={128} />
              </div>
              <div className="profile-field">
                <label htmlFor="new-password">وشەی نهێنیی نوێ</label>
                <input id="new-password" name="new_password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
                <small>لانیکەم ١٢ پیت. وشەیەکی تایبەت بەکاربهێنە.</small>
              </div>
              <div className="profile-field">
                <label htmlFor="new-password-confirmation">دووبارەکردنەوەی وشەی نهێنی</label>
                <input id="new-password-confirmation" name="new_password_confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
              </div>
            </div>
            <div className="profile-form-footer">
              <span>دوای گۆڕین، هەموو دانیشتنەکانی تری هەژمارەکەت دادەخرێن.</span>
              <button className="button button--primary profile-save" type="submit">گۆڕینی وشەی نهێنی</button>
            </div>
          </form>
        </section>

        <section className="profile-card security-card">
          <div className="profile-section-heading">
            <div>
              <span className="section-kicker">ACTIVE SESSIONS</span>
              <h2>دانیشتنەکانی هەژمار</h2>
              <p>دەتوانیت دانیشتنەکانی ئامێرەکانی تر داخەیت و لەم ئامێرە بمێنیتەوە.</p>
            </div>
            <span className="profile-section-number">02</span>
          </div>
          <form action={revokeOtherSessions} className="security-session-action">
            <span>ئەم کردارە تەنها دانیشتنەکانی تر دەخاتە دەرەوە؛ ئەم دانیشتنە دەمێنێتەوە.</span>
            <button className="button button--quiet" type="submit">دەرکردنی ئامێرەکانی تر</button>
          </form>
          <div className="security-global-signout">
            <div>
              <strong>چوونەدەرەوە لە هەموو ئامێرەکان</strong>
              <p>هەموو دانیشتنەکانی هەژمار داخە، لەوانە ئەم ئامێرەش.</p>
            </div>
            <form action="/auth/signout-all" method="post">
              <button className="security-danger-button" type="submit">چوونەدەرەوە لە هەموو شوێنەکان</button>
            </form>
          </div>
        </section>
      </div>
    </section>
  );
}
