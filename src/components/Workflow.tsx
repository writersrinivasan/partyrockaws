"use client";

import { useState } from "react";
import { ChevronRight, Info } from "lucide-react";
import { backendFlow, type FlowStage } from "@/lib/knowledge";
import { SectionHeader } from "./Sections";

const layerStyle: Record<FlowStage["layer"], { chip: string; ring: string; dot: string }> = {
  You: { chip: "bg-pink-100 text-pink-700", ring: "ring-pink-400", dot: "bg-pink-500" },
  PartyRock: { chip: "bg-violet-100 text-violet-700", ring: "ring-violet-400", dot: "bg-violet-500" },
  AWS: { chip: "bg-amber-100 text-amber-800", ring: "ring-amber-400", dot: "bg-amber-500" },
  Bedrock: { chip: "bg-sky-100 text-sky-700", ring: "ring-sky-400", dot: "bg-sky-500" },
};

export function Workflow() {
  const [active, setActive] = useState(backendFlow[2].id);
  const stage = backendFlow.find((s) => s.id === active)!;
  const idx = backendFlow.indexOf(stage);

  return (
    <section className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="[&_h2]:text-white [&_p:last-child]:text-slate-300">
          <SectionHeader
            id="workflow"
            eyebrow="3 · The back-end story"
            title="From a sentence to a running app"
            lede="Click any stage to see what happens behind the scenes when you build and run a PartyRock app."
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs">
          {(Object.keys(layerStyle) as FlowStage["layer"][]).map((l) => (
            <span key={l} className="flex items-center gap-1.5 text-slate-300">
              <span className={`h-2.5 w-2.5 rounded-full ${layerStyle[l].dot}`} /> {l}
            </span>
          ))}
        </div>

        <ol className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {backendFlow.map((s, i) => {
            const st = layerStyle[s.layer];
            const on = s.id === active;
            return (
              <li key={s.id} className="relative">
                <button
                  onClick={() => setActive(s.id)}
                  className={`flex h-full w-full flex-col rounded-2xl border p-4 text-left transition ${
                    on
                      ? `border-transparent bg-white text-slate-900 ring-2 ${st.ring}`
                      : "border-slate-800 bg-slate-900 hover:border-slate-600"
                  }`}
                >
                  <span className="text-xs font-mono text-slate-400">0{i + 1}</span>
                  <span className={`mt-2 w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${st.chip}`}>{s.layer}</span>
                  <span className="mt-2 font-semibold leading-tight">{s.title}</span>
                  <span className={`mt-1 text-xs ${on ? "text-slate-600" : "text-slate-400"}`}>{s.summary}</span>
                </button>
                {i < backendFlow.length - 1 && (
                  <ChevronRight
                    size={16}
                    className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-slate-600 lg:block"
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div key={stage.id} className="rise mt-8 grid gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-sm text-slate-400">
              Stage {idx + 1} of {backendFlow.length}
            </p>
            <h3 className="mt-1 text-2xl font-bold">{stage.title}</h3>
            <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${layerStyle[stage.layer].chip}`}>
              {stage.layer} layer
            </span>
            {stage.inferred && (
              <p className="mt-4 flex gap-2 text-xs text-amber-300">
                <Info size={14} className="shrink-0" /> Inferred: AWS hasn&apos;t published this internal detail.
              </p>
            )}
          </div>
          <p className="text-lg leading-relaxed text-slate-200">{stage.detail}</p>
        </div>

        <ArchitectureDiagram />
      </div>
    </section>
  );
}

function ArchitectureDiagram() {
  const box = (x: number, y: number, w: number, label: string, sub: string, fill: string) => (
    <g>
      <rect x={x} y={y} width={w} height={64} rx={14} fill={fill} />
      <text x={x + w / 2} y={y + 28} textAnchor="middle" className="fill-white text-[15px] font-semibold">
        {label}
      </text>
      <text x={x + w / 2} y={y + 47} textAnchor="middle" className="fill-white/80 text-[11px]">
        {sub}
      </text>
    </g>
  );
  const providers = ["Anthropic", "Amazon", "Meta", "Mistral", "Cohere", "Stability"];
  return (
    <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-semibold">Architecture at a glance</h3>
      <p className="text-sm text-slate-400">A request&apos;s path from browser to model and back (orchestration layer inferred).</p>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox="0 0 1000 300" className="min-w-[720px]" role="img" aria-label="PartyRock architecture diagram">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
            </marker>
          </defs>
          {box(10, 40, 160, "Browser", "Widgets + @refs", "#db2777")}
          {box(220, 40, 180, "PartyRock API", "Auth · quota · templates", "#7c3aed")}
          {box(450, 40, 180, "Guardrails", "Safety filters", "#d97706")}
          {box(680, 40, 160, "Bedrock Runtime", "Converse / Invoke", "#0284c7")}
          {box(220, 190, 180, "App store (DB)", "Saved app specs", "#4c1d95")}
          {[
            [170, 72, 220, 72],
            [400, 72, 450, 72],
            [630, 72, 680, 72],
            [310, 104, 310, 190],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={2} className="flow-line" markerEnd="url(#arr)" />
          ))}
          <path d="M760,104 C760,150 90,150 90,104" fill="none" stroke="#34d399" strokeWidth={2} className="flow-line" markerEnd="url(#arr)" />
          <text x={425} y={142} textAnchor="middle" className="fill-emerald-300 text-[11px]">
            streamed tokens / images
          </text>
          {providers.map((p, i) => (
            <g key={p}>
              <rect x={870} y={10 + i * 46} width={120} height={36} rx={10} fill="#0f172a" stroke="#38bdf8" />
              <text x={930} y={33 + i * 46} textAnchor="middle" className="fill-sky-200 text-[12px]">
                {p}
              </text>
              <line x1={840} y1={72} x2={870} y2={28 + i * 46} stroke="#334155" strokeWidth={1.5} />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
