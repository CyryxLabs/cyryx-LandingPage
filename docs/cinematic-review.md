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

No form component, endpoint, CRM/attachment signing contract, consent, validation, attribution, honeypot, rate limit, legal page or recovery behavior changed. `/start`, `/brief`, careers and the assistant retain their existing fields and destinations. Success/error/interruption/retry/draft recovery was exercised only with browser mocks or local CRM/Gemini stand-ins. No live lead or email submission occurred.

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

Full repository lint retains **128 errors / 10 warnings** in baseline files, without suppressions. Deterministic local SEO retains the baseline `/engagement-model` description length (162 vs limit159). Legacy compliance checks retain the removed newsletter endpoint's 404 (5/6 checks pass). An AEXOS hydration mismatch was previously reproduced on clean main and the revision; that untouched route remains a baseline issue. Local WebKit/Firefox downloads failed with CDN403; Safari CI above is actual verification, not an inferred local pass.

## Navigable review preview

One public preview on the existing Vercel project is explicitly authorized and being prepared independently for the exact reviewed branch head including this follow-up. No verified current URL is available at this update. Existing older previews and the official production domain are not candidate evidence. No production promotion, infrastructure/access change or live form submission is authorized.
