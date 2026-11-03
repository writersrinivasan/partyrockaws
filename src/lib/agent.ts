import { ToolLoopAgent, stepCountIs, tool } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";
import {
  backendFlow,
  bedrockModels,
  innovativeUses,
  prosCons,
  widgetTypes,
} from "./knowledge";

const tools = {
  lookupBedrockModels: tool({
    description:
      "Look up Amazon Bedrock model families: provider, modalities, strengths and how PartyRock uses them. Pass an empty query to list all.",
    inputSchema: z.object({
      query: z.string().describe("Model family or provider name, e.g. 'Claude', 'Nova', 'Meta'. Empty for all."),
    }),
    execute: async ({ query }) => {
      const q = query.toLowerCase().trim();
      const hits = bedrockModels.filter(
        (m) =>
          !q ||
          m.family.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.id.includes(q),
      );
      return hits.length
        ? hits.map((m) => ({ family: m.family, provider: m.provider, modalities: m.modalities, strengths: m.strengths, partyrockRole: m.partyrockRole }))
        : bedrockModels.map((m) => m.family);
    },
  }),

  explainBackendFlow: tool({
    description:
      "Return the end-to-end PartyRock → Bedrock back-end pipeline, optionally for one stage. Stages: " +
      backendFlow.map((s) => s.id).join(", "),
    inputSchema: z.object({
      stage: z.string().optional().describe("Stage id; omit for the whole flow."),
    }),
    execute: async ({ stage }) => {
      const stages = stage ? backendFlow.filter((s) => s.id === stage) : backendFlow;
      return {
        note: "Stages marked inferred are reconstructed from public behaviour; AWS has not published PartyRock's internal architecture.",
        stages: stages.length ? stages : backendFlow,
      };
    },
  }),

  compareProsCons: tool({
    description: "Get pros, cons, biggest plus and biggest minus for PartyRock and/or Amazon Bedrock.",
    inputSchema: z.object({
      target: z.enum(["partyrock", "bedrock", "both"]),
    }),
    execute: async ({ target }) => (target === "both" ? prosCons : { [target]: prosCons[target] }),
  }),

  suggestInnovativeUses: tool({
    description: "Get catalogued innovative ways to use PartyRock, filtered by a theme keyword.",
    inputSchema: z.object({
      theme: z.string().describe("Keyword such as education, evaluation, creative. Empty for all."),
    }),
    execute: async ({ theme }) => {
      const t = theme.toLowerCase().trim();
      const hits = innovativeUses.filter(
        (u) => !t || `${u.title} ${u.body} ${u.tag}`.toLowerCase().includes(t),
      );
      return hits.length ? hits : innovativeUses;
    },
  }),

  draftPartyRockBlueprint: tool({
    description:
      "Validate and normalise a PartyRock app blueprint you designed. Call this after deciding the widgets so the user gets a clean, buildable plan.",
    inputSchema: z.object({
      appName: z.string(),
      widgets: z
        .array(
          z.object({
            name: z.string(),
            type: z.enum(["User Input", "Text Generation", "Image Generation", "Chatbot", "Document", "Static Text"]),
            prompt: z.string().describe("Prompt text; reference other widgets as @Widget Name"),
            suggestedModel: z.string().optional(),
          }),
        )
        .min(1),
    }),
    execute: async ({ appName, widgets }) => {
      const names = new Set(widgets.map((w) => w.name));
      const issues: string[] = [];
      for (const w of widgets) {
        for (const ref of w.prompt.match(/@([\w ]+?)(?=[\s,.;:!?]|$)/g) ?? []) {
          const target = ref.slice(1).trim();
          if (![...names].some((n) => target.startsWith(n))) issues.push(`${w.name} references unknown ${ref}`);
        }
      }
      return {
        appName,
        widgetCount: widgets.length,
        widgets,
        issues,
        availableTypes: widgetTypes,
      };
    },
  }),
};

const instructions = `You are "Rocky", an expert guide to Amazon PartyRock and Amazon Bedrock inside an explainer web app.
Work agentically: call tools to ground your answer in the app's knowledge base before answering. Combine several tools when a question spans topics.
When the user wants an app idea, design widgets and call draftPartyRockBlueprint, then present the blueprint as a numbered widget list.
Be clear about uncertainty: PartyRock's internal architecture is not fully public; say "likely" for inferred parts.
Answer in concise Markdown with short headings and bullets. Keep answers under 300 words unless asked for more.`;

export const ALLOWED_MODELS = [
  "openai/gpt-oss-120b",
  "llama-3.3-70b-versatile",
  "moonshotai/kimi-k2-instruct-0905",
  "openai/gpt-oss-20b",
] as const;

export function createRockyAgent(apiKey: string, modelId: string) {
  const groq = createGroq({ apiKey });
  return new ToolLoopAgent({
    model: groq(modelId),
    instructions,
    tools,
    stopWhen: stepCountIs(6),
  });
}
