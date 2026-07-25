import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import maaxDevices from "@/assets/cyryx-maax-devices-1200.jpg";
import maaxDevices480Jpg from "@/assets/cyryx-maax-devices-480.jpg";
import maaxDevices800Jpg from "@/assets/cyryx-maax-devices-800.jpg";
import maaxDevices1200Jpg from "@/assets/cyryx-maax-devices-1200.jpg";
import maaxDevices480Webp from "@/assets/cyryx-maax-devices-480.webp";
import maaxDevices800Webp from "@/assets/cyryx-maax-devices-800.webp";
import maaxDevices1200Webp from "@/assets/cyryx-maax-devices-1200.webp";
import maaxLogo from "@/assets/maax-studio-logo-exact.svg";
import { HudLabel } from "./primitives/HudLabel";
import { trackCta } from "@/lib/track-cta";
import { MaaxWaitlistDialog } from "./maax/MaaxWaitlistDialog";

const PRODUCT_LAYERS = [
  {
    n: "01",
    title: "Ground the mission",
    body: "Organize the goal, project context, constraints, and completion criteria.",
  },
  {
    n: "02",
    title: "Coordinate execution",
    body: "Connect specialized agent roles and tools with review boundaries visible.",
  },
  {
    n: "03",
    title: "Preserve operating context",
    body: "Keep decisions and execution context available for review and continuation.",
  },
];

function ProductPreview() {
  return (
    <figure
      data-maax-visual
      className="relative overflow-hidden rounded-lg border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] bg-[var(--obsidian)] shadow-[0_32px_100px_-48px_rgba(0,0,0,0.95)]"
    >
      <picture>
        <source
          type="image/webp"
          srcSet={`${maaxDevices480Webp} 480w, ${maaxDevices800Webp} 800w, ${maaxDevices1200Webp} 1200w`}
          sizes="(min-width: 1024px) 54vw, 100vw"
        />
        <img
          src={maaxDevices}
          srcSet={`${maaxDevices480Jpg} 480w, ${maaxDevices800Jpg} 800w, ${maaxDevices1200Jpg} 1200w`}
          sizes="(min-width: 1024px) 54vw, 100vw"
          alt="MAAX Studio agentic IDE on a desktop monitor and laptop"
          width={1200}
          height={896}
          loading="lazy"
          decoding="async"
          className="block aspect-[4/3] h-auto w-full object-cover"
        />
      </picture>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[var(--onyx)]/80 via-transparent to-transparent"
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-white/10 bg-[color-mix(in_oklab,var(--onyx)_78%,transparent)] px-4 py-3 backdrop-blur-md sm:px-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--silver)]">
          MAAX Studio / Product preview
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--accent-glow)]">
          <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />{" "}
          Active development
        </span>
      </figcaption>
    </figure>
  );
}

export function MAAXStudioSpotlight() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
      <section
        id="maax"
        aria-labelledby="maax-heading"
        data-story-section
        className="relative overflow-hidden bg-[var(--graphite)] py-12 sm:py-24 lg:py-28"
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-[color-mix(in_oklab,var(--accent-glow)_22%,transparent)]"
        />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="cx-reveal max-w-4xl">
            <HudLabel withDot>Cyryx Labs / Flagship product</HudLabel>
            <img
              src={maaxLogo}
              alt="MAAX Studio"
              width={1794}
              height={222}
              loading="lazy"
              decoding="async"
              className="mt-6 block h-auto w-full object-contain sm:mt-7"
              style={{ maxWidth: 500 }}
            />
            <h2
              id="maax-heading"
              className="mt-7 max-w-[18ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:mt-8 sm:text-5xl lg:text-7xl"
            >
              A command environment for agentic software execution.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:mt-7 sm:text-lg">
              Separate from client delivery, MAAX Studio is Cyryx Labs&apos; product program for
              coordinating software missions, project context, review, and controlled action — with
              the operator in command.
            </p>
          </div>

          <div className="mt-10 grid gap-10 sm:mt-14 sm:gap-12 lg:mt-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-20">
            <div className="cx-reveal lg:sticky lg:top-28">
              <ProductPreview />
            </div>

            <div className="cx-stagger lg:pt-4">
              {PRODUCT_LAYERS.map((layer) => (
                <article
                  key={layer.n}
                  data-maax-step
                  className="cx-stagger-item border-t border-[color-mix(in_oklab,var(--steel)_18%,transparent)] py-6 first:pt-0 sm:py-7 lg:py-8"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] tracking-[0.24em] text-[var(--accent-glow)]">
                      {layer.n}
                    </span>
                    <h3 className="font-display text-2xl font-medium tracking-[-0.025em] text-[var(--silver)] sm:text-3xl">
                      {layer.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--silver-dim)] sm:text-base">
                    {layer.body}
                  </p>
                </article>
              ))}

              <div className="cx-reveal mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    trackCta({
                      cta: "request_early_access",
                      section: "maax_spotlight",
                      href: "#maax-waitlist-dialog",
                    });
                    setWaitlistOpen(true);
                  }}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--silver)] px-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--onyx)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--graphite)]"
                >
                  Request an early-access review <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                <Link
                  to="/products/maax-studio"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--silver)_22%,transparent)] px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--silver)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
                >
                  Explore MAAX Studio <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <MaaxWaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </>
  );
}
