"use client";

import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { pixelBody, pixelDisplay } from "./fonts";
import styles from "./styles.module.css";
import ViewerTheme from "@/components/viewer/viewerTheme";
import "./viewer.css";

const NAV = [
  ["story", "Story"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["timeline", "Timeline"],
  ["contact", "Contact"],
] as const;

// PICO-8 palette. One letter per colour keeps the sprite sheets readable as pictures.
const PALETTE: Record<string, string> = {
  H: "#ab5236",
  S: "#ffccaa",
  E: "#1d2b53",
  M: "#ff004d",
  T: "#29adff",
  P: "#5f574f",
  L: "#c2c3c7",
  Y: "#ffec27",
  O: "#ffa300",
};

const PLAYER = [
  "....HHHH....",
  "...HHHHHH...",
  "..HHHHHHHH..",
  "..HSSSSSSH..",
  "..SSESSESS..",
  "..SSSSSSSS..",
  "...SSMMSS...",
  "....SSSS....",
  "..TTTTTTTT..",
  ".TTTTTTTTTT.",
  "STTTTTTTTTTS",
  "SSTTTTTTTTSS",
  ".STTTTTTTTS.",
  "..PPP..PPP..",
  "..PPP..PPP..",
  ".LLLL..LLLL.",
];

const STAR = ["...Y...", "...Y...", "YYYYYYY", ".YYYYY.", "..YYY..", ".YY.YY.", ".Y...Y."];

/** A sprite drawn from rows of letters, rendered as crisp rectangles. Decorative. */
function Sprite({ rows, className }: { rows: string[]; className?: string }) {
  const width = rows[0].length;
  return (
    <svg aria-hidden viewBox={`0 0 ${width} ${rows.length}`} shapeRendering="crispEdges" className={className}>
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={PALETTE[cell]} className={cell === "E" ? styles.eye : undefined} />
        )
      )}
    </svg>
  );
}

function Heading({ id, title, alias }: { id: string; title: string; alias: string }) {
  return (
    <header className={styles.head}>
      <h2 id={id} className={styles.title}>{title}</h2>
      <span aria-hidden className={styles.alias}>{alias}</span>
    </header>
  );
}

/**
 * Pixel art. Reading this as: developer portfolio for recruiters, as a 16-bit adventure game:
 * quest log, inventory, levels, save points. The pixel font is used for headings and labels only
 * (never paragraphs) and the text people read is Atkinson Hyperlegible. Colours are the PICO-8
 * palette; every text and fill pair is checked for contrast. Motion is stepped and stops for
 * reduced motion. The wording of the headings plays along; the content underneath is the data.
 */
