# PartyRock × Bedrock Explorer

A Next.js app explaining how Amazon PartyRock runs on Amazon Bedrock: models, back-end workflow,
infographics, innovative uses, pros & cons, plus "Rocky", an agentic AI guide.

## Run

```bash
npm install
npm run dev   # http://localhost:3000
```

## AI guide (BYOK, Groq)

- Paste your Groq key (https://console.groq.com/keys) into the "Ask Rocky" panel.
- The key stays in your browser (localStorage, optional) and is sent per request in the
  `x-groq-key` header to `/api/agent`, which uses it for that call only. Nothing is stored server-side.
- The agent is a Vercel AI SDK `ToolLoopAgent` (`src/lib/agent.ts`) with tools over the shared
  knowledge base (`src/lib/knowledge.ts`): model lookup, back-end flow, pros/cons, innovative uses,
  and an app-blueprint validator. Answers show which tools were called.

## Structure

- `src/lib/knowledge.ts`: all content (edit here to update both the site and the agent)
- `src/components/`: Sections, Workflow (interactive pipeline + architecture SVG), Infographics, Assistant
- `src/app/api/agent/route.ts`: BYOK agent endpoint
