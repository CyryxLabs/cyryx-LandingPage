import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export function SectionFrame({
  id,
  index,
  eyebrow,
  title,
  lead,
  children,
  className = "",
}: {
  id?: string;
  index: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`cx-enterprise-section ${className}`}>
      <div className="cx-enterprise-shell">
        <div className="cx-section-rule" aria-hidden>
          <span>{index}</span>
        </div>
        <div className="cx-section-intro">
          <p className="cx-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {lead ? <p className="cx-section-lead">{lead}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="cx-text-link" href={href}>
      <span>{children}</span>
      <ArrowUpRight aria-hidden size={15} />
    </a>
  );
}

export function StatusBadge({ children }: { children: ReactNode }) {
  return (
    <span className="cx-status-badge">
      <span aria-hidden />
      {children}
    </span>
  );
}
