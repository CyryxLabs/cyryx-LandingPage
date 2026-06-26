## Goals

1. Disable submit until consent is checked + show specific error message.
2. Privacy Policy link: open new tab with `rel="noopener noreferrer"` (already set) + add aria attributes for accessibility.
3. Ensure consent value flows through payload to the server and is logged.
4. Add tests covering: initial scroll restoration to top, client-side consent validation, server-side consent rejection.

## Implementation

### 1. `src/components/cyryx/ContactSection.tsx`
- Disable the submit button when `consent` is false (in addition to loading state). Add `aria-disabled` and a tooltip/help text "Accept the Privacy Policy to enable sending".
- Show consent-specific inline error immediately on submit attempt when unchecked ("Please accept the Privacy Policy to continue") — already wired; ensure it also renders helper hint when not yet erroring.
- Add `aria-label="Cyryx Labs Privacy Policy (opens in new tab)"` and a visually-hidden "(opens in new tab)" span on the `/privacy` link. Keep `target="_blank" rel="noopener noreferrer"`.
- Ensure the payload sent to `submitContact` includes `consent: true` (already in `parsed.data`). Add an explicit assertion comment.

### 2. `src/lib/contact.functions.ts`
- Already validates `consent: z.literal(true)`. Add `consent: data.consent` to the console.log payload so it's clearly recorded in backend logs.

### 3. Tests

Add two test files (Playwright e2e since vitest isn't set up; Playwright is already configured):

**`tests/accessibility/scroll-restoration.spec.ts`**
- Load `/`, scroll down, reload → expect `window.scrollY === 0`.
- Load `/#contact` directly → expect `window.scrollY === 0` and URL hash stripped.

**`tests/accessibility/contact-consent.spec.ts`**
- Client validation: fill name/email/message but leave consent unchecked → click submit → expect inline error text "Please accept the Privacy Policy to continue" visible, and assert submit button is disabled (or remains enabled but blocked — verify which we ship).
- Privacy link accessibility: assert `target="_blank"`, `rel` contains `noopener` and `noreferrer`, and `aria-label` present.
- Server validation: POST directly to the server function endpoint with `consent: false` payload → expect non-2xx (Zod rejection).

Add corresponding Playwright project entries in `playwright.config.ts` if needed (or rely on default `hero-a11y-chromium` project which already serves `bun run dev`).

### 4. No changes to GSAP or unrelated files.

## Validation

- Run `bun run test:a11y` locally via the Playwright dev server.
- Manual check: load `/`, scroll, reload — stays at top. Submit without consent → error + button disabled.
