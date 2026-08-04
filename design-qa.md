# Design QA — Structural Aperture Internal Heroes

## Visual truth

- Source target: `C:\Users\ppetr\.codex\generated_images\019fc93a-d787-7123-bf8f-510c22d52b9f\exec-dc366aef-18b5-4ca4-b14e-926e46f7c86f.png`
- Source pixels: 1487 × 1058 PNG, treated as a 1x desktop composition.
- Implemented comparison capture: `C:\Users\ppetr\.codex\visualizations\2026\08\03\019fc93a-d787-7123-bf8f-510c22d52b9f\cyryx-option-3-implementation\company-desktop-1440x1024-v2.png`
- Implemented capture pixels: 1425 × 1013 JPEG from the in-app browser content frame at the 1440 × 1024 desktop viewport preset.
- Normalization: the source and implementation have matching aspect ratios (1.405 and 1.407). The source was proportionally normalized beside the implementation; no non-uniform scaling was used.
- Mobile proof: `C:\Users\ppetr\.codex\visualizations\2026\08\03\019fc93a-d787-7123-bf8f-510c22d52b9f\cyryx-option-3-implementation\company-production-mobile-390x844.png` (375 × 812 captured content frame at the 390 × 844 preset).
- State: `/company`, page top, default theme, no open menus or focus overlays.

## Comparison evidence

- Full-view comparison, reference left and implementation right: `C:\Users\ppetr\.codex\visualizations\2026\08\03\019fc93a-d787-7123-bf8f-510c22d52b9f\cyryx-option-3-implementation\company-reference-left-implementation-right.png`
- Focused hero comparison, reference left and implementation right: `C:\Users\ppetr\.codex\visualizations\2026\08\03\019fc93a-d787-7123-bf8f-510c22d52b9f\cyryx-option-3-implementation\company-focus-reference-left-implementation-right.png`
- Production desktop proof: `C:\Users\ppetr\.codex\visualizations\2026\08\03\019fc93a-d787-7123-bf8f-510c22d52b9f\cyryx-option-3-implementation\company-production-desktop-1440x1024.png`
- Migrated desktop routes: `C:\Users\ppetr\.codex\visualizations\2026\08\03\019fc93a-d787-7123-bf8f-510c22d52b9f\cyryx-option-3-implementation\migrated-heroes-desktop-contact-sheet.png`

## Required fidelity surfaces

| Surface            | Result | Evidence                                                                                                                                    |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Composition        | Passed | Editorial left column, architectural right edge, boundary note, and four-step rail preserve the approved Structural Aperture hierarchy.     |
| Typography         | Passed | The mockup serif was intentionally replaced with brand-approved Space Grotesk; Inter and IBM Plex Mono complete the moodboard stack.        |
| Color and material | Passed | Near-black and matte gunmetal dominate; teal is limited to traces and interaction emphasis. No neon field or game-HUD treatment remains.    |
| Asset quality      | Passed | The production WebP is a real 1920 × 1200 raster asset with a safe center and responsive crops; no CSS-drawn substitute is used.            |
| Copy hierarchy     | Passed | Category, outcome-led H1, concrete company description, CTAs, scope boundary, and lifecycle rail establish a clear enterprise-AI narrative. |
| Responsive layout  | Passed | The 390 × 844 state has no horizontal overflow; the primary CTA is 44 px high and remains in the first viewport.                            |
| Accessibility      | Passed | Semantic heading order, descriptive links, 44 px targets, restrained motion, and readable contrast are preserved.                           |
| Core interactions  | Passed | Primary CTA reached the context-aware `/start` form; secondary CTA reached `/solutions`; the form was not submitted during QA.              |
| Runtime integrity  | Passed | Production preview rendered desktop and mobile with no console errors or warnings during the tested journey.                                |

## Comparison history

1. Original Option 3 established the architectural aperture, but the serif display face, brighter glow, and stronger central geometry created avoidable luxury-editorial and sci-fi risk.
2. The refined visual target reduced geometry and glow, moved the structure toward the periphery, and kept the center quiet for copy.
3. The implementation aligned the concept to the official moodboard by using Space Grotesk, adding evidence-safe company language, preserving restrained teal, and validating the conversion journey in the production build.

## Remaining observations

- The architectural asset is deliberately subtle on desktop. Increasing its contrast would add spectacle but also increase cyberpunk/gaming risk.
- Long solution-detail titles create taller mobile heroes, but they remain readable, overflow-free, and conversion-capable.
- This report gates the Structural Aperture visual implementation. It does not waive the broader story's existing repository-wide lint and live Supabase persistence requirements.

final result: passed
