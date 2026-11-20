import { Fragment, type CSSProperties } from "react";

/**
 * A heading split into words, each inside its own mask (`.w > span`), so the
 * words can rise one after another. The words stay ordinary text separated by
 * normal spaces: the heading reads and copies as one sentence. `tail` keeps
 * punctuation attached to the last word.
 */
export function Split({
  text,
  from = 0,
  tail = "",
}: {
  text: string;
  from?: number;
  tail?: string;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="w">
            <span style={{ "--i": from + i } as CSSProperties}>
              {word}
              {i === words.length - 1 ? tail : null}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** A statement whose words light up while it scrolls past (`.w2`). */
export function Statement({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="w2">{word}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
