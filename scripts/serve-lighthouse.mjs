#!/usr/bin/env node
import { spawn } from "node:child_process";

const host = process.env.HOST ?? "127.0.0.1";
const port = process.env.PORT ?? "4175";
const origin = `http://${host}:${port}`;

const server = spawn(process.execPath, [".output/server/index.mjs"], {
  env: { ...process.env, HOST: host, PORT: port },
  stdio: "inherit",
});

let stopping = false;
const stop = (signal) => {
  if (stopping) return;
  stopping = true;
  server.kill(signal);
};

process.once("SIGINT", () => stop("SIGINT"));
process.once("SIGTERM", () => stop("SIGTERM"));
process.once("exit", () => stop("SIGTERM"));

server.once("exit", (code, signal) => {
  if (stopping) process.exit(0);
  console.error(`Lighthouse server exited before shutdown (${signal ?? code ?? "unknown"}).`);
  process.exit(code ?? 1);
});

const deadline = Date.now() + 30_000;
while (Date.now() < deadline) {
  try {
    const response = await fetch(origin);
    if (response.ok) {
      console.log(`Local: ${origin}`);
      break;
    }
  } catch {
    // The production server is still starting.
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
}

if (Date.now() >= deadline) {
  stop("SIGTERM");
  throw new Error(`Lighthouse production server did not become ready at ${origin}.`);
}

await new Promise((resolve) => server.once("exit", resolve));
