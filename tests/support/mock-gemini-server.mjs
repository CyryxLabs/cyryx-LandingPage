// Local stand-ins used by tests:
//  - Gemini REST API via GEMINI_API_BASE=http://127.0.0.1:4599/models
//      POST /models/{model}:generateContent        -> JSON
//      POST /models/{model}:streamGenerateContent  -> SSE (three chunks)
//  - Supabase RPC via SUPABASE_URL=http://127.0.0.1:4599
//      POST /rest/v1/rpc/submit_contact_public_v2  -> { ok, id } (404 when MOCK_V2_MISSING=1)
//      POST /rest/v1/rpc/submit_contact_public     -> { ok, id }
//      POST /rest/v1/rpc/record_contact_ai_reply   -> 204
//      GET  /calls                                 -> recorded RPC calls (for assertions)
import { createServer } from "node:http";

const port = Number(process.env.MOCK_GEMINI_PORT || 4599);

const chunk = (text) => JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] });

const calls = [];

createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    if (req.url === "/calls") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(calls));
      return;
    }
    if (req.url?.startsWith("/rest/v1/rpc/")) {
      const fn = req.url.slice("/rest/v1/rpc/".length).split("?")[0];
      calls.push({ fn, body: body ? JSON.parse(body) : null });
      if (fn === "submit_contact_public_v2" && process.env.MOCK_V2_MISSING === "1") {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ code: "PGRST202", message: "Could not find the function" }));
        return;
      }
      if (fn === "record_contact_ai_reply") {
        res.writeHead(204).end();
        return;
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true, id: "00000000-0000-4000-8000-000000000001" }));
      return;
    }
    if (req.method !== "POST" || !req.headers["x-goog-api-key"]) {
      res.writeHead(401).end();
      return;
    }
    if (req.url?.includes(":streamGenerateContent")) {
      res.writeHead(200, { "content-type": "text/event-stream" });
      const parts = [
        "Most teams start with ",
        "Advise when the opportunity is unclear, ",
        "or Build when the workflow is known. Want to tell me about yours?",
      ];
      let i = 0;
      const timer = setInterval(() => {
        if (i >= parts.length) {
          clearInterval(timer);
          res.end();
          return;
        }
        res.write(`data: ${chunk(parts[i++])}\n\n`);
      }, 120);
      return;
    }
    if (req.url?.includes(":generateContent")) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        chunk(
          "You want invoice exceptions routed to the right approver without manual triage. Build looks like the right starting point, with Control defining approval limits. Which system holds your approval rules today?",
        ),
      );
      return;
    }
    res.writeHead(404).end();
  });
}).listen(port, () => console.log(`mock gemini on ${port}`));
