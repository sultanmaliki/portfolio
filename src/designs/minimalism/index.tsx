"use client";

import SkipLink from "../shared/SkipLink";
import { usePortfolio } from "../shared/usePortfolio";
import { minimalSans } from "./fonts";
import styles from "./styles.module.css";

const NAV = [
  ["story", "Story"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["timeline", "Timeline"],
  ["curiosity", "Interests"],
  ["contact", "Contact"],
] as const;

/**
 * Minimalism. Reading this as: developer portfolio for recruiters, calm and quiet, one typeface,
 * one column, no decoration. Nothing is hidden: it is simply set in plain text with room around it.
 */
export default function MinimalismDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="minimalism" className={`${minimalSans.variable} ${styles.page}`}>
      <SkipLink />
      <div className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.role}>{profile.tagline.join(", ")}</p>
          <p className={styles.status}>
            {profile.availability.status}. {profile.availability.detail}.
          </p>
          <p className={styles.actions}>
            <a {...resume}>Resume</a>
            <a {...mail}>{profile.email}</a>
          </p>
          <nav aria-label="Sections" className={styles.nav}>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
        </header>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.label}>Story</h2>
          <p className={styles.lead}>{profile.summary}</p>
          {story.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <p className={styles.quiet}>
            {story.quotes.join(" ")} {story.refrain.lines.join(" ")} {story.refrain.punchline.lead}{" "}
            <strong>{story.refrain.punchline.emphasis}</strong>
          </p>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <h2 id="skills-h" className={styles.label}>Skills</h2>
          <dl className={styles.pairs}>
            {skills.map((category) => (
              <div key={category.title}>
                <dt>{category.title}</dt>
                <dd>{category.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="experience" aria-labelledby="experience-h" className={styles.section}>
          <h2 id="experience-h" className={styles.label}>Experience</h2>
          {experience.map((job) => (
            <article key={job.company + job.period} className={styles.entry}>
              <h3>{job.role}</h3>
              <p className={styles.meta}>
                {job.company}, {job.period}
              </p>
              {job.highlights.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p className={styles.meta}>{job.tags.join(", ")}</p>
              {job.link && (
                <p>
                  <a href={job.link.href} target="_blank" rel="noopener noreferrer" translate="no">
                    {job.link.label}
                  </a>
                </p>
              )}
            </article>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <h2 id="projects-h" className={styles.label}>Projects</h2>
          {projects.map((project) => (
            <article key={project.repo.name} className={styles.entry}>
              <h3>{project.title}</h3>
              <p className={styles.meta}>{project.kind}</p>
              <p>{project.summary}</p>
              {project.highlights.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p className={styles.meta}>{project.stack.join(", ")}</p>
              {project.facts && <p className={styles.meta}>{project.facts.join(", ")}</p>}
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
              <h3 className={styles.sub}>More from GitHub</h3>
              <ul className={styles.plain}>
                {moreRepos.map(({ repo, link }) => (
                  <li key={repo.name}>
                    <a {...link} translate="no">
                      {repo.name}
                    </a>
                    {repo.description && <span className={styles.meta}>{`: ${repo.description}`}</span>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section id="education" aria-labelledby="education-h" className={styles.section}>
          <h2 id="education-h" className={styles.label}>Education</h2>
          {education.map((entry) => (
            <article key={entry.institution} className={styles.entry}>
              <h3>{entry.degree}</h3>
              <p className={styles.meta}>
                {entry.institution}, {entry.period}
                {entry.cgpa && `, CGPA ${entry.cgpa}`}
              </p>
              <p className={styles.meta}>{entry.coursework.join(", ")}</p>
            </article>
          ))}
          <h3 className={styles.sub}>Certifications</h3>
          <ul className={styles.plain}>
            {certifications.map((cert) => (
              <li key={cert.name}>
                {cert.name}
                {(cert.issuer || cert.year) && <span className={styles.meta}>{`, ${[cert.issuer, cert.year].filter(Boolean).join(" ")}`}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
          <h2 id="timeline-h" className={styles.label}>Timeline</h2>
          <ol className={styles.timeline}>
            {timeline.map((entry) => (
              <li key={entry.year + entry.desc}>
                <span className={styles.year}>{entry.year}</span>
                <span>{entry.desc}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <h2 id="curiosity-h" className={styles.label}>Interests</h2>
          <p>{interests.join(", ")}.</p>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <h2 id="contact-h" className={styles.label}>Contact</h2>
          <p className={styles.lead}>{profile.contact.headline.join(" ")}</p>
          <p>{profile.contact.pitch}</p>
          <p className={styles.meta}>{profile.location.sentence}</p>
          <p className={styles.actions}>
            {contactLinks.map((link) => (
              <a key={link.id} {...link.props}>
                {link.label}
              </a>
            ))}
            <button type="button" onClick={() => copy(profile.email)} className={styles.textButton}>
              {copied ? "Copied" : "Copy email"}
              <span className="sr-only"> address</span>
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}
