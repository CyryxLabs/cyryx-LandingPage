import { Fragment, type CSSProperties } from "react";

/**
 * Splits a heading into words so each can rise out of its own mask. The
 * words are ordinary text with normal spaces between them, so the heading
 * reads and copies as one sentence; the masks only exist under `html.hm-js`.
 */
export function Words({ text, from = 0 }: { text: string; from?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="hm-w">
            <span className="hm-wi" style={{ "--i": from + i } as CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/**
 * A paragraph whose words light up as it scrolls through the viewport
 * (`--wp` is set by the home motion hook). Fully readable without it.
 */
export function ScrubText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="hm-scrub" data-hm-scrub style={{ "--n": words.length } as CSSProperties}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="hm-sw" style={{ "--i": i } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
