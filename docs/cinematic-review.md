# Cyryx homepage — cinematic company narrative

Review branch: `design/cinematic-cyryx-review`, [draft PR 17](https://github.com/CyryxLabs/cyryx-LandingPage/pull/17). The source described here is the runtime in the commit containing this document, including viewport-based preparation of later GSAP scenes. Previous candidate: [`0bf1a1c94d8c3e11cff03ac6c153b6c45a8cb99c`](https://github.com/CyryxLabs/cyryx-LandingPage/commit/0bf1a1c94d8c3e11cff03ac6c153b6c45a8cb99c). Exact head and terminal CI evidence are maintained in the PR description. Historical screenshots and performance-follow-up.md describe previous revisions and must not be used as evidence of this candidate.

## Offer and first-screen copy

Eyebrow: **Cyryx / AI & software company**.

Headline: **From idea to software. From AI to action.**

Subhead: “We develop our own AI products, build custom software for clients, and help teams decide what to build next.”

Primary CTA: **Tell us about your project**, `/start?source=home`, preserving `start_project` / `hero`. Secondary: **Explore Cyryx**, `#cyryx-offer`, preserving `see_how_we_work` / `hero`. The destination deliberately opens the company offer in this page; the existing engagement-model route remains linked from the build method. The first step remains a short project brief and fit assessment, with no free consultation or turnaround guarantee.

Three numbered editorial paths immediately separate **Our products**, **Custom development** and **Consulting**. The founder-led company section names Paulo without implying a large team.

## Continuous visual story

An original SVG connects a real brief to Cyryx logic and a usable workspace. Its label explicitly says the build is illustrative, not a client application. The initial copy and CTA do not wait for scrolling, JavaScript or a pinned sequence. Mobile uses a compact version of the same composition beside immediately readable copy.

Custom development gives concrete outputs through three generous service rows:

- **Applications & websites:** web applications, websites and internal tools.
- **Connected systems & automation:** API integrations, data connections and workflow automation, with human review where appropriate.
- **AI agents & applied AI:** assistants, agents and AI features around a defined task, permitted tools and testing.

Keyboard/touch service selection transforms the illustration between application, workflow and agent views. All descriptions and destinations remain visible.

Only after explaining the offer, an expressly illustrative invoice becomes structured fields and an accounting draft. Its final state is **Ready for review**. It does not simulate payment or approval and does not claim a client result.

A bright silver **AI software. By Cyryx.** chapter presents AEXOS separately from client services: CLI-first framework/core available on npm, with real install/product/license destinations and no fabricated output or maturity claims. **Find the right thing to build** then explains consulting through discovery and requirements, prototypes and feasibility testing, and practical build plans and technical direction.

**How we build** condenses permissions, human review, testing and cost practices. Existing keyboard-accessible sample documents are illustrations; public research and code are inspectable resources, not client case studies. Founder identity and the project brief close the narrative.

## Motion, accessibility and delivery

The optional motion module uses GSAP 3.15, ScrollTrigger and scoped React useGSAP contexts. Finite opening assembly and signal drawing lead into native-scroll service convergence, a once-only invoice trace, product commands and consulting rules. No pinning, scroll hijacking, endless ambient movement or forced delay precedes contact. Static SVG/HTML states remain complete when JavaScript, optional imports or motion are unavailable. Reduced motion and Save-Data retain full reading; media listeners and GSAP contexts clean up on change/unmount.

Typography preserves the existing Space Grotesk, Inter, IBM Plex Mono and Cormorant Garamond families using local Latin WOFF2 files from Fontsource 5.3.0, with bundled OFL licences/provenance. Only the display face is preloaded. [Fontsource family information](https://fontsource.org/fonts/space-grotesk) describes the source. No external font request is needed for the reviewed Latin copy. Existing logo pixels/geometry are preserved in smaller WebP delivery; the favicon retains the existing 16/32px PNG frames inside its ICO container.

Both Node and Vercel builds retain negotiated static gzip/Brotli. Public successful GET HTML additionally negotiates streaming gzip while preserving response/security/cache headers. The helper excludes APIs, POST/HEAD, server functions, errors, ranges, cookies, no-transform and pre-encoded responses. Four unit tests cover response bytes, negotiation, header preservation and excluded contracts. No signed JSON contract is recompressed by the helper.

## Functional boundaries

No form behavior, endpoint, CRM/attachment signing contract, consent, validation, attribution, honeypot, rate limit, legal wording or recovery behavior changed. The QA follow-up formats existing source without changing those runtime contracts. `/start`, `/brief`, careers and the assistant retain their existing fields and destinations. Success/error/interruption/retry/draft recovery was exercised only with browser mocks or local CRM/Gemini stand-ins. No live lead or email submission occurred.

MAAX remains discontinued with its existing 308 redirect. No customer logos, certifications, commercial outcomes, deployments or user counts were invented. PR16 is separate and unmerged.

The signed CTA isolation check correlates the full `start_project` / `hero` / `/` / `/start` identity and valid signature with a unique synthetic referrer. Concurrent unrelated mock events cannot satisfy the check. The five viewport geometry assertions now run as independently parameterized tests, preventing five reloads from sharing one 30-second timeout; assertions and timeout policy are unchanged.

## Previous candidate CI and verified follow-up

[Run 37364004394](https://github.com/CyryxLabs/cyryx-LandingPage/actions/runs/37364004394), source `0bf1a1c94d8c3e11cff03ac6c153b6c45a8cb99c`:

| Check                                 | Result                                                          |
| ------------------------------------- | --------------------------------------------------------------- |
| A11y/content/SEO, typecheck and build | Success: 642 passed, 38 conditional skips, 1 flaky-on-retry     |
| Safari mobile                         | Success: 3 passed                                               |
| Windows approved visual baselines     | Success: 3 passed                                               |
| Desktop Lighthouse                    | Success                                                         |
| Mobile Lighthouse                     | Failure: max-potential-fid 256ms against unchanged 200ms budget |
| Summary                               | Pending at this document update                                 |

The flaky check is mobile-profile `header-dropdown.spec.ts:70`, which explicitly uses a desktop viewport: the initial click failed to open Products; the retry passed. The outside-click and expanded-state assertions remain strict. This differs from the previously fixed signed-CRM event isolation failure.

Mobile Lighthouse 12.1.0, three genuine mobile simulations:

| Run | Performance |    LCP |   TBT | Max potential FID |
| --- | ----------: | -----: | ----: | ----------------: |
| 1   |          72 | 4036ms | 379ms |             330ms |
| 2   |          88 | 3048ms | 122ms |             256ms |
| 3   |          87 | 3062ms | 165ms |             259ms |

Accessibility, SEO and best practices were 100 in all three. LHCI's selected aggregation passed LCP/TBT/CLS and failed max-potential-fid. A passing median does not imply each individual run met every budget. The report attributes the longest remaining post-hydration task to the main JavaScript bundle. A local follow-up now prepares later scenes with IntersectionObserver as they approach the viewport, recording their GSAP work inside the same matchMedia context and disconnecting observers on cleanup. It preserves all scenes and reduced-motion behavior. The follow-up in this commit was verified locally: three mobile runs measured max-potential-fid 178/167/162ms (all below200), LCP3304/3310/3303ms, TBT95/62.5/65ms, CLS0, performance86/87/86 and accessibility/SEO/best-practices100. No threshold changed. The matching production-browser verification passed 63 checks in58.8s with retries disabled, covering actual motion, dynamic reduced motion, keyboard/touch service selection, WCAG narrative/documents, first-screen geometry and overflow at360/390/768/1280/1920px. Node/Vercel builds, typecheck and scoped ESLint passed. The new exact-head CI is required before an all-green claim; its terminal result will be recorded in the PR description.

## Local verification and limitations

Node/Vercel production builds, typecheck and scoped lint passed for this follow-up. The unchanged unit contracts passed 53 tests / 182 assertions on the preceding candidate. The complete local Chromium / 360 mobile / forced-colors matrix, retries disabled, recorded 630 passes, 38 conditional skips and one combined five-viewport timeout. The unchanged combined test passed in isolation. Its parameterized replacement passed all 15 checks across three profiles. Exact-head CI results above supersede any assumption that the local full run was entirely green.

Actual desktop 1920×1080 and mobile 390×844 navigation included first-screen CTA, scroll down/up, refresh, service selection, keyboard/menu, reduced motion, overflow, contrast and console checks. Previous captures remain internal QA/history; they are not presented as current candidate screenshots. The user requested the navigable experience. No new image/video delivery is being substituted for a preview.

Three isolated local Lighthouse runs per mode on the preceding candidate, with Lighthouse 12.1.0 and Chromium 151: mobile performance 88/88/88, median LCP 3056ms, TBT 119ms, CLS 0; desktop performance 100/100/100, median LCP 700ms, TBT 5.5ms. Accessibility/SEO/best practices 100. However mobile max-potential-fid was 230/238/256ms: the earlier LCP/TBT budget success was not a complete all-budget pass. That candidate’s CI confirmed the issue subsequently addressed above. These absolute measurements are not a paired causal comparison or production telemetry.

Earlier revisions retained 128 lint errors / 10 warnings, a falsely counted `/engagement-model` description and an AEXOS hydration mismatch. The QA follow-up below resolves these rather than treating baseline failures as passes. Legacy compliance still expects the removed newsletter endpoint (404; 5/6 checks pass). Local WebKit/Firefox downloads failed with CDN403; historical Safari CI is actual verification of its own SHA, not an inferred local pass for this follow-up.

## Navigable review preview

[The public review preview](https://cyryx-landing-page-es4r02dk7-contact-70575058s-projects.vercel.app/) is READY on the existing Vercel project at security revision `dd6dd838c70cdbb69ab975797984b198521430d3`. Its deployment is `dpl_HBzE5h8p62HQ899ZjTUEvkofpdna`, target preview. It does not include the later AEXOS/QA follow-up until independently redeployed and verified; the preview owner coordinates that change. No production promotion, infrastructure/access change or live form submission occurred.

## TanStack Start security patch

The first approved preview build of `2053e881ef2e21bfc7f823dabcfadc3ad3884f90` was blocked by Vercel because the locked Start release was vulnerable. The [official TanStack advisory](https://github.com/TanStack/router/security/advisories/GHSA-qx66-fv34-fjm8) and [security update](https://tanstack.com/blog/tanstack-start-security-update-cve-2026-102989) identify React Start1.168.60 and start-server-core1.169.39 as the first patched releases for CVE-2026-102989.

This revision pins React Start1.168.60, aligns its direct router1.170.41/plugin1.168.42 dependencies and raises the existing Seroval override to1.6.7, the minimum required by the patched chain. The Bun lockfile resolves one patched server-core1.169.39; frozen installation succeeds. No security bypass, deployment setting or visual/form source change is introduced. Updating the preview does not update the existing production deployment.

Local security-revision checks: 53 unit tests/182 assertions and typecheck pass; Vercel and Node production builds pass. Full lint remains128errors/10warnings, exactly the established baseline. Three cold-browser measurements in each mode pass every unchanged local budget: mobile performance88/88/88, LCP3207/3198/3198ms, TBT63/65.5/57ms, max-potential-fid162/163/164ms, CLS0; desktop performance100/100/100, LCP727/662/733ms, TBT0, CLSbelow0.001. Accessibility/SEO/best-practices100 in all six. The native production-browser matrix completed with643passes/38conditional skips and no retries across Chromium desktop,360mobile and forced-colors profiles. Three additional Safari cases could not launch because the local WebKit executable is unavailable (previous CDN403); they are environment failures, not passes or product regressions. Form success/error/interruption/recovery/signature, motion, keyboard, contrast and first-screen assertions passed. The separate Chromium desktop/Android public-route/navigation suite recorded7passes/1desktop-only skip/2failures: both complete route sweeps reproduced React418, previously localized to the unchanged AEXOS route. That baseline remains unweakened and explicitly reported. The exact new head requires fresh CI. The generated route file changed only line order (verified by identical line multisets), so that generated-only churn was excluded from the security commit.

## AEXOS hydration and QA follow-up

The root-level motion effect was writing GSAP styles and replacing AEXOS server-rendered counter text before the lazy page hydrated. This caused React418; merely removing the initial zero avoided the fatal error but left development attribute mismatches. AEXOS now starts its content motion from its own committed page effect. The root retains one delegated pointer listener and defers that route's content animation. Counters retain readable server-rendered values until their scroll animation actually starts. No hydration warning is suppressed and no arbitrary readiness delay is added.

The cross-browser regression checks fresh load, scroll, reload, client navigation, Back and reduced motion, retaining strict runtime/hydration assertions. Both Chromium desktop and Android completed the full public-route/navigation suite in development and production: **13 passed / 1 desktop-only mobile-menu skip** in each mode, no retries. The previous two full-route failures now pass. An observed counter moved from64 through15 during the animation and settled at64; console and page errors remained empty on fresh load and reload.

Patched Start advertises `virtual:tanstack-start-dev-client-entry`; the old Safari/Windows setup demanded the obsolete resolved client entry and failed before browser assertions ran. The setup now derives the entry from actual SSR HTML, warms its resolved module, and still requires successful JavaScript readiness within the unchanged deadline. Development browser tests exercise this setup without bypassing it. Actual Safari/Windows verification still requires CI.

Repository lint now exits successfully with **0 errors / 9 existing warnings**. Formatting fixes are limited to21 files identified by the baseline error report; generated runtime ASTs are equivalent, coalescing adjacent JSX text for the Terms page. Two empty storage-fallback catches gain intent comments; the brief mock gets a concrete payload type; one obsolete eslint suppression is removed. No new lint suppression or rule relaxation is used.

The deterministic SEO script previously counted `&amp;` as five characters. The actual `/engagement-model` description is158 characters, within its unchanged159-character limit. Decoding SSR attribute entities fixes the measurement without changing the copy or limit. The complete local crawl passes **1333 integrity checks**.

Both Vercel and Node production builds, typecheck and53 unit tests/182 assertions pass. The final full native production Chromium/360mobile/forced-colors matrix passes **643 tests / 38 conditional skips**, with retries disabled (6.8 minutes). Existing start/brief/careers/assistant success, error, interruption, recovery and signed-contract checks use only local stand-ins or browser mocks. No real lead is submitted. Internal final desktop1920×1080/mobile390×844 captures were visually inspected; primary CTAs end at745px/577px, scroll down/up then refresh returns toY0, widths stay1920/390 without overflow, reduced-motion reload retains the content, first keyboard focus is Skip to content, and page errors are empty. Captures remain internal QA, in accordance with the request for an interactive review.

Final isolated local Lighthouse12.1.0 / Chromium151 measurements (three fresh browser processes per mode): mobile performance87/87/88, LCP3210/3307/3203ms, TBT97/56/61ms, CLS0, max-potential-fid240/154/160ms; desktop performance100/100/100, LCP729/730/733ms, TBT0, CLSbelow0.001, max-potential-fid41/42/38ms. Accessibility/SEO/best-practices100 in all six. The first mobile run exceeds the unchanged200ms max-potential-fid budget; it is retained and reported, not discarded or described as an all-budget pass. Its longest post-hydration task is attributed to the main JavaScript bundle. These unpaired local runs do not establish whether the follow-up caused the variance; exact-head Lighthouse CI is still needed.

Security-revision CI [37369553541](https://github.com/CyryxLabs/cyryx-LandingPage/actions/runs/37369553541), exact SHA `dd6dd838c70cdbb69ab975797984b198521430d3`, is terminal **failure**: main a11y/content/SEO success (643passed/38conditional skips/no retries); Safari failure in the obsolete readiness setup; Windows visual regression and both Lighthouse jobs cancelled before a runner was assigned; summary success. This is not an all-green run and does not verify the newer follow-up. New exact-head CI is required after the coordinated branch update.
