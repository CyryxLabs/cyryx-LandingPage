# Cyryx — architectural opening and working illustration

Exact runtime/test source: **6242daa90bc43b3eaee9f6834238bf360fa8fe8e**. The following evidence commit changes documentation and sanitized captures only. Draft PR17 remains the review destination; final head and its exact-head CI are in the PR description.

These are **actual local production Chromium captures**, not verification of the published preview. The existing public preview still shows dd6dd838. The environment's external browser connection returns ERR_TUNNEL_CONNECTION_FAILED. No deployment occurred.

## Actual before and after

[Published-source before](../published-dd6-mobile/README.md) and [preceding mobile revision at718](https://github.com/CyryxLabs/cyryx-LandingPage/blob/718240e8eb2c19321f7c82d81a79e6506b708ee1/docs/review/mobile-focused/README.md) remain inspectable. The new source gives the mobile architecture its own focal area and replaces the generic workspace illustration immediately after the hero with a specific, labelled service-desk example.

| Current capture  | Evidence                                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Desktop1920×1080 | [Hero](LOCAL-1920-hero.jpg), [prepared visit](LOCAL-1920-visit-prepared.jpg), [actual motion](LOCAL-desktop-motion.webm)                                                                         |
| Phone390×844     | [Hero](LOCAL-390-hero.jpg), [request](LOCAL-390-request.jpg), [prepared visit](LOCAL-390-visit-prepared.jpg), [reduced motion](LOCAL-390-reduced.jpg), [actual motion](LOCAL-mobile-motion.webm) |
| Phone360×844     | [Hero](LOCAL-360-hero.jpg)                                                                                                                                                                       |

Screenshots use Playwright's native JPEG capture at quality88. Recordings contain actual browser frames encoded as VP9; they are not designed storyboards. The recordings cover opening → request → Prepare visit → Reset example → AEXOS → top → refresh → keyboard focus. No real form was submitted. [Measured geometry and console](LOCAL-observations.json), [recording observations](recording-observations.json), [source manifest](source.json), [all local Lighthouse samples](performance.json).

The sample is explicitly **Illustrative client application / sample data**. Its original request is “Please arrange an equipment inspection at Building B.” Work and Place retain that source. Prepare visit changes the local sample to “Visit draft prepared.” with “Equipment inspection · Building B · Ready for review”, retaining Source linked / Fields checked / Review next. Reset reverses it. This is an illustration of an application, not a customer result, a live booking or an intake form.

The first screen reads **AI products. Software, made real.** and “Our own AI products. Custom software for clients. Practical advice on what to build next.” Our products / Custom development / Consulting, the project CTA, short-brief explanation and assistant remain usable immediately.

All motion is finite and optional. The supplied Cyryx architecture opens once on desktop; phone uses a finite camera movement on one smaller portrait still; a Building B label travels from its source into the sample Place field. Native scrolling is unpinned. Reduced motion and Save-Data retain complete readable content, hiding the entrance doors/light. Product, service-selection, consulting and subordinate invoice sections remain from the preceding reviewed source.

[Full copy, motion, QA and limitations](../../cinematic-review.md). Creative acceptance and the separately coordinated interactive preview remain pending; this evidence is not a production-readiness claim.
