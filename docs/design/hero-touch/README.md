# Hero film: "the touch" (2026-11-15)

A hand in a suit sleeve touches a pane of dark glass, and teal pathways spread
from the point of touch: a person sets the work in motion and stays in control
of it. Chosen after the founder rejected the operations-room scene and pointed
to motionsites.ai as the style reference (one cinematic generated shot, short
headline, smooth motion).

Generated on the founder's Higgsfield account. Nothing here is stock footage,
a client, or a real product screen.

## Steps

1. Still, Nano Banana Pro, 16:9 (wide) and 9:16 (tall), 2 credits each.
2. Motion, Seedance 2.5, image-to-video from each still, 5 s, 1080p, no sound,
   80 credits each.
3. Web encode: H.264, CRF 24, `-movflags +faststart`, no audio track.
   First and last frames exported as WebP for the still and the reduced-motion
   still.

## Prompts

Wide still:

> Cinematic macro photograph, 16:9, film still. A human hand in the cuff of a
> dark tailored suit sleeve enters from the right, index finger gently touching
> a thin floating sheet of dark smoked glass. From the exact point of touch,
> fine luminous teal light lines spread across the glass like branching
> pathways of a system waking up, with small glowing nodes. Pure black studio
> background, deep shadows, soft silver rim light on the hand, shallow depth of
> field, subtle reflections, graphite and silver tones with teal as the only
> accent color. Large empty dark space on the left third of the frame. Elegant,
> enterprise, premium, photorealistic. No text, no letters, no logos, no
> interface screens, no robots.

Tall still: the same, as a vertical 9:16 frame with the glass and the point of
touch in the upper half and the lower 40 percent empty and dark.

Motion (both):

> Use the reference image as the first frame. Slow, calm, premium cinematic
> shot. The camera pushes in very slowly toward the glass. The hand stays almost
> still, the fingertip resting on the glass. From the point of touch, pulses of
> teal light travel outward along the existing lines, new thin branches grow
> and reach the edges of the glass, and the small nodes light up one after
> another, like a system coming online. Subtle reflections drift across the
> smoked glass; faint dust in the light. Black background, no other changes, no
> new objects, no text, no camera shake, no cuts.

## Files

| File                                                  | What                                    |
| ----------------------------------------------------- | --------------------------------------- |
| `public/media/hero-touch-1920.mp4`                    | wide film, 1920x1080                    |
| `public/media/hero-touch-tall.mp4`                    | tall film, for widths under 900 px      |
| `public/media/hero-touch-1920.webp`, `-1280.webp`     | wide first frame (first paint)          |
| `public/media/hero-touch-end-1920.webp`, `-1280.webp` | wide last frame (reduced motion)        |
| `public/media/hero-touch-tall.webp`, `-tall-end.webp` | tall first and last frames              |
| `public/media/network-aerial.webp`                    | section picture, "What Cyryx Labs does" |

The film builds up, so it plays once and holds on its last frame.
