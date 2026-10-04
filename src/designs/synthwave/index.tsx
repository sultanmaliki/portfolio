"use client";

import { ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { synthExo } from "./fonts";
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

/** Sun on the horizon with a perspective grid below it. Pure CSS and decorative. */
function Scene({ divider = false }: { divider?: boolean }) {
  return (
    <div aria-hidden className={`${styles.scene} ${divider ? styles.sceneDivider : styles.sceneHero}`}>
      <span className={styles.sun} />
      <span className={styles.horizon} />
      <span className={styles.floor}>
        <span className={styles.grid} />
      </span>
    </div>
  );
}

/**
 * Synthwave. Reading this as: developer portfolio for recruiters, as a retro-futurist night
 * drive: a striped neon sun sinking behind a perspective grid, chrome italic headlines with a pink
 * and cyan glow. "Who I am" (pink, the sky) sits above a horizon line; "what I built" (cyan, the
 * grid) sits below it. Body text is solid and bright; the grid and sun stop for reduced motion.
 */
export default function SynthwaveDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="synthwave" className={`${synthExo.variable} ${styles.page}`}>
      <ViewerTheme slug="synthwave" fonts={`${synthExo.variable}`} entrance="rise" />
      <SkipLink />

      <header className={styles.hero}>
        <div aria-hidden className={styles.stars} />
        <nav aria-label="Sections" className={styles.nav}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className={styles.heroBody}>
          <p className={styles.chip}>
            <strong>{profile.availability.status}</strong>
            <span>{profile.availability.detail}</span>
          </p>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.role}>{profile.tagline.join(" // ")}</p>
          <p className={styles.actions}>
            <a {...resume} className={`${styles.button} ${styles.buttonPink}`}>
              <FileText aria-hidden size={18} strokeWidth={2} />
              Resume
            </a>
            <a {...mail} className={styles.button}>
              <Mail aria-hidden size={18} strokeWidth={2} />
              <span translate="no">{profile.email}</span>
            </a>
          </p>
        </div>
        <Scene />
      </header>

      <div className={styles.night}>
        <div className={styles.content}>
          {/* Who I am: the sky (pink) */}
          <section id="story" aria-labelledby="story-h" className={styles.section}>
            <h2 id="story-h" className={styles.title}>Story</h2>
            <Reveal className={`${styles.card} ${styles.cardPink}`}>
              <p className={styles.lead}>{profile.summary}</p>
              <div className={styles.twoCol}>
                {story.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </Reveal>
            <ul className={styles.quotes}>
              {story.quotes.map((quote, i) => (
                <Reveal as="li" key={quote} delay={i * 0.1}>
                  {quote}
                </Reveal>
              ))}
            </ul>
            <p className={styles.refrain}>
              {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
            </p>
          </section>

          <section id="skills" aria-labelledby="skills-h" className={styles.section}>
            <h2 id="skills-h" className={styles.title}>Skills</h2>
            <div className={styles.grid2}>
              {skills.map((category, i) => (
                <Reveal as="article" key={category.title} delay={i * 0.06} className={`${styles.card} ${styles.cardPink}`}>
                  <h3>{category.title}</h3>
                  <p className={styles.muted}>{category.subtitle}</p>
                  <ul className={styles.chips}>
                    {category.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </section>

          <Scene divider />

          {/* What I built: the grid (cyan) */}
          <section id="experience" aria-labelledby="experience-h" className={styles.section}>
            <h2 id="experience-h" className={`${styles.title} ${styles.titleCyan}`}>Experience</h2>
            {experience.map((job) => (
              <Reveal as="article" key={job.company + job.period} className={`${styles.card} ${styles.cardCyan}`}>
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
                <ul className={styles.chips}>
                  {job.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                {job.link && (
                  <p>
                    <a href={job.link.href} target="_blank" rel="noopener noreferrer" translate="no" className={styles.inline}>
                      {job.link.label} <ArrowUpRight aria-hidden size={16} strokeWidth={2} />
                    </a>
                  </p>
                )}
              </Reveal>
            ))}
          </section>

          <section id="projects" aria-labelledby="projects-h" className={styles.section}>
            <h2 id="projects-h" className={`${styles.title} ${styles.titleCyan}`}>Projects</h2>
            <div className={styles.projectGrid}>
              {projects.map((project, i) => (
                <Reveal as="article" key={project.repo.name} delay={i * 0.07} className={`${styles.card} ${styles.cardCyan} ${i === 0 ? styles.wide : ""}`}>
                  <p className={styles.badge}>{project.kind}</p>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p>{project.summary}</p>
                  <ul className={styles.bullets}>
                    {project.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <ul className={styles.chips}>
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {project.facts && <p className={styles.muted}>{project.facts.join(", ")}</p>}
                  <p className={styles.actions}>
                    <a {...project.code} className={styles.button}>
                      Code<span className="sr-only"> for {project.title}</span>
                    </a>
                    {project.demo && (
                      <a {...project.demo} className={`${styles.button} ${styles.buttonPink}`}>
                        Live demo<span className="sr-only"> of {project.title}</span>
                      </a>
                    )}
                  </p>
                </Reveal>
              ))}
            </div>
            {moreRepos.length > 0 && (
              <Reveal className={`${styles.card} ${styles.cardCyan} ${styles.repoCard}`}>
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
              </Reveal>
            )}
          </section>

          <section id="education" aria-labelledby="education-h" className={styles.section}>
            <h2 id="education-h" className={`${styles.title} ${styles.titleCyan}`}>Education</h2>
            <div className={styles.grid2}>
              {education.map((entry) => (
                <Reveal as="article" key={entry.institution} className={`${styles.card} ${styles.cardCyan}`}>
                  <p className={styles.badge}>{entry.period}</p>
                  <h3>{entry.degree}</h3>
                  <p>
                    {entry.institution}
                    {entry.cgpa && `. CGPA ${entry.cgpa}`}
                  </p>
                  <ul className={styles.chips}>
                    {entry.coursework.map((course) => (
                      <li key={course}>{course}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
              <Reveal delay={0.07} className={`${styles.card} ${styles.cardCyan}`}>
                <h3>Certifications</h3>
                <ul className={styles.certList}>
                  {certifications.map((cert) => (
                    <li key={cert.name}>
                      <span>{cert.name}</span>
                      {(cert.issuer || cert.year) && <small>{[cert.issuer, cert.year].filter(Boolean).join(", ")}</small>}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
            <h2 id="timeline-h" className={`${styles.title} ${styles.titleCyan}`}>Timeline</h2>
            <ol className={styles.road}>
              {timeline.map((entry, i) => (
                <Reveal as="li" key={entry.year + entry.desc} delay={i * 0.04}>
                  <span aria-hidden className={styles.marker} />
                  <span className={styles.year}>{entry.year}</span>
                  <span>{entry.desc}</span>
                </Reveal>
              ))}
            </ol>
          </section>

          <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
            <h2 id="curiosity-h" className={`${styles.title} ${styles.titleCyan}`}>Interests</h2>
            <ul className={styles.neon}>
              {interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section id="contact" aria-labelledby="contact-h" className={styles.section}>
            <Reveal className={`${styles.card} ${styles.contact}`}>
              <h2 id="contact-h" className={styles.contactTitle}>
                {profile.contact.headline.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className={styles.lead}>{profile.contact.pitch}</p>
              <p className={styles.muted}>{profile.location.sentence}</p>
              <p className={styles.actions}>
                {contactLinks.map((link) => (
                  <a key={link.id} {...link.props} className={`${styles.button} ${link.id === "resume" ? styles.buttonPink : ""}`}>
                    {link.label}
                  </a>
                ))}
                <button type="button" onClick={() => copy(profile.email)} className={styles.button}>
                  {copied ? <Check aria-hidden size={16} strokeWidth={2} /> : <Copy aria-hidden size={16} strokeWidth={2} />}
                  {copied ? "Copied" : "Copy email"}
                  <span className="sr-only"> address</span>
                </button>
              </p>
            </Reveal>
          </section>
        </div>
      </div>
    </main>
  );
}
