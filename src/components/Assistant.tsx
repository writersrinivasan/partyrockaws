"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, KeyRound, Loader2, Send, ShieldCheck, Trash2, Wrench } from "lucide-react";
import { SectionHeader } from "./Sections";

type TraceItem = { step: number; tool: string; input: unknown };
type Msg = { role: "user" | "assistant"; content: string; trace?: TraceItem[]; error?: boolean };

const KEY_STORE = "groq-byok-key";
const MODELS = [
  ["openai/gpt-oss-120b", "GPT-OSS 120B"],
  ["llama-3.3-70b-versatile", "Llama 3.3 70B"],
  ["moonshotai/kimi-k2-instruct-0905", "Kimi K2"],
  ["openai/gpt-oss-20b", "GPT-OSS 20B (fast)"],
];
const STARTERS = [
  "How does a PartyRock widget call a Bedrock model?",
  "Design a PartyRock app that turns meeting notes into action items and a poster",
  "Biggest plus and minus of PartyRock vs Bedrock?",
  "Which Bedrock model should I pick for image generation?",
];

function readKey() {
  try {
    return localStorage.getItem(KEY_STORE) ?? "";
  } catch {
    return "";
  }
}

export function Assistant() {
  const [key, setKey] = useState("");
  const [draftKey, setDraftKey] = useState("");
  const [remember, setRemember] = useState(true);
  const [model, setModel] = useState(MODELS[0][0]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setKey(readKey());
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy]);

  function saveKey() {
    const k = draftKey.trim();
    if (!k) return;
    setKey(k);
    setDraftKey("");
    try {
      if (remember) localStorage.setItem(KEY_STORE, k);
    } catch {}
  }

  function forgetKey() {
    setKey("");
    try {
      localStorage.removeItem(KEY_STORE);
    } catch {}
  }

  async function ask(text: string) {
    const q = text.trim();
    if (!q || busy || !key) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-groq-key": key },
        body: JSON.stringify({
          model,
          messages: next.filter((m) => !m.error).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
      setMessages((m) => [...m, { role: "assistant", content: data.text || "_No answer returned._", trace: data.trace }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: (e as Error).message, error: true }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mesh py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeader
          id="assistant"
          eyebrow="6 · Agentic AI guide"
          title="Ask Rocky, your PartyRock & Bedrock agent"
          lede="Built on the Vercel AI SDK's ToolLoopAgent. Rocky plans, calls knowledge tools, validates app blueprints, then answers, running on Groq with your own key."
        />

        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-violet-500/10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3">
            <div className="flex items-center gap-2 text-sm">
              <KeyRound size={16} className={key ? "text-emerald-600" : "text-slate-400"} />
              {key ? (
                <>
                  <span className="font-medium text-emerald-700">Groq key connected</span>
                  <span className="font-mono text-slate-400">…{key.slice(-4)}</span>
                  <button onClick={forgetKey} className="ml-2 text-xs text-rose-600 hover:underline">
                    Remove
                  </button>
                </>
              ) : (
                <span className="text-slate-600">Bring your own Groq API key</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm"
                aria-label="Model"
              >
                {MODELS.map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"
                  aria-label="Clear chat"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          {!key ? (
            <div className="p-8">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 text-white">
                  <KeyRound />
                </div>
                <h3 className="mt-4 text-xl font-bold">Connect your Groq key</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Get a free key at{" "}
                  <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="font-medium text-violet-700 underline">
                    console.groq.com/keys
                  </a>
                  .
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveKey();
                  }}
                  className="mt-6 flex gap-2"
                >
                  <input
                    type="password"
                    value={draftKey}
                    onChange={(e) => setDraftKey(e.target.value)}
                    placeholder="gsk_…"
                    autoComplete="off"
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 font-mono text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  />
                  <button className="rounded-xl bg-slate-900 px-5 font-semibold text-white hover:bg-violet-700">Connect</button>
                </form>
                <label className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember on this device
                </label>
                <p className="mt-5 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-left text-xs text-emerald-800">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                  Your key stays in your browser. It is sent only with your own requests to this app&apos;s server, which
                  forwards it to Groq and never stores or logs it.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="h-[460px] space-y-4 overflow-y-auto p-5">
                {messages.length === 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => ask(s)}
                        className="rounded-2xl border border-slate-200 p-4 text-left text-sm text-slate-700 transition hover:border-violet-400 hover:bg-violet-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`rise flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                    {m.role === "assistant" && (
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500 text-white">
                        <Bot size={16} />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        m.role === "user"
                          ? "bg-slate-900 text-white"
                          : m.error
                            ? "bg-rose-50 text-rose-800 ring-1 ring-rose-200"
                            : "bg-slate-50 text-slate-800 ring-1 ring-slate-200"
                      }`}
                    >
                      {m.trace && m.trace.length > 0 && (
                        <details className="mb-3 rounded-lg bg-white p-2 text-xs ring-1 ring-slate-200">
                          <summary className="flex cursor-pointer items-center gap-1.5 font-medium text-violet-700">
                            <Wrench size={12} /> Agent used {m.trace.length} tool call{m.trace.length > 1 ? "s" : ""}
                          </summary>
                          <ul className="mt-2 space-y-1 font-mono text-[11px] text-slate-600">
                            {m.trace.map((t, j) => (
                              <li key={j} className="break-all">
                                step {t.step}: <b>{t.tool}</b>({JSON.stringify(t.input).slice(0, 120)})
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                      {m.role === "assistant" && !m.error ? <Markdown text={m.content} /> : m.content}
                    </div>
                  </div>
                ))}
                {busy && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Loader2 size={16} className="animate-spin" /> Rocky is planning and calling tools…
                  </div>
                )}
                <div ref={endRef} />
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex gap-2 border-t border-slate-200 p-4"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about PartyRock, Bedrock models, or describe an app idea…"
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                />
                <button
                  disabled={busy || !input.trim()}
                  className="grid w-12 place-items-center rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white disabled:opacity-40"
                  aria-label="Send"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// Minimal Markdown: headings, bullets, numbered lists, bold, inline code.
function Markdown({ text }: { text: string }) {
  const inline = (s: string) =>
    s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
      part.startsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : part.startsWith("`") ? (
        <code key={i} className="rounded bg-violet-100 px-1 text-violet-800">
          {part.slice(1, -1)}
        </code>
      ) : (
        part
      ),
    );
  return (
    <div className="space-y-1.5 leading-relaxed">
      {text.split("\n").map((line, i) => {
        const t = line.trim();
        if (!t) return null;
        const h = t.match(/^#{1,4}\s+(.*)/);
        if (h) return <p key={i} className="pt-2 font-bold text-slate-900">{inline(h[1])}</p>;
        const b = t.match(/^[-*•]\s+(.*)/);
        if (b) return <p key={i} className="pl-4 -indent-3">• {inline(b[1])}</p>;
        const n = t.match(/^(\d+)[.)]\s+(.*)/);
        if (n) return <p key={i} className="pl-5 -indent-4"><b>{n[1]}.</b> {inline(n[2])}</p>;
        return <p key={i}>{inline(t)}</p>;
      })}
    </div>
  );
}
