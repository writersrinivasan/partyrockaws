import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Cpu,
  Lightbulb,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { bedrockModels, innovativeUses, prosCons, stats, widgetTypes } from "@/lib/knowledge";

export function SectionHeader({
  eyebrow,
  title,
  lede,
  id,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  id: string;
}) {
  return (
    <div id={id} className="mx-auto max-w-3xl scroll-mt-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg text-slate-600">{lede}</p>
    </div>
  );
}

export function Nav() {
  const links = [
    ["Models", "#models"],
    ["Workflow", "#workflow"],
    ["Infographics", "#infographics"],
    ["Innovate", "#innovate"],
    ["Pros & Cons", "#verdict"],
    ["AI Guide", "#assistant"],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#" className="flex items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-600 via-pink-500 to-orange-400 text-white">
            <Sparkles size={16} />
          </span>
          <span>
            PartyRock <span className="text-slate-400">×</span> Bedrock
          </span>
        </a>
        <div className="hidden gap-1 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href="#assistant"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Ask Rocky
        </a>
      </nav>
    </header>
  );
}

export function Hero() {
  return (
    <section className="mesh relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 text-center sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-violet-700">
          <Boxes size={14} /> The back-end story of a no-code GenAI playground
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          How <span className="grad-text">Amazon PartyRock</span> turns a sentence into an app, powered by{" "}
          <span className="grad-text">Amazon Bedrock</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Explore the foundation models, the request pipeline behind every widget, how to use the platform
          creatively, and where each one shines or falls short. Then quiz our agentic guide using your own
          Groq key.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#workflow"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:brightness-110"
          >
            See the workflow <ArrowRight size={18} />
          </a>
          <a
            href="#models"
            className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-violet-400"
          >
            Meet the models
          </a>
        </div>
        <dl className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white bg-white/70 p-5 shadow-sm">
              <dt className="text-sm text-slate-500">{s.label}</dt>
              <dd className="grad-text mt-1 text-4xl font-extrabold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Models() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeader
        id="models"
        eyebrow="1 · The engine"
        title="Amazon Bedrock: one API, many minds"
        lede="Bedrock is AWS's fully managed service for foundation models. Instead of hosting GPUs, you call a single API and pick a model ID. PartyRock is a friendly front end on top of exactly that."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {[
          {
            icon: <Cpu />,
            title: "Serverless inference",
            body: "Bedrock runs the models; you pay per token (or buy provisioned throughput). No infrastructure to manage.",
          },
          {
            icon: <Boxes />,
            title: "Unified Converse API",
            body: "The same request shape works across providers, so swapping Claude for Nova or Llama is a one-line change. PartyRock's model dropdown relies on this.",
          },
          {
            icon: <CheckCircle2 />,
            title: "Built-in governance",
            body: "Guardrails, IAM, encryption and the promise that your prompts are not used to train base models.",
          },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-700">{c.icon}</div>
            <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 text-slate-600">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {bedrockModels.map((m) => (
          <article
            key={m.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`h-2 bg-gradient-to-r ${m.color}`} />
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{m.provider}</p>
              <h3 className="mt-1 text-xl font-bold">{m.family}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.modalities.map((mod) => (
                  <span key={mod} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                    {mod}
                  </span>
                ))}
              </div>
              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {m.strengths.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
              <p className="mt-auto pt-4 text-sm font-medium text-violet-700">{m.partyrockRole}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4 text-center text-sm text-slate-500">
        The exact models in PartyRock&apos;s dropdown change over time as AWS adds and retires them.
      </p>
    </section>
  );
}

export function Innovate() {
  const tagColors = [
    "bg-violet-100 text-violet-700",
    "bg-pink-100 text-pink-700",
    "bg-orange-100 text-orange-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-fuchsia-100 text-fuchsia-700",
    "bg-rose-100 text-rose-700",
  ];
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          id="innovate"
          eyebrow="2 · Think bigger"
          title="Using PartyRock in more innovative ways"
          lede="Once you see widgets as nodes in a prompt graph, PartyRock stops being a toy and becomes a free, visual lab for agent design, model evaluation and teaching."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {innovativeUses.map((u, i) => (
            <div key={u.title} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition hover:border-violet-300 hover:bg-white">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tagColors[i % tagColors.length]}`}>{u.tag}</span>
              <h3 className="mt-3 flex items-center gap-2 text-lg font-semibold">
                <Lightbulb size={18} className="text-amber-500" /> {u.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{u.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-gradient-to-r from-violet-600 via-pink-500 to-orange-400 p-[2px]">
          <div className="rounded-[22px] bg-white p-8">
            <h3 className="text-xl font-bold">The six building blocks</h3>
            <p className="mt-1 text-slate-600">Every innovative idea above is just a clever arrangement of these widgets.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {widgetTypes.map((w) => (
                <div key={w.name} className="rounded-xl border border-slate-200 p-4">
                  <p className="font-semibold">{w.name}</p>
                  <p className="text-sm text-slate-600">{w.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VerdictCard({
  name,
  data,
  accent,
}: {
  name: string;
  data: (typeof prosCons)["partyrock"];
  accent: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className={`bg-gradient-to-r ${accent} px-6 py-5 text-white`}>
        <h3 className="text-2xl font-bold">{name}</h3>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <div className="rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-200">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700">
            <ThumbsUp size={16} /> Biggest plus
          </p>
          <p className="mt-2 font-semibold text-emerald-950">{data.biggestPlus}</p>
        </div>
        <div className="rounded-2xl bg-rose-50 p-5 ring-1 ring-rose-200">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-rose-700">
            <ThumbsDown size={16} /> Biggest minus
          </p>
          <p className="mt-2 font-semibold text-rose-950">{data.biggestMinus}</p>
        </div>
        <ul className="space-y-2">
          {data.pros.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-slate-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" /> {p}
            </li>
          ))}
        </ul>
        <ul className="space-y-2">
          {data.cons.map((c) => (
            <li key={c} className="flex gap-2 text-sm text-slate-700">
              <XCircle size={16} className="mt-0.5 shrink-0 text-rose-500" /> {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Verdict() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeader
        id="verdict"
        eyebrow="5 · The verdict"
        title="Biggest plus & minus"
        lede="PartyRock optimises for speed of learning; Bedrock optimises for control in production. Use each for what it's good at."
      />
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <VerdictCard name="Amazon PartyRock" data={prosCons.partyrock} accent="from-pink-500 to-orange-400" />
        <VerdictCard name="Amazon Bedrock" data={prosCons.bedrock} accent="from-violet-600 to-sky-500" />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
      <p>
        Independent explainer, not affiliated with Amazon. Back-end stages marked &ldquo;inferred&rdquo; are reconstructed
        from public behaviour.
      </p>
    </footer>
  );
}
