import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  ONYX_AVAILABILITY,
  ONYX_CHAT,
  ONYX_HEADLINE,
  ONYX_SCREENS,
  ONYX_SITE,
  ONYX_SKILLS,
  ONYX_STATS,
  ONYX_SUMMARY,
} from "@/data/onyx";
import { AEXOS_CYCLE, AEXOS_NUMBERS, AEXOS_VERSION } from "@/data/aexos";
import { AEXOS_PRODUCT } from "@/data/site-taxonomy";
import { ORBIT } from "@/data/products";
import { trackCta } from "@/lib/track-cta";

type Heading = "h2" | "h3";

/** Plays a muted loop only while it is on screen; a still frame otherwise. */
export function InViewVideo({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.classList.contains("cx-low-perf")) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={label}
      width={1600}
      height={1000}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

/** The Onyx Command Center, with tabs for its screens. Real captures, example data. */
export function OnyxScreens({ screens = ONYX_SCREENS.length }: { screens?: number }) {
  const [active, setActive] = useState(0);
  const list = ONYX_SCREENS.slice(0, screens);
  const screen = list[active];
  return (
    <figure className="cy-win" data-cy-reveal="scale">
      <div className="cy-win__bar">
        <span className="cy-win__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="cy-win__title">Onyx · Command Center</span>
        <span className="cy-win__tag">Example data</span>
      </div>
      {list.length > 1 ? (
        <div className="cy-win__tabs" role="tablist" aria-label="Command Center screens">
          {list.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`onyx-screen-tab-${item.id}`}
              aria-selected={index === active}
              aria-controls="onyx-screen-panel"
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                const next =
                  (active + (event.key === "ArrowRight" ? 1 : -1) + list.length) % list.length;
                setActive(next);
                document.getElementById(`onyx-screen-tab-${list[next].id}`)?.focus();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
      <div
        className="cy-win__body"
        id="onyx-screen-panel"
        role={list.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={list.length > 1 ? `onyx-screen-tab-${screen.id}` : undefined}
      >
        {screen.video ? (
          <InViewVideo
            key={screen.id}
            src={screen.video}
            poster={screen.image}
            label={screen.alt}
          />
        ) : (
          <img
            key={screen.id}
            src={screen.image}
            alt={screen.alt}
            width={1600}
            height={1000}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <figcaption className="cy-win__cap">{screen.caption}</figcaption>
    </figure>
  );
}

/** `priority` is for a first-screen portrait: loaded eagerly, ahead of other images. */
export function OnyxPortrait({ priority = false }: { priority?: boolean }) {
  return (
    <div className="cy-onyx__figure">
      <div className="cy-onyx__halo" aria-hidden="true" />
      <img
        className="cy-onyx__face"
        src="/media/onyx/onyx-android-b-v1.webp"
        alt="Onyx, the default character of the Onyx AI coworker"
        width={760}
        height={935}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
      <div className="cy-onyx__chat" aria-label="Example conversation with Onyx">
        <p>
          <span>You</span>
          {ONYX_CHAT.ask}
        </p>
        <p>
          <span>Onyx</span>
          <b className="cy-onyx__say">{ONYX_CHAT.answer}</b>
        </p>
      </div>
    </div>
  );
}

function OnyxActions({ section }: { section: "product" | "final_cta" }) {
  return (
    <div className="cy-actions">
      <a
        href={ONYX_SITE}
        target="_blank"
        rel="noopener noreferrer"
        className="cy-btn cy-btn--primary"
        onClick={() => trackCta({ cta: "view_product", section, href: ONYX_SITE })}
      >
        Open the Onyx site
        <ArrowUpRight aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <Link
        to="/products/onyx"
        className="cy-btn cy-btn--ghost"
        onClick={() => trackCta({ cta: "view_product", section, href: "/products/onyx" })}
      >
        Explore Onyx
        <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}

/** Onyx, presented with the product's own words, character and screens. */
export function OnyxShowcase({ as: Tag = "h3" }: { as?: Heading }) {
  return (
    <article id="onyx" className="cy-show cy-show--onyx" aria-labelledby="show-onyx-heading">
      <div className="cy-show__top">
        <div className="cy-show__copy">
          <p className="cy-show__brand" data-cy-reveal>
            <img
              src="/media/onyx/onyx-wordmark.svg"
              alt="Onyx"
              width={130}
              height={26}
              loading="lazy"
            />
            <span>by Cyryx Labs</span>
          </p>
          <p className="cy-badge" data-cy-reveal>
            <i aria-hidden="true" /> AI coworker for Windows · Free beta
          </p>
          <Tag id="show-onyx-heading" className="cy-show__title" data-cy-reveal>
            {ONYX_HEADLINE}
          </Tag>
          <p className="cy-lead" data-cy-reveal>
            {ONYX_SUMMARY}
          </p>
          <dl className="cy-show__stats" data-cy-reveal>
            {ONYX_STATS.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
          <div data-cy-reveal>
            <OnyxActions section="product" />
          </div>
          <p className="cy-show__note" data-cy-reveal>
            {ONYX_AVAILABILITY}
          </p>
        </div>
        <OnyxPortrait />
      </div>
      <ul className="cy-show__chips" aria-label="What Onyx does">
        {ONYX_SKILLS.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
      <OnyxScreens screens={2} />
    </article>
  );
}

/** One story moving through the AEXOS cycle, printed like a terminal session. */
export function AexosCycle() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(AEXOS_CYCLE.length - 1);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        if (!entry?.isIntersecting) return;
        setLive(true);
        setStep(0);
        timer = window.setInterval(
          () => setStep((current) => (current + 1) % (AEXOS_CYCLE.length + 2)),
          1500,
        );
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, []);

  const shown = Math.min(step, AEXOS_CYCLE.length - 1);
  return (
    <div ref={ref} className="cy-cycle" data-live={live ? "true" : undefined}>
      <ol className="cy-cycle__steps" aria-label="The AEXOS story development cycle">
        {AEXOS_CYCLE.map((item, index) => (
          <li key={item.key} data-state={index < shown ? "done" : index === shown ? "now" : "next"}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.step}
          </li>
        ))}
      </ol>
      <div className="cy-cycle__term" aria-hidden="true">
        <p className="cy-cycle__head">
          <span>story-4.2 · simulation</span>
          <span>@aexos/core {AEXOS_VERSION}</span>
        </p>
        {AEXOS_CYCLE.map((item, index) =>
          index <= shown ? (
            <p key={item.key} className="cy-cycle__line">
              <b>›</b> {item.agent} {item.command}
              <span>{item.output}</span>
            </p>
          ) : null,
        )}
        <p className="cy-cycle__line cy-cycle__line--cursor">
          <b>›</b> <i />
        </p>
      </div>
      <p className="cy-cycle__cap">
        Simulation · commands and verdicts as documented, example story
      </p>
    </div>
  );
}

export function AexosShowcase({ as: Tag = "h3" }: { as?: Heading }) {
  return (
    <article id="aexos" className="cy-show cy-show--aexos" aria-labelledby="show-aexos-heading">
      <div className="cy-show__top">
        <AexosCycle />
        <div className="cy-show__copy">
          <p className="cy-show__brand cy-show__brand--text" data-cy-reveal>
            <strong>AEXOS</strong>
            <span>{AEXOS_PRODUCT.fullName}</span>
          </p>
          <p className="cy-badge" data-cy-reveal>
            <i aria-hidden="true" /> {AEXOS_PRODUCT.category} · AEXOS Core free on npm
          </p>
          <Tag id="show-aexos-heading" className="cy-show__title" data-cy-reveal>
            AI agents that work to a method.
          </Tag>
          <p className="cy-lead" data-cy-reveal>
            AEXOS is an agent framework for software projects, for developers who use AI coding
            tools. It installs specialised AI agents, the procedures they follow and the gates they
            must pass into your project. You talk to one orchestrator; it routes the work to the
            specialist that owns it.
          </p>
          <p className="cy-code cy-show__cmd" data-cy-reveal>
            {AEXOS_PRODUCT.installCommand}
          </p>
          <div className="cy-actions" data-cy-reveal>
            <Link
              to="/products/aexos"
              className="cy-btn cy-btn--primary"
              onClick={() =>
                trackCta({ cta: "view_product", section: "product", href: "/products/aexos" })
              }
            >
              Explore AEXOS
              <ArrowRight aria-hidden="true" />
            </Link>
            <a
              href={AEXOS_PRODUCT.npmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cy-btn cy-btn--ghost"
              onClick={() =>
                trackCta({ cta: "view_product", section: "product", href: AEXOS_PRODUCT.npmUrl })
              }
            >
              Install from npm
              <ArrowUpRight aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <p className="cy-show__note" data-cy-reveal>
            AEXOS Core is free on npm · v{AEXOS_VERSION} · {AEXOS_PRODUCT.runtime}. Works with{" "}
            {AEXOS_PRODUCT.hosts.join(", ")}.
          </p>
        </div>
      </div>
      <dl className="cy-show__nums" aria-label={`What ships in @aexos/core ${AEXOS_VERSION}`}>
        {AEXOS_NUMBERS.map((item) => (
          <div key={item.label} data-cy-reveal>
            <dt>{item.label}</dt>
            <dd>
              <span data-cy-count={item.value}>{item.value}</span>
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

/**
 * Orbit is listed by name and status only (founder decision 2026-11-17):
 * no description, features, link, CTA or form until a purpose line is approved.
 */
export function OrbitCard({ as: Tag = "h3" }: { as?: Heading }) {
  return (
    <article id="orbit" className="cy-card cy-prod__more" aria-labelledby="show-orbit-heading">
      <Tag id="show-orbit-heading" className="cy-h3">
        {ORBIT.name}
      </Tag>
      <p className="cy-badge" style={{ alignSelf: "flex-start" }}>
        {ORBIT.stage}
      </p>
    </article>
  );
}
