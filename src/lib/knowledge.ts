// Single source of truth for the site content and the agent's tools.
// PartyRock internals are not fully published by AWS; anything marked
// `inferred: true` is a reasoned reconstruction from public docs and behaviour.

export type BedrockModel = {
  id: string;
  family: string;
  provider: string;
  modalities: string[];
  strengths: string[];
  partyrockRole: string;
  color: string;
};

export const bedrockModels: BedrockModel[] = [
  {
    id: "claude",
    family: "Claude",
    provider: "Anthropic",
    modalities: ["text", "vision"],
    strengths: ["Long-context reasoning", "Careful instruction following", "Writing & analysis"],
    partyrockRole: "Common choice for Text Generation and Chatbot widgets that need nuanced reasoning.",
    color: "from-orange-400 to-amber-500",
  },
  {
    id: "nova",
    family: "Amazon Nova",
    provider: "Amazon",
    modalities: ["text", "image", "video"],
    strengths: ["Low latency & cost", "Multimodal understanding", "Native AWS model family"],
    partyrockRole: "Amazon's own models; Nova Canvas generates images, Nova Lite/Pro/Micro handle text.",
    color: "from-sky-400 to-blue-600",
  },
  {
    id: "titan",
    family: "Amazon Titan",
    provider: "Amazon",
    modalities: ["text", "image", "embeddings"],
    strengths: ["Embeddings for search/RAG", "Image generation", "Built-in watermarking"],
    partyrockRole: "Earlier Amazon models; Titan Image Generator powered early image widgets.",
    color: "from-cyan-400 to-teal-500",
  },
  {
    id: "llama",
    family: "Llama",
    provider: "Meta",
    modalities: ["text", "vision"],
    strengths: ["Open weights", "Strong general chat", "Cost efficient"],
    partyrockRole: "Open-weight option for chat and text widgets.",
    color: "from-indigo-400 to-violet-600",
  },
  {
    id: "mistral",
    family: "Mistral",
    provider: "Mistral AI",
    modalities: ["text"],
    strengths: ["Fast inference", "Efficient multilingual", "Mixture-of-experts variants"],
    partyrockRole: "Lightweight text generation where speed matters.",
    color: "from-amber-400 to-orange-600",
  },
  {
    id: "cohere",
    family: "Command & Embed",
    provider: "Cohere",
    modalities: ["text", "embeddings"],
    strengths: ["Enterprise RAG", "Multilingual embeddings", "Reranking"],
    partyrockRole: "Retrieval-oriented text; mostly relevant once you graduate to Bedrock proper.",
    color: "from-emerald-400 to-green-600",
  },
  {
    id: "ai21",
    family: "Jamba",
    provider: "AI21 Labs",
    modalities: ["text"],
    strengths: ["Hybrid SSM-Transformer", "Very long context", "Throughput"],
    partyrockRole: "Long-document text generation.",
    color: "from-pink-400 to-rose-600",
  },
  {
    id: "stability",
    family: "Stable Diffusion / Image",
    provider: "Stability AI",
    modalities: ["image"],
    strengths: ["Artistic control", "Style variety", "Photoreal output"],
    partyrockRole: "Alternative engine for Image Generation widgets.",
    color: "from-fuchsia-400 to-purple-600",
  },
];

export type FlowStage = {
  id: string;
  title: string;
  layer: "You" | "PartyRock" | "Bedrock" | "AWS";
  summary: string;
  detail: string;
  inferred?: boolean;
};

export const backendFlow: FlowStage[] = [
  {
    id: "signin",
    title: "Sign in",
    layer: "You",
    summary: "Social login, no AWS account.",
    detail:
      "You sign in with an Amazon, Apple or Google identity. No AWS account, IAM role or credit card is required: PartyRock owns the AWS account that talks to Bedrock and meters usage per user.",
  },
  {
    id: "prompt",
    title: "Describe your app",
    layer: "You",
    summary: "One sentence → an app.",
    detail:
      "In the App Builder you type what you want (\"a trip planner that writes an itinerary and draws a postcard\").",
  },
  {
    id: "builder",
    title: "App Builder LLM",
    layer: "PartyRock",
    summary: "An LLM writes the app spec.",
    detail:
      "A foundation model on Bedrock turns your description into a structured app definition: a list of widgets, their types, prompts, model choices and the @references that wire them together. This is meta-prompting: the model generates prompts for other models.",
    inferred: true,
  },
  {
    id: "widgets",
    title: "Widget graph",
    layer: "PartyRock",
    summary: "Widgets form a dependency graph.",
    detail:
      "Each widget (User Input, Text Generation, Image Generation, Chatbot, Document, Static Text) is a node. When a prompt mentions @Another Widget, that widget's output is injected. The front end resolves the graph and re-runs only the downstream nodes whose inputs changed.",
  },
  {
    id: "orchestrator",
    title: "Orchestration API",
    layer: "AWS",
    summary: "Serverless back end assembles calls.",
    detail:
      "A serverless API layer (typical AWS pattern: API Gateway + Lambda + a database for app definitions) fills in prompt templates, applies guardrails, checks your usage quota and sends the call to Bedrock. The model call is made by PartyRock's service account, not yours.",
    inferred: true,
  },
  {
    id: "bedrock",
    title: "Amazon Bedrock",
    layer: "Bedrock",
    summary: "One API, many models.",
    detail:
      "Bedrock exposes Converse / InvokeModel APIs over models from Anthropic, Amazon, Meta, Mistral, Cohere, AI21 and Stability. PartyRock switches a widget's model by changing the model ID; the rest of the pipeline stays the same. Prompts and outputs are not used to train the base models.",
  },
  {
    id: "stream",
    title: "Stream back",
    layer: "PartyRock",
    summary: "Tokens stream into the widget.",
    detail:
      "Responses stream token by token into the widget, then trigger dependent widgets. Images return as generated files rendered in place.",
  },
  {
    id: "share",
    title: "Share & remix",
    layer: "You",
    summary: "Public link, one-click remix.",
    detail:
      "Publishing creates a public URL. Anyone signed in can use the app and spend their own free usage; Remix copies the full app definition so others can fork and modify it.",
  },
];

