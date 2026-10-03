export type Service = {
  number: string;
  slug: string;
  name: string;
  /** One line, shown on the service card. */
  summary: string;
  /** Two sentences, shown at the top of the service page. */
  intro: string;
  /** A short paragraph on how we approach it, shown above the list of what we offer. */
  overview: string;
  photo: { src: string; alt: string };
  /** Everything we offer under this service, in the order we'd list it. */
  items: string[];
  scenarios: { title: string; body: string }[];
  process: { step: string; body: string }[];
  stack: string[];
};

export const services: Service[] = [
  {
    number: "01",
    slug: "ai-automation",
    name: "AI and automation",
    summary: "Agents, chatbots and automations that take real work off your team's plate.",
    intro:
      "We build AI that does real work inside your business: answering customers, taking orders, reading documents and moving data between systems. It connects to the tools you already use, follows your rules and hands over to a person when it should.",
    photo: { src: "/photos/ai-automation.jpg", alt: "A wireframe AI brain glowing above a grid" },
    overview:
      "Most of the value sits in the repetitive parts of the day: the same questions, the same forms, the same copying between systems. We start with one of those, measure how often the AI gets it right on your real cases, and only then widen what it is allowed to do. Every action is logged, so you can always see what it did and why.",
    items: [
      "AI agent development",
      "AI chatbots and conversational AI",
      "RAG and enterprise knowledge systems",
      "LLM application development",
      "AI workflow and business process automation",
      "n8n automation",
      "WhatsApp AI and automation",
      "Voice AI and speech-to-text systems",
      "Multimodal AI",
      "AI integration into existing applications",
      "AI testing, evaluation and optimisation",
    ],
    scenarios: [
      {
        title: "Ordering on WhatsApp",
        body: "A restaurant group wants customers to order on WhatsApp without staff typing orders by hand. An agent shows the menu, checks the delivery area, applies promotions and writes the confirmed order straight into the POS.",
      },
      {
        title: "Answers from your own documents",
        body: "An operations team answers the same policy questions every day. An assistant answers from the current handbook and links the paragraph it used, so people can check it.",
      },
    ],
    process: [
      { step: "Discover", body: "We read real conversations and documents, list what the AI must and must never do, and agree on accuracy targets." },
      { step: "Prototype", body: "A working agent on your real data within the first weeks, tested against real questions." },
      { step: "Build", body: "Integrations, guardrails, human handover and an evaluation suite that runs on every change." },
      { step: "Support", body: "We review live conversations, fix failure cases and tune cost and speed." },
    ],
    stack: ["Python", "FastAPI", "LangChain", "LangGraph", "LlamaIndex", "OpenAI, Gemini and Qwen models", "n8n", "WhatsApp Cloud API", "Whisper", "PostgreSQL"],
  },
  {
    number: "02",
    slug: "ai-ml-computer-vision",
    name: "AI/ML and computer vision",
    summary: "Custom models that read images, video and documents, trained on your data.",
    intro:
      "When off-the-shelf models aren't accurate enough, we build and train our own. We handle the whole path: collecting and labelling data, training and fine-tuning, measuring accuracy honestly and deploying the model where it's needed.",
    photo: { src: "/photos/ai-ml-computer-vision.jpg", alt: "Camera and lidar sensors on the roof of a self-driving car" },
    overview:
      "Custom models make sense when the job is specific to you: your products, your documents, your camera angles. We collect a sample of real data first and agree what a correct answer looks like, so every model is measured against that rather than a demo. Anything the model is unsure about goes to a person, and their corrections make the next version better.",
    items: [
      "Custom AI/ML model development",
      "Machine learning and deep learning",
      "Computer vision",
      "Object detection and image classification",
      "Image segmentation",
      "YOLO and SAM-based solutions",
      "OCR and document AI",
      "Dataset creation, annotation and curation",
      "Model fine-tuning and deployment",
    ],
    scenarios: [
      {
        title: "Invoices into the accounting system",
        body: "A finance team keys in hundreds of supplier invoices a month. A pipeline reads each one, extracts the line items, flags anything it isn't sure about and posts the rest automatically.",
      },
      {
        title: "Visual inspection",
        body: "A manufacturer checks products by eye at the end of the line. A camera and a trained detection model flag defects and log each one with a photo for review.",
      },
    ],
    process: [
      { step: "Discover", body: "We gather sample images or documents and define exactly which outputs matter." },
      { step: "Prototype", body: "A first model measured on a held-out sample, so accuracy is a number, not a promise." },
      { step: "Build", body: "Production pipeline, review screens for low-confidence results, and integration with your systems." },
      { step: "Support", body: "Reviewer corrections feed back into retraining, so accuracy keeps improving." },
    ],
    stack: ["PyTorch", "TensorFlow", "Hugging Face", "YOLO", "SAM 2", "OpenCV", "Docling", "FastAPI", "Docker"],
  },
  {
    number: "03",
    slug: "web-software-development",
    name: "Web and software development",
    summary: "Web apps, SaaS products and MVPs, built end to end.",
    intro:
      "We design and build software from the database up: web applications, SaaS products, internal tools and the APIs behind them. Permissions, error handling and tests are part of the job from day one.",
    photo: { src: "/photos/web-software-development.jpg", alt: "A laptop showing code on a desk beside a stack of books" },
    overview:
      "We usually start with the smallest version that proves the idea, put it in front of real users, then build out from what they actually use. The code is written to be handed over: documented, tested and deployed in a way your own team or a future hire can pick up. You own all of it.",
    items: [
      "Full-stack web development",
      "React and Next.js development",
      "Node.js, Express and FastAPI development",
      "Custom web applications",
      "SaaS product development",
      "MVP development",
      "Backend and REST API development",
      "Database architecture and development",
      "Custom business software",
      "WordPress development",
    ],
    scenarios: [
      {
        title: "From idea to first customers",
        body: "A founder needs a working product to show investors and early users. We scope the smallest version worth launching and ship it in weeks, on a codebase that can grow.",
      },
      {
        title: "Replacing the spreadsheet",
        body: "An operations team runs the business from a shared spreadsheet that breaks weekly. It becomes a proper internal tool with permissions, history and reporting.",
      },
    ],
    process: [
      { step: "Discover", body: "We define users, roles and the core flows, and design the data model first." },
      { step: "Prototype", body: "Clickable screens, then a working slice of the main flow on real infrastructure." },
      { step: "Build", body: "Feature by feature with tests, code review and weekly releases to a staging site." },
      { step: "Support", body: "Hosting, monitoring, security updates and new features after launch." },
    ],
    stack: ["Next.js", "React", "TypeScript", "Node.js", "Express", "FastAPI", "PostgreSQL", "Prisma", "Supabase", "WordPress"],
  },
  {
    number: "04",
    slug: "real-time-communication",
    name: "Real-time and communication systems",
    summary: "Chat, video calling, live collaboration and presence, built to stay fast.",
    intro:
      "Some software has to update the moment something happens: messages, calls, shared boards, live dashboards. We build real-time systems that stay fast and reliable as the number of people using them grows.",
    photo: { src: "/photos/real-time-communication.jpg", alt: "A video call on a laptop beside a cup of coffee" },
    overview:
      "Real-time features look simple in a demo and get hard under load: dropped connections, messages arriving out of order, people on weak mobile networks, thousands of open sockets. We design for those cases up front and load-test before launch, so the product feels instant on day one and stays that way as usage grows.",
    items: [
      "Real-time web applications",
      "WebSocket and Socket.IO development",
      "Chat and messaging platforms",
      "WebRTC video calling",
      "Real-time collaboration systems",
      "Live notifications and presence systems",
    ],
    scenarios: [
      {
        title: "Messaging inside your product",
        body: "A marketplace wants buyers and sellers to talk without leaving the platform. We add chat with read receipts, file sharing and moderation, backed by the platform's own accounts.",
      },
      {
        title: "Consultations by video",
        body: "A clinic wants to see patients remotely. A browser-based video call with a waiting room, booking and live transcription runs without anyone installing an app.",
      },
    ],
    process: [
      { step: "Discover", body: "We map who talks to whom, how many at once, and what must never be lost." },
      { step: "Prototype", body: "A working real-time slice under realistic load, so latency is measured early." },
      { step: "Build", body: "Scaling, reconnection, storage, moderation and monitoring." },
      { step: "Support", body: "We watch performance as usage grows and tune before it becomes a problem." },
    ],
    stack: ["Socket.IO", "WebSockets", "WebRTC", "Node.js", "Redis", "PostgreSQL", "React", "AWS S3"],
  },
  {
    number: "05",
    slug: "business-ecommerce",
    name: "Business and e-commerce solutions",
    summary: "Stores, marketplaces, CRMs, dashboards and payments.",
    intro:
      "We build the systems a business runs on day to day: where it sells, how it tracks customers, how it gets paid and how leadership sees the numbers. Payments, permissions and reporting are built in, not bolted on.",
    photo: { src: "/photos/business-ecommerce.jpg", alt: "Someone paying online with a card on a laptop" },
    overview:
      "Off-the-shelf platforms cover the common cases. We step in where your business works differently: custom checkout rules, multi-vendor payouts, pricing logic or reporting nobody else offers. We build on proven pieces such as Stripe where they fit, and write custom code only where it earns its keep.",
    items: [
      "E-commerce development",
      "Marketplace development",
      "CRM and lead management systems",
      "Admin and analytics dashboards",
      "Business intelligence and data visualisation",
      "Custom internal business platforms",
      "Payment systems and Stripe integration",
      "Stripe Connect and automated payouts",
    ],
    scenarios: [
      {
        title: "A portal for your clients",
        body: "A consultancy runs its client work over email and spreadsheets. A portal gives each client a login to submit requests, track progress, see invoices and pay online.",
      },
      {
        title: "One set of numbers",
        body: "Sales, finance and operations each report different figures. A single dashboard pulls from each system with agreed definitions, so everyone works from the same numbers.",
      },
    ],
    process: [
      { step: "Discover", body: "We map how money, orders and customer data move through the business today." },
      { step: "Prototype", body: "The core flow working end to end, including a real test payment." },
      { step: "Build", body: "Roles and permissions, payments, reporting and admin tools, with tests." },
      { step: "Support", body: "We keep payments, integrations and reports running as the business changes." },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Stripe", "Stripe Connect", "Redis", "Metabase"],
  },
  {
    number: "06",
    slug: "integrations-infrastructure",
    name: "Integrations and infrastructure",
    summary: "Connect your systems and run them reliably in the cloud.",
    intro:
      "We connect the tools you already pay for so information moves between them without anyone copying and pasting, and we set up the infrastructure underneath so it keeps running when you're not watching.",
    photo: { src: "/photos/integrations-infrastructure.jpg", alt: "Server racks with network cabling in a data centre" },
    overview:
      "We map where your data lives and where it needs to go, then connect the systems with retries, logging and alerts, so a failed sync gets noticed and fixed instead of silently lost. Underneath, we set up deployments, backups and monitoring your team can understand and maintain.",
    items: [
      "Third-party API integrations",
      "WhatsApp Business API",
      "POS integrations",
      "Gmail and Google Workspace integrations",
      "AWS and cloud deployment",
      "Docker and CI/CD",
      "Redis and BullMQ",
      "Background jobs and event-driven systems",
    ],
    scenarios: [
      {
        title: "Orders across systems",
        body: "Online orders are re-entered into the POS and the delivery tool by hand. An integration syncs them automatically and alerts staff when something doesn't match.",
      },
      {
        title: "Deployments without fear",
        body: "A team deploys by hand on Friday nights and hopes. We set up containers, automated tests and one-click deploys with rollbacks and alerts.",
      },
    ],
    process: [
      { step: "Discover", body: "We map every system involved and where data is lost or duplicated today." },
      { step: "Prototype", body: "The most painful connection automated first, running alongside the manual process." },
      { step: "Build", body: "Retries, queues, alerts, logging and documentation, deployed through CI/CD." },
      { step: "Support", body: "We monitor runs and update integrations when the tools on either end change." },
    ],
    stack: ["Node.js", "Python", "AWS (EC2, S3)", "Docker", "GitHub Actions", "Redis", "BullMQ", "Webhooks", "Google Workspace APIs"],
  },
  {
    number: "07",
    slug: "consulting-optimisation",
    name: "Consulting and optimisation",
    summary: "Architecture, reviews and tuning for software and AI you already have.",
    intro:
      "Not every problem needs a new build. We review architecture and code, find what's slow, costly or fragile, and fix it or show your team how. That includes AI systems whose costs or accuracy have drifted.",
    photo: { src: "/photos/consulting-optimisation.jpg", alt: "An engineer explaining a design on a whiteboard" },
    overview:
      "Most engagements start with a short, fixed-scope review: we read the code, look at how it runs in production and talk to the people who work on it. You get a written report of what to fix first and why, with estimates. From there we can make the changes ourselves or work alongside your team.",
    items: [
      "Software architecture",
      "AI/ML architecture",
      "RAG and agent architecture",
      "Technical consulting",
      "Code and architecture reviews",
      "Backend and database optimisation",
      "AI cost and performance optimisation",
      "Authentication, authorisation and RBAC",
      "AI and software QA and testing",
    ],
    scenarios: [
      {
        title: "An AI bill that keeps growing",
        body: "A chatbot's model costs double every quarter. We measure where tokens go, trim prompts, cache what repeats and move simple steps to smaller models, without losing accuracy.",
      },
      {
        title: "A second opinion before you scale",
        body: "A startup is about to hire and grow its product. We review the codebase and architecture, and hand over a prioritised list of what to fix now and what can wait.",
      },
    ],
    process: [
      { step: "Discover", body: "We read the code, the metrics and the incident history before forming a view." },
      { step: "Prototype", body: "The highest-impact fix tried first, with before-and-after numbers." },
      { step: "Build", body: "Fixes applied, or a written plan your team can carry out." },
      { step: "Support", body: "Follow-up reviews to make sure the improvements hold." },
    ],
    stack: ["Architecture reviews", "Load testing", "PostgreSQL tuning", "Observability", "LLM evaluation", "JWT and RBAC"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function nextService(slug: string): Service {
  const i = services.findIndex((s) => s.slug === slug);
  return services[(i + 1) % services.length];
}
