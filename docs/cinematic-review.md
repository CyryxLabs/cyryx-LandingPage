# Cyryx homepage — architecture, offer and working software

Branch: `design/cinematic-cyryx-review`, [draft PR17](https://github.com/CyryxLabs/cyryx-LandingPage/pull/17). Exact runtime/test source: **6242daa90bc43b3eaee9f6834238bf360fa8fe8e**. Its following evidence commit adds only review documents and sanitized captures. Final branch head and exact-head CI are recorded in the PR description.

## The commercial story

**Cyryx / AI & software company**. Headline: **AI products. Software, made real.** Subhead: “Our own AI products. Custom software for clients. Practical advice on what to build next.” The three first-screen paths are **Our products**, **Custom development** and **Consulting**. **Tell us about your project**, **Explore Cyryx**, the short project brief / fit explanation and assistant remain immediately usable. Existing `/start?source=home`, `start_project` / `hero` and `see_how_we_work` / `hero` destinations and analytics identities remain intact.

The supplied silver/teal Cyryx architecture is a large stage on desktop. Mobile has a separate215px focal composition above concise copy, rather than placing all the text over a dim image. Desktop keeps the finite opening architecture. Phone uses its existing smaller portrait still and a finite camera movement, avoiding the extra entrance image download.

Immediately afterward, an original **Illustrative client application / sample data** turns “Please arrange an equipment inspection at Building B” into a specific service-desk interface. Work and Place retain the source. **Prepare visit** changes this local sample to **Visit draft prepared.** / “Equipment inspection · Building B · Ready for review”, retaining Source linked / Fields checked / Review next. **Reset example** reverses it. This sample does not make a network request, book a visit or submit an intake. Keyboard activation and live feedback are covered; normal web-vitals telemetry continues.

The bright **Our own software** chapter follows. AEXOS remains a **CLI-first framework**, with **core available on npm**, inspectable install commands and the existing product/license destinations. Products remain distinct from client work. Services show applications, websites and internal tools; integrations, data connections and repetitive workflow automation; AI assistants, agents and features around a defined task. Their existing touch/keyboard controls replace the adjacent illustrative interface with concrete deliverables.

Consulting explains discovery notes and requirements, prototypes and feasibility tests, and a practical build plan. Only afterward does the illustrative invoice demonstrate document → structured fields → accounting draft, ending **Ready for review**. **How we build** preserves permissions, human review, testing and cost practices. Founder-led identity names Paulo without team-size claims. Public code and research remain inspectable resources rather than customer case studies. MAAX's existing308 lifecycle and separate PR16 remain untouched. No customers, results, certifications, deployments or user counts were invented.

## Three finite scenes and complete static content

The architecture opens once on desktop; mobile uses the smaller focal still and a short camera movement. Building B travels from its original request to the Place field; the sample button produces a visible draft with retained evidence. The later invoice transforms a document into a structured record and reviewable draft. Product commands and consulting lines enter quietly near the viewport. No scene pins native scrolling, loops constantly or gates contact.

All copy, fields and illustrations are complete in SSR. At most two selected hero stills load on desktop and one on phones; there is no canvas, video or full sequence preload. Scoped useGSAP/matchMedia and near-viewport observers clean up on unmount/media changes. Reduced motion and Save-Data retain intentional static states; dynamic reduced motion restores actors and stops animations. Existing forms, consent, validation, honeypots, attribution, signing, endpoints and retry/draft recovery contracts are unchanged.

## Actual captures and measured access

[Before: published-source reproduction](review/published-dd6-mobile/README.md). [Previous mobile source718](https://github.com/CyryxLabs/cyryx-LandingPage/blob/718240e8eb2c19321f7c82d81a79e6506b708ee1/docs/review/mobile-focused/README.md). [Current actual screenshots, recordings and measurements](review/aperture-working/README.md).

These are local production Chromium captures at1920×1080,390×844 and360×844, not live deployment verification. Direct screenshots and actual browser recordings were visually inspected. Recordings include opening, the sample action/reset, products, scroll up, refresh and keyboard focus. Refresh returnsY0; first focus is Skip to content. No overflow or page/console errors were observed. Demo labels remain at least12px; reduced-motion captures have no running animations. No live lead/email was submitted.

| Measurement                                      | 360×844 | 390×844 | 1920×1080 |
| ------------------------------------------------ | ------: | ------: | --------: |
| Hero height                                      |   806px |   813px |    1022px |
| Primary CTA bottom                               |   544px |   550px |     719px |
| Three company areas begin                        |   677px |   684px |     843px |
| Product chapter begins                           |  1666px |  1604px |    1971px |
| Prepared sample result bottom in its review view |   636px |   600px |     503px |
| Horizontal overflow                              |       0 |       0 |         0 |

## Verification and retained failures

Node and Vercel builds, typecheck,53unit tests/182assertions, deterministic1333SEO integrity checks and full lint passed. Lint retains0errors/9existing warnings. Chromium desktop/Android public navigation passed13checks with1desktop-only menu skip, without retries. Local WebKit/Firefox executables remain unavailable; exact-head CI supplies Safari/Windows verification. Skips and environment limitations are not passes.

The full local three-profile production matrix, retries disabled, finished **654passed /38conditional skips /1failed** in8.0minutes. Every new-scene/form/SEO/accessibility assertion passed. The unchanged desktop **Child selection closes the menu** header test failed waiting to click AEXOS. Its retained trace shows the Products trigger closed immediately after its opening click, with the closing viewport detaching before AEXOS could be clicked. Hover/click timing is a plausible inference from the existing Radix trigger handlers, not a proven cause. The entire unchanged header suite then passed30checks across all three profiles in isolation, without retries. No header runtime, assertion, force-click, sleep or timeout was altered. The full local run is not entirely green.

The initial candidate run had649passes/38skips/6failures: the unchanged1688px product-position bound failed at360px in three profiles, and three paragraph assertions still expected the previous copy. Smaller mobile spacing fixed the geometry to1666px without changing that bound; assertions now require the exact complete new three-area copy. All six assertions passed in the full run. After the bounded phone asset/crop adjustment, all63affected cinematic/static/motion checks passed across all three profiles without retries.

All form success/error/interruption/retry/recovery checks used browser mocks or synthetic local CRM/Gemini stand-ins only. Fresh production server state avoided the previously diagnosed five-per-hour synthetic talent quota exhaustion. The existing signed CRM event expectations were not weakened.

## Performance: complete samples, unchanged budgets

Lighthouse12.1.0 uses fresh Chromium processes with genuine default mobile simulation and the desktop profile. No browser matrix, build or video encoder ran concurrently with these measurements. All six samples, profiles, warnings, audit errors and CPU benchmarks are retained in [performance.json](review/aperture-working/performance.json).

All six local numeric samples meet the unchanged budgets. Mobile LCP has only about42–44ms of margin; these are bounded measurements, not production telemetry or a causal comparison. Accessibility/SEO/best-practices scored100, with no report-level warnings or failed requests. Several diagnostic insight audits failed with a trace-engine frame_sequence dependency error; the same errors exist in the earlier local source reports. Those diagnostic audits are unavailable, not passed. All errors and CPU benchmarks are retained; exact-head CI remains separate evidence.

| Profile/run | Performance |    LCP |   TBT | Max potential FID |      CLS |
| ----------- | ----------: | -----: | ----: | ----------------: | -------: |
| Mobile1     |          86 | 3456ms |   0ms |              47ms | 0.000000 |
| Mobile2     |          86 | 3458ms | 1.5ms |              53ms | 0.000000 |
| Mobile3     |          86 | 3458ms |   8ms |              58ms | 0.000000 |
| Desktop1    |          99 |  770ms |   0ms |              16ms | 0.000000 |
| Desktop2    |          99 |  771ms |   0ms |              16ms | 0.000000 |
| Desktop3    |          99 |  770ms |   0ms |              17ms | 0.000001 |

The preceding unoptimized architectural candidate measured mobile84/84/84, LCP3685/3690/3681ms, above the unchanged3500ms limit; TBT0/3.5/0.5ms, maxFID48/57/51ms, CLS0. Desktop99/99/99, LCP747/769/746ms. This justified replacing the phone's desktop40KB still with its existing22KB portrait still and removing the extra34KB entrance download on phones, while preserving the two-frame desktop scene. These changes do not relax profiles, thresholds or assertions.

Source718's exact-head CI37393701622 previously passed all six jobs, main649/38 without flaky retries and Safari/Windows3each. Its first mobile sample nevertheless scored69 withTBT1136/maxFID947ms; later samples87/88 passed those limits. Existing LHCI optimistic aggregation means a job pass does not imply every sample met every budget. This historical baseline is not current-source proof, and its outlier is not attributed solely to host variance.

## Preview and remaining review

[Existing public preview](https://cyryx-landing-page-es4r02dk7-contact-70575058s-projects.vercel.app/) remains source **dd6dd838c70cdbb69ab975797984b198521430d3**, deployment `dpl_HBzE5h8p62HQ899ZjTUEvkofpdna`. It does not show this candidate. The external browser connection here returns ERR_TUNNEL_CONNECTION_FAILED. The owner coordinates a separate interactive preview after QA/CI; no deployment, production promotion, merge, paid service, infrastructure/access change or PR16 merge occurred.

Saving the new captures to Library failed because its authenticated connection was unavailable. No new Library file was confirmed. Sanitized committed review assets are the fallback. Creative acceptance and live preview review remain pending; this is not a production-readiness claim.
