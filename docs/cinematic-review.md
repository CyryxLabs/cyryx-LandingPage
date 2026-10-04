# Cyryx homepage — commercial story revision

Review branch: `design/cinematic-cyryx-review`, [draft PR 17](https://github.com/CyryxLabs/cyryx-LandingPage/pull/17). Verified runtime source: [`d7deb3c9919337b1d26772183c2f031180b38aad`](https://github.com/CyryxLabs/cyryx-LandingPage/commit/d7deb3c9919337b1d26772183c2f031180b38aad). Previous draft: `e54666049ca2c057fc644cc64d1d0b8db39c60fa`. The following review-assets commit changes only documentation and captures; the final PR head is reported with its exact CI results. This revision continues that branch; it does not merge PR 16 or promote a production deployment.

## Copy and narrative

Hero: **“Custom software and AI for the way your business works.”**

Subhead: “We build applications, connect systems and automate workflows. We help you decide what’s worth building—and turn it into working software.”

The primary CTA is **“Tell us about your project”** and still goes to `/start?source=home` with `start_project` / `hero`. The secondary label is **“Explore our services”** and retains `/engagement-model` and `see_how_we_work` / `hero`. The first step is explicitly a short project brief and fit assessment; no free consultation or reply deadline is promised.

The story is readable without scrolling through an introduction or waiting for JavaScript:

1. A direct promise and founder-led software/AI identity, with the useful copy and CTA in the first viewport.
2. Three generous service rows: **Custom software & AI development** (applications, internal tools, AI features); **Integrations & workflow automation** (APIs, data connections, workflows); **Consulting & applied research** (discovery, prototypes, feasibility testing). Each has its own existing service destination and concrete deliverables.
3. Project-fit questions about a missing tool, work stuck between systems, or an AI idea that needs feasibility testing.
4. One explicitly illustrative invoice → structured data → accounting draft. It ends **“Ready for review”**, with no simulated approval, payment or claimed client result.
5. Understand / Build / Connect, with concise permissions, human review, testing and cost practices. Sample scope/test/workflow documents remain keyboard accessible and are labelled as examples; test thresholds are pending tests, not achieved performance claims.
6. A separate **Our products** chapter. AEXOS is a CLI-first framework for AI-assisted development, with core available on npm and the existing install command/product/license links.
7. Public research and code as inspectable resources, explicitly distinguished from client case studies; a founder-led close with Paulo and the project brief.

## Motion and static reading

The opening assembles Interface, Logic and Connections planes into an original application composition in about 1.1 seconds. Only the artwork moves; the headline and contact action stay usable throughout. The same composition transforms between application, workflow and prototype views when a service is selected by keyboard or touch, using 350ms transitions. Every service description and link remains visible.

The invoice trace completes once in 1.2 seconds. It is horizontal on desktop and vertical on mobile. It indicates the relationship between document, data and draft; it never claims a payment or approval occurred. Static reading zones separate these moments. There is no scroll hijack, pinning, repeated auto-approval animation or forced sequence before contact.

Reduced motion disables the assembly, service transitions and scroll motion, leaving the complete composition and review-ready example. No JavaScript still renders the offer, links and example. Save-Data retains the existing static fallback. GSAP uses scoped React contexts and matchMedia cleanup.

## Form and integration boundaries

No form component, backend endpoint, CRM signing/upload contract, consent, validation, attribution, honeypot, rate limit, legal page or recovery behavior was changed. `/start`, `/brief`, careers and the assistant retain the existing fields and destinations. Synthetic submissions use only browser route mocks or the repository’s local CRM/Gemini stand-ins. No leads or email messages were sent to live systems.

MAAX’s existing 308 redirect and discontinued lifecycle are unchanged. Research/product resources are not presented as client deployments. No customer logos, certifications, user counts, commercial results or team size were invented.

The signed-event test previously selected the last event in a mock shared by concurrent workers. It now searches the post-click records for the full `start_project` / `hero` / `/` / `/start` identity and still requires a valid signature. A unique synthetic referrer correlates the signed record to this browser’s beacon, so another concurrent hero click cannot satisfy the check. Scroll interaction tests wait for the existing `data-cyryx-scroll-ready` bootstrap signal before simulating a user scroll, preserving all visibility assertions.

## Review assets

Actual browser captures at **1920×1080** and **390×844**:

- Previous draft: [desktop](review/before-desktop-hero.png), [mobile](review/before-mobile-hero.png).
- Revised opening: [desktop](review/desktop-hero.png), [mobile](review/mobile-hero.png).
- Services: [desktop offer](review/desktop-operating-model.png), [mobile composition](review/mobile-service-stage.png).
- Example: [desktop workflow](review/desktop-controlled-execution.png), [mobile invoice](review/mobile-invoice.png), [mobile draft](review/mobile-draft.png).
- [Our products](review/desktop-our-products.png), [mobile process](review/mobile-security.png), [mobile contact](review/mobile-contact.png).
- [Actual vertical browser motion recording](review/mobile-motion.mp4), 390×844, approximately 26 seconds.

The screenshots and sampled recording frames were visually inspected. These captures use the cloud browser’s available font fallback: the unchanged Google Fonts request is blocked by the cloud network (`ERR_TUNNEL_CONNECTION_FAILED`). The same environment and fallback were used for the before/after captures. Local page/runtime errors were absent on the revised homepage; the external font failures are recorded separately.

Library upload was attempted through the current official prepared-upload helper. It failed before any preparation/write with `hosted apps tools/list request failed: network`; no Library IDs were created. Sanitized images and video are therefore committed as the authorized fallback.

No existing public automatic branch preview has been confirmed. The built page is available locally on port 4175 with the CRM/Gemini stand-ins, and `scripts/capture-cinematic.mjs` accepts an existing preview URL. No hosting project, deployment, access grant or infrastructure was created.

## Verification and baseline limitations

The runtime source commit above was verified before pushing. The prior draft’s test results are not used as a production-readiness claim for this revision.

| Check                                                               | Current cloud result                                                                                                        |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Production build / typecheck                                        | Passed                                                                                                                      |
| Unit tests                                                          | 49 passed / 150 assertions                                                                                                  |
| Changed-file ESLint / diff check                                    | Passed, no errors or warnings                                                                                               |
| Full Chromium / 360 mobile / forced-colors matrix, retries disabled | 630 passed, 38 existing conditional skips, 1 careers rate-limit failure after repeating the matrix on the same local server |
| Full conversion suite after restarting the local server             | 38 passed, 1 desktop-only skip, no failures; the careers failure above resolved with the original strict assertion          |
| Signed CTA isolation stress check                                   | 15 passed across the three projects, no retries; unique synthetic referrer proves the record belongs to that browser        |
| Chromium desktop / Android route and navigation suite               | 8 passed, 1 desktop-only menu skip, 1 existing AEXOS hydration failure                                                      |
| SEO crawl                                                           | One unchanged engagement-model description-length failure                                                                   |
| Forbidden terms / admin-link audit                                  | Passed                                                                                                                      |

All 631 unique matrix checks have passed across the complete matrix and fresh-server conversion rerun. This is explicitly not a claim that the last complete local matrix had zero failures. The final PR CI runs in a fresh server process and is monitored at the review head. No success assertion, limit or skipped-test condition was weakened.

Already verified in this cloud environment: production build; typecheck; 49 unit tests / 150 assertions; changed-file ESLint; forbidden-terms bundle scan; admin-link audit; narrative/document WCAG scans; first-viewport desktop/mobile CTA; scroll down/up and refresh; keyboard service selection; reduced motion; no-JavaScript fallback; service and product links.

Full repository lint has **128 errors and 10 warnings**. A clean checkout of main at `a1230f65fbb323aa342ad7dc1cab336812a57aa8`, using the same dependencies, has **130 errors and 10 warnings**. No lint rules were suppressed. The deterministic local SEO crawl has one unchanged baseline failure: `/engagement-model` description is 162 characters against its 159-character limit; the revised homepage metadata, social tags and JSON-LD are synchronized.

The Chromium public-route matrix exposed an existing `/products/aexos` text hydration mismatch (React #418). Repeated fresh mobile loads reproduced it on clean main (7/8 loads) and this revision (8/8). The AEXOS route and its components are unchanged in this revision; the assertion remains strict and the failure is reported. Other route/navigation checks passed. This is a remaining baseline issue, not a passing cross-browser result.

Additional local WebKit and Firefox browser downloads are blocked by the cloud network (HTTP 403 from the Playwright CDNs). Their absence is an environment blocker, not a skipped passing test. Existing Safari CI will be monitored at the new head; full Firefox/WebKit route coverage remains unverified here.

## Current local Lighthouse comparison

Single Lighthouse 12.8.2 samples with the same installed Chromium and node production server settings, captured on this cloud host. Some independent QA overlapped and Google Fonts is blocked here; these samples are not production telemetry or the pipeline’s three-run median.

| Result               | Main desktop | Revision desktop | Main mobile | Revision mobile |
| -------------------- | -----------: | ---------------: | ----------: | --------------: |
| Performance          |           90 |               88 |          59 |              59 |
| Accessibility        |           97 |              100 |          97 |             100 |
| SEO / best practices |     100 / 96 |         100 / 96 |    100 / 96 |        100 / 96 |
| LCP                  |       1770ms |           1941ms |      9811ms |         10061ms |
| TBT                  |          0ms |              0ms |       100ms |            23ms |
| CLS                  |            0 |                0 |           0 |               0 |

Desktop LCP is inside the existing 2500ms budget in both samples. The 3500ms mobile LCP budget fails in both, and mobile performance is still below the 85 warning threshold. This revision does not solve that baseline performance issue. The shared best-practices penalty reflects the blocked font request reported above. No production promotion is authorized by these results.
