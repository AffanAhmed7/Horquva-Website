export type Service = {
  number: string;
  slug: string;
  name: string;
  /** One line, shown in the services index. */
  summary: string;
  /** Two sentences, shown at the top of the service page. */
  intro: string;
  photo: { src: string; alt: string };
  deliverables: string[];
  scenarios: { title: string; body: string }[];
  process: { step: string; body: string }[];
  stack: string[];
};

export const services: Service[] = [
  {
    number: "01",
    slug: "ai-agents",
    name: "AI agents and chat automation",
    summary: "WhatsApp, web and voice agents that take orders, answer support and work with your database.",
    intro:
      "We build agents that do real work inside your business: taking orders, answering customers, updating records. They connect to your systems, follow your rules and hand over to a person when they should.",
    photo: { src: "/photos/ai-agents.jpg", alt: "A busy restaurant kitchen during service" },
    deliverables: [
      "WhatsApp Business agents for ordering, bookings and support",
      "Website and in-app chat assistants connected to your data",
      "Tool-calling agents that read and write to your database, CRM or POS",
      "Voice notes and images understood inside the conversation",
      "Human handover, audit logs and conversation dashboards",
      "Automated test suites that check the agent before every release",
    ],
    scenarios: [
      {
        title: "Ordering on WhatsApp",
        body: "A restaurant group wants customers to order on WhatsApp without staff typing orders by hand. The agent shows the menu, checks the delivery area, applies promotions and writes the confirmed order straight into the POS.",
      },
      {
        title: "Support that closes tickets",
        body: "A retailer's support inbox is full of the same ten questions. An agent answers them from order data, processes simple returns and passes anything unusual to a person with the full context attached.",
      },
    ],
    process: [
      { step: "Discover", body: "We read real conversations, list what the agent must and must never do, and agree on accuracy targets." },
      { step: "Prototype", body: "A working agent on a test number or page, using your real catalogue or data." },
      { step: "Build", body: "Integrations, guardrails, handover and a test suite that runs on every change." },
      { step: "Support", body: "We watch real conversations after launch, fix failure cases and tune cost and speed." },
    ],
    stack: ["Python", "FastAPI", "LangGraph", "OpenAI, Gemini and Qwen models", "WhatsApp Cloud API", "Whisper", "PostgreSQL", "Pydantic"],
  },
  {
    number: "02",
    slug: "knowledge-assistants",
    name: "Knowledge assistants",
    summary: "Assistants that answer questions from your documents, wikis and data, and show their sources.",
    intro:
      "Most company knowledge lives in PDFs, shared drives and people's heads. We build assistants that search it properly and answer with a reference to where the answer came from, so people can check it.",
    photo: { src: "/photos/knowledge-assistants.jpg", alt: "Shelves of archived paper files" },
    deliverables: [
      "Internal assistants over policies, manuals, contracts and wikis",
      "Ingestion of PDFs, Office files, web pages, repositories and transcripts",
      "Answers with citations back to the exact source passage",
      "Access control so people only see what they're allowed to see",
      "Evaluation sets that measure answer quality over time",
    ],
    scenarios: [
      {
        title: "Policy questions for staff",
        body: "An operations team spends hours answering the same HR and process questions. An assistant answers from the current handbook and links the paragraph it used.",
      },
      {
        title: "Searching years of project files",
        body: "An engineering firm has a decade of reports on a shared drive. An assistant lets staff ask \"have we done this before?\" and get the relevant reports with page references.",
      },
    ],
    process: [
      { step: "Discover", body: "We collect the real questions people ask and the documents that should answer them." },
      { step: "Prototype", body: "An assistant over a sample of your documents, tested against those questions." },
      { step: "Build", body: "Full ingestion, permissions, citations and a quality evaluation you can rerun." },
      { step: "Support", body: "New documents are indexed automatically and weak answers are reviewed and fixed." },
    ],
    stack: ["Python", "LangChain", "LlamaIndex", "FAISS", "ChromaDB", "pgvector", "Docling", "FastAPI"],
  },
  {
    number: "03",
    slug: "document-vision-ai",
    name: "Document and vision AI",
    summary: "Data extraction from documents, computer vision and custom-trained models.",
    intro:
      "We turn documents and images into structured data your systems can use. Where off-the-shelf models aren't accurate enough, we train and fine-tune our own on your data.",
    photo: { src: "/photos/document-vision-ai.jpg", alt: "Hands sorting printed forms and invoices on a desk" },
    deliverables: [
      "Extraction of fields and tables from invoices, receipts, forms and reports",
      "Classification and routing of incoming documents",
      "Object detection and segmentation models for images and video",
      "Fine-tuning of vision and vision-language models on your data",
      "Review screens where people check low-confidence results",
    ],
    scenarios: [
      {
        title: "Invoices into the accounting system",
        body: "A finance team keys in hundreds of supplier invoices a month. A pipeline reads each invoice, extracts the line items, flags anything it isn't sure about and posts the rest automatically.",
      },
      {
        title: "Visual inspection",
        body: "A manufacturer checks products by eye at the end of the line. A camera and a trained detection model flag defects and log them with a photo for review.",
      },
    ],
    process: [
      { step: "Discover", body: "We gather sample documents or images and define exactly which outputs matter." },
      { step: "Prototype", body: "A first model measured on a held-out sample, so accuracy is a number, not a promise." },
      { step: "Build", body: "Production pipeline, review interface and integration with your systems." },
      { step: "Support", body: "Corrections from reviewers feed back into retraining so accuracy improves." },
    ],
    stack: ["PyTorch", "Hugging Face", "YOLO", "SAM 2", "Docling", "OpenCV", "FastAPI", "Next.js"],
  },
  {
    number: "04",
    slug: "voice-ai",
    name: "Voice AI",
    summary: "Speech-to-text, text-to-speech and voice assistants, including Urdu and Roman Urdu.",
    intro:
      "We build systems that listen and speak: transcription, voice assistants and phone agents. We pay particular attention to local languages and accents, where generic tools often fall short.",
    photo: { src: "/photos/voice-ai.jpg", alt: "A studio microphone in low warm light" },
    deliverables: [
      "Transcription of calls, meetings and voice notes, including Urdu and Roman Urdu",
      "Voice assistants for devices, kiosks and apps",
      "Phone agents that answer, book and route calls",
      "Text-to-speech pipelines and voice dataset preparation",
      "Low-latency streaming for real-time conversations",
    ],
    scenarios: [
      {
        title: "Searchable call recordings",
        body: "A call centre records every call but nobody can search them. Calls are transcribed, tagged by topic and made searchable, with a summary on each one.",
      },
      {
        title: "Voice notes into orders",
        body: "Customers send voice notes in Roman Urdu instead of typing. The system transcribes them, understands the request and turns it into a structured order.",
      },
    ],
    process: [
      { step: "Discover", body: "We collect real audio samples and measure how current tools perform on them." },
      { step: "Prototype", body: "A working pipeline tested on your audio, with word error rate reported." },
      { step: "Build", body: "Streaming, integrations, fallbacks for poor audio and monitoring." },
      { step: "Support", body: "We tune for new accents, vocabulary and noise conditions as they appear." },
    ],
    stack: ["Whisper", "Wav2Vec2", "WebRTC", "FastAPI", "Python", "Groq", "Raspberry Pi"],
  },
  {
    number: "05",
    slug: "automation-integrations",
    name: "Workflow automation and integrations",
    summary: "n8n and LangGraph automations, webhooks, and POS, CRM and ERP integrations.",
    intro:
      "We connect the tools you already pay for so information moves between them without anyone copying and pasting. Where a step needs judgement, we add AI to handle it.",
    photo: { src: "/photos/automation-integrations.jpg", alt: "Parcels moving along a warehouse conveyor" },
    deliverables: [
      "Automations in n8n or custom code, hosted and monitored",
      "Integrations with POS, CRM, ERP, accounting and messaging platforms",
      "Webhooks and APIs built for systems that don't have one",
      "Email and inbox agents that read, classify and act on messages",
      "Retries, alerts and logs so failures are caught, not discovered",
    ],
    scenarios: [
      {
        title: "Enquiries into the CRM",
        body: "Leads arrive by email, web form and WhatsApp. Each one is captured, deduplicated, enriched and created in the CRM with the right owner assigned.",
      },
      {
        title: "Orders across systems",
        body: "Online orders are re-entered into the POS and the delivery tool by hand. An integration syncs them automatically and alerts staff when something doesn't match.",
      },
    ],
    process: [
      { step: "Discover", body: "We map the workflow step by step and count where time and errors go." },
      { step: "Prototype", body: "The most painful step automated first, running alongside the manual process." },
      { step: "Build", body: "The full workflow with error handling, retries, alerts and documentation." },
      { step: "Support", body: "We monitor runs and update integrations when the tools on either end change." },
    ],
    stack: ["n8n", "LangGraph", "Node.js", "Python", "Webhooks", "REST APIs", "Google Workspace APIs", "PostgreSQL"],
  },
  {
    number: "06",
    slug: "web-product-engineering",
    name: "Web and product engineering",
    summary: "SaaS platforms, dashboards, client portals, payments and real-time apps.",
    intro:
      "We design and build web products end to end, from database schema to interface. The things that make software dependable, like permissions, payments and audit trails, are built in from the start.",
    photo: { src: "/photos/web-product-engineering.jpg", alt: "An engineer working at a desk late in the evening" },
    deliverables: [
      "SaaS platforms and internal tools",
      "Client and partner portals with role-based access",
      "Admin dashboards, reporting and KPI views",
      "Payments, subscriptions, invoicing and payouts with Stripe",
      "Real-time features: chat, live updates, presence and notifications",
      "Background jobs and queues for heavy or slow work",
    ],
    scenarios: [
      {
        title: "A portal for your clients",
        body: "A consultancy runs its client work over email and spreadsheets. A portal gives each client a login to submit requests, track progress, see invoices and pay online.",
      },
      {
        title: "Replacing the spreadsheet",
        body: "An operations team runs the business from a shared spreadsheet that breaks weekly. It becomes a proper internal tool with permissions, history and a dashboard.",
      },
    ],
    process: [
      { step: "Discover", body: "We define users, roles and the core flows, and design the data model first." },
      { step: "Prototype", body: "Clickable screens, then a working slice of the main flow on real infrastructure." },
      { step: "Build", body: "Feature by feature with tests, code review and weekly releases to a staging site." },
      { step: "Support", body: "Hosting, monitoring, security updates and new features after launch." },
    ],
    stack: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Supabase", "Stripe", "Redis", "Socket.io"],
  },
  {
    number: "07",
    slug: "wordpress",
    name: "WordPress development",
    summary: "Custom themes and plugins, WooCommerce, speed and security fixes, and headless WordPress.",
    intro:
      "WordPress runs a huge share of the web, and it can be fast and secure when it's built well. We build custom themes and plugins, fix slow or broken sites, and set up WordPress as a back end for modern front ends.",
    photo: { src: "/photos/wordpress.jpg", alt: "A designer's desk with printed page layouts" },
    deliverables: [
      "Custom themes built from your design, without heavy page builders",
      "Custom plugins and integrations with your other systems",
      "WooCommerce stores, payments and shipping setup",
      "Speed, security and Core Web Vitals fixes for existing sites",
      "Headless WordPress with a Next.js front end",
      "Hosting setup, backups, updates and maintenance",
    ],
    scenarios: [
      {
        title: "A slow site that loses sales",
        body: "A store built on a page builder takes eight seconds to load on mobile. We rebuild the theme, remove unused plugins and fix hosting so pages load in under two seconds.",
      },
      {
        title: "Content team keeps WordPress",
        body: "A company wants a modern, fast site but its editors know WordPress. We keep WordPress for editing and build the public site in Next.js on top of it.",
      },
    ],
    process: [
      { step: "Discover", body: "We audit the current site, or agree on the design and content model for a new one." },
      { step: "Prototype", body: "Key templates built first and reviewed on a staging site." },
      { step: "Build", body: "Full theme or plugin, content migration, performance and security hardening." },
      { step: "Support", body: "Updates, backups, uptime monitoring and changes on request." },
    ],
    stack: ["WordPress", "PHP", "WooCommerce", "Advanced Custom Fields", "WPGraphQL", "Next.js", "MySQL"],
  },
  {
    number: "08",
    slug: "data-analytics",
    name: "Data and analytics",
    summary: "Dashboards, KPI reporting, data cleaning and validation, and data pipelines.",
    intro:
      "We get your data into one reliable place and turn it into reports people trust. That starts with the unglamorous part: cleaning and validating the data before anyone draws conclusions from it.",
    photo: { src: "/photos/data-analytics.jpg", alt: "Printed charts and notes spread across a meeting table" },
    deliverables: [
      "Dashboards and KPI reports for leadership and operations",
      "Pipelines that pull data from your systems on a schedule",
      "Data cleaning, deduplication and validation rules",
      "Reconciliation reports that flag discrepancies across records",
      "Exports and scheduled reports by email",
    ],
    scenarios: [
      {
        title: "One set of numbers",
        body: "Sales, finance and operations each report different figures. A single pipeline pulls from each system, applies agreed definitions and feeds one dashboard everyone uses.",
      },
      {
        title: "Catching errors in records",
        body: "A compliance team checks large datasets by hand. Validation rules run automatically and produce a list of discrepancies to review.",
      },
    ],
    process: [
      { step: "Discover", body: "We list the decisions the data should support and trace where each number comes from." },
      { step: "Prototype", body: "A first dashboard on real data, so definitions get agreed early." },
      { step: "Build", body: "Automated pipelines, validation rules, access control and documentation." },
      { step: "Support", body: "We keep pipelines running and add metrics as questions change." },
    ],
    stack: ["Python", "Pandas", "SQL", "PostgreSQL", "Streamlit", "Metabase", "Node.js"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function nextService(slug: string): Service {
  const i = services.findIndex((s) => s.slug === slug);
  return services[(i + 1) % services.length];
}
