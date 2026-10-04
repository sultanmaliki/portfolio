"use client";

import type { ReactNode } from "react";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { y2kDisplay, y2kText } from "./fonts";
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

const SPARKLES = [
  { top: "8%", left: "6%", size: 2.4, delay: 0 },
  { top: "14%", left: "88%", size: 3.2, delay: -1.2 },
  { top: "34%", left: "94%", size: 1.6, delay: -2.1 },
  { top: "46%", left: "3%", size: 2, delay: -0.6 },
  { top: "62%", left: "90%", size: 2.6, delay: -3 },
  { top: "78%", left: "8%", size: 3, delay: -1.8 },
  { top: "90%", left: "80%", size: 1.8, delay: -2.6 },
] as const;

/** A decorative desktop window. The title bar text is the section's real heading. */
function Win({ id, title, children, className = "", delay = 0 }: { id: string; title: string; children: ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal as="section" id={id} aria-labelledby={`${id}-h`} delay={delay} className={`${styles.win} ${className}`}>
      <div className={styles.bar}>
        <h2 id={`${id}-h`} className={styles.barTitle}>{title}</h2>
        <span aria-hidden className={styles.controls}>
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className={styles.winBody}>{children}</div>
    </Reveal>
  );
}

/**
 * Y2K aesthetic. Reading this as: developer portfolio for recruiters, as a 1999 desktop dreamed up
 * by a toy company: iridescent pastel sky, glossy bubble buttons, translucent plastic windows with
 * title bars, sparkles. Deep indigo text on pale surfaces, dark plum on pink; shine sweeps and
 * twinkles are slow and stop for reduced motion. Window controls are decoration only.
 */
