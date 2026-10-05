# Homepage performance follow-up

This follows the commercial-story revision on draft [PR17](https://github.com/CyryxLabs/cyryx-LandingPage/pull/17), starting from `dfc0e1b6a441cb6528b00becfa69381746dbd0a2`. The remote head was checked before editing. The final reviewed SHA and CI outcome are recorded in the PR. Only the shared logo image delivery changes at runtime; homepage copy, motion, forms, endpoints, SEO, routes and the MAAX lifecycle remain unchanged.

## Concrete change

Lighthouse identified the two transparent logo PNGs as oversized: the mark renders at 35×56 CSS pixels and the wordmark at about 145×36 on desktop, but their sources were 320×512 and 1200×296. Together they transferred **509,136 bytes** on the first screen.

The logo now uses transparent WebP derivatives at 120×192 and 600×148, losslessly encoded after Lanczos resampling from the original brand artwork. These cover every current logo display at density 3× or higher. Together they total **58,068 bytes**, an **88.6% reduction**. The original PNGs remain untouched as `<picture>` fallbacks. Accessible names, loading priority, lazy loading, aspect ratios, CSS dimensions and positions are preserved. No dependencies or animation changes were introduced.

`<picture>` uses `display: contents` to preserve the existing layout. Its `<source>` elements are explicitly hidden so they do not become zero-width flex items and add gaps. A preliminary capture exposed that extra-gap regression; it was corrected before the final measurements and verification below.

Reproduction of the derivatives, using FFmpeg's libwebp encoder:

```sh
ffmpeg -i src/assets/cyryx-brand-mark.png -vf scale=120:192:flags=lanczos -c:v libwebp -lossless 1 -compression_level 6 src/assets/cyryx-brand-mark-display.webp
ffmpeg -i src/assets/cyryx-brand-wordmark.png -vf scale=600:148:flags=lanczos -c:v libwebp -lossless 1 -compression_level 6 src/assets/cyryx-brand-wordmark-display.webp
```

## Repeated comparison

The baseline production bundle was copied before editing and served independently. Both versions use the same cloud host, Chromium 151.0.7922.173, Lighthouse 12.8.2, Node server and local CRM/Gemini stand-ins. Each version was measured three times in each mode, alternating before/after and after/before, using a fresh browser/cache each time. No build or functional QA ran concurrently with the final measurement series. Desktop uses Lighthouse's desktop preset; mobile uses its actual default mobile screen/network/CPU simulation.

| Median              | Desktop before | Desktop after | Mobile before | Mobile after |
| ------------------- | -------------: | ------------: | ------------: | -----------: |
| Performance         |             88 |            92 |            59 |           60 |
| LCP                 |         1932ms |        1495ms |       10524ms |       7511ms |
| FCP                 |         1225ms |        1252ms |        6685ms |       6761ms |
| TBT                 |            0ms |           0ms |        20.5ms |       19.5ms |
| CLS                 |              0 |             0 |             0 |            0 |
| Page resource bytes |      1,758,269 |     1,308,114 |     1,674,542 |    1,224,387 |
| Accessibility / SEO |      100 / 100 |     100 / 100 |     100 / 100 |    100 / 100 |

Desktop scores ranged **88–89 before / 91–92 after**; LCP ranged **1855–1934ms / 1458–1535ms**, with no overlap. The median LCP improved about 22.6%. Mobile scores were 59 in all baseline samples and 60 in all candidate samples; LCP ranged **10069–10668ms / 7375–7512ms**, also without overlap. Page resource bytes fell by exactly **450,155 bytes in every pair**, after accounting for the small markup/module change.

FCP ranges overlap and its medians are slightly slower; no FCP improvement is claimed. Mobile TBT varies, and these runs do not establish a CPU improvement. The largest candidate CLS was 0.000133; its median remains zero. Google Fonts is blocked by the cloud network in both versions, so captures use the same available fallback and best-practices scores retain the shared font-request penalty. These measurements are repeatable local samples, not production telemetry or a guarantee of an identical CI score.

**The real mobile performance budget remains unmet:** LCP is still above 3500ms and performance below 85. CSS/font delivery remains material; broad CSS, font-hosting or router changes are outside this targeted follow-up. Existing global lint, engagement-model description length and AEXOS hydration issues are documented in [the initial review](cinematic-review.md).

The previous CI artifact labelled `lighthouse-report-mobile` has `configSettings.formFactor: desktop`, `screenEmulation.mobile: false`, width 1350 and desktop throttling. Its template uses `preset: desktop` plus the obsolete `emulatedFormFactor` setting. Therefore the earlier CI score of 86 must not be presented as a genuine mobile simulation. The pipeline is untouched in this change; correcting that configuration and addressing the real mobile budget is a separate follow-up.

Raw samples, settings, medians, ranges and asset hashes: [performance-comparison.json](review/performance-comparison.json).

## Visual and behavioral verification

The final browser captures were inspected at **1920×1080** and **390×844**, with density 1× and 3×. Image dimensions, image positions and the complete lockup bounds are identical before/after. No horizontal overflow or page/runtime errors occurred. The browser downloaded only the WebPs; removing their sources exercised the preserved PNG fallback without a layout change. The mobile menu opened and closed at both densities. Reduced motion was used for the paired static captures so both versions show the same complete scene; normal motion is unchanged and covered by the existing browser checks.

- Desktop: [before](review/performance-before-desktop.png) / [after](review/performance-after-desktop.png).
- Mobile: [before](review/performance-before-mobile.png) / [after](review/performance-after-mobile.png).
- Desktop logo at 3×: [before](review/performance-before-desktop-logo-3x.png) / [after](review/performance-after-desktop-logo-3x.png).
- [Logo geometry, current sources and request checks](review/logo-layout-checks.json).

Production build, typecheck, changed-file ESLint and diff checks passed. The existing unit suite passed **49 tests / 150 assertions**. The final targeted production-browser suite passed **227 tests / 1 existing conditional skip / no failures or retries**, across Chromium desktop, 360px mobile and forced colors. It covers the cinematic narrative/evidence tabs, header/footer/navigation, reduced motion, no JavaScript, hero rendering, SEO metadata, conversion contracts and form success/error/interruption/recovery with consent intact. Exact-head CI is recorded in the PR; no assertion or skip condition was weakened. All form checks use the existing local mocks/stand-ins, with no live lead or email delivery. No merge, deployment, public preview, infrastructure or access change was performed.

## Separate PR16 review

PR16 at `e1e6ce35f96b0335fe5c451e7e10464f31ad1840` changes only artifact retention and README. Its failing `security reveals should finish in WebKit` assertion runs the same legacy homepage/test as main; its retention changes do not alter that animation or test. The exact underlying reveal cause has not been isolated here.

PR17 replaces that section with always-visible “How we build” content. The opacity assertion itself remains, but the new section has no legacy `.cx-reveal` elements, so a green PR17 run does **not** prove the old reveal mechanism was fixed. The new narrative's visibility and behavior have their own browser/a11y checks. Review PR17's runtime change and PR16's retention change independently. If PR17 is later accepted through an authorized merge, updating PR16 onto the resulting main and rerunning Safari would verify that new base; neither branch is merged or mixed here.
