# Cyryx Labs Hero Film — Scroll-Driven Creative Brief

## Purpose

Create a premium, single-shot hero film that visualizes the Cyryx Labs promise: enterprise AI moving from fragmented activity to controlled, governed execution. The film will be paused and scrubbed by page scroll on desktop, so every frame must work as a deliberate still and the movement must look natural both forward and backward.

## Generation prompt

Use the following prompt in English. Generate without audio.

> A cinematic, ultra-premium enterprise technology film designed specifically for scroll-controlled playback. One continuous unbroken shot, no cuts. Inside a vast near-black architectural command chamber built from matte onyx, smoked glass and brushed titanium, a restrained vertical cyan energy line in Cyryx teal (#19C7C0) appears in the right third of frame. The camera performs an extremely slow, perfectly stable forward dolly. At first the system is dormant and fragmented: sparse dim signal paths, disconnected geometric modules, subtle incomplete reflections. As the camera advances, the signal paths align into ordered channels, pass through precise abstract control gates, and converge into a calm central execution core. The final state is not explosive; it is controlled, resolved and authoritative — a monolithic governed infrastructure online, with a single clean teal line and disciplined metallic geometry. Preserve the left 45 percent of every frame as dark, low-detail negative space for a headline and calls to action. Keep all important visual action between 58 and 78 percent of frame width, vertically centered, and safe for a center crop. Low-key cinematic lighting, deep blacks with visible detail, polished titanium highlights, subtle volumetric atmosphere, physically plausible reflections, restrained bloom, high-end enterprise brand film, architectural precision, quiet confidence, no visual clutter. Constant exposure and color grade. Motion must be monotonic, slow and reversible, with no sudden acceleration. Every frame must look like a finished key visual. End with a stable two-second hold on the fully aligned execution core.

## Negative prompt

> No text, letters, numbers, logos, watermarks, interfaces, dashboards, code, holographic screens, people, faces, hands, humanoid robots, spaceships, cyberpunk city, neon rainbow colors, purple or magenta, explosions, sparks, lightning storms, frantic particles, camera shake, handheld movement, whip pans, zoom jumps, lens warping, morphing architecture, geometry flicker, temporal inconsistency, hard cuts, dissolves, scene changes, crushed blacks, blown highlights, excessive bloom, shallow-focus pulsing, compression artifacts.

## Required output

- Master: 3840×2160 or 1920×1080, 16:9, 24 fps, 12–16 seconds.
- One continuous shot; no edit, transition, logo, copy or audio baked into the video.
- First 1.0 second and last 2.0 seconds must be visually stable.
- The left 45% must remain consistently quiet and dark across the full duration.
- Deliver the highest-quality MP4 available. Do not optimize it in the generation platform.
- Also export the first frame as a lossless PNG for the poster fallback.

## Integration notes

Send the original master to the development team. It will be color-checked, cropped and encoded into:

- `public/media/cyryx-hero-1080.mp4`
- `public/media/cyryx-hero-720.mp4`
- `src/assets/cyryx-hero-poster-1920.webp`
- `src/assets/cyryx-hero-poster-960.webp`

The web encodes must use H.264, yuv420p, constant 24 fps, `faststart`, and frequent keyframes (GOP 6–12) so ScrollTrigger can seek smoothly.

## Acceptance test

Reject the generated film if any of these are true:

- the subject repeatedly crosses behind the left-side copy;
- a hard cut or location change appears at any point;
- scrubbing backward exposes morphing or temporal artifacts;
- the main event is an explosion instead of a controlled system state change;
- the opening or final frame cannot serve as a premium static poster;
- the visual could plausibly belong to a gaming, crypto or generic cyberpunk brand.
