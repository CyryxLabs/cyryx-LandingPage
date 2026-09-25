#!/usr/bin/env node
// Polls the production site for the google-site-verification meta tag, then
// prints the next Google Search Console actions (verify + add site + submit
// sitemap). Safe to call from CI after a deploy.
//
//   node scripts/post-deploy-verify-gsc.mjs \
//     --site=https://www.cyryxlabs.com/ \
//     --token=Bc35xHMHU3j3kg9Iuj2it5vGwLp4IIXwzz_m-VSIk8g \
//     --timeout=600

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.replace(/^--/, "").split("=");
    return [k, rest.join("=") || "true"];
  }),
);

const SITE = (args.site || "https://www.cyryxlabs.com/").replace(/\/?$/, "/");
const TOKEN = args.token || "Bc35xHMHU3j3kg9Iuj2it5vGwLp4IIXwzz_m-VSIk8g";
const TIMEOUT_S = Number(args.timeout || 600);
const INTERVAL_S = Number(args.interval || 15);

const META_RE = new RegExp(
  `<meta[^>]+name=["']google-site-verification["'][^>]+content=["']${TOKEN}["']`,
  "i",
);

async function fetchHtml(url) {
  const r = await fetch(url, {
    headers: { "cache-control": "no-cache", pragma: "no-cache" },
  });
  return { status: r.status, body: await r.text() };
}

const started = Date.now();
let attempt = 0;
process.stdout.write(`Polling ${SITE} for google-site-verification meta tag...\n`);

while ((Date.now() - started) / 1000 < TIMEOUT_S) {
  attempt++;
  try {
    const { status, body } = await fetchHtml(SITE);
    if (status === 200 && META_RE.test(body)) {
      console.log(`✓ Meta tag live after ${attempt} attempt(s).`);
      console.log("\nNext steps in Google Search Console (search.google.com/search-console):");
      console.log(`  1. Verify ${SITE} with the HTML tag method.`);
      console.log(`  2. Submit ${SITE}sitemap.xml under Sitemaps.`);
      process.exit(0);
    }
    process.stdout.write(`  attempt ${attempt}: status=${status}, tag not yet present\n`);
  } catch (e) {
    process.stdout.write(`  attempt ${attempt}: ${e.message}\n`);
  }
  await new Promise((r) => setTimeout(r, INTERVAL_S * 1000));
}

console.error(`✖ Timed out after ${TIMEOUT_S}s waiting for meta tag at ${SITE}.`);
process.exit(1);
