"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { showOnView } from "../shared/showOnView";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { sketchBody, sketchHand } from "./fonts";
import styles from "./styles.module.css";
import ViewerTheme from "@/components/viewer/viewerTheme";
import "./viewer.css";
import Egg from "./Egg";

const NAV = [
  ["story", "Story"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["timeline", "Timeline"],
  ["contact", "Contact"],
] as const;

/** A pencil stroke that draws itself once when it scrolls into view. The drawing is CSS (static for reduced motion). */
function Stroke({ d, viewBox, className, width = 3, delay = 0, duration = 0.9, arrow }: { d: string; viewBox: string; className?: string; width?: number; delay?: number; duration?: number; arrow?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => (ref.current ? showOnView(ref.current) : undefined), []);
  const timing = { "--d": `${duration}s`, "--delay": `${delay}s` } as CSSProperties;
  return (
    <svg ref={ref} aria-hidden viewBox={viewBox} className={className} preserveAspectRatio="none" overflow="visible" style={timing}>
      <path className={styles.stroke} pathLength={1} d={d} fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {arrow && <path d={arrow} fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}

/**
 * The LinkedOut architecture, sketched. Every box and label comes from the project's own data:
 * the stack list decides which boxes exist and the highlight text decides the arrow label, so the
 * drawing can never claim something the data does not.
 */
function Architecture({ stack, highlights }: { stack: string[]; highlights: string[] }) {
  const has = (name: string) => stack.some((item) => item.toLowerCase() === name.toLowerCase());
  if (!(has("Next.js") && has("NestJS") && has("PostgreSQL"))) return null;
  const text = highlights.join(" ");
  const label = [text.includes("REST") && "REST", text.includes("JWT") && "JWT"].filter(Boolean).join(" + ");
  const monorepo = /Turborepo/.test(text) ? "Turborepo + pnpm monorepo" : null;

  return (
    <figure className={styles.diagram}>
      <svg viewBox="0 0 760 300" role="img" aria-label={`LinkedOut architecture: ${stack.join(", ")}`}>
        <defs>
          <marker id="arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        <g filter="url(#sketch-wobble)" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          {has("Docker") && <rect x="300" y="26" width="440" height="190" rx="18" strokeDasharray="9 8" opacity="0.7" />}
          <rect x="24" y="86" width="190" height="84" rx="12" />
          <rect x="330" y="86" width="190" height="84" rx="12" />
          <rect x="550" y="86" width="170" height="84" rx="12" />
          <path d="M 216 128 C 250 120, 290 138, 326 128" markerEnd="url(#arrow-head)" />
          <path d="M 522 128 C 530 124, 540 132, 546 128" markerEnd="url(#arrow-head)" />
          {monorepo && <path d="M 24 238 C 200 252, 560 226, 740 244" opacity="0.8" />}
        </g>
        <g className={styles.diagramText}>
          <text x="119" y="134" textAnchor="middle">Next.js</text>
          <text x="119" y="156" textAnchor="middle" className={styles.diagramSmall}>web client</text>
          <text x="425" y="134" textAnchor="middle">NestJS</text>
          <text x="425" y="156" textAnchor="middle" className={styles.diagramSmall}>REST API</text>
          <text x="635" y="134" textAnchor="middle">PostgreSQL</text>
          <text x="635" y="156" textAnchor="middle" className={styles.diagramSmall}>database</text>
          {label && (
            <text x="270" y="102" textAnchor="middle" className={styles.diagramSmall}>{label}</text>
          )}
          {has("Docker") && <text x="720" y="52" textAnchor="end" className={styles.diagramSmall}>Docker Compose</text>}
          {monorepo && <text x="382" y="278" textAnchor="middle" className={styles.diagramSmall}>{monorepo}</text>}
        </g>
      </svg>
      <figcaption>How LinkedOut fits together, drawn from the project&rsquo;s own stack.</figcaption>
    </figure>
  );
}

/**
 * Conceptual sketch. Reading this as: developer portfolio for recruiters, as a drafted idea in a
 * notebook: graph paper, graphite and one blue ink, hand-lettered notes, strokes that draw
 * themselves once. Plain, readable body text; the hand lettering is only for notes and headings.
 */
export default function ConceptualSketchDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();
  const linkedOut = projects[0];

  return (
    <main id="top" data-design="conceptual-sketch" className={`${sketchHand.variable} ${sketchBody.variable} ${styles.page}`}>
      <ViewerTheme slug="conceptual-sketch" fonts={`${sketchHand.variable} ${sketchBody.variable}`} entrance="rise" />
      <Egg />
      <SkipLink />

      {/* Shared pencil-wobble filter used by the sketched borders. Decorative. */}
      <svg aria-hidden width="0" height="0" className={styles.defs}>
        <filter id="sketch-wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" />
        </filter>
      </svg>

      <div className={styles.wrap}>
        <header className={styles.hero}>
          <nav aria-label="Sections" className={styles.nav}>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>

          <h1 className={styles.name}>{profile.name}</h1>
          <Stroke d="M 2 10 C 60 2, 120 16, 190 6 S 300 14, 358 4" viewBox="0 0 360 18" className={styles.underline} />
          <p className={styles.role}>{profile.tagline.join(" / ")}</p>

          <p className={`${styles.circled}`}>
            <span>{profile.availability.status}</span>
            <Stroke d="M 6 28 C 4 8, 70 2, 160 4 S 316 8, 318 30 C 318 50, 240 56, 160 54 S 10 52, 6 28" viewBox="0 0 324 58" className={styles.ring} width={2.5} delay={0.4} duration={1.2} />
          </p>
          <p className={styles.note}>{profile.availability.detail}</p>

          <div className={`${styles.actions} ${styles.heroActions}`}>
            <span className={styles.resumeWrap}>
              <span aria-hidden className={styles.startHere}>
                start here
                <Stroke d="M 6 2 C 10 16, 22 24, 30 34" viewBox="0 0 40 40" className={styles.pointer} width={2.4} delay={0.9} arrow="M 20 30 L 31 36 L 33 24" />
              </span>
              <a {...resume} className={`${styles.button} ${styles.buttonSolid}`}>Resume</a>
            </span>
            <a {...mail} className={styles.button} translate="no">{profile.email}</a>
          </div>
        </header>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.title}>Story</h2>
          <div className={styles.twoCol}>
            <Reveal className={styles.prose}>
              <p className={styles.lead}>{profile.summary}</p>
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
            <ul className={styles.margin}>
              {story.quotes.map((quote, i) => (
                <Reveal as="li" key={quote} delay={i * 0.1} className={styles.marginNote}>
                  {quote}
                </Reveal>
              ))}
            </ul>
          </div>
          <p className={styles.refrain}>
            {story.refrain.lines.join(" ")} {story.refrain.punchline.lead}{" "}
            <span className={styles.marked}>
              {story.refrain.punchline.emphasis}
              <Stroke d="M 2 8 C 40 2, 80 12, 130 5" viewBox="0 0 132 12" className={styles.markLine} width={3} />
            </span>
          </p>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <h2 id="skills-h" className={styles.title}>Skills</h2>
          <div className={styles.skillGrid}>
            {skills.map((category, i) => (
              <Reveal as="article" key={category.title} delay={i * 0.06} className={styles.box}>
                <h3>{category.title}</h3>
                <p className={styles.note}>{category.subtitle}</p>
                <ul className={styles.ticks}>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-h" className={styles.section}>
          <h2 id="experience-h" className={styles.title}>Experience</h2>
          {experience.map((job) => (
            <Reveal as="article" key={job.company + job.period} className={`${styles.box} ${styles.wideBox}`}>
              <p className={styles.annotation}>{job.period}</p>
              <h3 className={styles.big}>{job.role}</h3>
              <p className={styles.note}>{job.company}</p>
              <ul className={styles.bracketed}>
                {job.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ul className={styles.tags}>
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
            </Reveal>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <h2 id="projects-h" className={styles.title}>Projects</h2>
          {linkedOut && (
            <Reveal>
              <Architecture stack={linkedOut.stack} highlights={linkedOut.highlights} />
            </Reveal>
          )}
          <div className={styles.projectList}>
            {projects.map((project) => (
              <Reveal as="article" key={project.repo.name} className={styles.box}>
                <p className={styles.annotation}>{project.kind}</p>
                <h3 className={styles.big}>{project.title}</h3>
                <p>{project.summary}</p>
                <ul className={styles.bracketed}>
                  {project.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className={styles.tags}>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {project.facts && <p className={styles.note}>{project.facts.join(", ")}</p>}
                <p className={styles.actions}>
                  <a {...project.code} className={styles.button}>
                    Code<span className="sr-only"> for {project.title}</span>
                  </a>
                  {project.demo && (
                    <a {...project.demo} className={`${styles.button} ${styles.buttonSolid}`}>
                      Live demo<span className="sr-only"> of {project.title}</span>
                    </a>
                  )}
                </p>
              </Reveal>
            ))}
          </div>
          {moreRepos.length > 0 && (
            <Reveal>
              <h3 className={styles.sub}>More from GitHub</h3>
              <ul className={styles.repoList}>
                {moreRepos.map(({ repo, link }) => (
                  <li key={repo.name}>
                    <a {...link} translate="no">{repo.name}</a>
                    <span>{repo.description}</span>
                    <small>{[repo.language, monthYear(repo.pushed_at)].filter(Boolean).join(", ")}</small>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </section>

        <section id="education" aria-labelledby="education-h" className={styles.section}>
          <h2 id="education-h" className={styles.title}>Education</h2>
          <div className={styles.skillGrid}>
            {education.map((entry) => (
              <Reveal as="article" key={entry.institution} className={styles.box}>
                <p className={styles.annotation}>{entry.period}</p>
                <h3>{entry.degree}</h3>
                <p className={styles.note}>
                  {entry.institution}
                  {entry.cgpa && `, CGPA ${entry.cgpa}`}
                </p>
                <ul className={styles.tags}>
                  {entry.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <Reveal delay={0.06} className={styles.box}>
              <h3>Certifications</h3>
              <ul className={styles.ticks}>
                {certifications.map((cert) => (
                  <li key={cert.name}>
                    {cert.name}
                    {(cert.issuer || cert.year) && <small>{[cert.issuer, cert.year].filter(Boolean).join(", ")}</small>}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
          <h2 id="timeline-h" className={styles.title}>Timeline</h2>
          <ol className={styles.path}>
            {timeline.map((entry) => (
              <Reveal as="li" key={entry.year + entry.desc}>
                <span aria-hidden className={styles.dot} />
                <span className={styles.year}>{entry.year}</span>
                <span>{entry.desc}</span>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <h2 id="curiosity-h" className={styles.title}>Interests</h2>
          <ul className={styles.doodles}>
            {interests.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <h2 id="contact-h" className={styles.contactTitle}>
            {profile.contact.headline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <Stroke d="M 2 10 C 80 2, 160 16, 240 6 S 340 14, 420 4" viewBox="0 0 422 18" className={styles.underline} />
          <p className={styles.lead}>{profile.contact.pitch}</p>
          <p className={styles.note}>{profile.location.sentence}</p>
          <p className={styles.actions}>
            {contactLinks.map((link) => (
              <a key={link.id} {...link.props} className={`${styles.button} ${link.id === "resume" ? styles.buttonSolid : ""}`}>
                {link.label}
              </a>
            ))}
            <button type="button" onClick={() => copy(profile.email)} className={styles.button}>
              {copied ? "Copied" : "Copy email"}
              <span className="sr-only"> address</span>
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}