export default function PixelArtDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="pixel-art" className={`${pixelDisplay.variable} ${pixelBody.variable} ${styles.page}`}>
      <ViewerTheme slug="pixel-art" fonts={`${pixelDisplay.variable} ${pixelBody.variable}`} entrance="snap" />
      <SkipLink />
      <div aria-hidden className={styles.stars} />

      <div className={styles.wrap}>
        <nav aria-label="Sections" className={styles.nav}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={`${styles.box} ${styles.status}`}>
              <Sprite rows={STAR} className={styles.star} />
              <span>
                <strong>{profile.availability.status}</strong>
                <small>{profile.availability.detail}</small>
              </span>
              <span aria-hidden className={styles.cursor} />
            </p>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.role}>{profile.tagline.join(" / ")}</p>
            <p className={styles.actions}>
              <a {...resume} className={`${styles.button} ${styles.green}`}>Resume</a>
              <a {...mail} className={`${styles.button} ${styles.yellow}`} translate="no">{profile.email}</a>
            </p>
          </div>
          <div aria-hidden className={styles.stage}>
            <Sprite rows={PLAYER} className={styles.player} />
            <span className={styles.ground} />
          </div>
        </header>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <Heading id="story-h" title="Story" alias="Prologue" />
          <div className={`${styles.box} ${styles.dialog}`}>
            <p className={styles.lead}>{profile.summary}</p>
            <div className={styles.twoCol}>
              {story.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
          <ul className={styles.lines}>
            {story.quotes.map((quote) => (
              <li key={quote} className={styles.line}>
                {quote}
              </li>
            ))}
          </ul>
          <p className={styles.refrain}>
            {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <mark>{story.refrain.punchline.emphasis}</mark>
          </p>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <Heading id="skills-h" title="Skills" alias="Inventory" />
          <div className={styles.grid2}>
            {skills.map((category) => (
              <article key={category.title} className={`${styles.box} ${styles.panel}`}>
                <h3>{category.title}</h3>
                <p className={styles.muted}>{category.subtitle}</p>
                <ul className={styles.slots}>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-h" className={styles.section}>
          <Heading id="experience-h" title="Experience" alias="Quest log" />
          {experience.map((job) => (
            <article key={job.company + job.period} className={`${styles.box} ${styles.panel}`}>
              <div className={styles.jobHead}>
                <h3>{job.role}</h3>
                <p className={styles.badge}>{job.period}</p>
              </div>
              <p className={styles.muted}>{job.company}</p>
              <ul className={styles.bullets}>
                {job.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ul className={styles.slots}>
                {job.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {job.link && (
                <p>
                  <a href={job.link.href} target="_blank" rel="noopener noreferrer" translate="no" className={styles.inline}>
                    {job.link.label}
                  </a>
                </p>
              )}
            </article>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <Heading id="projects-h" title="Projects" alias="Levels" />
          {projects.map((project, i) => (
            <article key={project.repo.name} className={`${styles.box} ${styles.panel} ${styles.level}`} data-tone={i % 3}>
              <p aria-hidden className={styles.levelNo}>LV {i + 1}</p>
              <p className={styles.muted}>{project.kind}</p>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.lead}>{project.summary}</p>
              <ul className={styles.bullets}>
                {project.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ul className={styles.slots}>
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {project.facts && <p className={styles.muted}>{project.facts.join(", ")}</p>}
              <p className={styles.actions}>
                <a {...project.code} className={`${styles.button} ${styles.blue}`}>
                  Code<span className="sr-only"> for {project.title}</span>
                </a>
                {project.demo && (
                  <a {...project.demo} className={`${styles.button} ${styles.green}`}>
                    Live demo<span className="sr-only"> of {project.title}</span>
                  </a>
                )}
              </p>
            </article>
          ))}
          {moreRepos.length > 0 && (
            <div className={`${styles.box} ${styles.panel}`}>
              <h3>More from GitHub</h3>
              <ul className={styles.repoList}>
                {moreRepos.map(({ repo, link }) => (
                  <li key={repo.name}>
                    <a {...link} translate="no">{repo.name}</a>
                    <span>{repo.description}</span>
                    <small>{[repo.language, monthYear(repo.pushed_at)].filter(Boolean).join(", ")}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section id="education" aria-labelledby="education-h" className={styles.section}>
          <Heading id="education-h" title="Education" alias="Training" />
          <div className={styles.grid2}>
            {education.map((entry) => (
              <article key={entry.institution} className={`${styles.box} ${styles.panel}`}>
                <p className={styles.badge}>{entry.period}</p>
                <h3>{entry.degree}</h3>
                <p>
                  {entry.institution}
                  {entry.cgpa && `. CGPA ${entry.cgpa}`}
                </p>
                <ul className={styles.slots}>
                  {entry.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </article>
            ))}
            <div className={`${styles.box} ${styles.panel}`}>
              <h3>Certifications</h3>
              <ul className={styles.certList}>
                {certifications.map((cert) => (
                  <li key={cert.name}>
                    <span>{cert.name}</span>
                    {(cert.issuer || cert.year) && <small>{[cert.issuer, cert.year].filter(Boolean).join(", ")}</small>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
          <Heading id="timeline-h" title="Timeline" alias="Save points" />
          <ol className={styles.path}>
            {timeline.map((entry) => (
              <li key={entry.year + entry.desc}>
                <span aria-hidden className={styles.node} />
                <span className={styles.year}>{entry.year}</span>
                <span>{entry.desc}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <Heading id="curiosity-h" title="Interests" alias="Side quests" />
          <ul className={styles.quests}>
            {interests.map((item) => (
              <li key={item} className={styles.box}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <Heading id="contact-h" title="Contact" alias="Continue?" />
          <div className={`${styles.box} ${styles.panel} ${styles.contact}`}>
            <p className={styles.contactLine}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className={styles.lead}>{profile.contact.pitch}</p>
            <p className={styles.muted}>{profile.location.sentence}</p>
            <ul className={styles.menu}>
              {contactLinks.map((link) => (
                <li key={link.id}>
                  <a {...link.props}>{link.label}</a>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => copy(profile.email)}>
                  {copied ? "Copied" : "Copy email"}
                  <span className="sr-only"> address</span>
                </button>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
