# Technical SEO Remediation — Canonicals, Discovery, Images, and Structured Data

**Status:** In Progress  
**Date:** 2026-08-17  
**Owner:** Technical SEO + Frontend  
**Source:** User-provided Ahrefs issue inventory and independently reproduced crawl evidence

## User need

As a prospective Cyryx Labs customer or search-engine crawler, I need every public page to expose one
clear, indexable, accessible, and internally discoverable canonical URL so that the website can be
understood and indexed without redirect ambiguity, duplicate sitemap entries, missing image text, or
invalid structured data.

As a prospective buyer using an AI answer engine, I also need Cyryx Labs to expose a consistent,
evidence-backed public entity and answer corpus so that ChatGPT, Claude, Perplexity, Google AI,
Bing/Copilot, and other permitted discovery systems can crawl, understand, attribute, and cite the
company accurately for relevant topics such as applied AI, AI strategy, AI governance, AI systems,
and operational control.

This expansion targets maximum eligible discovery, citation quality, and measurable share of voice.
It does not promise that Cyryx Labs will always appear, rank first, or be cited for any query: those
outcomes are controlled by independent search and AI systems, change over time, and depend on
authority, relevance, competition, user context, and each provider's retrieval and ranking policies.

## Reported baseline

| Issue | Ahrefs count |
| --- | ---: |
| Canonical points to redirect | 38 |
| Page has only one dofollow incoming internal link | 13 |
| Page has links to redirect | 1 |
| 3XX redirect | 34 |
| HTTP to HTTPS redirect | 2 |
| Redirect chain | 1 |
| Meta description too short | 2 |
| Missing alt text | 38 |
| 3XX redirect in sitemap | 26 |
| Page in multiple sitemaps | 25 |
| schema.org validation error | 3 |
| Google rich-results validation error | 1 |

The counts above are report inputs, not yet proof of the affected URLs. Implementation decisions must
trace to source inspection or a reproducible crawl of the current public site.

## Acceptance criteria

- [x] Every indexable public route returns a single-hop `200` canonical URL using the production
      HTTPS host; no canonical target redirects or conflicts with `og:url` or JSON-LD.
- [x] Internal navigation and contextual links reference final canonical destinations directly; no
      indexable page contains a dofollow link to a redirecting URL.
- [x] Every indexable route has at least two truthful, useful incoming internal links unless it is an
      explicitly documented leaf whose information architecture makes one link intentional.
- [x] Legacy aliases preserve user-safe redirects, but every redirect is necessary, direct, and free
      of chains or loops. HTTP requests continue to upgrade safely to HTTPS.
- [x] The sitemap authority contains only canonical, indexable, `200` URLs. Redirect aliases are
      excluded and no URL is duplicated across submitted sitemaps.
- [x] Every indexable route has a unique, accurate title and meta description with no mechanically
      short or duplicated description among the crawled routes.
- [x] Every rendered `img` has an explicit alternative-text decision: descriptive text for
      informative images and `alt=""` for decorative images. No filename or keyword-stuffed alt text
      is introduced.
- [x] Every JSON-LD block parses and validates against its declared schema.org type. Markup intended
      for Google rich results uses only supported, evidenced properties and makes no invented claims.
- [x] `robots.txt`, canonical tags, sitemap entries, redirects, metadata, Open Graph URLs, and JSON-LD
      agree on the same production URL policy.
- [x] Automated regression coverage fails on canonical-to-redirect, redirecting sitemap URL,
      duplicate sitemap URL, missing `alt`, invalid JSON-LD, and direct internal links to redirects.
- [x] Typecheck, focused lint, unit/contracts, accessibility/SEO tests, production build, and a local
      post-build crawl pass on one revision.
- [x] A live follow-up crawl is reported separately from local validation. No commit, push, PR,
      deployment, or Ahrefs re-crawl is claimed unless separately authorized and observed.
