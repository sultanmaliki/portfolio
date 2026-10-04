"use client";

import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { display, mono } from "./fonts";
import styles from "./styles.module.css";

const NAV = [
  ["story", "Story"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["timeline", "Timeline"],
  ["contact", "Contact"],
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Cyberpunk. Reading this as: developer portfolio for recruiters, as a dystopian terminal: hazard
 * yellow and red on near-black, angular cut corners, scanlines, a terminal-style availability
 * banner. The glitch on the name plays once on load and once per hover (a short slice shift, never
 * a flash, and never on text being read); everything animated stops for reduced motion.
 */
export default function CyberpunkDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="cyberpunk" className={`${display.variable} ${mono.variable} ${styles.page}`}>
      <SkipLink />
      <div aria-hidden className={styles.scanlines} />

      <div className={styles.wrap}>
        <nav aria-label="Sections" className={styles.nav}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <header className={styles.hero}>
          <p className={styles.terminal}>
            <span className={styles.prompt}>STATUS</span>
            <strong>{profile.availability.status}</strong>
            <span className={styles.detail}>{profile.availability.detail}</span>
            <span aria-hidden className={styles.caret} />
          </p>
          <div className={styles.heroGrid}>
            <div>
              <h1 className={styles.name} data-text={profile.name}>
                {profile.name}
              </h1>
              <ul className={styles.roles}>
                {profile.tagline.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className={styles.actions}>
                <a {...resume} className={`${styles.button} ${styles.buttonYellow}`}>Resume</a>
                <a {...mail} className={styles.button} translate="no">{profile.email}</a>
              </p>
            </div>
            <dl className={`${styles.panel} ${styles.readout}`}>
              <div>
                <dt>Class</dt>
                <dd>{profile.jobTitle}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{profile.location.city}, {profile.location.region}</dd>
              </div>
              <div>
                <dt>Relocating</dt>
                <dd>{profile.location.relocatingTo}</dd>
              </div>
            </dl>
          </div>
          <div aria-hidden className={styles.hazard} />
        </header>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.title}>Story</h2>
          <Reveal className={styles.panel}>
            <p className={styles.lead}>{profile.summary}</p>
            <div className={styles.twoCol}>
              {story.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </Reveal>
          <ul className={styles.quotes}>
            {story.quotes.map((quote, i) => (
              <Reveal as="li" key={quote} delay={i * 0.08} className={styles.quote}>
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
          <div className={styles.skillGrid}>
            {skills.map((category, i) => (
              <Reveal as="article" key={category.title} delay={i * 0.06} className={styles.panel}>
                <h3>{category.title}</h3>
                <p className={styles.muted}>{category.subtitle}</p>
                <ul className={styles.modules}>
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
            <Reveal as="article" key={job.company + job.period} className={styles.panel}>
              <div className={styles.jobHead}>
                <h3>{job.role}</h3>
                <p className={styles.tag}>{job.period}</p>
              </div>
              <p className={styles.muted}>{job.company}</p>
              <ul className={styles.log}>
                {job.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ul className={styles.modules}>
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
          {projects.map((project, i) => (
            <Reveal as="article" key={project.repo.name} className={`${styles.panel} ${styles.dossier}`}>
              <div className={styles.dossierHead}>
                <span aria-hidden className={styles.number}>{pad(i + 1)}</span>
                <p className={styles.tag}>{project.kind}</p>
              </div>
              <div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.lead}>{project.summary}</p>
                <ul className={styles.log}>
                  {project.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className={styles.modules}>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {project.facts && <p className={styles.muted}>{project.facts.join(" | ")}</p>}
                <p className={styles.actions}>
                  <a {...project.code} className={styles.button}>
                    Code<span className="sr-only"> for {project.title}</span>
                  </a>
                  {project.demo && (
                    <a {...project.demo} className={`${styles.button} ${styles.buttonYellow}`}>
                      Live demo<span className="sr-only"> of {project.title}</span>
                    </a>
                  )}
                </p>
              </div>
            </Reveal>
          ))}
          {moreRepos.length > 0 && (
            <Reveal className={styles.panel}>
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
          <h2 id="education-h" className={styles.title}>Education</h2>
          <div className={styles.skillGrid}>
            {education.map((entry) => (
              <Reveal as="article" key={entry.institution} className={styles.panel}>
                <p className={styles.tag}>{entry.period}</p>
                <h3>{entry.degree}</h3>
                <p>
                  {entry.institution}
                  {entry.cgpa && `. CGPA ${entry.cgpa}`}
                </p>
                <ul className={styles.modules}>
                  {entry.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <Reveal delay={0.06} className={styles.panel}>
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
          <h2 id="timeline-h" className={styles.title}>Timeline</h2>
          <Reveal className={styles.panel}>
            <ol className={styles.history}>
              {timeline.map((entry) => (
                <li key={entry.year + entry.desc}>
                  <span className={styles.year}>{entry.year}</span>
                  <span>{entry.desc}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <h2 id="curiosity-h" className={styles.title}>Interests</h2>
          <ul className={styles.tags}>
            {interests.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <Reveal className={`${styles.panel} ${styles.contact}`}>
            <h2 id="contact-h" className={styles.contactTitle}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className={styles.lead}>{profile.contact.pitch}</p>
            <p className={styles.muted}>{profile.location.sentence}</p>
            <p className={styles.actions}>
              {contactLinks.map((link) => (
                <a key={link.id} {...link.props} className={`${styles.button} ${link.id === "resume" ? styles.buttonYellow : ""}`}>
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={() => copy(profile.email)} className={styles.button}>
                {copied ? "Copied" : "Copy email"}
                <span className="sr-only"> address</span>
              </button>
            </p>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
