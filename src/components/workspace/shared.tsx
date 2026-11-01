type PageHeaderProps = { eyebrow: string; title: string; description: string; index?: string };
export function WorkspacePageHeader({ eyebrow, title, description, index }: PageHeaderProps) {
  return (
    <div className="workspace-page-heading">
      <div>
        <span className="section-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {index ? <span className="profile-page-index">{index}</span> : null}
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: string;
  variant?: "neutral" | "warning" | "error";
};
export function EmptyState({ title, description, icon = "◇", variant = "neutral" }: EmptyStateProps) {
  return (
    <section
      className={"workspace-empty-state workspace-empty-state--" + variant}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <span className="workspace-empty-icon" aria-hidden="true">{icon}</span>
      <div className="workspace-empty-copy"><strong>{title}</strong><p>{description}</p></div>
    </section>
  );
}
