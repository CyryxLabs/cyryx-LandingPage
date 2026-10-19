import { Globe, Repeat, ShieldQuestion } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const PAINS = [
  {
    icon: Globe,
    title: "Your website doesn't bring in customers.",
    body: "It looks fine, but visitors leave without calling, booking or buying.",
  },
  {
    icon: Repeat,
    title: "Your team retypes the same data every day.",
    body: "Forms, inboxes, spreadsheets and the CRM don't talk to each other, so people copy and paste.",
  },
  {
    icon: ShieldQuestion,
    title: "You want AI, but don't trust it with clients or money.",
    body: "Nobody can say what it is allowed to do, what it costs, or who checks its work.",
  },
] as const;

export function Problem() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      data-story-section
      className="relative overflow-hidden border-b border-[color-mix(in_oklab,var(--silver)_12%,transparent)] bg-[var(--obsidian)] py-12 sm:py-20 lg:py-28"
    >
      <div aria-hidden className="cx-aurora opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          id="problem-heading"
          title="Three vendors for a website, software and AI — and still no clear answer."
          lead="Most companies hire a web agency, an automation shop and a consultant, and still don't know which AI projects are worth the money."
        />

        <ul className="cx-stagger mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:mt-16 lg:grid-cols-3">
          {PAINS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="cx-stagger-item bg-[var(--obsidian)] p-6 sm:p-8">
              <Icon className="h-5 w-5 text-[var(--accent-glow)]" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-6 max-w-[22ch] font-display text-xl font-semibold leading-snug tracking-[-0.025em] text-[var(--silver)] sm:text-2xl">
                {title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver-dim)]">{body}</p>
            </li>
          ))}
        </ul>

        <p className="cx-reveal mt-10 max-w-4xl font-display text-2xl font-medium leading-snug tracking-[-0.025em] text-[var(--silver)] sm:mt-14 sm:text-3xl">
          Cyryx Labs is one team for all of it: we advise, build, control and operate — and we tell
          you when not to build.
        </p>
      </div>
    </section>
  );
}
