"use client";

import ViewerTheme from "@/components/viewer/viewerTheme";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import styles from "./styles.module.css";
import "./viewer.css";

/**
 * __NAME__ design (STARTER).
 *
 * A plain, accessible rendering of the whole portfolio so the design works end to end on day one.
 * Replace the markup and styles.module.css with the real __NAME__ look, but keep the contract that
 * e2e/designs.spec.ts checks for every live design:
 *
 *   - one <h1> with the full name, one <main>, the availability line, a Resume link and the email
 *   - every featured project, job, education entry and skill
 *   - the nine anchors: top, story, skills, experience, education, projects, timeline, curiosity, contact
 *   - no console errors, no horizontal scrolling from 320px up, WCAG AA contrast, calm under reduced motion
 *   - a viewer theme: <ViewerTheme> below plus viewer.css, so the built-in browser window and PDF reader take on this design
 *
 * Content and links come only from usePortfolio() (never hard-code them). Fonts: self-host with
 * next/font/local in ./fonts.ts. The brief and the conventions are in docs/DESIGNS.md.
 */
export default function __COMPONENT__() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="__SLUG__" className={styles.page}>
      <ViewerTheme slug="__SLUG__" entrance="rise" />
      <SkipLink />
      <div className={styles.wrap}>
        <header className={styles.header}>
          <h1>{profile.name}</h1>
          <p>{profile.tagline.join(" | ")}</p>
          <p className={styles.muted}>
            {profile.availability.status}. {profile.availability.detail}.
          </p>
          <p className={styles.actions}>
            <a {...resume} className={styles.button}>Resume</a>
            <a {...mail} className={styles.button} translate="no">{profile.email}</a>
          </p>
          <nav aria-label="Sections" className={styles.nav}>
            {(["story", "skills", "experience", "projects", "education", "timeline", "contact"] as const).map((id) => (
              <a key={id} href={`#${id}`}>
                {id}
              </a>
            ))}
          </nav>
        </header>

        <section id="story" aria-labelledby="story-h">
          <h2 id="story-h">Story</h2>
          <p>{profile.summary}</p>
          {story.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </section>

        <section id="skills" aria-labelledby="skills-h">
          <h2 id="skills-h">Skills</h2>
          {skills.map((category) => (
            <div key={category.title}>
              <h3>{category.title}</h3>
              <p>{category.items.join(", ")}</p>
            </div>
          ))}
        </section>

        <section id="experience" aria-labelledby="experience-h">
          <h2 id="experience-h">Experience</h2>
          {experience.map((job) => (
            <article key={job.company + job.period}>
              <h3>{job.role}</h3>
              <p className={styles.muted}>
                {job.company}, {job.period}
              </p>
              <ul>
                {job.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="education" aria-labelledby="education-h">
          <h2 id="education-h">Education</h2>
          {education.map((entry) => (
            <article key={entry.institution}>
              <h3>{entry.degree}</h3>
              <p className={styles.muted}>
                {entry.institution}, {entry.period}
                {entry.cgpa && `, CGPA ${entry.cgpa}`}
              </p>
            </article>
          ))}
          <ul>
            {certifications.map((cert) => (
              <li key={cert.name}>
                {cert.name}
                {(cert.issuer || cert.year) && ` (${[cert.issuer, cert.year].filter(Boolean).join(", ")})`}
              </li>
            ))}
          </ul>
        </section>

        <section id="projects" aria-labelledby="projects-h">
          <h2 id="projects-h">Projects</h2>
          {projects.map((project) => (
            <article key={project.repo.name}>
              <h3>{project.title}</h3>
              <p className={styles.muted}>{project.kind}</p>
              <p>{project.summary}</p>
              <ul>
                {project.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className={styles.muted}>{project.stack.join(", ")}</p>
              <p className={styles.actions}>
                <a {...project.code}>
                  Code<span className="sr-only"> for {project.title}</span>
                </a>
                {project.demo && (
                  <a {...project.demo}>
                    Live demo<span className="sr-only"> of {project.title}</span>
                  </a>
                )}
              </p>
            </article>
          ))}
          {moreRepos.length > 0 && (
            <>
              <h3>More from GitHub</h3>
              <ul>
                {moreRepos.map(({ repo, link }) => (
                  <li key={repo.name}>
                    <a {...link} translate="no">{repo.name}</a>
                    {repo.description && <span className={styles.muted}>{`: ${repo.description} (${monthYear(repo.pushed_at)})`}</span>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section id="timeline" aria-labelledby="timeline-h">
          <h2 id="timeline-h">Timeline</h2>
          <ol>
            {timeline.map((entry) => (
              <li key={entry.year + entry.desc}>
                <strong>{entry.year}</strong> {entry.desc}
              </li>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h">
          <h2 id="curiosity-h">Interests</h2>
          <p>{interests.join(", ")}</p>
        </section>

        <section id="contact" aria-labelledby="contact-h">
          <h2 id="contact-h">{profile.contact.headline.join(" ")}</h2>
          <p>{profile.contact.pitch}</p>
          <p className={styles.muted}>{profile.location.sentence}</p>
          <p className={styles.actions}>
            {contactLinks.map((link) => (
              <a key={link.id} {...link.props}>
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
