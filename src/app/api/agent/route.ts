import { ALLOWED_MODELS, createRockyAgent } from "@/lib/agent";

export const maxDuration = 60;

type ChatMessage = { role: "user" | "assistant"; content: string };

// BYOK: the Groq key arrives per request in a header and is used only for this call.
// It is never logged, persisted or returned.
export async function POST(req: Request) {
  const apiKey = req.headers.get("x-groq-key")?.trim();
  if (!apiKey) {
    return Response.json({ error: "Add your Groq API key to use the assistant." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { messages?: ChatMessage[]; model?: string } | null;
  const messages = (body?.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "No question supplied." }, { status: 400 });
  }
  const model = (ALLOWED_MODELS as readonly string[]).includes(body?.model ?? "")
    ? body!.model!
    : ALLOWED_MODELS[0];

  try {
    const agent = createRockyAgent(apiKey, model);
    const result = await agent.generate({ messages });
    const trace = result.steps.flatMap((step) =>
      step.toolCalls.map((call) => ({ step: step.stepNumber, tool: call.toolName, input: call.input })),
    );
    return Response.json({ text: result.text, trace, model });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Agent failed";
    const status = /401|invalid api key|unauthorized/i.test(message) ? 401 : 500;
    return Response.json(
      { error: status === 401 ? "Groq rejected the API key. Check it and try again." : message },
      { status },
    );
  }
}