- [ ] `robots.txt` explicitly permits the official public search and AI user agents selected for
      discovery, including Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
      Claude-SearchBot, PerplexityBot, and Perplexity-User, while private, authentication, API,
      preview, administrative, and other protected routes remain disallowed. The policy is validated
      against current official provider documentation before release and does not weaken application
      authorization or expose non-public content.
- [ ] The public entity graph identifies Cyryx Labs consistently across Organization, WebSite,
      WebPage, Article, Person, Product, and Service nodes where applicable: one canonical entity ID,
      legal/brand name, canonical `www` URL, logo, verified same-as profiles, ownership relationships,
      authorship, publisher, topical expertise, and truthful service taxonomy agree across JSON-LD,
      visible content, metadata, sitemaps, and company/contact pages.
- [ ] A canonical `/llms.txt` and, only if justified by the content volume, `/llms-full.txt` return
      direct `200` responses with absolute canonical links. Each entry identifies the page purpose,
      source/provenance, publisher or author where known, and last-reviewed information when
      supportable; it contains no hidden claims, unverifiable credentials, duplicate URLs, redirects,
      staging hosts, or private endpoints. These files supplement rather than replace standard
      crawling, sitemaps, structured data, and visible HTML.
- [ ] Priority AI-governance, AI-strategy, applied-AI, engineering, and company pages provide concise
      answer-first passages, descriptive headings, definitions, decision criteria, limitations,
      FAQs only when visible and genuinely useful, and links to primary or authoritative sources.
      Claims about Cyryx Labs, methods, products, customers, outcomes, certifications, and metrics are
      either evidenced on the page or omitted; generated keyword pages and unsupported comparative
      or leadership claims are prohibited.
- [ ] IndexNow submission is implemented as a post-deploy operation for Bing-compatible discovery:
      the key is scoped and publicly verifiable, only canonical changed URLs from the deployed
      revision are submitted, the provider response and timestamp are recorded, retries are bounded,
      and no successful indexing or ranking is inferred from a successful submission receipt.
- [ ] AI visibility is measured from a versioned, intent-balanced prompt set covering brand,
      category, problem, comparison, and governance queries across supported answer engines. The
      baseline and recurring reports record presence, rank/position when exposed, citation URL,
      citation accuracy, sentiment, competitor share of voice, geography/language, model/provider,
      date, and reproducible evidence without automated query activity that violates provider terms.
- [ ] The public release gate verifies deployed `200` content, canonical/entity consistency,
      crawler accessibility, protected-route exclusions, `llms` absolute URLs, structured data,
      sitemap membership, IndexNow receipt, and representative live answer-engine observations.
      Commit, push, deployment, indexing, citation, share-of-voice improvement, or #1 ranking is never
      claimed without separately observed evidence; ranking and universal inclusion remain
      non-guaranteed external outcomes.

## Execution plan

- [x] Inventory public routes, redirects, sitemap sources, metadata, images, internal links, and JSON-LD.
- [x] Reproduce the issue classes against production and preserve a URL-level baseline artifact.
- [x] Correct shared URL policy and route-level defects without removing required legacy redirects.
- [x] Add deterministic SEO regression contracts and a post-build crawler.
- [x] Run repository quality gates and record exact results.
- [x] Request independent QA verdict and document remaining third-party recrawl boundaries.
- [ ] Inventory current official AI/search crawler user agents and document the allow/disallow policy,
      including protected-route boundaries and provider-specific verification evidence.
- [ ] Implement and test the canonical public entity graph, `llms` discovery files, and sourced
      answer-oriented content without unsupported commercial or ranking claims.
- [ ] Add deterministic regression contracts for AI crawler policy, entity consistency, provenance,
      absolute links, and protected-route exclusions.
- [ ] Add bounded IndexNow post-deploy submission and an evidence receipt tied to the deployed
      revision and canonical changed-URL set.
- [ ] Establish the AI-visibility baseline, measurement cadence, and provider-compliant reporting
      before evaluating improvement or competitive position.
- [ ] Deploy through the authorized release workflow and complete public search, crawler, schema,
      sitemap, `llms`, IndexNow, and representative answer-engine verification.

