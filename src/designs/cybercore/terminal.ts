import { portfolio } from "@/data";

/** The brain of the Cybercore terminal egg: a pretend shell that answers questions about the portfolio. Pure, so it is unit tested. */

export type LineKind = "in" | "out" | "ok" | "err" | "dim";
export interface Line {
  kind: LineKind;
  text: string;
}
export interface Result {
  lines: Line[];
  clear?: boolean;
  exit?: boolean;
}

const { profile, skills, featuredProjects, experience, education, interests } = portfolio;

const out = (...text: string[]): Line[] => text.map((t) => ({ kind: "out", text: t }));
const ok = (...text: string[]): Line[] => text.map((t) => ({ kind: "ok", text: t }));
const err = (...text: string[]): Line[] => text.map((t) => ({ kind: "err", text: t }));
const dim = (...text: string[]): Line[] => text.map((t) => ({ kind: "dim", text: t }));

export const PROMPT = "visitor@sultan:~$";

export const COMMANDS = [
  "help", "about", "skills", "projects", "experience", "education", "contact", "hire", "ls", "cat", "neofetch", "whoami", "history", "date", "echo", "clear", "exit",
] as const;

const FILES: Record<string, () => Line[]> = {
  "about.txt": () => out(profile.summary),
  "skills.txt": () => skillLines(),
  "projects.txt": () => projectLines(),
  "contact.txt": () => out(`email    ${profile.email}`, `github   ${profile.links.find((l) => l.id === "github")?.href}`, `linkedin ${profile.links.find((l) => l.id === "linkedin")?.href}`),
  "secrets.txt": () => err("cat: secrets.txt: Permission denied", "(try sudo. It has never worked, but try.)"),
  "resume.pdf": () => err("cat: resume.pdf: binary file. Use the Resume button on the page instead."),
};

function skillLines(): Line[] {
  return skills.flatMap((s) => out(`${s.title.padEnd(24)} ${s.items.join(", ")}`));
}

function projectLines(): Line[] {
  return featuredProjects.flatMap((p, i) => [...out(`${i + 1}. ${p.title}  [${p.kind}]`), ...dim(`   ${p.stack.join(" / ")}`)]);
}

function neofetch(): Line[] {
  const rows = [
    `${profile.givenName.split(" ")[0].toLowerCase()}@portfolio`,
    "-------------------",
    `Role     ${profile.jobTitle}`,
    `Status   ${profile.availability.status}`,
    `Based    ${profile.location.city}, ${profile.location.region}`,
    `Stack    ${skills[0].items.slice(0, 3).join(", ")} + Java`,
    `Shell    this one, apparently`,
    `Projects ${featuredProjects.length} featured`,
    `Curious  ${interests.length} things at the moment`,
  ];
  return out(...rows);
}

const HELP = [
  "about        who I am",
  "skills       what I work with",
  "projects     what I have built",
  "experience   where I have worked",
  "education    where I studied",
  "contact      how to reach me",
  "hire         the shortest path to a yes",
  "ls, cat      poke around the files",
  "neofetch     system info, portfolio edition",
  "clear, exit  tidy up, leave",
];

/** Runs one line of input and returns what the terminal prints. `history` is everything typed before (for `history`). */
export function run(input: string, history: string[] = []): Result {
  const line = input.trim();
  if (!line) return { lines: [] };
  const [cmd, ...args] = line.split(/\s+/);
  const rest = args.join(" ");

  switch (cmd.toLowerCase()) {
    case "help":
    case "?":
      return { lines: out("Commands:", ...HELP) };
    case "about":
      return { lines: out(profile.summary) };
    case "whoami":
      return { lines: out(`${profile.name}. ${profile.tagline.join(", ")}.`) };
    case "skills":
      return { lines: skillLines() };
    case "projects":
      return { lines: projectLines() };
    case "experience":
      return { lines: experience.flatMap((e) => out(`${e.role}, ${e.company} (${e.period})`)) };
    case "education":
      return { lines: education.flatMap((e) => out(`${e.degree}, ${e.institution} (${e.period})${e.cgpa ? `, CGPA ${e.cgpa}` : ""}`)) };
    case "contact":
      return { lines: FILES["contact.txt"]() };
    case "hire":
      return {
        lines: [
          ...ok("ACCESS GRANTED"),
          ...out(`${profile.availability.status}. ${profile.availability.detail}.`, `Write to ${profile.email}. Replies faster than npm install.`),
        ],
      };
    case "ls":
      return { lines: out(Object.keys(FILES).join("  ")) };
    case "cat": {
      if (!rest) return { lines: err("cat: missing file. Try: ls") };
      const file = FILES[rest.toLowerCase()];
      return { lines: file ? file() : err(`cat: ${rest}: No such file or directory`) };
    }
    case "neofetch":
      return { lines: neofetch() };
    case "date":
      return { lines: out(new Date().toString()) };
    case "echo":
      return { lines: out(rest) };
    case "history":
      return { lines: out(...history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`)) };
    case "clear":
      return { lines: [], clear: true };
    case "exit":
    case "quit":
      return { lines: dim("logout"), exit: true };
    case "sudo":
      if (/^(hire|hire\s+me|hire\s+sultan)$/i.test(rest)) {
        return { lines: [...dim("[sudo] password for visitor: ********"), ...ok("Authenticated as a person with excellent taste."), ...run("hire").lines] };
      }
      return { lines: err("visitor is not in the sudoers file. This incident will be reported.", "(To whom? Nobody. It is a portfolio.)") };
    case "rm":
      return { lines: err("rm: nice try. This site is read-only, and everything is in git anyway.") };
    case "vim":
    case "vi":
    case "nano":
    case "emacs":
      return { lines: err(`${cmd}: you can open it, but I am not telling you how to leave.`) };
    case "ping":
      return { lines: out("pong") };
    case "coffee":
      return { lines: out("Brewing... done. This is the real fuel for the portfolio.") };
    case "matrix":
      return { lines: dim("Wake up, visitor.", "The recruiter has you.", "Follow the white rabbit (or just run: hire).") };
    case "42":
      return { lines: out("The answer, but what was the question? Probably: is he available?") };
    default:
      return { lines: err(`command not found: ${cmd}. Try: help`) };
  }
}

/** Tab completion: the single command that starts with `partial`, or the partial itself. */
export function complete(partial: string): string {
  const p = partial.toLowerCase();
  if (!p || p.includes(" ")) return partial;
  const matches = COMMANDS.filter((c) => c.startsWith(p));
  return matches.length === 1 ? matches[0] : partial;
}