export default function Y2KDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="y2k" className={`${y2kDisplay.variable} ${y2kText.variable} ${styles.page}`}>
      <SkipLink />

      <div aria-hidden className={styles.sky}>
        {SPARKLES.map((s, i) => (
          <span key={i} className={styles.sparkle} style={{ top: s.top, left: s.left, width: `${s.size}rem`, height: `${s.size}rem`, animationDelay: `${s.delay}s` }} />
        ))}
      </div>

      <div className={styles.wrap}>
        <nav aria-label="Sections" className={styles.menu}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={styles.menuLink}>
              {label}
            </a>
          ))}
        </nav>

        <header className={`${styles.win} ${styles.hero}`}>
          <div className={styles.bar}>
            <p className={styles.barTitle}>{profile.jobTitle}</p>
            <span aria-hidden className={styles.controls}>
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className={`${styles.winBody} ${styles.heroBody}`}>
            <p className={styles.sticker}>
              <strong>{profile.availability.status}</strong>
              <span>{profile.availability.detail}</span>
            </p>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.role}>{profile.tagline.join(" + ")}</p>
            <p className={styles.actions}>
              <a {...resume} className={styles.bubble}>Resume</a>
              <a {...mail} className={`${styles.bubble} ${styles.bubbleBlue}`} translate="no">{profile.email}</a>
            </p>
          </div>
        </header>

        <div className={styles.desk}>
          <Win id="story" title="Story" className={styles.left}>
            <p className={styles.lead}>{profile.summary}</p>
            <div className={styles.twoCol}>
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className={styles.quotes}>
              {story.quotes.map((quote) => (
                <li key={quote}>{quote}</li>
              ))}
            </ul>
            <p className={styles.refrain}>
              {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
            </p>
          </Win>

          <Win id="skills" title="Skills" className={styles.right}>
            <div className={styles.skillGrid}>
              {skills.map((category) => (
                <article key={category.title} className={styles.folder}>
                  <h3>{category.title}</h3>
                  <p className={styles.muted}>{category.subtitle}</p>
                  <ul className={styles.beads}>
                    {category.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Win>

          <Win id="experience" title="Experience" className={styles.left}>
            {experience.map((job) => (
              <article key={job.company + job.period}>
                <div className={styles.jobHead}>
                  <h3>{job.role}</h3>
                  <p className={styles.date}>{job.period}</p>
                </div>
                <p className={styles.muted}>{job.company}</p>
                <ul className={styles.bullets}>
                  {job.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className={styles.beads}>
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
          </Win>

          <section id="projects" aria-labelledby="projects-h" className={styles.projects}>
            <h2 id="projects-h" className={styles.sectionHeading}>Projects</h2>
            {projects.map((project, i) => (
              <Reveal as="article" key={project.repo.name} delay={i * 0.06} className={`${styles.win} ${i % 2 ? styles.right : styles.left}`}>
                <div className={styles.bar}>
                  <h3 className={styles.barTitle}>{project.title}</h3>
                  <span aria-hidden className={styles.controls}>
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
                <div className={styles.winBody}>
                  <p className={styles.date}>{project.kind}</p>
                  <p className={styles.lead}>{project.summary}</p>
                  <ul className={styles.bullets}>
                    {project.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <ul className={styles.beads}>
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {project.facts && <p className={styles.muted}>{project.facts.join(", ")}</p>}
                  <p className={styles.actions}>
                    <a {...project.code} className={`${styles.bubble} ${styles.bubbleSmall}`}>
                      Code<span className="sr-only"> for {project.title}</span>
                    </a>
                    {project.demo && (
                      <a {...project.demo} className={`${styles.bubble} ${styles.bubbleBlue} ${styles.bubbleSmall}`}>
                        Live demo<span className="sr-only"> of {project.title}</span>
                      </a>
                    )}
                  </p>
                </div>
              </Reveal>
            ))}
            {moreRepos.length > 0 && (
              <Reveal className={`${styles.win} ${styles.left}`}>
                <div className={styles.bar}>
                  <h3 className={styles.barTitle}>More from GitHub</h3>
                  <span aria-hidden className={styles.controls}>
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
                <div className={styles.winBody}>
                  <ul className={styles.files}>
                    {moreRepos.map(({ repo, link }) => (
                      <li key={repo.name}>
                        <a {...link} translate="no">{repo.name}</a>
                        <span>{repo.description}</span>
                        <small>{[repo.language, monthYear(repo.pushed_at)].filter(Boolean).join(", ")}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </section>

          <Win id="education" title="Education" className={styles.right}>
            {education.map((entry) => (
              <article key={entry.institution}>
                <p className={styles.date}>{entry.period}</p>
                <h3>{entry.degree}</h3>
                <p>
                  {entry.institution}
                  {entry.cgpa && `. CGPA ${entry.cgpa}`}
                </p>
                <ul className={styles.beads}>
                  {entry.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </article>
            ))}
            <h3 className={styles.sub}>Certifications</h3>
            <ul className={styles.files}>
              {certifications.map((cert) => (
                <li key={cert.name} className={styles.certRow}>
                  <span>{cert.name}</span>
                  {(cert.issuer || cert.year) && <small>{[cert.issuer, cert.year].filter(Boolean).join(", ")}</small>}
                </li>
              ))}
            </ul>
          </Win>

          <Win id="timeline" title="Timeline" className={styles.left}>
            <div aria-hidden className={styles.progress}>
              {Array.from({ length: 14 }, (_, i) => (
                <span key={i} />
              ))}
            </div>
            <ol className={styles.history}>
              {timeline.map((entry) => (
                <li key={entry.year + entry.desc}>
                  <span className={styles.year}>{entry.year}</span>
                  <span>{entry.desc}</span>
                </li>
              ))}
            </ol>
          </Win>

          <section id="curiosity" aria-labelledby="curiosity-h" className={styles.stickers}>
            <h2 id="curiosity-h" className={styles.sectionHeading}>Interests</h2>
            <ul>
              {interests.map((item, i) => (
                <li key={item} className={`${styles.stickerChip} ${[styles.chipPink, styles.chipBlue, styles.chipLilac][i % 3]}`}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <Win id="contact" title="Contact" className={styles.right}>
            <p className={styles.contactLine}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className={styles.lead}>{profile.contact.pitch}</p>
            <p className={styles.muted}>{profile.location.sentence}</p>
            <p className={styles.actions}>
              {contactLinks.map((link) => (
                <a key={link.id} {...link.props} className={`${styles.bubble} ${link.id === "resume" ? "" : styles.bubbleBlue}`}>
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={() => copy(profile.email)} className={`${styles.bubble} ${styles.bubbleLilac}`}>
                {copied ? "Copied" : "Copy email"}
                <span className="sr-only"> address</span>
              </button>
            </p>
          </Win>
        </div>
      </div>
    </main>
  );
}
