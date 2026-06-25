import { ArrowLeft } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HudLabel } from "./primitives/HudLabel";
import architectureImg from "@/assets/cyryx-architecture.jpg";

export function StubPage({
  eyebrow,
  title,
  description,
  status = "Coming Soon",
}: {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
}) {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="relative">
        <section className="relative isolate overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
          <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.18]">
            <img
              src={architectureImg}
              alt=""
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--onyx)] via-[color-mix(in_oklab,var(--onyx)_70%,transparent)] to-[var(--onyx)]" />
          </div>
          <div className="relative mx-auto max-w-4xl px-5 sm:px-8 lg:px-12">
            <HudLabel withDot className="text-[var(--accent-glow)]">
              {eyebrow}
            </HudLabel>
            <h1 className="mt-6 font-display text-[40px] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em] text-silver-gradient">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
              {description}
            </p>

            <div className="mt-10 inline-flex items-center gap-3 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_70%,transparent)] px-5 py-3 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)] animate-pulse" />
              <span className="hud-label text-[var(--accent-glow)]">{status}</span>
            </div>

            <div className="mt-12">
              <a
                href="/"
                className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Cyryx Labs
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}