## Architecture decision

- `https://www.cyryxlabs.com` is the only canonical public origin used by metadata, Open Graph,
  JSON-LD, sitemaps, email templates, and operational verification scripts.
- `/sitemap.xml` is the submitted sitemap index. Its three child sitemaps are disjoint and contain
  all 26 indexable public URLs. `/sitemap-index.xml` remains a non-advertised `200` compatibility
  response for previously discovered clients.
- Legacy solution aliases remain direct permanent `308` redirects and preserve query parameters.
  They are never included in sitemaps or linked from canonical pages.
- Legal pages use the valid generic `WebPage` type. Unsupported `SoftwareApplication` rich-result
  markup was removed because price and review evidence do not exist and must not be invented.
- The remaining apex HTTP redirect chain is an edge-domain configuration concern. It can only be
  closed and certified after a Vercel domain change, deployment, and live crawl.
- AEO/GEO is treated as an evidence and distribution layer built on top of technical SEO, not as a
  mechanism that can force inclusion or ranking. Public HTML remains authoritative; `llms` files,
  crawler directives, IndexNow, and structured data are machine-readable discovery aids.
- Cyryx Labs has one public entity identity anchored to the canonical `www` origin. Topic pages may
  describe distinct capabilities and departments, but they must connect to that identity and must
  not create conflicting organizations, fabricated expertise, doorway pages, or unsupported claims.
- AI visibility is an observed external metric, not an acceptance claim. Release evidence separates
  source implementation, deployed accessibility, submission receipts, provider citations, and
  competitive ranking so that no stage is represented as proof of another.

## File list

- [x] `docs/stories/technical-seo-remediation-2026-08-17.md`
- [x] `public/robots.txt`
- [x] `public/llms.txt`
- [x] `public/1f0a899cb1fd4b29b1f6756b6d61da84.txt`
- [x] `docs/seo/ai-visibility-query-set.md`
- [x] `scripts/indexnow-submit.mjs`
- [x] `scripts/compliance-self-check.mjs`
- [x] `scripts/lighthouse-seo-audit.mjs`
- [x] `scripts/post-deploy-verify-gsc.mjs`
- [x] `scripts/seo-self-check.mjs`
- [x] `src/lib/site-url.ts`
- [x] `src/lib/sitemap.ts`
- [x] `src/components/cyryx/seo/seo.ts`
- [x] `src/components/cyryx/seo/AnswerPage.tsx`
- [x] `src/components/cyryx/Footer.tsx`
- [x] `src/data/seo-entities.ts`
- [x] `src/components/cyryx/v4/EvidenceBeforeClaims.tsx`
- [x] `src/lib/email-templates/_shared.tsx`
- [x] `src/lib/email-templates/newsletter-confirm.tsx`
- [x] `src/lib/email-templates/newsletter-welcome.tsx`
- [x] `src/lib/email/send-internal.server.ts`
- [x] `src/routes/api/public/newsletter.subscribe.ts`
- [x] `src/routes/index.tsx`
- [x] `src/routes/company.tsx`
- [x] `src/routes/research.$slug.tsx`
- [x] `src/routes/answers.index.tsx`
- [x] `src/routes/answers.what-is-ai-governance.tsx`
- [x] `src/routes/answers.what-is-governed-ai-execution.tsx`
- [x] `src/routes/answers.ai-execution-system-vs-ai-automation.tsx`
- [x] `src/routes/answers.what-are-command-gates-in-ai-systems.tsx`
- [x] `src/routes/answers.what-is-goal-grounded-generation.tsx`
- [x] `src/routes/answers.how-to-measure-ai-output-quality.tsx`
- [x] `src/routes/privacy.tsx`
- [x] `src/routes/products.maax-studio.tsx`
- [x] `src/routes/sitemap-company[.]xml.ts`
- [x] `src/routes/sitemap-index[.]xml.ts`
- [x] `src/routes/sitemap-products[.]xml.ts`
- [x] `src/routes/sitemap-solutions[.]xml.ts`
- [x] `src/routes/sitemap[.]xml.ts`
- [x] `src/routes/solutions.ai-governance-cost-control.tsx`
- [x] `src/routes/solutions.ai-integrations.tsx`
- [x] `src/routes/solutions.ai-product-engineering.tsx`
- [x] `src/routes/solutions.ai-websites-lead-systems.tsx`
- [x] `src/routes/solutions.applied-ai-systems.tsx`
- [x] `src/routes/solutions.governance-optimization.tsx`
- [x] `src/routes/terms.tsx`
- [x] `tests/accessibility/__snapshots__/jsonld.snapshot.json`
- [x] `tests/accessibility/ai-discovery.spec.ts`
- [x] `tests/accessibility/jsonld-pages.spec.ts`
- [x] `tests/accessibility/jsonld-snapshot.spec.ts`
- [x] `tests/accessibility/mobile-public-routes.spec.ts`
- [x] `tests/accessibility/robots-sitemap.spec.ts`
- [x] `tests/accessibility/route-metadata.spec.ts`
- [x] `tests/accessibility/seo-integrity.spec.ts`
- [x] `tests/accessibility/seo-metadata.spec.ts`
- [x] `tests/accessibility/sitemap-coverage.spec.ts`
- [x] `tests/support/seo-site-contract.ts`

