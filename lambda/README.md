# La Winspire Companion — Lambda backend

`index.mjs` is the whole backend: one file, no npm packages. It is **pasted into the
AWS Lambda console** (Code tab → `index.mjs` → Deploy). Nothing here is deployed by
GitHub Actions, and no key or passcode is ever stored in this repo.

The system prompt inside `index.mjs` is a verbatim copy of `guardrails.md`
(everything under `## SYSTEM PROMPT`). Edit `guardrails.md` first, then run
`npm run sync:guardrails` and re-paste the file into the console.
`npm run check:guardrails` fails if the two differ.

## Lambda settings

| Setting | Value |
| --- | --- |
| Runtime | Node.js 22.x |
| Handler | `index.handler` |
| Memory | 256 MB |
| Timeout | **30 seconds** (the Claude call is aborted at 25 s) |
| Reserved concurrency (recommended) | 5 — caps cost if the URL is abused |

## Environment variables

| Name | Required | What it is |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | yes | Your Anthropic API key. Only ever set here, in the console. |
| `DEMO_PASSCODE` | yes | The passcode people type on the gate screen. Share it privately. |
| `ALLOWED_ORIGIN` | yes | `https://vatsan1305-hub.github.io` — scheme + host only, **no path, no trailing slash**. |
| `MODEL` | no | Defaults to `claude-sonnet-5-5`. |
| `MAX_USER_MESSAGES` | no | Defaults to `10`. Keep it in step with `companion.maxMessages` in `lib/site.ts`. |

Also set a monthly spend limit on the Anthropic Console for this key.

## Function URL

- Auth type: **NONE** (the passcode and origin check are done in code).
- Invoke mode: **BUFFERED**.
- CORS — configure it here, *not* in code (the code sets no CORS headers; duplicates break CORS):
  - Allow origin: `https://vatsan1305-hub.github.io`
  - Allow methods: `POST`
  - Allow headers: `content-type`, `x-demo-passcode`
  - Expose headers: *(none)*
  - Allow credentials: **off**
  - Max age: `86400`

Copy the Function URL into `companionEndpoint` in `lib/site.ts` and merge to `main`.

## What the handler does (in order)

1. POST only, and the `origin` header must equal `ALLOWED_ORIGIN` → else **403**.
2. `x-demo-passcode` must equal `DEMO_PASSCODE` (constant-time) → else **401**.
   A body of `{ "verify": true }` stops here and returns `{ ok: true, maxMessages }`
   (the gate screen uses this to check the passcode without calling Claude).
3. Body `{ messages: [{ role, content }] }`: roles alternate user/assistant, start and end
   with user, every content a non-empty string, last message ≤ 1,000 characters → else **400**.
4. More than `MAX_USER_MESSAGES` user messages → `{ limitReached: true }`.
5. Crisis keywords in the latest message → `{ crisis: true, reply: <fixed message> }`;
   Claude is **not** called. The list is `CRISIS_KEYWORDS` — **Dr M must review it**.
6. Otherwise calls Claude with the last 20 turns, `max_tokens` 400 →
   `{ reply, crisis: false, remaining }`.

Any failure returns **502** `{ error: <calm generic message> }` — no upstream detail.
Logs are one JSON line per request: timestamp, status, message count, latency, crisis flag.
Never message text, passcode or key.

**Temperature:** `claude-sonnet-5-5` rejects any non-default `temperature` with a 400, so
the code only sends `temperature: 0.5` to older models that accept it (e.g.
`claude-haiku-4-5`). On Sonnet 5.5 it instead turns extended thinking off
(`thinking: { type: "between_tools" }`, effort `low`) so the 400-token budget goes to the
reply, and enables the API's server-side refusal fallback.

## Testing

Locally (fetch is mocked — no key, no network):

```bash
npm run test:lambda
```

In the AWS console: open `test-events.json`, copy one event (the value, not its name) into
the Test tab, replace `REPLACE_WITH_YOUR_DEMO_PASSCODE` with your real `DEMO_PASSCODE`.

| Event | Expected |
| --- | --- |
| `normal` | 200, `{ reply, crisis: false, remaining: 9 }` |
| `verify` | 200, `{ ok: true, maxMessages: 10 }` |
| `wrongPasscode` | 401 |
| `badOrigin` | 403 |
| `crisis` | 200, `{ crisis: true, reply: … }` — CloudWatch shows `crisis: true` and no Claude call |
| `tooLong` | 400, "please keep it under 1,000 characters" |
| `limitReached` | 200, `{ limitReached: true }` |

Note: the origin check stops other websites, not scripts (anyone can fake an `origin`
header outside a browser). The passcode, reserved concurrency and the Anthropic spend
limit are what actually cap misuse — rotate the passcode if it leaks.
