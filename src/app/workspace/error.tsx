"use client";

export default function WorkspaceError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="workspace-state-page">
      <section className="workspace-state-card workspace-state-card--error" role="alert">
        <span className="workspace-state-icon" aria-hidden="true">!</span>
        <span className="section-kicker">WORKSPACE ERROR</span>
        <h1>کێشەیەک ڕوویدا</h1>
        <p>پەڕەکە بە سەرکەوتوویی بارنەبوو. دەتوانیت دووبارە هەوڵبدەیتەوە؛ ئەگەر کێشەکە بەردەوام بوو، پەیوەندی بە بەڕێوەبەرەوە بکە.</p>
        <button className="button button--primary" type="button" onClick={() => reset()}>دووبارە هەوڵدانەوە</button>
      </section>
    </main>
  );
}
