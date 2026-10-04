"use client";

import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { grotesk, mono } from "./fonts";
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

// Skill categories and interests rotate through the same four colours, so the page keeps a fixed palette.
const TONES = ["tonePink", "toneBlue", "toneMint", "toneLilac"] as const;

/**
 * Neo-brutalism. Reading this as: developer portfolio for recruiters, loud and honest: thick black
 * borders, hard offset shadows, flat colour blocks and slightly crooked stickers. Sharp corners
 * everywhere (one shape rule), mechanical motion only (things shift into their shadow when pressed).
 */
export default function NeoBrutalismDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="neo-brutalism" className={`${grotesk.variable} ${mono.variable} ${styles.page}`}>
      <SkipLink />
      <div className={styles.wrap}>
        <header className={styles.top}>
          <nav aria-label="Sections" className={styles.nav}>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
        </header>

        <section aria-label="Introduction" className={styles.hero}>
          <div>
            <h1 className={styles.name}>
              <span>{profile.givenName}</span>{" "}
              <span className={styles.nameMark}>{profile.familyName}</span>
            </h1>
            <p className={styles.sticker}>
              <strong>{profile.availability.status}</strong>
              <span>{profile.availability.detail}</span>
            </p>
            <p className={styles.heroActions}>
              <a {...resume} className={`${styles.btn} ${styles.btnDark}`}>Resume</a>
              <a {...mail} className={styles.btn}>Email me</a>
            </p>
          </div>
          <dl className={`${styles.card} ${styles.facts}`}>
            <div>
              <dt>Role</dt>
              <dd>{profile.jobTitle}</dd>
            </div>
            <div>
              <dt>Background</dt>
              <dd>{profile.tagline[0]}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{profile.tagline[1]}</dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{profile.location.city}, {profile.location.region}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd translate="no">{profile.email}</dd>
            </div>
          </dl>
        </section>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.title}>Story</h2>
          <p className={`${styles.card} ${styles.big}`}>{profile.summary}</p>
          <ul className={styles.quotes}>
            {story.quotes.map((quote, i) => (
              <li key={quote} className={`${styles.card} ${styles[TONES[(i + 1) % TONES.length]]} ${styles.quote}`}>
                {quote}
              </li>
            ))}
          </ul>
          <div className={styles.twoCol}>
            {story.paragraphs.map((text) => (
              <p key={text} className={styles.paragraph}>{text}</p>
            ))}
          </div>
          <p className={styles.refrain}>
            {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <mark>{story.refrain.punchline.emphasis}</mark>
          </p>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <h2 id="skills-h" className={styles.title}>Skills</h2>
          <div className={styles.skillGrid}>
            {skills.map((category, i) => (
              <article key={category.title} className={`${styles.card} ${styles[TONES[i % TONES.length]]}`}>
                <h3>{category.title}</h3>
                <p className={styles.label}>{category.subtitle}</p>
                <ul className={styles.chips}>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-h" className={styles.section}>
          <h2 id="experience-h" className={styles.title}>Experience</h2>
          {experience.map((job) => (
            <article key={job.company + job.period} className={`${styles.card} ${styles.job}`}>
              <div className={styles.jobHead}>
                <h3>{job.role}</h3>
                <p className={styles.stamp}>{job.period}</p>
              </div>
              <p className={styles.label}>{job.company}</p>
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
                    {job.link.label}
                  </a>
                </p>
              )}
            </article>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <h2 id="projects-h" className={styles.title}>Projects</h2>
          <div className={styles.projectGrid}>
            {projects.map((project, i) => (
              <article key={project.repo.name} className={`${styles.card} ${styles.project} ${i === 0 ? styles.projectWide : ""} ${i % 2 ? styles.tiltRight : styles.tiltLeft}`}>
                <p className={styles.kind}>{project.kind}</p>
                <h3>{project.title}</h3>
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
                {project.facts && (
                  <ul className={styles.badges}>
                    {project.facts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                )}
                <p className={styles.heroActions}>
                  <a {...project.code} className={`${styles.btn} ${styles.btnDark}`}>
                    Code<span className="sr-only"> for {project.title}</span>
                  </a>
                  {project.demo && (
                    <a {...project.demo} className={styles.btn}>
                      Live demo<span className="sr-only"> of {project.title}</span>
                    </a>
                  )}
                </p>
              </article>
            ))}
          </div>

          {moreRepos.length > 0 && (
            <>
              <h3 className={styles.subTitle}>More from GitHub</h3>
              <ul className={styles.repoGrid}>
                {moreRepos.map(({ repo, link }) => (
                  <li key={repo.name} className={styles.card}>
                    <a {...link} translate="no" className={styles.repoName}>{repo.name}</a>
                    <p>{repo.description}</p>
                    <p className={styles.label}>{[repo.language, monthYear(repo.pushed_at)].filter(Boolean).join(", ")}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section id="education" aria-labelledby="education-h" className={styles.section}>
          <h2 id="education-h" className={styles.title}>Education</h2>
          <div className={styles.eduGrid}>
            {education.map((entry) => (
              <article key={entry.institution} className={`${styles.card} ${styles.toneBlue}`}>
                <h3>{entry.degree}</h3>
                <p className={styles.label}>
                  {entry.institution}, {entry.period}
                </p>
                {entry.cgpa && <p className={styles.stamp}>CGPA {entry.cgpa}</p>}
                <ul className={styles.chips}>
                  {entry.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </article>
            ))}
            <ul className={styles.certs}>
              {certifications.map((cert, i) => (
                <li key={cert.name} className={`${styles.card} ${styles[TONES[(i + 2) % TONES.length]]}`}>
                  <strong>{cert.name}</strong>
                  {(cert.issuer || cert.year) && <span>{[cert.issuer, cert.year].filter(Boolean).join(", ")}</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
          <h2 id="timeline-h" className={styles.title}>Timeline</h2>
          <ol className={styles.steps}>
            {timeline.map((entry) => (
              <li key={entry.year + entry.desc} className={styles.card}>
                <span className={styles.stamp}>{entry.year}</span>
                <span>{entry.desc}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <h2 id="curiosity-h" className={styles.title}>Interests</h2>
          <ul className={styles.stickers}>
            {interests.map((item, i) => (
              <li key={item} className={`${styles.card} ${styles[TONES[i % TONES.length]]}`}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <div className={`${styles.card} ${styles.contact}`}>
            <h2 id="contact-h" className={styles.contactTitle}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className={styles.big}>{profile.contact.pitch}</p>
            <p className={styles.label}>{profile.location.sentence}</p>
            <p className={styles.heroActions}>
              {contactLinks.map((link) => (
                <a key={link.id} {...link.props} className={`${styles.btn} ${link.id === "resume" ? styles.btnDark : ""}`}>
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={() => copy(profile.email)} className={styles.btn}>
                {copied ? "Copied" : "Copy email"}
                <span className="sr-only"> address</span>
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