export const widgetTypes = [
  { name: "User Input", purpose: "Text the user types; the root of most graphs." },
  { name: "Text Generation", purpose: "Prompt + model → text. The workhorse widget." },
  { name: "Image Generation", purpose: "Prompt → image via an image model." },
  { name: "Chatbot", purpose: "Multi-turn chat that can see other widgets via @references." },
  { name: "Document", purpose: "Upload a file so its text can be referenced in prompts." },
  { name: "Static Text", purpose: "Fixed instructions or branding on the page." },
];

export const innovativeUses = [
  {
    title: "Prompt-chain prototyping",
    body: "Sketch a multi-step agent (research → outline → draft → critique) as chained widgets before writing any code. Each widget is one step you can inspect.",
    tag: "Builders",
  },
  {
    title: "Model bake-off board",
    body: "Put the same @input into four Text Generation widgets, each on a different Bedrock model. You get a side-by-side eval harness for free.",
    tag: "Evaluation",
  },
  {
    title: "Classroom labs",
    body: "Teachers publish a tutor app; students remix it. No AWS accounts, no keys, no setup: the fastest way to teach prompt engineering.",
    tag: "Education",
  },
  {
    title: "Self-critique loop",
    body: "Widget A drafts, Widget B critiques @A against a rubric, Widget C rewrites using @A and @B. A reflection pattern in three boxes.",
    tag: "Quality",
  },
  {
    title: "Document copilots",
    body: "Upload a policy, contract or syllabus, then add a Chatbot that references @Document plus extraction widgets for summary, risks and FAQs.",
    tag: "Productivity",
  },
  {
    title: "Stakeholder demos",
    body: "Validate a GenAI product idea with real users via a share link, then port the proven prompts to Bedrock + Lambda for production.",
    tag: "Product",
  },
  {
    title: "Multimodal storytelling",
    body: "Story text → scene description → image → narration script. Chained text and image widgets make illustrated content pipelines.",
    tag: "Creative",
  },
  {
    title: "Guardrail red-teaming",
    body: "Build a quick app to probe how different models respond to edge-case prompts before you pick one for production.",
    tag: "Safety",
  },
];

export const prosCons = {
  partyrock: {
    pros: [
      "Zero setup: no AWS account, no credit card, no code",
      "Free daily usage to experiment",
      "Visual widget chaining teaches prompt orchestration",
      "Swap between multiple Bedrock models in one click",
      "Instant share links and remixing for collaboration",
    ],
    cons: [
      "Playground only: no custom code, APIs, or external data sources",
      "Usage caps make it unsuitable for real traffic",
      "Limited control over parameters, versions and logging",
      "No private VPC, IAM or enterprise governance",
      "Export path to production is manual (copy prompts across)",
    ],
    biggestPlus: "Turns an idea into a shareable GenAI app in minutes, with no code and no AWS account.",
    biggestMinus: "It's a sandbox: there's no supported way to run a PartyRock app as a production workload.",
  },
  bedrock: {
    pros: [
      "One API across many top model providers",
      "Enterprise security: IAM, VPC endpoints, encryption, data not used for training",
      "Knowledge Bases (RAG), Agents, Guardrails and fine-tuning built in",
      "Serverless: pay per token, no GPUs to manage",
      "Deep AWS integration (Lambda, S3, CloudWatch, Step Functions)",
    ],
    cons: [
      "Model availability varies by region and requires access setup",
      "Costs can grow quickly at scale without monitoring",
      "Newest models may arrive later than on provider-native APIs",
      "Learning curve: IAM, quotas, and service limits",
      "Each model has its own prompt quirks and limits",
    ],
    biggestPlus: "Choice plus governance: swap frontier models behind one secure, AWS-native API.",
    biggestMinus: "Operational complexity and cost management are on you once you scale.",
  },
};

export const stats = [
  { value: "8+", label: "Model providers on Bedrock" },
  { value: "6", label: "PartyRock widget types" },
  { value: "0", label: "Lines of code to build" },
  { value: "1", label: "Click to remix" },
];
