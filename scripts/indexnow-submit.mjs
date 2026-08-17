#!/usr/bin/env node

const CANONICAL_ORIGIN = "https://www.cyryxlabs.com";
const DEFAULT_KEY = "1f0a899cb1fd4b29b1f6756b6d61da84";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const options = Object.fromEntries(
  process.argv.slice(2).map((argument) => {
    const [name, ...value] = argument.replace(/^--/, "").split("=");
    return [name, value.join("=") || "true"];
  }),
);

const site = String(options.site || CANONICAL_ORIGIN).replace(/\/$/, "");
const key = String(options.key || DEFAULT_KEY);
const paths = String(options.urls || "/")
  .split(",")
  .map((path) => path.trim())
  .filter(Boolean);

if (site !== CANONICAL_ORIGIN) {
  throw new Error(`IndexNow submissions are restricted to ${CANONICAL_ORIGIN}`);
}
if (!/^[a-f0-9-]{8,128}$/i.test(key)) throw new Error("Invalid IndexNow key format");
if (paths.length === 0 || paths.length > 10_000) throw new Error("Provide 1–10,000 URLs");

const urlList = paths.map((path) => {
  const url = new URL(path, `${CANONICAL_ORIGIN}/`);
  if (url.origin !== CANONICAL_ORIGIN) throw new Error(`Non-canonical URL rejected: ${url}`);
  return url.href;
});

const payload = {
  host: new URL(CANONICAL_ORIGIN).host,
  key,
  keyLocation: `${CANONICAL_ORIGIN}/${key}.txt`,
  urlList,
};

if (options["dry-run"] === "true") {
  console.log(JSON.stringify({ mode: "dry-run", endpoint: ENDPOINT, payload }, null, 2));
  process.exit(0);
}

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

const receipt = {
  submittedAt: new Date().toISOString(),
  endpoint: ENDPOINT,
  status: response.status,
  accepted: response.ok,
  urls: urlList,
  response: await response.text(),
};
console.log(JSON.stringify(receipt, null, 2));
if (!response.ok) process.exit(1);
