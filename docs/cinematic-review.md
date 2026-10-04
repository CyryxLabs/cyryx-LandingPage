# Cinematic homepage review

Review branch: `design/cinematic-cyryx-review`, from main `a1230f6`. This is separate from retention PR16. No merge or production deployment is authorized by this review.

The opening communicates AI products and custom software in one viewport, followed immediately by a clearly labelled illustrative invoice workflow. Services, the published AEXOS Core package, human authority, interactive evidence, public research and founder-led contact form a continuous narrative. The three visual moments are the metallic opening, the silver invoice crossing a human approval boundary, and the teal governance aperture. Existing brand imagery and GSAP provide native-scroll transformations; there is no pinning or scroll hijacking. Text remains visible without JavaScript or motion.

## Product and content boundaries

AEXOS is described at its evidenced published Core maturity, with existing product/npm links. Sample workflow and evidence are explicitly illustrative. There are no invented deployments, customer logos, certifications, results or team size claims. The existing MAAX discontinuation and permanent `/products/maax-studio` redirect remain unchanged. Other routes and public research/code links remain available.

## Preserved form inventory

| Surface         | Fields and behavior                                                                                                                                                                                                                                                                         | Contract                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `/start`        | Required name, work email, company, project type, problem and consent; optional outcome, why-now, role, company website, stage, investment, timeline, systems, decision and notes. Existing privacy link, validation, two-step flow, attribution, assistant summary and `website` honeypot. | Existing `POST /api/public/contact`; signed CRM forwarding, rate limits, success, first-read and error states. |
| `/brief`        | Existing eight-step requirements intake, contact details, privacy consent and optional marketing opt-in; local draft recovery, AI drafting, attachments and captions. Existing `nickname` honeypot and minimum-fill-time protection.                                                        | Existing init, signed upload and submit endpoints; signed CRM records and idempotency.                         |
| `/careers`      | Name, email, area, optional profile/context, consent and `website` honeypot. Existing validation, privacy notice and success/error states.                                                                                                                                                  | Existing `POST /api/public/talent`.                                                                            |
| Cyryx assistant | Existing question stream and human handoff; name, work email, company, project type, problem, consent, honeypot, transcript summary and attribution. Existing dialog focus/keyboard behavior.                                                                                               | Existing `POST /api/public/assistant` and contact handoff.                                                     |
| `/contact`      | Existing contact hub and email links; no native form.                                                                                                                                                                                                                                       | Unchanged.                                                                                                     |

No form component, backend endpoint, API payload, legal page or integration configuration was changed. Homepage CTA attribution and existing analytic event hooks are retained. All synthetic submission tests use local route mocks or the repository's local CRM/Gemini stand-ins, never live records or email recipients.

## Reproduce the local review

1. Install from the unchanged lockfile and build with `LIGHTHOUSE_BUILD=1` and `VITE_ASSISTANT_ENABLED=true`.
2. Run `node tests/support/mock-gemini-server.mjs` on port 4599.
3. Serve `.output/server/index.mjs` on 4175 with the same local CRM/Gemini environment documented in `.github/workflows/quality.yml`.
4. Set `PLAYWRIGHT_USE_PRODUCTION_SERVER=1`; run the original accessibility config and `playwright.cinematic.config.ts`. The latter preserves the five-browser public-route/navigation matrix against the built site.
5. Run `node scripts/capture-cinematic.mjs`; `REVIEW_BASE_URL` can select an existing public branch preview. The script writes review captures and measured runtime/layout results outside the repository.

Tests replaced for the old pinned image-sequence hero now verify the actual native-scroll poster transitions, image failure fallback, first-screen content/CTA, reduced motion, no-JavaScript content and absence of bulk frame downloads. Existing form, route, SEO, security, mobile navigation and keyboard contracts remain tested. Sitemap navigation now follows the existing sitemap index rather than interpreting its child sitemap URLs as page URLs.

## Baseline limitations

The clean main worktree at `a1230f6` produced 130 ESLint errors and 10 warnings; the redesign produces 128 errors and the same 10 warnings. New and changed files are checked separately. Existing errors have not been suppressed.

The local SEO crawl's sole failure is the unchanged `/engagement-model` description (162 characters against the crawler's 159-character maximum). The exact source is identical to main; homepage metadata, canonical/social tags and JSON-LD are updated and tested.

The reported PR16 Safari security reveal timeout did not reproduce: the unchanged main Safari layout suite passed all three tests before development. The final redesign suite retains the security visibility check and its timeout.

## Visual review and measured results

Final verification: production build and typecheck passed; 49 unit tests / 150 assertions passed; the original accessibility/content/SEO/motion/form matrix passed 631 tests with 35 existing conditional skips, zero failures and zero flaky results (272.45s). The five-browser public-route/navigation matrix passed 22 tests with 3 desktop-only mobile-menu skips (43.34s). Changed-file ESLint passed with zero errors/warnings; the full repository has the baseline limitations above. The forbidden-terms bundle scan and admin-link audit passed. Signed brief uploads, consent/validation, assistant streaming/handoff, all four submission surfaces' error/interruption/retry flows, keyboard focus, mobile menu, up/down scroll, no-JavaScript and reduced-motion behavior were verified locally. The unchanged baseline Safari suite also passed its three checks.

The final captures were visually inspected at 1920 x 1080 and 390 x 844, including mobile WebKit, every narrative section, and full-page static fallback. Opening heights were 1080px desktop and 844px mobile (WebKit: 843.984px). The primary CTA was visible in each first viewport. All three captures measured zero horizontal overflow, a refreshed top position of 0, no incomplete images, no page/console errors, and zero running animations with reduced motion.

Review images: [desktop opening](review/desktop-hero.png), [mobile opening](review/mobile-hero.png), [desktop workflow](review/desktop-controlled-execution.png), [mobile approval moment](review/mobile-invoice.png), [services and product](review/desktop-operating-model.png), [mobile governance](review/mobile-security.png).

Library upload was attempted with the official batch helper, but this execution session did not expose Library's prepare-upload capability. No Library file was created. The branch images provide a persistent review artifact; full-page and additional Safari captures remain in the local `review-artifacts` directory outside the checkout.

Single Lighthouse 12 local samples, using the same settings and node production server for clean main and the redesign:

| Result               | Main desktop | Redesign desktop | Main mobile | Redesign mobile |
| -------------------- | -----------: | ---------------: | ----------: | --------------: |
| Performance          |           83 |               84 |          58 |              58 |
| Accessibility        |           97 |              100 |          97 |             100 |
| SEO / best practices |    100 / 100 |        100 / 100 |   100 / 100 |       100 / 100 |
| LCP                  |       2184ms |           2109ms |     11248ms |         10752ms |

Redesign total blocking time was 0ms on both samples; CLS was 0.006 desktop and 0.016 mobile. The existing mobile LCP budget (3500ms) fails in both versions, and the 85 performance warning threshold misses in both. These are local samples, not production measurements or the pipeline's three-run median. This branch is for design review; a production promotion should address the existing performance budget and repository baseline failures separately.

The launcher test waits for the existing `data-cyryx-scroll-ready` signal before simulating user scroll, because hydration is published before the bootstrap's two-frame scroll reset. It still asserts hidden-at-top, visible-after-scroll, hidden-on-return and visibility on product routes. Repeated local matrices also reached the unchanged careers limit of five introductions per connection per hour; the final matrix starts a fresh local process without weakening spam protection.
