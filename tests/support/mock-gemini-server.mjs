// Local stand-ins used by tests:
//  - Gemini REST API via GEMINI_API_BASE=http://127.0.0.1:4599/models
//      POST /models/{model}:generateContent        -> JSON
//      POST /models/{model}:streamGenerateContent  -> SSE (three chunks)
//  - Supabase RPC via SUPABASE_URL=http://127.0.0.1:4599
//      POST /rest/v1/rpc/submit_contact_public_v2  -> { ok, id } (404 when MOCK_V2_MISSING=1)
//      POST /rest/v1/rpc/submit_contact_public     -> { ok, id }
//      POST /rest/v1/rpc/record_contact_ai_reply   -> 204
//      GET  /calls                                 -> recorded RPC calls (for assertions)
//  - Cyryx CRM public intake via CRM_INTAKE_URL=http://127.0.0.1:4599/crm
//      POST /crm/init, /crm/submit, /crm/event (HMAC-verified with MOCK_CRM_SECRET)
//      PUT  /upload/<path>                         -> signed-upload stand-in
import { createServer } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";

const CRM_SECRET = process.env.MOCK_CRM_SECRET || "test-crm-intake-secret-0123456789abcdef";

function validSignature(req, body) {
  const ts = String(req.headers["x-cyryx-timestamp"] || "");
  const sig = String(req.headers["x-cyryx-signature"] || "");
  if (!ts || Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const expected = `v1=${createHmac("sha256", CRM_SECRET).update(`${ts}.${body}`).digest("hex")}`;
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

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
    if (req.url?.startsWith("/upload/")) {
      res.setHeader("access-control-allow-origin", "*");
      res.setHeader("access-control-allow-methods", "PUT, OPTIONS");
      res.setHeader("access-control-allow-headers", "content-type, x-upsert");
    }
    if (req.method === "OPTIONS" && req.url?.startsWith("/upload/")) {
      res.writeHead(204).end();
      return;
    }
    if (req.method === "PUT" && req.url?.startsWith("/upload/")) {
      calls.push({ fn: "crm_upload", body: { path: req.url.slice(8), bytes: body.length } });
      res.writeHead(200, { "content-type": "application/json" });
      res.end("{}");
      return;
    }
    if (req.url?.startsWith("/crm/")) {
      const route = req.url.slice(5).split("?")[0];
      const signatureValid = validSignature(req, body);
      const parsed = body ? JSON.parse(body) : null;
      calls.push({
        fn: `crm_${route}`,
        body: parsed,
        signatureValid,
        idempotencyKey: req.headers["idempotency-key"] || null,
      });
      if (!signatureValid) {
        res.writeHead(401, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "unauthorized" }));
        return;
      }
      if (route === "event") {
        res.writeHead(202, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
        return;
      }
      res.writeHead(200, { "content-type": "application/json" });
      if (route === "init") {
        const intakeId = `int_mock_${Date.now()}`;
        res.end(
          JSON.stringify({
            intakeId,
            expiresAt: new Date(Date.now() + 3600_000).toISOString(),
            uploads: (parsed?.files || []).map((file, index) => {
              const path = `intake/ws-test/${intakeId}/${String(index + 1).padStart(2, "0")}-${file.name}`;
              return {
                name: file.name,
                path,
                signedUrl: `http://127.0.0.1:${port}/upload/${path}`,
                token: "t",
              };
            }),
          }),
        );
        return;
      }
      res.end(
        JSON.stringify({
          intakeId: parsed?.intakeId || "int_mock",
          leadId: "lead_mock",
          requirementsId: "req_mock_0001",
          status: "received",
          duplicate: false,
        }),
      );
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
    if (req.url?.includes(":generateContent") && body.includes("application/json")) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        chunk(
          JSON.stringify({
            projectName: "Shift scheduling",
            summary: "A web app where clinic managers publish shifts and staff swap them.",
            problem:
              "Managers schedule 40 clinics in spreadsheets, which takes hours every week and causes gaps.",
            goals: ["Cut scheduling time for managers"],
            users: [
              {
                name: "Clinic manager",
                description: "Runs one clinic",
                needs: "Publish shifts quickly",
              },
            ],
            features: [
              {
                title: "Publish weekly shifts",
                description: "Managers publish a week of shifts.",
                priority: "Must",
              },
              {
                title: "Swap shifts",
                description: "Staff request and accept swaps.",
                priority: "Must",
              },
              {
                title: "Payroll export",
                description: "Export hours every two weeks.",
                priority: "Should",
              },
            ],
            platforms: ["Web app"],
            openQuestions: "Which payroll system do you use?",
          }),
        ),
      );
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
