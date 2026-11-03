import { SectionHeader } from "./Sections";

// Editorial 1–5 ratings, not measured benchmarks.
const dimensions = [
  { name: "Time to first app", partyrock: 5, bedrock: 2 },
  { name: "Cost to start", partyrock: 5, bedrock: 3 },
  { name: "Model choice", partyrock: 3, bedrock: 5 },
  { name: "Customisation", partyrock: 2, bedrock: 5 },
  { name: "Scalability", partyrock: 1, bedrock: 5 },
  { name: "Security & governance", partyrock: 2, bedrock: 5 },
];

const journey = [
  { step: "Idea", note: "One-line description", color: "#db2777" },
  { step: "PartyRock", note: "Prototype & share", color: "#ea580c" },
  { step: "Bedrock Playground", note: "Tune prompts & params", color: "#7c3aed" },
  { step: "Bedrock API", note: "Lambda · KB · Agents", color: "#0284c7" },
  { step: "Production", note: "Guardrails · monitoring", color: "#059669" },
];

const positions = [
  { name: "PartyRock", ease: 0.92, control: 0.18, color: "#ec4899" },
  { name: "Bedrock Playground", ease: 0.68, control: 0.42, color: "#f97316" },
  { name: "Bedrock Agents / KB", ease: 0.45, control: 0.7, color: "#7c3aed" },
  { name: "Bedrock API + code", ease: 0.2, control: 0.92, color: "#0284c7" },
];

const layers = [
  { name: "You", desc: "Prompt, inputs, sharing", color: "#ec4899", w: 52 },
  { name: "PartyRock UI", desc: "Widgets, @references, remix", color: "#d946ef", w: 64 },
  { name: "Orchestration", desc: "Templates, quota, guardrails", color: "#8b5cf6", w: 76 },
  { name: "Amazon Bedrock", desc: "Converse / InvokeModel", color: "#3b82f6", w: 88 },
  { name: "Foundation models", desc: "Claude · Nova · Llama · Mistral …", color: "#0ea5e9", w: 100 },
];

export function Infographics() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionHeader
        id="infographics"
        eyebrow="4 · Infographics"
        title="The picture in four visuals"
        lede="Where PartyRock sits in the stack, how it compares with Bedrock, and the path from playful prototype to production."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card title="The stack" sub="Every widget run travels down these layers and back up.">
          <div className="flex flex-col items-center gap-2">
            {layers.map((l) => (
              <div
                key={l.name}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-white shadow-sm"
                style={{ width: `${l.w}%`, background: l.color }}
              >
                <span className="font-semibold">{l.name}</span>
                <span className="hidden text-xs opacity-90 sm:inline">{l.desc}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Ease vs. control" sub="The AWS GenAI ladder: climb as your needs grow.">
          <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label="Ease of use versus control chart">
            <line x1="40" y1="220" x2="390" y2="220" stroke="#cbd5e1" />
            <line x1="40" y1="10" x2="40" y2="220" stroke="#cbd5e1" />
            <text x="215" y="250" textAnchor="middle" className="fill-slate-500 text-[12px]">
              Control & customisation →
            </text>
            <text x="14" y="115" textAnchor="middle" transform="rotate(-90 14 115)" className="fill-slate-500 text-[12px]">
              Ease of use →
            </text>
            <path
              d={`M${positions.map((p) => `${40 + p.control * 340},${220 - p.ease * 200}`).join(" L")}`}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
              strokeDasharray="4 6"
            />
            {positions.map((p) => {
              const x = 40 + p.control * 340;
              const y = 220 - p.ease * 200;
              return (
                <g key={p.name}>
                  <circle cx={x} cy={y} r="11" fill={p.color} />
                  <text
                    x={x + (p.control > 0.6 ? -16 : 16)}
                    y={y + 4}
                    textAnchor={p.control > 0.6 ? "end" : "start"}
                    className="fill-slate-800 text-[12px] font-semibold"
                  >
                    {p.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </Card>

        <Card title="PartyRock vs. Bedrock" sub="Editorial rating, 1 (weak) to 5 (strong).">
          <div className="mb-4 flex gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-pink-500" /> PartyRock</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-sky-500" /> Bedrock</span>
          </div>
          <div className="space-y-4">
            {dimensions.map((d) => (
              <div key={d.name}>
                <p className="mb-1 text-sm font-medium text-slate-700">{d.name}</p>
                {(["partyrock", "bedrock"] as const).map((k) => (
                  <div key={k} className="mb-1 flex items-center gap-2">
                    <div className="h-3 flex-1 rounded-full bg-slate-100">
                      <div
                        className={`h-3 rounded-full ${k === "partyrock" ? "bg-gradient-to-r from-pink-500 to-orange-400" : "bg-gradient-to-r from-violet-500 to-sky-500"}`}
                        style={{ width: `${d[k] * 20}%` }}
                      />
                    </div>
                    <span className="w-4 text-right text-xs tabular-nums text-slate-500">{d[k]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Prototype → production journey" sub="PartyRock is step two, not the destination.">
          <ol className="relative space-y-5 border-l-2 border-dashed border-slate-200 pl-8">
            {journey.map((j, i) => (
              <li key={j.step} className="relative">
                <span
                  className="absolute -left-[45px] grid h-8 w-8 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ background: j.color }}
                >
                  {i + 1}
                </span>
                <p className="font-semibold">{j.step}</p>
                <p className="text-sm text-slate-500">{j.note}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </section>
  );
}

function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mb-6 text-sm text-slate-500">{sub}</p>
      {children}
    </div>
  );
}
