"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { companion as copy } from "@/lib/content";
import { companion as config, companionEndpoint, companionReady, primaryCta } from "@/lib/site";
import { btnPrimary, btnSecondary, linkMore } from "@/lib/ui";

type Step = "setup" | "gate" | "consent" | "chat";
type Message = { role: "user" | "assistant"; content: string; crisis?: boolean };
type Reply = { reply?: string; crisis?: boolean; remaining?: number; limitReached?: boolean; ok?: boolean; maxMessages?: number; error?: string };

// sessionStorage only: cleared when the tab closes. The conversation itself
// lives only in React state and is gone on refresh.
const PASSCODE_KEY = "lw-companion-passcode";
const CONSENT_KEY = "lw-companion-consent";

const store = {
  get(key: string) {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {}
  },
  remove(key: string) {
    try {
      window.sessionStorage.removeItem(key);
    } catch {}
  },
};

async function post(passcode: string, body: object): Promise<{ status: number; data: Reply | null }> {
  const res = await fetch(companionEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json", "x-demo-passcode": passcode },
    body: JSON.stringify(body),
    signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(35_000) : undefined,
  });
  let data: Reply | null = null;
  try {
    data = await res.json();
  } catch {}
  return { status: res.status, data };
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Text with paragraph breaks kept — rendered as text, never as HTML. */
function Paragraphs({ text }: { text: string }) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p, i) => (
      <p key={i} className="whitespace-pre-line">
        {p}
      </p>
    ));
}

