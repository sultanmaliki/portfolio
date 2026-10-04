import { GITHUB_USERNAME } from "./config";

/**
 * Everything about *me* that any design may need: identity, voice, links, story, skills.
 * Designs never hard-code this content; they read it from `portfolio` in "@/data".
 * (Work, education and projects live next to this file in their own modules.)
 */

export interface ContactLink {
  id: "github" | "linkedin" | "email" | "resume";
  label: string;
  href: string;
  /** Shown in the in-page link preview card (external profiles only). */
  preview?: { title: string; description: string };
}

export interface SkillCategory {
  title: string;
  subtitle: string;
  items: string[];
}

export interface TimelineEntry {
  year: string;
  desc: string;
}

export interface Story {
  /** The three opening thoughts, without quote marks (each design decides how to quote them). */
  quotes: [string, string, string];
  paragraphs: string[];
  /** The closing refrain; `punchline.emphasis` is the part a design should stress. */
  refrain: { lines: string[]; punchline: { lead: string; emphasis: string } };
}

const EMAIL = "ssultanmaliki47@gmail.com";

export const profile = {
  name: "Syed Mohammed Sultan",
  givenName: "Syed Mohammed",
  familyName: "Sultan",

  /** Two short descriptors shown under the name. */
  tagline: ["Computer Science Graduate", "Full Stack Java Developer"] as [string, string],
  jobTitle: "Full Stack Developer",

  /** From the resume. */
  summary:
    "Computer Science Engineering graduate (VTU, 2026) and full stack developer intern with hands-on experience building web applications using React.js, Next.js, TypeScript and Node.js, and backend systems in Java. Experienced in designing REST APIs, relational and NoSQL databases (MySQL, PostgreSQL, MongoDB), JWT authentication, unit testing and Docker. Has built LLM-powered applications and a native Android app in Kotlin, and uses AI-assisted development tools daily. Looking for entry-level software engineering roles.",

  availability: {
    status: "Open to entry-level roles",
    detail: "Relocating to Bangalore",
  },

  location: {
    city: "Bhatkal",
    region: "Karnataka",
    country: "IN",
    relocatingTo: "Bangalore",
    sentence: "Based in Bhatkal, Karnataka. Open to relocating to Bangalore.",
  },

  email: EMAIL,
  resume: { url: "/resume.pdf", filename: "Syed_Mohammed_Sultan_Resume.pdf" },

  /** Big statements that punctuate the page, one array of lines each. */
  statements: [
    ["Building software", "that people remember."],
    ["Curiosity", "became", "my greatest tool."],
  ] as string[][],

  contact: {
    headline: ["Let’s build something", "meaningful."] as [string, string],
    pitch:
      "I’m looking for entry-level software engineering roles where curiosity, engineering, and thoughtful products come together.",
  },

  links: [
    {
      id: "github",
      label: "GitHub",
      href: `https://github.com/${GITHUB_USERNAME}`,
      preview: {
        title: `GitHub: ${GITHUB_USERNAME}`,
        description: "Everything I’ve built in public: source code, commit history and READMEs.",
      },
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/syedmohammedsultan",
      preview: {
        title: "Syed Mohammed Sultan on LinkedIn",
        description: "My professional profile: experience, education and the best way to get in touch.",
      },
    },
    { id: "email", label: "Email", href: `mailto:${EMAIL}` },
    { id: "resume", label: "Resume", href: "/resume.pdf" },
  ] as ContactLink[],
};

export const story: Story = {
  quotes: [
    "I don’t spend every hour coding.",
    "But when an idea captures my curiosity…",
    "…time quietly disappears.",
  ],
  paragraphs: [
    "My journey into programming started in 2021 during pre-university.",
    "Technology fascinated me long before I understood everything behind it. Beautiful interfaces, interactive experiences, and the invisible logic powering them made me want to build things myself.",
    "Classrooms gave me the fundamentals. The passion came from building on my own.",
    "It started when I began coding out of pure curiosity, just to see what I could make.",
  ],
  refrain: {
    lines: ["Curiosity eventually became habit.", "Habit became experimentation."],
    punchline: { lead: "Experimentation became", emphasis: "engineering." },
  },
};

export const skills: SkillCategory[] = [
  {
    title: "Frontend Experience",
    subtitle: "Modern Interfaces",
    items: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind", "Framer Motion"],
  },
  {
    title: "Backend Systems",
    subtitle: "Robust Architecture",
    items: ["Java", "Spring (learning)", "Node.js", "Express", "NestJS", "REST APIs", "JWT auth", "MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    title: "Artificial Intelligence",
    subtitle: "LLM Integration",
    items: ["OpenAI APIs", "Gemini", "Ollama", "Prompt engineering"],
  },
  {
    title: "Mobile & Tools",
    subtitle: "Android & Workflow",
    items: ["Kotlin", "Jetpack Compose", "Git", "Docker", "Linux", "Jest", "Canvas"],
  },
];

/** Oldest first. */
export const timeline: TimelineEntry[] = [
  { year: "2021", desc: "Started Programming" },
  { year: "2022", desc: "Computer Science" },
  { year: "2025", desc: "Built QueryCraft" },
  { year: "Feb 2026", desc: "Full Stack Developer Intern (Java & AI) at Vstand4U" },
  { year: "2026", desc: "Graduated in Computer Science Engineering (VTU)" },
  { year: "Now", desc: "Open to entry-level software engineering roles, and exploring AI and immersive web experiences." },
];

/** Things I'm curious about; short labels a design can scatter, list or tag. */
export const interests: string[] = [
  "Learning Motion Design",
  "Creating 3D Websites",
  "Video Editing",
  "Content Creation",
  "AI Experiments",
  "Linux",
  "Frontend Architecture",
];
