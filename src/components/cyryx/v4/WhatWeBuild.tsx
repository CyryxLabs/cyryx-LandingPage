import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";

const UNITS = [
  {
    tag: "Products",
    title: "Proprietary AI products.",
    body: "Led by MAAX Studio — governed autonomy, built into the runtime.",
    href: "/products",
  },
  {
    tag: "Solutions",
    title: "Custom execution systems.",
    body: "Designed, built, and transferred to your ownership.",
    href: "/solutions",
  },
  {
    tag: "Applied AI Lab",
    title: "Published research.",
    body: "Protocols and evaluations that feed every product and engagement.",
    href: "/research",
  },
];

export function WhatWeBuild() {
  return (
    <section id="what-we-build" className="relative py-20 sm:py-28 lg:py-40 bg-[var(--graphite)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal max-w-3xl">
          <HudLabel withDot>What We Build</HudLabel>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold uppercase leading-[1.02] tracking-tight text-silver-gradient">
            One discipline. Three units.
          </h2>
        </div>
        <div className="cx-stagger mt-14 grid gap-5 sm:mt-20 lg:grid-cols-3">
          {UNITS.map((u, i) => (
            <article
              key={u.tag}
              className="cx-stagger-item glass-panel group flex flex-col rounded-md p-7 lg:p-9"
            >
              <span className="hud-label text-[var(--accent-glow)]">{`0${i + 1}`}</span>
              <p className="mt-5 hud-label text-[var(--silver-dim)]">{u.tag}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold uppercase tracking-tight text-[var(--silver)]">
                {u.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                {u.body}
              </p>
              <Link
                to={u.href}
                className="mt-6 inline-flex min-h-11 items-center gap-2 hud-label text-[var(--accent-glow)] group-hover:gap-3 transition-all"
              >
                Explore <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
