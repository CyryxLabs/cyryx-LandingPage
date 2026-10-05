# Static asset compression

This loading-only follow-up continues draft [PR17](https://github.com/CyryxLabs/cyryx-LandingPage/pull/17) from `52be44e2a506491ba4fe958100e3739939f0d545`. The runtime change is one common Nitro option: `compressPublicAssets: { gzip: true, brotli: true }`, applied to both the standalone Node build and the normal Vercel build. Existing presets, routes, cache rules, visual content, motion, forms and Lighthouse budgets are unchanged. The final head and exact-head CI outcome are recorded in PR17.

## Delivery confirmed over HTTP

The installed Nitro version is `3.0.260603-beta`; its default disables public-asset compression. Generating files alone was not treated as success. Fresh Node processes served the builds, and raw HTTP requests checked the actual body bytes, `Content-Encoding`, `Content-Length`, MIME type and decoded SHA-256.

| Main asset | Identity body |     gzip body |   Brotli body |
| ---------- | ------------: | ------------: | ------------: |
| Stylesheet | 200,770 bytes |  31,194 bytes |  25,160 bytes |
| JavaScript | 412,466 bytes | 125,555 bytes | 108,124 bytes |

For the original asset URL, explicit `gzip`, `br` and `gzip, br` headers returned the corresponding compressed body with the correct encoding/length and `Vary: Accept-Encoding`. Absent, `identity` and unsupported encoding headers returned the intact original. CSS, main JavaScript and route CSS all returned HTTP 200 and decoded to their original hashes. The browser's Lighthouse network report independently confirmed **25,510 stylesheet transfer bytes** and **108,483 main-script transfer bytes**, including response headers. This is real negotiated delivery, without changing URLs, intercepting requests or replacing the server.

Both build presets generated 84 compressed variants. Every variant decoded exactly once to the original file, ruling out double compression in the generated payloads. The normal `.vercel/output/config.json` retains the existing media/asset cache rules, filesystem handler and server fallback. No forced `Content-Encoding` header or compression middleware was added. Original static assets remain present, and the edge can continue serving the canonical original URLs using its existing compression. No deployment was performed, so candidate production-edge behavior has not been measured.

An anonymous live read of the existing public site established that its Vercel delivery already uses Brotli: its different published stylesheet decoded to 210,108 bytes and transferred a 33,303-byte encoded body; its main script decoded to 412,167 bytes and transferred a 128,966-byte encoded body. That published build is `4c2146ec051c`, not PR17. These observations explain the previous Node/production delivery discrepancy; they do not establish PR17 production performance. This option precompresses static assets and does not itself compress dynamic SSR HTML.

## Paired true-mobile measurement

The baseline and candidate were built from the same source/dependencies, using the fixed build tag `52be44e2a506` in both to remove timestamp-driven chunk differences. The proposed compression option was the sole build-option difference. **All 77 original generated assets have identical names and bytes**; only compression companions are added. Both frozen bundles were served independently by real Node processes and passed hydration/local-resource preflight before measurement. An earlier local measurement attempt reached a stale process after rebuilding and was discarded; none of its reports are included in these samples.

Lighthouse **12.1.0**, the same version as LHCI 0.14.0, measured three fresh samples per version, alternating before/after and after/before. No build or functional suite ran during the final series. The profile verifier passed all six reports: mobile 412×823 at DPR 1.75, simulated RTT 150ms, throughput 1638.4Kbps and CPU slowdown 4×. Chromium is 151.0.7922.173; only the installed browser, local port and no-sandbox execution flag differ from CI. The assistant is disabled in both measurement builds, matching the existing Lighthouse job; functional QA separately enables it as the existing functional CI does.

| Median                       |          Before |         After |
| ---------------------------- | --------------: | ------------: |
| Performance                  |              59 |            85 |
| LCP                          |          7373ms |        3618ms |
| FCP                          |          6690ms |        2766ms |
| TBT                          |          94.5ms |          76ms |
| CLS                          |               0 |             0 |
| Total page resource transfer | 1,223,670 bytes | 493,663 bytes |
| Accessibility / SEO          |       100 / 100 |     100 / 100 |

LCP ranged **7362–7513ms before / 3613–3620ms after**, with no overlap. Median LCP improved about **50.9%**, and resource transfer fell **59.7%** in every sample. No CPU improvement is established by this small series. Google Fonts is blocked in both local versions, so local numbers are not production telemetry or a prediction of exact CI scores. Best practices remains the shared 96 locally.

**The existing mobile LCP budget still fails.** LHCI's actual assertion command checked the three candidate reports against the unchanged rendered configuration and returned exit 1: even its optimistic 3612.5631ms value exceeds 3500ms. Performance meets the 85 warning threshold locally; other candidate assertions pass. No threshold, assertion level, profile or sample count in the repository was modified. CI reports/export/profile verification remain enabled on budget failure.

## Functional and visual verification

Normal Vercel build and repeated standalone Node builds passed. Typecheck, changed-file ESLint, formatting and diff checks passed. The existing unit suite passed **49 tests / 150 assertions**. Full ESLint still reports **128 errors / 10 warnings in unchanged files**; the modified config has no lint errors.

The final production-browser suite, with the assistant enabled and local CRM/Gemini stand-ins, passed **182 tests / 1 existing conditional skip / no failures or retries** across desktop Chromium, 360px mobile and forced colors. It covers cinematic content/WCAG checks, keyboard and reduced-motion service selection, hero/CTA visibility, menu interactions, SEO metadata/JSON-LD, MAAX redirects, signed conversion events, `/start`, careers and assistant streaming/focus contracts. An initial incorrectly configured functional attempt used the assistant-disabled measurement build: six assistant checks failed and one menu-selection timeout occurred. After rebuilding with the same assistant flag as functional CI, the complete targeted suite passed once without retries or altered assertions. The timeout's underlying cause is not established.

Fresh paired captures at **1920×1080 and 390×844**, with reduced motion, were inspected. The before/after PNG bytes are exactly identical in each profile. Both versions hydrated, retained first-screen copy/CTA, had no horizontal overflow or local resource/page errors, and survived scroll down/up and refresh. The loading change does not alter the earlier [desktop](review/performance-after-desktop.png), [mobile](review/performance-after-mobile.png) and [motion recording](review/mobile-motion.mp4) review story.

Sanitized HTTP responses/hashes, variant byte equivalence, effective profiles, six samples, budgets and capture checks: [asset-compression-verification.json](review/asset-compression-verification.json). Full exact-head CI reports are linked in PR17. Stop at this scoped delivery correction: no CSS/JavaScript refactor, merge, deployment, new public preview, infrastructure/access change, live lead/email submission or PR16 change.
