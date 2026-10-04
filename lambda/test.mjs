// Local test for the Companion Lambda — fetch is mocked, no network, no key.
//   node lambda/test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

process.env.ANTHROPIC_API_KEY = "test-key-not-real";
process.env.DEMO_PASSCODE = "REPLACE_WITH_YOUR_DEMO_PASSCODE"; // same value as test-events.json
process.env.ALLOWED_ORIGIN = "https://vatsan1305-hub.github.io";
process.env.MAX_USER_MESSAGES = "10";

let calls = [];
let upstream = () => ({ ok: true, status: 200, json: async () => ({ stop_reason: "end_turn", content: [{ type: "text", text: "That sounds exhausting. What happens just before it starts?" }] }) });
globalThis.fetch = async (url, init) => {
  calls.push({ url, init });
  return upstream(url, init);
};
const logs = [];
console.log = (line) => logs.push(line);

const { handler, isCrisis, buildRequest } = await import("./index.mjs");
const events = JSON.parse(readFileSync(new URL("./test-events.json", import.meta.url), "utf8"));
const run = async (event) => {
  calls = [];
  const res = await handler(event);
  return { status: res.statusCode, body: JSON.parse(res.body) };
};
const results = [];
const test = async (name, fn) => {
  await fn();
  results.push(name);
};
const clone = (e) => structuredClone(e);

await test("normal reply", async () => {
  const r = await run(events.normal);
  assert.equal(r.status, 200);
  assert.equal(r.body.crisis, false);
  assert.equal(r.body.remaining, 9);
  assert.match(r.body.reply, /exhausting/);
  assert.equal(calls.length, 1);
  const { url, init } = calls[0];
  assert.equal(url, "https://api.anthropic.com/v1/messages");
  assert.equal(init.headers["x-api-key"], "test-key-not-real");
  assert.equal(init.headers["anthropic-version"], "2023-06-01");
  assert.equal(init.headers["content-type"], "application/json");
  const sent = JSON.parse(init.body);
  assert.equal(sent.model, "claude-sonnet-5-5");
  assert.equal(sent.max_tokens, 400);
  assert.match(sent.system, /^You are the \*\*La Winspire Companion\*\*/);
  assert.match(sent.system, /choose safe, and point to a human\.$/);
});

await test("wrong passcode → 401, no model call", async () => {
  const r = await run(events.wrongPasscode);
  assert.equal(r.status, 401);
  assert.equal(calls.length, 0);
});

await test("bad origin → 403, no model call", async () => {
  const e = clone(events.normal);
  e.headers.origin = "https://evil.example";
  const r = await run(e);
  assert.equal(r.status, 403);
  assert.equal(calls.length, 0);
});

await test("GET → 403", async () => {
  const e = clone(events.normal);
  e.requestContext.http.method = "GET";
  assert.equal((await run(e)).status, 403);
});

await test("crisis → fixed message, no model call", async () => {
  const r = await run(events.crisis);
  assert.equal(r.status, 200);
  assert.equal(r.body.crisis, true);
  assert.match(r.body.reply, /14416/);
  assert.match(r.body.reply, /1-800-891-4416/);
  assert.match(r.body.reply, /112/);
  assert.match(r.body.reply, /safe/);
  assert.equal(calls.length, 0);
});

await test("crisis keyword coverage", async () => {
  for (const t of ["I'm feeling SUICIDAL", "i just want to die", "I want to kill myself.", "thinking about self-harm", "nenu chanipovali anukuntunna", "main marna chahti hoon", "khudkushi", "Aatmahatya", "better off dead", "I don’t want to live", "आत्महत्या", "ఆత్మహత్య"]) {
    assert.ok(isCrisis(t), `should match: ${t}`);
  }
  for (const t of ["We keep having the same argument", "I want to diet", "my phone died", "this deadline is killing me"]) {
    assert.ok(!isCrisis(t), `should not match: ${t}`);
  }
});

await test("too long → 400, no model call", async () => {
  const r = await run(events.tooLong);
  assert.equal(r.status, 400);
  assert.match(r.body.error, /1,000/);
  assert.equal(calls.length, 0);
});

