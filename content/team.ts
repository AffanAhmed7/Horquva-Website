export type Person = {
  name: string;
  role: string;
  /** Path under /public; undefined renders an initials block. */
  photo?: string;
  bio: string;
  linkedin?: string;
};

/** In display order; the home page shows the first four. */
export const team: Person[] = [
  {
    name: "Kia Vang",
    role: "Co-founder, COO and CFO",
    photo: "/photos/team/kia-vang.jpg",
    bio: "Two decades in mid-market manufacturing and consumer goods. A CPA focused on P&L accountability, operations and financial change.",
  },
  {
    name: "Taha Omer Nadeem",
    role: "Board security advisor",
    photo: "/photos/team/taha-omer-nadeem.jpg",
    bio: "Twelve years across cybersecurity support, professional services and sales engineering for large enterprises.",
  },
  {
    name: "Natasha Khan",
    role: "Founder, CEO and CTO",
    photo: "/photos/team/natasha-khan.jpg",
    bio: "Leads Horquva's technology and product direction, and is building OBA Core around a simple idea: organisations should be able to see how their work actually connects.",
  },
  {
    name: "Affan Ahmed",
    role: "Full-stack engineer",
    photo: "/photos/team/affan-ahmed.jpg",
    bio: "Builds web platforms end to end: Next.js front ends, Node and PostgreSQL back ends, payments, role-based access and real-time features. Previously built Stripe Connect payouts and client portals for a US consultancy.",
  },
  {
    name: "Muhammad Ibrahim Shaikh",
    role: "AI engineer",
    photo: "/photos/team/muhammad-ibrahim-shaikh.jpg",
    bio: "Builds AI agents, retrieval systems and voice and vision pipelines. Previously built a multi-tenant WhatsApp ordering agent used by 25 restaurants, and TTS data pipelines at Entropik Labs.",
  },
  {
    name: "Memoona Saleem",
    role: "Head of business development",
    photo: "/photos/team/memoona-saleem.jpg",
    bio: "Works with organisations exploring AI and automation, and is usually the first person you'll speak to at Horquva.",
  },
  {
    name: "Muhammad Usman Azhar",
    role: "Marketing manager",
    photo: "/photos/team/muhammad-usman-azhar.jpg",
    bio: "Twelve years leading B2B marketing, community growth and brand development for tech companies. Runs Horquva's performance marketing and outbound pipeline.",
  },
  {
    name: "Hooriya K",
    role: "Senior manager",
    photo: "/photos/team/hooriya-k.jpg",
    bio: "Runs planning, governance and coordination, working closely with leadership to keep projects and internal processes on track.",
  },
];
