"use client";

import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { editorialDisplay, editorialText } from "./fonts";
import styles from "./styles.module.css";

const NAV = [
  ["story", "The story"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["timeline", "Chronology"],
  ["curiosity", "Pursuits"],
  ["contact", "Contact"],
] as const;

/**
 * Editorial design. Reading this as: developer portfolio for recruiters, set like a magazine
 * feature: a cover headline with a standfirst, serif text in columns, a drop cap, pull quotes and
 * thin rules. Reveal-on-scroll is the only motion.
 */
export default function EditorialDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();
  const [firstParagraph, ...restParagraphs] = story.paragraphs;

  return (
    <main id="top" data-design="editorial" className={`${editorialDisplay.variable} ${editorialText.variable} ${styles.page}`}>
      <SkipLink />
      <div className={styles.wrap}>
        <header className={styles.cover}>
          <div className={styles.rule} aria-hidden />
          <div className={styles.coverGrid}>
            <div className={styles.coverMain}>
              <p className={styles.kicker}>{profile.jobTitle}</p>
              <h1 className={styles.name}>{profile.name}</h1>
              <p className={styles.dek}>{profile.tagline.join(". ")}. {profile.location.sentence}</p>
              <p className={styles.byline}>
                <strong>{profile.availability.status}</strong>
                <span>{profile.availability.detail}</span>
              </p>
              <p className={styles.coverActions}>
                <a {...resume} className={styles.button}>Resume</a>
                <a {...mail} className={styles.linkQuiet} translate="no">{profile.email}</a>
              </p>
            </div>
            <nav aria-label="Sections" className={styles.contents}>
              <p className={styles.kicker}>In this portfolio</p>
              <ol>
                {NAV.map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`}>{label}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </header>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.title}>The story</h2>
          <p className={styles.standfirst}>{profile.summary}</p>
          <Reveal y={10} className={styles.columns}>
            <p className={styles.dropcap}>{firstParagraph}</p>
            {restParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal y={10}>
            <blockquote className={styles.pull}>
              {story.quotes.map((quote) => (
                <p key={quote}>{quote}</p>
              ))}
            </blockquote>
          </Reveal>
          <p className={styles.closing}>
            {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
          </p>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <h2 id="skills-h" className={styles.title}>Skills</h2>
          <Reveal y={10} className={styles.index}>
            {skills.map((category) => (
              <div key={category.title} className={styles.indexColumn}>
                <h3>{category.title}</h3>
                <p className={styles.subtitle}>{category.subtitle}</p>
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
          <h2 id="experience-h" className={styles.title}>Experience</h2>
          {experience.map((job) => (
            <Reveal as="article" y={10} key={job.company + job.period} className={styles.feature}>
              <aside className={styles.margin}>
                <p className={styles.kicker}>{job.period}</p>
                <p className={styles.marginName}>{job.company}</p>
              </aside>
              <div>
                <h3 className={styles.headline}>{job.role}</h3>
                <div className={styles.columns}>
                  {job.highlights.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className={styles.keywords}>
                  <span>Keywords</span> {job.tags.join(", ")}
                </p>
                {job.link && (
                  <p>
                    <a href={job.link.href} target="_blank" rel="noopener noreferrer" translate="no">
                      {job.link.label}
                    </a>
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <h2 id="projects-h" className={styles.title}>Projects</h2>
          {projects.map((project) => (
            <Reveal as="article" y={10} key={project.repo.name} className={styles.story}>
              <p className={styles.kicker}>{project.kind}</p>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.standfirst}>{project.summary}</p>
              <div className={styles.storyGrid}>
                <div className={styles.columns}>
                  {project.highlights.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <aside className={styles.glance} aria-label={`${project.title} at a glance`}>
                  <p className={styles.kicker}>Built with</p>
                  <p>{project.stack.join(", ")}</p>
                  {project.facts && (
                    <>
                      <p className={styles.kicker}>By the numbers</p>
                      <p>{project.facts.join(", ")}</p>
                    </>
                  )}
                  <p className={styles.glanceLinks}>
                    <a {...project.code}>
                      Code<span className="sr-only"> for {project.title}</span>
                    </a>
                    {project.demo && (
                      <a {...project.demo}>
                        Live demo<span className="sr-only"> of {project.title}</span>
                      </a>
                    )}
                  </p>
                </aside>
              </div>
            </Reveal>
          ))}
          {moreRepos.length > 0 && (
            <>
              <h3 className={styles.sub}>Also on GitHub</h3>
              <ul className={styles.leaders}>
                {moreRepos.map(({ repo, link }) => (
                  <li key={repo.name}>
                    <a {...link} translate="no">{repo.name}</a>
                    <span>{repo.description}</span>
                    <small>{[repo.language, monthYear(repo.pushed_at)].filter(Boolean).join(", ")}</small>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section id="education" aria-labelledby="education-h" className={styles.section}>
          <h2 id="education-h" className={styles.title}>Education</h2>
          <Reveal y={10} className={styles.split}>
            <div>
              {education.map((entry) => (
                <article key={entry.institution}>
                  <h3 className={styles.headline}>{entry.degree}</h3>
                  <p className={styles.standfirst}>
                    {entry.institution}, {entry.period}
                    {entry.cgpa && `. CGPA ${entry.cgpa}`}
                  </p>
                  <p className={styles.keywords}>
                    <span>Coursework</span> {entry.coursework.join(", ")}
                  </p>
                </article>
              ))}
            </div>
            <div>
              <h3 className={styles.sub}>Certifications</h3>
              <ul className={styles.plainList}>
                {certifications.map((cert) => (
                  <li key={cert.name}>
                    {cert.name}
                    {(cert.issuer || cert.year) && <small>{[cert.issuer, cert.year].filter(Boolean).join(", ")}</small>}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
          <h2 id="timeline-h" className={styles.title}>Chronology</h2>
          <Reveal y={10}>
            <ol className={styles.chronology}>
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
          <h2 id="curiosity-h" className={styles.title}>Pursuits</h2>
          <Reveal y={10}>
            <ul className={styles.pursuits}>
              {interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={`${styles.section} ${styles.contact}`}>
          <h2 id="contact-h" className={styles.contactTitle}>{profile.contact.headline.join(" ")}</h2>
          <div className={styles.split}>
            <p className={styles.standfirst}>{profile.contact.pitch}</p>
            <div className={styles.glance}>
              <p className={styles.kicker}>Write to me</p>
              <p>
                <a {...mail} translate="no">{profile.email}</a>{" "}
                <button type="button" onClick={() => copy(profile.email)} className={styles.copy}>
                  {copied ? "Copied" : "Copy"}
                  <span className="sr-only"> email address</span>
                </button>
              </p>
              <p>{profile.location.sentence}</p>
              <p className={styles.glanceLinks}>
                {contactLinks
                  .filter((link) => link.id !== "email")
                  .map((link) => (
                    <a key={link.id} {...link.props}>
                      {link.label}
                    </a>
                  ))}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
