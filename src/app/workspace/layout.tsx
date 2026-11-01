import type { ReactNode } from "react";
import Link from "next/link";
import { requireAuthenticatedContext } from "@/lib/auth/guards";

export default async function WorkspaceLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await requireAuthenticatedContext();

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <Link className="brand" href="/">
          <span className="brand-mark">ش</span>
          <span className="brand-copy"><strong>SHAKH</strong><small>ناوەندی بەڕێوەبردن</small></span>
        </Link>
        <div className="workspace-user">
          <span>{user.email ?? user.id}</span>
          <Link className="workspace-profile-link" href="/workspace/profile" aria-current="page">
            پرۆفایلی من
          </Link>
          <form action="/auth/signout" method="post">
            <button className="workspace-signout" type="submit">چوونەدەرەوە</button>
          </form>
        </div>
      </header>
      <div className="workspace-content">{children}</div>
    </main>
  );
}