/** "In crisis? Call Tele-MANAS 14416 or emergency 112." with tap-to-call numbers. */
function withPhoneLinks(text: string): ReactNode {
  return text.split(/(14416|112)/).map((part, i) =>
    part === "14416" || part === "112" ? (
      <a key={i} href={part === "14416" ? config.teleManasHref : config.emergencyHref} className="font-semibold underline decoration-2 underline-offset-4">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

const centred = "mx-auto flex w-full max-w-[45rem] flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8 md:py-24";
const heroTitle = "type-hero text-[clamp(2.75rem,6.5vw,5.5rem)]";
const badge = "inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-[0.75rem] font-medium tracking-[0.04em] text-ink-2 uppercase";

export default function Companion() {
  const [step, setStep] = useState<Step>(companionReady ? "gate" : "setup");
  const [passcode, setPasscode] = useState("");
  const [gateInput, setGateInput] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [ticked, setTicked] = useState<boolean[]>(() => copy.consent.statements.map(() => false));

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [max, setMax] = useState<number>(config.maxMessages);
  const [remaining, setRemaining] = useState<number>(config.maxMessages);
  const [limitReached, setLimitReached] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const passcodeRef = useRef<HTMLInputElement>(null);
  const consentHeadingRef = useRef<HTMLHeadingElement>(null);
  const greetingRef = useRef<HTMLHeadingElement>(null);
  const planHeadingRef = useRef<HTMLHeadingElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  // Focus moves only after the person acts, never on first load.
  const focusNext = useRef<"passcode" | "consent" | "greeting" | "plan" | null>(null);

  // Restore the session (passcode + consent) after hydration.
  useEffect(() => {
    if (!companionReady) return;
    const saved = store.get(PASSCODE_KEY);
    if (!saved) return;
    setPasscode(saved);
    setStep(store.get(CONSENT_KEY) === "1" ? "chat" : "consent");
  }, []);

  useEffect(() => {
    const target = focusNext.current;
    focusNext.current = null;
    if (target === "passcode") passcodeRef.current?.focus();
    if (target === "consent") consentHeadingRef.current?.focus();
    if (target === "greeting") greetingRef.current?.focus();
    if (target === "plan") planHeadingRef.current?.focus();
  }, [step, limitReached]);

  // Keep the newest message in view.
  useEffect(() => {
    if (step !== "chat" || (messages.length === 0 && !waiting)) return;
    endRef.current?.scrollIntoView({ block: "end", behavior: reducedMotion() ? "auto" : "smooth" });
  }, [messages, waiting, error, step]);

  // Auto-grow the textarea.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 192)}px`;
  }, [draft, step]);

  const signOut = useCallback(() => {
    store.remove(PASSCODE_KEY);
    setPasscode("");
    setMessages([]);
    setGateError(copy.gate.wrong);
    focusNext.current = "passcode";
    setStep("gate");
  }, []);

  async function onGateSubmit(e: FormEvent) {
    e.preventDefault();
    const value = gateInput.trim();
    if (!value || checking) return;
    setChecking(true);
    setGateError(null);
    try {
      const { status, data } = await post(value, { verify: true });
      if (status === 401) {
        setGateError(copy.gate.wrong);
        passcodeRef.current?.focus();
        return;
      }
      if (status !== 200 || !data?.ok) throw new Error();
      if (typeof data.maxMessages === "number") {
        setMax(data.maxMessages);
        setRemaining(data.maxMessages);
      }
      store.set(PASSCODE_KEY, value);
      setPasscode(value);
      setGateInput("");
      const consented = store.get(CONSENT_KEY) === "1";
      focusNext.current = consented ? "greeting" : "consent";
      setStep(consented ? "chat" : "consent");
    } catch {
      setGateError(copy.gate.unreachable);
    } finally {
      setChecking(false);
    }
  }

  function onConsentSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ticked.every(Boolean)) return;
    store.set(CONSENT_KEY, "1");
    focusNext.current = "greeting";
    setStep("chat");
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || waiting || limitReached || content.length > config.maxChars) return;
    const before = messages;
    const history: Message[] = [...before, { role: "user", content }];
    setMessages(history);
    setDraft("");
    setError(null);
    setFailed(null);
    setWaiting(true);
    setAnnouncement(copy.chat.thinking);

    let data: Reply | null = null;
    try {
      const res = await post(passcode, { messages: history.map(({ role, content }) => ({ role, content })) });
      data = res.data;
      if (res.status === 401) {
        signOut();
        return;
      }
      if (data?.limitReached) {
        setMessages(before);
        setRemaining(0);
        focusNext.current = "plan";
        setLimitReached(true);
        setAnnouncement("");
        return;
      }
      if (res.status !== 200 || typeof data?.reply !== "string") throw new Error(String(res.status));
      setMessages([...history, { role: "assistant", content: data.reply, crisis: data.crisis === true }]);
      setAnnouncement(`${copy.chat.them}: ${data.reply}`);
      if (typeof data.remaining === "number") {
        setRemaining(data.remaining);
        if (data.remaining <= 0) {
          focusNext.current = "plan";
          setLimitReached(true);
        }
      }
    } catch (err) {
      // Roll back and give the text back, so nothing typed is lost.
      const status = err instanceof Error ? Number(err.message) : NaN;
      setMessages(before);
      setDraft(content);
      setFailed(content);
      setError((status === 400 || status === 403) && data?.error ? data.error : copy.chat.error);
      setAnnouncement("");
    } finally {
      setWaiting(false);
    }
  }

  function onComposerKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(draft);
    }
  }

  // ── Setup (placeholder endpoint) ───────────────────────────────────────────
  if (step === "setup") {
    return (
      <section data-companion="" aria-labelledby="companion-title" className="flex min-h-[calc(100svh-3.25rem)] flex-col bg-bg">
        <div className={centred}>
          <span className={badge}>{copy.chat.badge}</span>
          <h1 id="companion-title" className={`${heroTitle} mt-6`}>
            {copy.title}
          </h1>
          <p className="type-lead mt-8 max-w-[30ch] font-normal text-ink-2">{copy.setup.body}</p>
          <a href={primaryCta.href} className={`${linkMore} mt-8`}>
            {copy.setup.link}
          </a>
        </div>
      </section>
    );
  }

  // ── Gate ───────────────────────────────────────────────────────────────────
  if (step === "gate") {
    return (
      <section data-companion="" aria-labelledby="companion-title" className="flex min-h-[calc(100svh-3.25rem)] flex-col bg-bg">
        <div className={centred}>
          <span className={badge}>{copy.chat.badge}</span>
          <h1 id="companion-title" className={`${heroTitle} hero-line mt-6`}>
            {copy.title}
          </h1>
          <p className="type-lead hero-after mt-6 max-w-[28ch] font-normal text-ink-2">{copy.gate.description}</p>

          <form onSubmit={onGateSubmit} noValidate className="hero-after mt-12 w-full max-w-[26rem] text-left">
            <label htmlFor="companion-passcode" className="block text-[0.9375rem] font-medium text-ink-2">
              {copy.gate.label}
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                ref={passcodeRef}
                id="companion-passcode"
                type="password"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                value={gateInput}
                onChange={(e) => setGateInput(e.target.value)}
                aria-invalid={gateError ? true : undefined}
                aria-describedby={gateError ? "companion-passcode-error" : undefined}
                className="min-h-12 w-full flex-1 rounded-full border border-line bg-surface px-6 text-[1.0625rem] text-ink transition-colors duration-150 ease-out outline-none focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-accent"
              />
              <button type="submit" disabled={checking || !gateInput.trim()} className={`${btnPrimary} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent`}>
                {checking ? copy.gate.checking : copy.gate.button}
              </button>
            </div>
            <p id="companion-passcode-error" role="alert" className="mt-3 min-h-[1.6em] text-[1rem] text-accent">
              {gateError}
            </p>
          </form>
        </div>
      </section>
    );
  }

  // ── Consent ────────────────────────────────────────────────────────────────
  if (step === "consent") {
    const allTicked = ticked.every(Boolean);
    return (
      <section data-companion="" aria-labelledby="companion-title" className="flex min-h-[calc(100svh-3.25rem)] flex-col bg-bg">
        <div className={centred}>
          <h1 id="companion-title" className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink-2">
            {copy.title}
          </h1>
          <h2 ref={consentHeadingRef} tabIndex={-1} className="type-h2 mt-4 outline-none">
            {copy.consent.h2}
          </h2>
          <form onSubmit={onConsentSubmit} className="mt-10 w-full max-w-[34rem] rounded-3xl bg-surface p-6 text-left sm:p-10">
            <fieldset>
              <legend className="text-[1rem] text-ink-2">{copy.consent.intro}</legend>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {copy.consent.statements.map((statement, i) => (
                  <li key={statement}>
                    <label className="flex cursor-pointer items-start gap-4 py-4">
                      <input
                        type="checkbox"
                        checked={ticked[i]}
                        onChange={(e) => setTicked((t) => t.map((v, j) => (j === i ? e.target.checked : v)))}
                        className="mt-1 size-5 shrink-0 cursor-pointer accent-accent"
                      />
                      <span className="text-[1.0625rem] leading-snug">{statement}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
            <p className="mt-6 border-l-2 border-accent bg-bg px-4 py-3 text-[1rem] text-ink" role="note">
              {withPhoneLinks(copy.consent.crisis)}
            </p>
            <button type="submit" disabled={!allTicked} className={`${btnPrimary} mt-8 w-full disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent`}>
              {copy.consent.button}
            </button>
          </form>
        </div>
      </section>
    );
  }

  // ── Chat ───────────────────────────────────────────────────────────────────
  const tooLong = draft.trim().length > config.maxChars;
  const showCounter = draft.length >= config.counterFrom;
  const canSend = !waiting && draft.trim().length > 0 && !tooLong;

  return (
    <section data-companion="" aria-labelledby="companion-title" className="flex min-h-[calc(100svh-3.25rem)] flex-col bg-surface">
      {/* Translucent strip under the site header. */}
      <div className="sticky top-13 z-30 border-b border-line/80 bg-surface/72 backdrop-blur-[20px] backdrop-saturate-[1.8]">
        <div className="mx-auto flex min-h-14 w-full max-w-[45rem] items-center justify-between gap-4 px-5 sm:px-8">
          <div className="min-w-0 py-2 sm:flex sm:items-center sm:gap-2.5 sm:py-0">
            <h1 id="companion-title" className="text-[1rem] font-semibold tracking-[-0.02em] sm:text-[1.0625rem]">
              {copy.title}
            </h1>
            {/* On phones the counter sits under the title so nothing truncates. */}
            <p className="text-[0.875rem] leading-snug text-ink-2 tabular-nums sm:hidden">{copy.chat.counter(remaining, max)}</p>
            <span className="hidden shrink-0 sm:block">
              <span className={`${badge} px-2 text-[0.6875rem]`}>{copy.chat.badge}</span>
            </span>
          </div>
          <span className="shrink-0 sm:hidden">
            <span className={`${badge} px-2 text-[0.6875rem]`}>{copy.chat.badge}</span>
          </span>
          <p className="hidden shrink-0 text-[0.875rem] text-ink-2 tabular-nums sm:block">{copy.chat.counter(remaining, max)}</p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[45rem] flex-1 flex-col px-5 pt-10 pb-8 sm:px-8 md:pt-14">
        {messages.length === 0 && !waiting && !limitReached ? (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <h2 ref={greetingRef} tabIndex={-1} className="max-w-[18ch] text-[clamp(1.875rem,1.2rem+2.4vw,3rem)] outline-none">
              {copy.chat.greeting}
            </h2>
            <p className="mt-4 max-w-[34ch] text-ink-2">{copy.chat.greetingSub}</p>
            <ul className="mt-10 flex flex-wrap justify-center gap-3">
              {copy.chat.chips.map((chip) => (
                <li key={chip}>
                  <button
                    type="button"
                    onClick={() => void send(chip)}
                    className="min-h-12 rounded-full border border-line bg-bg px-5 py-2.5 text-[1rem] text-ink transition-colors duration-150 ease-out hover:border-ink"
                  >
                    {chip}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ol aria-label={copy.chat.conversation} className="flex flex-col gap-8">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <li key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-[20px] bg-ink px-5 py-3 text-[1.0625rem] leading-[1.55] text-bg [&_p]:[text-wrap:wrap]">
                    <span className="sr-only">{copy.chat.you}: </span>
                    <div className="space-y-3">
                      <Paragraphs text={m.content} />
                    </div>
                  </div>
                </li>
              ) : m.crisis ? (
                <li key={i} className="reply-in">
                  <div className="rounded-3xl bg-accent-soft p-6 text-ink sm:p-8">
                    <span className="sr-only">{copy.chat.them}: </span>
                    <h2 className="text-[1.25rem] tracking-[-0.02em]">{copy.crisis.heading}</h2>
                    <div className="mt-4 space-y-4 text-[1.0625rem] leading-[1.65]">
                      <Paragraphs text={m.content} />
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <a href={config.teleManasHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3 text-[1.0625rem] font-medium text-bg transition-colors duration-150 ease-out hover:bg-ink-2">
                        {copy.crisis.teleManas}
                      </a>
                      <a href={config.emergencyHref} className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink px-6 py-3 text-[1.0625rem] font-medium text-ink transition-colors duration-150 ease-out hover:bg-ink hover:text-bg">
                        {copy.crisis.emergency}
                      </a>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={i} className="reply-in max-w-[62ch] space-y-4 text-[1.0625rem] leading-[1.7] text-ink md:text-[1.125rem]">
                  <span className="sr-only">{copy.chat.them}: </span>
                  <Paragraphs text={m.content} />
                </li>
              ),
            )}
          </ol>
        )}

        {waiting && (
          <div role="status" className="mt-8 flex items-center gap-3 text-ink-2">
            <span aria-hidden="true" className="thinking-dots items-center gap-1.5">
              <span className="size-2 rounded-full bg-ink-2" />
              <span className="size-2 rounded-full bg-ink-2" />
              <span className="size-2 rounded-full bg-ink-2" />
            </span>
            <span className="thinking-text text-[1rem]">{copy.chat.thinking}</span>
          </div>
        )}

        {error && (
          <div role="alert" className="mt-8 flex flex-col items-start gap-4 rounded-3xl bg-bg p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-ink">{error}</p>
            {failed && (
              <button type="button" onClick={() => void send(failed)} className={`${btnSecondary} min-h-11 shrink-0 px-6 py-2`}>
                {copy.chat.retry}
              </button>
            )}
          </div>
        )}

        {limitReached && (
          <div className="reply-in mt-12 rounded-3xl bg-bg p-6 sm:p-10">
            <h2 ref={planHeadingRef} tabIndex={-1} className="text-[clamp(1.75rem,1.2rem+1.8vw,2.5rem)] outline-none">
              {copy.plan.h2}
            </h2>
            <p className="mt-3 text-ink-2">{copy.plan.body}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {copy.plan.tiles.map((tile) => (
                <li key={tile.name} className="rounded-2xl border border-line bg-surface p-6">
                  <span className={badge}>{tile.label}</span>
                  <h3 className="mt-4 text-[1.25rem] tracking-[-0.02em]">{tile.name}</h3>
                  <p className="mt-2 text-[1rem] text-ink-2">{tile.body}</p>
                </li>
              ))}
            </ul>
            <a href={primaryCta.href} className={`${btnPrimary} mt-8 w-full sm:w-auto`}>
              {copy.plan.button}
            </a>
          </div>
        )}

        <div ref={endRef} className="scroll-mb-40" />
        {limitReached && <p className="mt-10 text-center text-[0.875rem] text-ink-2">{copy.footer}</p>}
      </div>

      {/* Screen-reader announcements for new replies. */}
      <p aria-live="polite" className="sr-only">
        {waiting ? "" : announcement}
      </p>

      {!limitReached && (
        <div className="sticky bottom-0 z-20 border-t border-line/80 bg-surface/85 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-[20px] backdrop-saturate-[1.8]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
            className="mx-auto w-full max-w-[45rem] px-5 sm:px-8"
          >
            <label htmlFor="companion-input" className="sr-only">
              {copy.chat.inputLabel}
            </label>
            {tooLong && (
              <p id="companion-too-long" className="mb-2 px-2 text-[0.9375rem] font-medium text-accent">
                {copy.chat.tooLong}
              </p>
            )}
            <div className="flex items-end gap-2 rounded-[1.5rem] border border-line bg-surface p-1.5 pl-2 transition-colors duration-150 ease-out focus-within:border-ink">
              <textarea
                ref={textareaRef}
                id="companion-input"
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onComposerKeyDown}
                placeholder={copy.chat.placeholder}
                aria-describedby={`companion-hint companion-count${tooLong ? " companion-too-long" : ""}`}
                aria-invalid={tooLong || undefined}
                className="max-h-48 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-[1.0625rem] leading-[1.5] text-ink outline-none placeholder:text-ink-2 focus-visible:outline-none"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-accent px-5 text-[1rem] font-medium text-surface transition-colors duration-150 ease-out hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-2"
              >
                {copy.chat.send}
              </button>
            </div>
            <div className="mt-2 flex items-start justify-between gap-4 px-2 text-[0.875rem] leading-snug text-ink-2">
              <p>{copy.footer}</p>
              <p id="companion-count" aria-live="polite" className={`shrink-0 tabular-nums ${tooLong ? "font-medium text-accent" : ""}`}>
                {showCounter ? copy.chat.charCount(draft.trim().length) : ""}
              </p>
            </div>
            <p id="companion-hint" className="sr-only md:not-sr-only md:mt-1 md:px-2 md:text-[0.875rem] md:text-ink-2">
              {copy.chat.hint}
            </p>
          </form>
        </div>
      )}
    </section>
  );
}
