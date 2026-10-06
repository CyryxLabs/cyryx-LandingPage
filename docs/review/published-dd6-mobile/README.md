# Local mobile review of the published source

These are real Chromium screenshots at 360×844 and 390×844, captured from an isolated local production build of **dd6dd838c70cdbb69ab975797984b198521430d3**. This is a **LOCAL reproduction of the published source**, not verification of the live deployment. The public preview remains unchanged; outbound preview access failed with an Envoy CONNECT 403 / ERR_TUNNEL_CONNECTION_FAILED. Environment, network and third-party behavior may differ.

The homepage and its motion source are identical between published dd6dd838 and PR head 31983a1f292b3adec38dd096b88240c64233a562. No forms were submitted. The 13.9-second recording scrolls through the existing scenes, returns to the top and refreshes; no page errors were observed. Captured 2026-10-05.

## Pixel findings

1. **The main CTA is visible on the first screen.** Hero height is 698px at 360 and 713px at 390. This preserves immediate contact, but the microcopy, secondary link and assistant link compete below it.
2. **The illustration is too small to explain the work.** The hero diagram is 320×100 /350×109px. Its SVG text sizes of 8–14 units in a 640-unit viewBox render at approximately 4–7.7 CSS pixels. It reads as decorative stationery, rather than a substantial system or product transformation. The service stage repeats the same brief/logo/window motif.
3. **Service feedback is mostly below the visible viewport.** After a genuine click on “AI agents & applied AI” at 390px, scrollY=1493 and the service stage begins at y=646. The important change occurs further inside the illustration, obscured by the bottom sticky CTA and viewport edge. The visible response is primarily the teal heading. The full stage begins at document y=2139.
4. **Own products are named early, but demonstrated late.** The first-screen “Our products” link is visible; the actual bright product chapter begins at document y=4249 (390px) /4280 (360px), approximately five viewport heights. Services and a 1548–1621px invoice chapter intervene. Consulting begins at y=5273 /5357.
5. **The reading rhythm is repetitive.** Services, invoice and products reuse a numbered eyebrow, rule, sans/serif headline and paragraph. The invoice and product captures make that repetition visible. The first strong light-surface chapter arrives late.

## Bounded next design direction

Preserve the first-screen CTA and clear three-part company offer. Replace the repeated tiny diagram with one larger original build or truthful product demonstration, with readable mobile labels and a visible response next to its controls. Bring the own-product and consulting story closer to the opening; vary composition and pause length. Keep the invoice clearly illustrative and subordinate. These are diagnosed priorities, not a completed redesign or user visual approval.

## Files

- `LOCAL-published-dd6-360-01-hero.png` and `LOCAL-published-dd6-390-01-hero.png`: first screen.
- `LOCAL-published-dd6-390-02-offer.png`: service introduction.
- `LOCAL-published-dd6-390-03-service-visual.png`: repeated diagram.
- `LOCAL-published-dd6-390-06-service-control.png` /`LOCAL-published-dd6-390-07-after-service-click.png`: genuine selection, without programmatically scrolling to its result.
- `LOCAL-published-dd6-390-04-invoice.png` /`LOCAL-published-dd6-390-05-products.png`: chapter hierarchy and repeated composition.
- `LOCAL-dd6-mobile-scroll-refresh-review.webm`: short actual browser motion recording, compressed for review.
- `observations.json`: measured geometry and provenance.

Library transfer was attempted with the current supported helper, but its authenticated tools/list failed with a network error before preparation. No Library save is claimed. These historical captures are included in the candidate evidence commit for a real before/after comparison; they do not update or redeploy the preview. See [the candidate captures](../mobile-focused/README.md) for the new source and limits.
