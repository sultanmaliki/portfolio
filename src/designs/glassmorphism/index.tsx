"use client";

import type { CSSProperties } from "react";
import { ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { sans } from "./fonts";
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

/**
 * Glassmorphism. Reading this as: developer portfolio for recruiters, as frosted panels floating
 * over vivid blurred colour. Brighter and more colourful than the cinematic design. Every panel
 * carries a dark tint so white text stays above AA contrast wherever the colour drifts behind it,
 * and the number of blurred layers is kept low for phones.
 */
export default function GlassmorphismDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="glassmorphism" className={`${sans.variable} ${styles.page}`}>
      <SkipLink />

      {/* Colour field the glass refracts. Decorative and fixed, so it never moves with the content. */}
      <div aria-hidden className={styles.field}>
        <span className={`${styles.blob} ${styles.blobViolet}`} />
        <span className={`${styles.blob} ${styles.blobPink}`} />
        <span className={`${styles.blob} ${styles.blobCyan}`} />
      </div>

      <div className={styles.wrap}>
        <nav aria-label="Sections" className={`${styles.glass} ${styles.nav}`}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={`${styles.chip} ${styles.glass}`}>
              <strong>{profile.availability.status}</strong>
              <span>{profile.availability.detail}</span>
            </p>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.role}>{profile.tagline.join(" / ")}</p>
            <p className={styles.actions}>
              <a {...resume} className={styles.primary}>
                <FileText aria-hidden size={18} strokeWidth={1.75} />
                Resume
              </a>
              <a {...mail} className={styles.ghost}>
                <Mail aria-hidden size={18} strokeWidth={1.75} />
                <span translate="no">{profile.email}</span>
              </a>
            </p>
          </div>
          <div aria-hidden className={styles.orbs}>
            <span className={styles.orbLarge} />
            <span className={styles.orbSmall} />
          </div>
        </header>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.title}>Story</h2>
          <Reveal className={`${styles.glass} ${styles.panel}`}>
            <p className={styles.lead}>{profile.summary}</p>
            <div className={styles.twoCol}>
              {story.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </Reveal>
          <ul className={styles.quotes}>
            {story.quotes.map((quote, i) => (
              <Reveal as="li" key={quote} delay={i * 0.08} className={`${styles.glass} ${styles.quote}`}>
                {quote}
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <p className={styles.refrain}>
              {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
            </p>
          </Reveal>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <h2 id="skills-h" className={styles.title}>Skills</h2>
          <div className={styles.skillGrid}>
            {skills.map((category, i) => (
              <Reveal as="article" key={category.title} delay={i * 0.06} className={`${styles.glass} ${styles.panel}`}>
                <h3>{category.title}</h3>
                <p className={styles.muted}>{category.subtitle}</p>
                <ul className={styles.pills}>
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
            <Reveal as="article" key={job.company + job.period} className={`${styles.glass} ${styles.panel}`}>
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
              <ul className={styles.pills}>
                {job.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {job.link && (
                <p>
                  <a href={job.link.href} target="_blank" rel="noopener noreferrer" translate="no" className={styles.inline}>
                    {job.link.label} <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} />
                  </a>
                </p>
              )}
            </Reveal>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <h2 id="projects-h" className={styles.title}>Projects</h2>
          <div className={styles.stack}>
            {projects.map((project, i) => (
              <article key={project.repo.name} className={`${styles.glass} ${styles.stackCard}`} style={{ "--i": i } as CSSProperties}>
                <div>
                  <p className={styles.badge}>{project.kind}</p>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p>{project.summary}</p>
                  <ul className={styles.pills}>
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {project.facts && <p className={styles.muted}>{project.facts.join(", ")}</p>}
                  <p className={styles.actions}>
                    <a {...project.code} className={styles.ghost}>
                      Code<span className="sr-only"> for {project.title}</span>
                      <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} />
                    </a>
                    {project.demo && (
                      <a {...project.demo} className={styles.primary}>
                        Live demo<span className="sr-only"> of {project.title}</span>
                        <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} />
                      </a>
                    )}
                  </p>
                </div>
                <ul className={styles.bullets}>
                  {project.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {moreRepos.length > 0 && (
            <Reveal className={`${styles.glass} ${styles.panel} ${styles.repoPanel}`}>
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
          <div className={styles.eduGrid}>
            {education.map((entry) => (
              <Reveal as="article" key={entry.institution} className={`${styles.glass} ${styles.panel}`}>
                <p className={styles.badge}>{entry.period}</p>
                <h3>{entry.degree}</h3>
                <p>
                  {entry.institution}
                  {entry.cgpa && `. CGPA ${entry.cgpa}`}
                </p>
                <ul className={styles.pills}>
                  {entry.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <Reveal delay={0.06} className={`${styles.glass} ${styles.panel}`}>
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
          <ol className={styles.timeline}>
            {timeline.map((entry, i) => (
              <Reveal as="li" key={entry.year + entry.desc} delay={i * 0.04} className={`${styles.glass} ${styles.timeItem}`}>
                <span className={styles.year}>{entry.year}</span>
                <span>{entry.desc}</span>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <h2 id="curiosity-h" className={styles.title}>Interests</h2>
          <ul className={styles.floaters}>
            {interests.map((item, i) => (
              <li key={item} className={styles.floater} style={{ "--d": `${(i % 4) * -2.3}s` } as CSSProperties}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <Reveal className={`${styles.glass} ${styles.contact}`}>
            <h2 id="contact-h" className={styles.contactTitle}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className={styles.lead}>{profile.contact.pitch}</p>
            <p className={styles.muted}>{profile.location.sentence}</p>
            <p className={styles.actions}>
              {contactLinks.map((link) => (
                <a key={link.id} {...link.props} className={link.id === "resume" ? styles.primary : styles.ghost}>
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={() => copy(profile.email)} className={styles.ghost}>
                {copied ? <Check aria-hidden size={16} strokeWidth={1.75} /> : <Copy aria-hidden size={16} strokeWidth={1.75} />}
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
