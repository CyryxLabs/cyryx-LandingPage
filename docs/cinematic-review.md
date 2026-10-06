# Cyryx homepage — mobile company narrative

Branch: `design/cinematic-cyryx-review`, [draft PR17](https://github.com/CyryxLabs/cyryx-LandingPage/pull/17). Exact runtime/test source: **e62a0579de38c4c3ade3122f60f87651f9e0f609**. The following evidence commit adds documentation and sanitized captures without changing that source. Final branch head and exact-head CI are recorded in the PR description.

## Story and offer

**Cyryx / AI & software company**. Headline: **From idea to software. From AI to action.** Subhead: “We develop our own AI products, build custom software for clients, and help teams decide what to build next.”

The first screen separates **Our products**, **Custom development** and **Consulting**, with **Tell us about your project**, **Explore Cyryx** and the assistant opener. The first step remains a short project brief and fit assessment. `/start?source=home`, `start_project` / `hero` and `see_how_we_work` / `hero` analytics identities remain intact. The founder section names Paulo without implying a large team.

An original, explicitly illustrative HTML composition takes Documents / Systems / People through a brief into a usable workspace. Demo labels are at least12 CSS pixels on phones. Desktop shows it beside the hero; mobile shows the readable composition immediately after the compact first screen. Exactly one responsive version is visible. Content and contact remain available before JavaScript or scrolling.

The bright **Our own software** chapter follows the opening. AEXOS remains a **CLI-first framework**, with **core available on npm**, real install commands and existing product/license destinations. Own products remain separate from client services.

Custom development provides concrete outputs: applications, websites and internal tools; API integrations, data connections and workflow automation; AI assistants, agents and features around a defined task. Three touch/keyboard controls visibly replace the nearby demonstration with a task workspace, connected request workflow or bounded document-search assistant. Sample labels make their illustrative status explicit. All descriptions and service destinations remain readable below the stage.

Consulting explains discovery notes and requirements, prototypes and feasibility tests, and practical build plans. Large numbered steps provide a quieter composition. Only afterward does the illustrative invoice demonstrate document → structured fields → accounting draft, ending **Ready for review**. It never depicts payment approval or a client result.

**How we build** retains permissions, human review, testing and cost practices. Public code and research are inspectable resources, not client case studies. MAAX remains discontinued with its308 redirect; PR16 remains separate. No invented customers, outcomes, certifications, deployments or user counts appear.

## Motion and access

Finite GSAP scenes assemble brief/connector/workspace, draw invoice connections, and introduce product commands and consulting rules near the viewport. Service selection uses a short arrival transition between different HTML interfaces. Native scrolling remains unpinned, with no ambient loop or forced introduction. Scoped useGSAP/matchMedia contexts and IntersectionObserver cleanup handle unmount/media changes. Reduced motion and Save-Data retain complete static content; dynamic reduced motion restores real actors to identity transforms and stops running animations. Keyboard, focus, accessible live selection feedback and no-JavaScript content remain covered.

## Actual before/after evidence

[Before: published-source reproduction](review/published-dd6-mobile/README.md). [After: screenshots and recording](review/mobile-focused/README.md). These actual Chromium captures are **local production reproductions, not live deployment verification**. Public preview access fails here with Envoy CONNECT403 / ERR_TUNNEL_CONNECTION_FAILED. No form was submitted during recording.

| Measurement                            | 360×844 | 390×844 | 1920×1080 |
| -------------------------------------- | ------: | ------: | --------: |
| Hero height                            |   793px |   799px |    1072px |
| Primary CTA bottom                     |   442px |   448px |     706px |
| Three business areas begin             |   556px |   562px |     845px |
| Product chapter begins                 |  1273px |  1279px |    1072px |
| Workflow result bottom after selection |   570px |   552px |     562px |
| Agent result bottom after selection    |   529px |   529px |     581px |
| Horizontal overflow                    |       0 |       0 |         0 |

Earlier phone SVG labels rendered at approximately4–7.7px; new demo labels are12px or larger. The product chapter previously began at4280/4249px. The current service result clears the sticky contact CTA after a real tap, without scrolling to reveal the response. Scroll down/up, refresh, keyboard focus, reduced motion and console were checked: refreshY0, first focus Skip to content, empty page errors. The14.24-second recording covers opening → AEXOS → touch workflow/agent → top → refresh.

## QA: retain the failure and skips

Final local production Chromium matrix, retries disabled: **648passed /38conditional skips /1failed** in6.6minutes. The failure was the unchanged careers form's5-second `Introduction received.` assertion in forced colors. Its complete unchanged test then passed in all three profiles in isolation (3passed,5.1seconds), including signed CRM introduction and absence of lead-submission assertions. The cause remains unproven; the full run is not entirely green. All form traffic used browser mocks or synthetic local CRM/Gemini stand-ins; no real lead/email was submitted.

The preceding candidate full run had647passes/38skips and two header link-stability failures. Header runtime was unchanged. A delayed-font diagnostic showed identical navigation movement in published dd6 and this source (trigger x402.125→402.734px). Hydration alone does not settle pointer geometry; this supports the readiness guard but does not prove the whole failure mechanism. The fixture now awaits `document.fonts.ready` and the existing `data-cyryx-scroll-ready=true`. No forced click, sleep, increased timeout or weakened assertion was added. All30header checks passed in isolation and in the final matrix.

Obsolete SVG selectors now check the actual HTML demonstration and invoice actors, retaining native-scroll, no pinning, viewport, readable content, touch, keyboard and reduced-motion contracts. New360/390 tests require readable labels, early products and actual visible selection feedback.

Production Chromium desktop/Android navigation: **13passed /1desktop-only menu skip**, no retries, with strict AEXOS hydration/reload/navigation checks. Typecheck, Node build,53unit tests/182assertions and1333SEO integrity checks passed. Full lint:0errors/9existing warnings. Vercel build and exact-head CI results are maintained in the PR. Local WebKit/Firefox executables remain unavailable; new exact-head CI is required for Safari/Windows. Skips and environment limitations are not passes.

## Performance: all six samples

Lighthouse12.1.0, six fresh Chromium processes, genuine mobile/default simulation and desktop profile, without competing browser tests. Every run scored100 for accessibility/SEO/best practices, had no warnings or failed requests, and met the unchanged local budgets. [All samples, profiles and host benchmarks](review/mobile-focused/performance.json).

| Profile/run | Performance |    LCP | TBT | Max potential FID | CLS |
| ----------- | ----------: | -----: | --: | ----------------: | --: |
| Mobile1     |          87 | 3305ms | 0ms |              43ms |   0 |
| Mobile2     |          89 | 3053ms | 0ms |              46ms |   0 |
| Mobile3     |          87 | 3305ms | 0ms |              47ms |   0 |
| Desktop1    |         100 |  661ms | 0ms |              16ms |   0 |
| Desktop2    |         100 |  726ms | 0ms |              16ms |   0 |
| Desktop3    |         100 |  701ms | 0ms |              16ms |   0 |

Mobile CPU benchmark indices:2805.5/2726.5/2548; desktop2734.5/2711.5/2538.5. These bounded local measurements are not production telemetry or a paired causal comparison. Baseline319's [terminal-success CI37374217674](https://github.com/CyryxLabs/cyryx-LandingPage/actions/runs/37374217674) retained a mobile1827ms max-potential-FID run with CPU benchmark44.5/slow-host warning, then150/160ms on benchmarks2495/2495.5. Existing LHCI optimistic aggregation means job success does not prove every sample met every budget. Profiles, thresholds, sample counts and aggregation are unchanged.

## Preview remains unchanged

[Existing public preview](https://cyryx-landing-page-es4r02dk7-contact-70575058s-projects.vercel.app/) remains `dpl_HBzE5h8p62HQ899ZjTUEvkofpdna`, source **dd6dd838c70cdbb69ab975797984b198521430d3**. It does not show this candidate. The owner coordinates any next preview deployment. This revision performs no deployment, production promotion, new infrastructure/access or paid service.