## Validation evidence

- `bun run build` — PASS.
- `bun run typecheck` — PASS.
- `bun run test:unit` — PASS, 37/37.
- AEO discovery, robots, JSON-LD, and SEO graph Playwright gate — PASS, 36/36 after adding the
  second contextual source link for the new AI governance answer.
- `scripts/seo-self-check.mjs --site=http://127.0.0.1:4175` — PASS across 27 public pages,
  including current AI retrieval agents, canonical absolute `llms.txt` references, the CGP DOI,
  the new answer route, disjoint sitemap membership, and at least two non-self incoming sources.
- `scripts/indexnow-submit.mjs --dry-run=true` — PASS with strict `www` host binding and six
  changed canonical URLs. Live submission remains post-deploy evidence.
- Focused SEO Playwright gate — PASS, 57/57.
- Focused mobile-route plus SEO gate — PASS, 8 passed and 16 intentionally skipped outside the
  canonical project.
- Full Playwright matrix with four workers and one retry — PASS, 666 passed, 49 intentionally
  skipped, one unrelated header-dropdown test recovered on retry; process exit code 0.
- Fresh `bun run build:lighthouse` Node production artifact followed by
  `scripts/seo-self-check.mjs --site=http://127.0.0.1:3000` — PASS across 26 public pages,
  including canonical/OG agreement, unique sitemap membership, direct internal targets, alt
  decisions, JSON-LD contracts, metadata lengths, internal discovery, and permanent aliases.
- Focused ESLint for all changed SEO implementation and test files — PASS.
- Repository-wide `bun run lint` — baseline CONCERN: 3,158 existing findings (3,131 errors and 27
  warnings), predominantly repository-wide formatting outside this story. No bulk unrelated
  formatting was applied.
- `git diff --check` — PASS.
- Production deployment, Vercel apex redirect correction, Search Console submission cleanup, and
  Ahrefs re-crawl remain external release evidence and are not claimed by this local story.

## QA Results

**Formal AEXOS gate:** FAIL  
**Source/local SEO:** PASS  
**Public release:** NOT CERTIFIED

Independent QA reproduced the fresh `.output` artifact and confirmed the SEO crawler exits `0`
across all 26 public pages. The source implementation, canonical graph, disjoint sitemaps, metadata,
alt decisions, internal discovery, JSON-LD contracts, and direct permanent aliases pass.

The formal repository gate remains red because mandatory repository-wide lint reports 3,158
pre-existing findings even though focused lint for the changed SEO files passes. The story therefore
remains `In Progress`. Public certification additionally requires deployment, direct apex-to-`www`
Vercel redirect configuration, live schema/rich-result checks, Search Console sitemap cleanup, and a
new Ahrefs crawl.
