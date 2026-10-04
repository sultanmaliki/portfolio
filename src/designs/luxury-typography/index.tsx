"use client";

import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { luxurySans, luxurySerif } from "./fonts";
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

function SectionTitle({ n, id, children }: { n: number; id: string; children: string }) {
  return (
    <header className={styles.sectionTitle}>
      <span aria-hidden className={styles.numeral}>{pad(n)}</span>
      <h2 id={id}>{children}</h2>
      <span aria-hidden className={styles.hairline} />
    </header>
  );
}

/**
 * Luxury typography. Reading this as: developer portfolio for recruiters, in a high-end editorial
 * register: black and ivory, gold hairlines, a high-contrast serif against a quiet geometric sans,
 * wide-tracked small caps, a great deal of negative space and slow fades. No imagery; the type is the luxury.
 */
export default function LuxuryTypographyDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();
  const monogram = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <main id="top" data-design="luxury-typography" className={`${luxurySerif.variable} ${luxurySans.variable} ${styles.page}`}>
      <SkipLink />

      <header className={styles.hero}>
        <nav aria-label="Sections" className={styles.nav}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <div className={styles.heroBody}>
          <span aria-hidden className={styles.monogram}>{monogram}</span>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.caps}>{profile.tagline.join("  ·  ")}</p>
          <span aria-hidden className={styles.rule} />
          <p className={styles.available}>
            {profile.availability.status}
            <span>{profile.availability.detail}</span>
          </p>
          <p className={styles.actions}>
            <a {...resume} className={styles.button}>Resume</a>
            <a {...mail} className={styles.textLink} translate="no">{profile.email}</a>
          </p>
        </div>
      </header>

      <div className={styles.content}>
        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <SectionTitle n={1} id="story-h">Story</SectionTitle>
          <Reveal y={14} duration={1.1} className={styles.narrow}>
            <p className={styles.lead}>{profile.summary}</p>
          </Reveal>
          <Reveal y={14} duration={1.1}>
            <blockquote className={styles.quote}>
              {story.quotes.map((quote) => (
                <p key={quote}>{quote}</p>
              ))}
            </blockquote>
          </Reveal>
          <Reveal y={14} duration={1.1} className={styles.narrow}>
            {story.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p className={styles.refrain}>
              {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
            </p>
          </Reveal>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <SectionTitle n={2} id="skills-h">Skills</SectionTitle>
          <Reveal y={14} duration={1.1} className={styles.skills}>
            {skills.map((category) => (
              <div key={category.title}>
                <h3>{category.title}</h3>
                <p className={styles.caps}>{category.subtitle}</p>
                <ul>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="experience" aria-labelledby="experience-h" className={styles.section}>
          <SectionTitle n={3} id="experience-h">Experience</SectionTitle>
          {experience.map((job) => (
            <Reveal as="article" y={14} duration={1.1} key={job.company + job.period} className={styles.lot}>
              <h3 className={styles.lotTitle}>{job.role}</h3>
              <p className={styles.gold}>
                {job.company}
                <span aria-hidden> / </span>
                {job.period}
              </p>
              <div className={styles.twoCol}>
                {job.highlights.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <p className={styles.caps}>{job.tags.join("  /  ")}</p>
              {job.link && (
                <p>
                  <a href={job.link.href} target="_blank" rel="noopener noreferrer" translate="no" className={styles.textLink}>
                    {job.link.label}
                  </a>
                </p>
              )}
            </Reveal>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <SectionTitle n={4} id="projects-h">Projects</SectionTitle>
          {projects.map((project, i) => (
            <Reveal as="article" y={14} duration={1.1} key={project.repo.name} className={styles.lot}>
              <p aria-hidden className={styles.lotNumber}>{pad(i + 1)}</p>
              <h3 className={styles.lotTitle}>{project.title}</h3>
              <p className={styles.gold}>{project.kind}</p>
              <p className={styles.lead}>{project.summary}</p>
              <div className={styles.twoCol}>
                {project.highlights.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <p className={styles.caps}>{project.stack.join("  /  ")}</p>
              {project.facts && <p className={styles.caps}>{project.facts.join("  /  ")}</p>}
              <p className={styles.actions}>
                <a {...project.code} className={styles.button}>
                  Code<span className="sr-only"> for {project.title}</span>
                </a>
                {project.demo && (
                  <a {...project.demo} className={styles.button}>
                    Live demo<span className="sr-only"> of {project.title}</span>
                  </a>
                )}
              </p>
            </Reveal>
          ))}
          {moreRepos.length > 0 && (
            <Reveal y={14} duration={1.1}>
              <h3 className={styles.subTitle}>More from GitHub</h3>
              <ul className={styles.repoList}>
                {moreRepos.map(({ repo, link }) => (
                  <li key={repo.name}>
                    <a {...link} translate="no">{repo.name}</a>
                    <span>{repo.description}</span>
                    <span className={styles.caps}>{[repo.language, monthYear(repo.pushed_at)].filter(Boolean).join("  /  ")}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </section>

        <section id="education" aria-labelledby="education-h" className={styles.section}>
          <SectionTitle n={5} id="education-h">Education</SectionTitle>
          <Reveal y={14} duration={1.1}>
            {education.map((entry) => (
              <article key={entry.institution} className={styles.lot}>
                <h3 className={styles.lotTitle}>{entry.degree}</h3>
                <p className={styles.gold}>
                  {entry.institution}
                  <span aria-hidden> / </span>
                  {entry.period}
                </p>
                {entry.cgpa && <p>CGPA {entry.cgpa}</p>}
                <p className={styles.caps}>{entry.coursework.join("  /  ")}</p>
              </article>
            ))}
            <h3 className={styles.subTitle}>Certifications</h3>
            <ul className={styles.certs}>
              {certifications.map((cert) => (
                <li key={cert.name}>
                  {cert.name}
                  {(cert.issuer || cert.year) && <span className={styles.caps}>{[cert.issuer, cert.year].filter(Boolean).join("  /  ")}</span>}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
          <SectionTitle n={6} id="timeline-h">Timeline</SectionTitle>
          <ol className={styles.timeline}>
            {timeline.map((entry) => (
              <Reveal as="li" y={14} duration={1.1} key={entry.year + entry.desc}>
                <span className={styles.year}>{entry.year}</span>
                <span>{entry.desc}</span>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <SectionTitle n={7} id="curiosity-h">Interests</SectionTitle>
          <Reveal y={14} duration={1.1}>
            <ul className={styles.interests}>
              {interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={`${styles.section} ${styles.contact}`}>
          <SectionTitle n={8} id="contact-h">Contact</SectionTitle>
          <Reveal y={14} duration={1.1}>
            <p className={styles.contactLine}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className={`${styles.narrow} ${styles.pitch}`}>{profile.contact.pitch}</p>
            <p className={styles.actions}>
              <a {...mail} className={styles.button} translate="no">{profile.email}</a>
              <button type="button" onClick={() => copy(profile.email)} className={styles.ghost}>
                {copied ? "Copied" : "Copy"}
                <span className="sr-only"> email address</span>
              </button>
            </p>
            <p className={styles.links}>
              {contactLinks
                .filter((link) => link.id !== "email")
                .map((link) => (
                  <a key={link.id} {...link.props} className={styles.textLink}>
                    {link.label}
                  </a>
                ))}
            </p>
            <p className={styles.caps}>{profile.location.sentence}</p>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
