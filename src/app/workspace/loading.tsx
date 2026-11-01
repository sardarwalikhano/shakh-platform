export default function WorkspaceLoading() {
  return (
    <main className="workspace-loading" aria-label="بارکردنی ناوەندی کار" aria-busy="true">
      <div className="workspace-loading-heading">
        <span className="workspace-skeleton workspace-skeleton--eyebrow" />
        <span className="workspace-skeleton workspace-skeleton--title" />
        <span className="workspace-skeleton workspace-skeleton--description" />
      </div>
      <div className="workspace-loading-grid">
        <span className="workspace-skeleton workspace-skeleton--card" />
        <span className="workspace-skeleton workspace-skeleton--card" />
        <span className="workspace-skeleton workspace-skeleton--card" />
      </div>
      <span className="sr-only">تکایە چاوەڕێ بکە، پەڕەکە بار دەکرێت.</span>
    </main>
  );
}
