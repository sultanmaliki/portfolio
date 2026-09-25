export interface FeaturedProject {
  /** GitHub repo name. The card only shows while that repo is public (deleted repos disappear). */
  repo: string;
  title: string;
  /** Short label above the title, e.g. "Full stack platform · Team of 2". */
  kind: string;
  summary: string;
  /** What was actually built or decided; keep to 2–3 concrete points. */
  highlights: string[];
  stack: string[];
  /** Concrete numbers, when there are honest ones. */
  facts?: string[];
}

/**
 * Curated projects shown first in the Projects section, in this order. Everything else that
 * is public on GitHub follows automatically. The live-demo link comes from the repo's
 * homepage field on GitHub, so it can't drift from the repo.
 */
export const featuredProjects: FeaturedProject[] = [
  {
    repo: "LinkedOut",
    title: "LinkedOut",
    kind: "Full stack platform · Team of 2",
    summary:
      "A career platform where companies discover professionals, with verified company reviews, job postings, a hiring pipeline and a social feed.",
    highlights: [
      "NestJS REST API with JWT access/refresh-token authentication, email verification, role-based admin moderation and validated DTOs, backed by PostgreSQL and Drizzle ORM.",
      "Monorepo on Turborepo and pnpm workspaces, with builds, linting and type checks run through Turborepo; local services via Docker Compose.",
    ],
    stack: ["Next.js", "NestJS", "TypeScript", "PostgreSQL", "Docker"],
    facts: ["300+ Jest unit tests", "54 test suites"],
  },
  {
    repo: "QueryCraft-AI",
    title: "QueryCraft AI",
    kind: "AI assistant · Final-year team of 3",
    summary:
      "A chat assistant that turns plain-English questions into SQL, MongoDB, Cypher and GraphQL queries, then explains and runs them.",
    highlights: [
      "Express.js backend routes each request to a suitable LLM (Gemini, Mistral, Llama via OpenRouter/Ollama) based on query complexity; CSV upload for instant querying.",
      "API secured with JWT authentication, bcrypt password hashing, Helmet security headers and rate limiting; backend containerized with Docker.",
    ],
    stack: ["Next.js", "Node.js", "Express", "MongoDB", "LLM APIs"],
    facts: ["9+ database types", "4 query languages"],
  },
  {
    repo: "setbeat",
    title: "SetBeat",
    kind: "Native Android app",
    summary:
      "A gesture-driven gym timer that can be used mid-workout without looking at the screen: tap, swipe and two-finger gestures control everything.",
    highlights: [
      "Media3 integration shows the track playing in any music app, with a real-time beat-reactive waveform.",
      "Privacy-first by design: no internet permission, no accounts, no analytics.",
    ],
    stack: ["Kotlin", "Jetpack Compose", "Media3"],
    facts: ["No internet permission"],
  },
];
