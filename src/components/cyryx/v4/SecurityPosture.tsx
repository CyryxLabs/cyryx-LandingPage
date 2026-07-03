import { HudLabel } from "../primitives/HudLabel";

const ITEMS = [
  {
    title: "Server-side boundaries.",
    body: "Secrets, credentials, permissions, and billing logic are never client-exposed.",
  },
  {
    title: "Least privilege.",
    body: "Agents receive the minimum scope required. Expanded deliberately, never by default.",
  },
  {
    title: "Human authority.",
    body: "Consequential actions require explicit approval. Autonomy is granted, bounded, revocable.",
  },
  {
    title: "Auditability.",
    body: "Material actions produce records: what ran, under whose authority, at what cost.",
  },
  {
    title: "Conservative claims.",
    body: "We state what is production-ready, what is experimental, and what is unknown.",
  },
];

export function SecurityPosture() {
  return (
    <section id="security" className="relative py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>Security & Governance</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            Governance is architecture.
          </h2>
        </div>
        <ul className="cx-stagger mt-10 space-y-4 sm:mt-14">
          {ITEMS.map((i) => (
            <li key={i.title} className="cx-stagger-item glass-panel rounded-md p-6">
              <p className="text-[15px] leading-relaxed text-[var(--silver)]">
                <span className="font-display uppercase tracking-[0.06em] text-[var(--silver)]">
                  {i.title}
                </span>{" "}
                <span className="text-[var(--silver-dim)]">{i.body}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}