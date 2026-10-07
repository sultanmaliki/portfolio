import { portfolio } from "@/data";

/** The chat partner in the Y2K messenger egg: keyword answers in the voice of 2003. Pure, so it is unit tested. */

const { profile, skills, featuredProjects } = portfolio;

const JOKES = [
  "why do java devs wear glasses?? because they dont C# lol",
  "there are 10 kinds of people: those who get binary and those who dont :-P",
  "my code has 99 problems and a semicolon is 1 of them",
  "a SQL query walks into a bar, sees two tables and asks: can i join you?",
];

const FALLBACKS = [
  "lol wait what? try: skills, projects, jokes or hire",
  "brb... ok im back. i only know about work stuff, ask me about skills or projects :-)",
  "hmm i dont get that one :-S try asl? or hire",
  "lol idk. ask about my projects maybe?",
];

let turn = 0;
const next = <T,>(items: readonly T[]): T => items[turn++ % items.length];

/** What the partner types back (one or more lines) to something the visitor typed. */
export function reply(input: string): string[] {
  const t = input.toLowerCase().trim();
  const has = (...words: string[]) => words.some((w) => t.includes(w));

  if (!t) return [];
  if (/\ba\/?s\/?l\b/.test(t)) return [`asl?? ok: dev / ${profile.location.city.toLowerCase()} / ${profile.location.relocation.toLowerCase()} for work lol`];
  if (/^(hi+|hello+|hey+|sup|yo|heya|hola)\b/.test(t)) return ["hiii!! :-)", "ask me about my skills, projects, or if im available"];
  if (has("hire", "job", "role", "available", "availab", "opportunit", "work for", "open to")) {
    return [`${profile.availability.status.toLowerCase()}!! ${profile.availability.detail.toLowerCase()}`, `email me: ${profile.email}  (i reply fast, i swear)`];
  }
  if (has("skill", "stack", "tech", "language", "know")) {
    const fe = skills[0].items.slice(0, 4).join(", ").toLowerCase();
    return [`frontend: ${fe}`, `backend: java, node, nestjs + mysql / postgres / mongodb`, "and i mess around with LLM apis a lot :-D"];
  }
  if (has("project", "built", "build", "made", "portfolio", "github", "repo")) {
    return [`ive built ${featuredProjects.length} big ones so far: ${featuredProjects.map((p) => p.title).join(", ")}`, "check the projects section, theyre all on github"];
  }
  if (has("contact", "email", "mail", "reach", "number", "phone")) return [`best way: ${profile.email}`];
  if (has("resume", "cv")) return ["hit the Resume button on the page, its a pdf :-)"];
  if (has("where", "location", "relocat", "city", "country", "live")) return [profile.location.sentence.toLowerCase()];
  if (has("who", "name")) return [`im ${profile.name.toLowerCase()}, ${profile.tagline[1].toLowerCase()}`];
  if (has("joke", "funny", "laugh")) return [next(JOKES)];
  if (has("college", "study", "degree", "school", "university")) return ["cs engineering at VTU, graduated 2026 :-)"];
  if (has("<3", "love", "cool", "nice", "awesome", "great")) return ["aww thx :-D :-D"];
  if (has("lol", "haha", "hehe", "rofl", "lmao")) return ["lol :-P"];
  if (has("thank", "thx", "ty")) return ["np!! :-)"];
  if (has("bye", "cya", "gtg", "ttyl", "later")) return ["ttyl!! dont forget to hire me :-P", "*signs out*"];
  if (has("brb", "afk")) return ["k, ill be here (obviously, im a bot) :-)"];
  return [next(FALLBACKS)];
}

/** How long to "type" a line, so the partner feels human: a beat plus a little per character. */
export const typingTime = (line: string) => Math.min(500 + line.length * 22, 1500);
