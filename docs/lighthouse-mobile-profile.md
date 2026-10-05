# Correct mobile Lighthouse measurement

This measurement-only follow-up continues draft [PR17](https://github.com/CyryxLabs/cyryx-LandingPage/pull/17), from `7dd806c40f9305b7b1eea7763444be673e9e1f72`. No frontend/runtime files change in this follow-up. Final head, CI result and downloadable CI artifacts are recorded in the PR.

## Cause and correction

The former mobile template combined `preset: desktop` with the obsolete `emulatedFormFactor: mobile`. Lighthouse CI 0.14.0 uses Lighthouse 12.1.0; the resulting report at the previous head had `formFactor: desktop`, desktop viewport and desktop network/CPU settings. Its score is not a mobile result.

The template now uses `formFactor: mobile` with Lighthouse's actual default mobile simulation. The workflow also verifies **every exported report's effective settings**, independently of the performance assertions. A mislabeled desktop report, disabled mobile emulation, altered CPU/network profile or missing reports fails that verification. The profile verification runs even when performance assertions fail. LHCI autorun still exports the HTML/JSON reports after assertion failure, and the existing always-run artifact upload remains intact.

| Effective setting | Former job labelled mobile | Corrected mobile |
| ----------------- | -------------------------: | ---------------: |
| Form factor       |                    desktop |           mobile |
| Screen mobile     |                      false |             true |
| Viewport          |                   1350×940 |          412×823 |
| Pixel density     |                          1 |             1.75 |
| Simulated RTT     |                       40ms |            150ms |
| Throughput        |                  10240Kbps |       1638.4Kbps |
| CPU slowdown      |                         1× |               4× |

All assertions, thresholds, error/warning levels, sample count and artifact-upload configuration are preserved. This was checked against the previous template: performance 0.85 (warning), accessibility/SEO 0.95, mobile LCP 3500ms, TBT 300ms, CLS 0.1 and max-potential-FID 200ms. The desktop template is untouched. No reports or tests are suppressed, and a failed mobile budget still fails the job.

## Bounded local verification

The corrected template was rendered through the existing threshold renderer. The full LHCI 0.14.0 autorun used the existing production-build/server command and Lighthouse 12.1.0, with installed Chromium 151.0.7922.173. Only local port, installed-browser/no-sandbox configuration and filesystem output location were overridden for the cloud execution; performance settings and assertions were not overridden. Any integrations use the existing local CRM/Gemini stand-ins.

Three fresh mobile runs completed and all three exported profiles passed the new verifier. Median results:

| Metric              | Correct mobile result | Existing budget |
| ------------------- | --------------------: | --------------: |
| Performance         |                    60 |     ≥85 warning |
| LCP                 |                7368ms |   ≤3500ms error |
| FCP                 |                6653ms |               — |
| TBT                 |                55.5ms |          ≤300ms |
| CLS                 |                     0 |            ≤0.1 |
| Accessibility / SEO |             100 / 100 |       ≥95 / ≥95 |

LCP ranged **7367–7369ms** and performance was 60 in every run. LHCI returned **exit 1 for the LCP assertion**, then successfully wrote all three HTML/JSON reports. The profile verifier returned **exit 0**: the measurement is technically correct, while the performance budget is unmet. The actual mobile samples already collected before this configuration correction also missed the budget; this follow-up changes the measurement, not the page's performance. Old desktop-profile scores and these mobile scores are not comparable as a before/after optimization.

Negative verification cases rejected the archived desktop-as-mobile reports, a mobile report with desktop screen emulation, a mobile report with CPU slowdown 1×, and an empty report directory. The same archived reports passed when explicitly checked as desktop. Typecheck, changed-script ESLint, formatting/diff checks passed; production build completed through the full LHCI run. Runtime behavior and unit tests were not changed.

Raw local settings, metrics, budget definitions and assertion outcome: [mobile-profile-verification.json](review/mobile-profile-verification.json). Google Fonts is blocked by this cloud host, so local values are not claimed to predict exact CI or production numbers. The final CI artifact is the source for its own measurements.

## Remaining block and next step

The mobile LCP budget blocks a clean performance gate. Stop at this bounded diagnosis: inspect CSS/font delivery and other requests in the mobile critical path, then review one isolated loading change against the same real mobile profile and fixed budgets. This follow-up does not remove cinematic content, expand into bundle/visual refactoring or change hosting/font infrastructure to chase a score.

The previous Products-menu intermittency remains documented in PR17: its initial open assertion failed once before the outside click, then passed on retry. Menu/test code and assertions are untouched; its cause is not established. Other established lint, SEO-description and AEXOS hydration limitations remain in the earlier review notes. No merge, deployment, public preview, live lead/email submission or infrastructure/access change was performed.