await test("limit reached → limitReached, no model call", async () => {
  const r = await run(events.limitReached);
  assert.equal(r.status, 200);
  assert.equal(r.body.limitReached, true);
  assert.equal(calls.length, 0);
});

await test("verify passcode → ok, no model call", async () => {
  const r = await run(events.verify);
  assert.equal(r.status, 200);
  assert.equal(r.body.ok, true);
  assert.equal(r.body.maxMessages, 10);
  assert.equal(calls.length, 0);
});

await test("invalid conversation shapes → 400", async () => {
  for (const messages of [[], "hi", [{ role: "assistant", content: "x" }], [{ role: "user", content: "a" }, { role: "user", content: "b" }], [{ role: "user", content: 5 }], [{ role: "user", content: "a" }, { role: "assistant", content: "b" }]]) {
    const e = clone(events.normal);
    e.body = JSON.stringify({ messages });
    assert.equal((await run(e)).status, 400, JSON.stringify(messages));
  }
  const e = clone(events.normal);
  e.body = "{not json";
  assert.equal((await run(e)).status, 400);
});

await test("base64 body accepted", async () => {
  const e = clone(events.normal);
  e.body = Buffer.from(e.body).toString("base64");
  e.isBase64Encoded = true;
  assert.equal((await run(e)).status, 200);
});

await test("only the last 20 turns are sent", async () => {
  const messages = [];
  for (let i = 0; i < 10; i++) messages.push({ role: "user", content: `u${i}` }, { role: "assistant", content: `a${i}` });
  messages.push({ role: "user", content: "latest" });
  process.env.MAX_USER_MESSAGES = "10";
  const e = clone(events.normal);
  e.body = JSON.stringify({ messages: messages.slice(2) }); // 10 user messages
  await run(e);
  const sent = JSON.parse(calls[0].init.body).messages;
  assert.ok(sent.length <= 20);
  assert.equal(sent[0].role, "user");
  assert.equal(sent.at(-1).content, "latest");
});

await test("upstream error → generic 502, nothing leaked", async () => {
  upstream = () => ({ ok: false, status: 529, json: async () => ({ error: { message: "Overloaded secret detail" } }) });
  const r = await run(events.normal);
  assert.equal(r.status, 502);
  assert.doesNotMatch(JSON.stringify(r.body), /Overloaded|529|stack/i);
});

await test("upstream throw / timeout → generic 502", async () => {
  upstream = () => { throw new DOMException("The operation was aborted", "TimeoutError"); };
  const r = await run(events.normal);
  assert.equal(r.status, 502);
  assert.doesNotMatch(r.body.error, /abort/i);
});

await test("refusal → generic 502", async () => {
  upstream = () => ({ ok: true, status: 200, json: async () => ({ stop_reason: "refusal", content: [] }) });
  assert.equal((await run(events.normal)).status, 502);
});

await test("request shape per model", async () => {
  const msgs = [{ role: "user", content: "hi" }];
  const s55 = buildRequest("claude-sonnet-5-5", msgs);
  assert.equal(s55.body.temperature, undefined, "Sonnet 5.5 rejects non-default temperature");
  assert.deepEqual(s55.body.thinking, { type: "between_tools" });
  const legacy = buildRequest("claude-haiku-4-5", msgs);
  assert.equal(legacy.body.temperature, 0.5);
  assert.equal(legacy.body.thinking, undefined);
});

await test("logs contain metadata only", async () => {
  const all = logs.join("\n");
  assert.doesNotMatch(all, /REPLACE_WITH_YOUR_DEMO_PASSCODE|test-key-not-real|same argument|kill myself|exhausting/);
  const entry = JSON.parse(logs[0]);
  assert.deepEqual(Object.keys(entry).sort(), ["crisis", "latencyMs", "messages", "status", "ts"]);
});

process.stdout.write(results.map((r) => `✓ ${r}`).join("\n") + `\n${results.length} passed\n`);
