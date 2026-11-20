# Hero film

Source of `public/media/hero-film-1600.mp4`, `hero-film-960.mp4` and the two posters.

The film is a web page (`film.html`, 1600×900) with a deterministic timeline: `window.setT(seconds)` draws any moment of the 24-second loop. `render.py` films it frame by frame with Playwright, one encoded file per scene, and the scenes are joined without re-encoding.

## Chapters

| Time      | Chapter                | What is on screen                                                         |
| --------- | ---------------------- | ------------------------------------------------------------------------- |
| 0–5 s     | AI systems             | Architecture: your systems, integration, AI agents, governance            |
| 5–10.5 s  | Workflow automation    | A workflow with a human approval, labelled as illustrative                |
| 10.5–15 s | System integration     | The systems an AI layer connects to                                       |
| 15–20 s   | Governance and control | Audit log, approval rule, spend against a limit, labelled as illustrative |
| 20–24 s   | Closing card           | Cyryx Labs wordmark, "AI technology company"                              |

No product appears in the film (founder decision, 2026-11-13). The first cut, with the Onyx capture and the AEXOS cycle, is kept as `film-v1-products.html` for reference; it needs `hq/` frames from `public/media/onyx/cc-hq.mp4` and is not used on the site.

`src/components/site/HeroFilm.tsx` holds the same chapter times (`HERO_CHAPTERS`, `CLOSING_AT`) and the poster time (`POSTER_AT`). Change them together.

## Rebuild

The page expects, next to `film.html`, a folder `assets/` with the four fonts from `public/fonts/` and `cyryx-brand-wordmark.png` from `src/assets/`.

Then (paths in `render.py` point at `/tmp/film`; adjust as needed):

```bash
python3 render.py            # all scenes, or: python3 render.py 2   (one scene)
printf "file 's%d.mp4'\n" 0 1 2 3 4 > out/list.txt
ffmpeg -f concat -safe 0 -i out/list.txt -c copy out/master.mp4
ffmpeg -i out/master.mp4 -an -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart -g 60 hero-film-1600.mp4
ffmpeg -i out/master.mp4 -an -vf scale=960:540 -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart -g 60 hero-film-960.mp4
ffmpeg -ss 3.2 -i out/master.mp4 -frames:v 1 poster.png   # then convert to WebP
```

Scenes fade to the shared background at every cut, so one scene can be rendered again and joined without touching the others.
