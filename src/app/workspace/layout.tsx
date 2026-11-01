import type { ReactNode } from "react";
import Link from "next/link";
import { requireAuthenticatedContext } from "@/lib/auth/guards";
import { ROLE_LABELS, ROLE_WORKSPACE_LABELS } from "@/lib/auth/presentation";
import { WorkspaceNavigation } from "@/components/workspace/navigation";

export default async function WorkspaceLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await requireAuthenticatedContext();
  return (
    <div className="workspace-shell" dir="rtl">
      <aside className="workspace-sidebar" aria-label="SHAKH workspace">
        <Link className="workspace-brand" href="/" aria-label="گەڕانەوە بۆ SHAKH">
          <span className="brand-mark">ش</span>
          <span className="brand-copy"><strong>SHAKH</strong><small>ناوەندی کار</small></span>
        </Link>
        <div className="workspace-sidebar-divider" />
        <div className="workspace-sidebar-role">
          <span className="workspace-role-avatar" aria-hidden="true">ش</span>
          <span><strong>{ROLE_WORKSPACE_LABELS[user.role]}</strong><small>{ROLE_LABELS[user.role]}</small></span>
        </div>
        <WorkspaceNavigation role={user.role} />
        <div className="workspace-sidebar-footer">
          <Link href="/" className="workspace-storefront-link"><span aria-hidden="true">↗</span><span>بینینی پەڕەی سەرەکی</span></Link>
          <span className="workspace-sidebar-version">SHAKH PLATFORM</span>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-topbar-context">
            <span className="workspace-topbar-eyebrow">SHAKH WORKSPACE</span>
            <strong>{ROLE_WORKSPACE_LABELS[user.role]}</strong>
          </div>
          <div className="workspace-topbar-account">
            <div className="workspace-topbar-identity">
              <span className="workspace-topbar-avatar" aria-hidden="true">{(user.email?.slice(0, 1) || "ش").toUpperCase()}</span>
              <span className="workspace-topbar-email" dir="ltr">{user.email ?? user.id}</span>
            </div>
            <form action="/auth/signout" method="post">
              <button className="workspace-signout" type="submit"><span aria-hidden="true">⇥</span><span>چوونەدەرەوە</span></button>
            </form>
          </div>
        </header>
        <main className="workspace-content"><div className="workspace-content-inner">{children}</div></main>
      </div>
    </div>
  );
}
