"use client";

import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { serif } from "./fonts";
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

/** An open circle, drawn once with a single imperfect stroke. */
function Enso() {
  return (
    <svg aria-hidden viewBox="0 0 200 200" className={styles.enso}>
      <path
        d="M 138 36 C 104 14, 52 24, 34 66 C 16 108, 38 164, 90 176 C 138 186, 178 152, 182 106 C 184 84, 178 66, 166 52"
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  );
}

/**
 * Wabi-sabi. Reading this as: developer portfolio for recruiters, quiet and imperfect: plaster and
 * paper tones, asymmetry, a great deal of silence, small deliberate flaws (a slightly crooked rule,
 * an uneven stone, an open circle). Calm still has to read: text is dark ink at AA contrast.
 */
export default function WabiSabiDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();
  const [openingStatement, closingStatement] = profile.statements;

  return (
    <main id="top" data-design="wabi-sabi" className={`${serif.variable} ${styles.page}`}>
      <SkipLink />
      <div aria-hidden className={styles.grain} />

      <div className={styles.wrap}>
        <header className={styles.hero}>
          <nav aria-label="Sections" className={styles.nav}>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <Enso />
          <div className={styles.heroBody}>
            <h1 className={styles.name}>
              <span>{profile.givenName}</span>{" "}
              <span>{profile.familyName}</span>
            </h1>
            <p className={styles.role}>{profile.tagline.join(", ")}</p>
            <p className={styles.status}>
              {profile.availability.status}. {profile.availability.detail}.
            </p>
            <p className={styles.links}>
              <a {...resume}>Resume</a>
              <a {...mail} translate="no">{profile.email}</a>
            </p>
          </div>
        </header>

        <Reveal duration={1.8} y={8} className={styles.statement}>
          <p>
            {openingStatement.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </Reveal>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.title}>Story</h2>
          <Reveal duration={1.6} y={8}>
            <p className={styles.lead}>{profile.summary}</p>
          </Reveal>
          <div className={styles.slow}>
            {story.paragraphs.map((paragraph, i) => (
              <Reveal duration={1.6} y={8} key={paragraph} className={i % 2 ? styles.right : styles.left}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <ul className={styles.quotes}>
            {story.quotes.map((quote) => (
              <Reveal as="li" duration={1.8} y={6} key={quote}>
                {quote}
              </Reveal>
            ))}
          </ul>
          <Reveal duration={1.6} y={8}>
            <p className={styles.refrain}>
              {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
            </p>
          </Reveal>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <h2 id="skills-h" className={styles.title}>Skills</h2>
          <div className={styles.skills}>
            {skills.map((category, i) => (
              <Reveal as="article" duration={1.6} y={8} key={category.title} className={i % 2 ? styles.right : styles.left}>
                <h3>{category.title}</h3>
                <p className={styles.note}>{category.subtitle}</p>
                <ul className={styles.stones}>
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
            <Reveal as="article" duration={1.6} y={8} key={job.company + job.period} className={styles.entry}>
              <p className={styles.note}>{job.period}</p>
              <div>
                <h3>{job.role}</h3>
                <p className={styles.note}>{job.company}</p>
                <ul className={styles.lines}>
                  {job.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className={styles.stones}>
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
              </div>
            </Reveal>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <h2 id="projects-h" className={styles.title}>Projects</h2>
          {projects.map((project, i) => (
            <Reveal as="article" duration={1.6} y={8} key={project.repo.name} className={`${styles.project} ${i % 2 ? styles.right : styles.left}`}>
              <span aria-hidden className={styles.crooked} />
              <p className={styles.note}>{project.kind}</p>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.lead}>{project.summary}</p>
              <ul className={styles.lines}>
                {project.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ul className={styles.stones}>
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {project.facts && <p className={styles.note}>{project.facts.join(", ")}</p>}
              <p className={styles.links}>
                <a {...project.code}>
                  Code<span className="sr-only"> for {project.title}</span>
                </a>
                {project.demo && (
                  <a {...project.demo}>
                    Live demo<span className="sr-only"> of {project.title}</span>
                  </a>
                )}
              </p>
            </Reveal>
          ))}
          {moreRepos.length > 0 && (
            <Reveal duration={1.6} y={8}>
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
          <Reveal duration={1.6} y={8}>
            {education.map((entry) => (
              <article key={entry.institution} className={styles.entry}>
                <p className={styles.note}>{entry.period}</p>
                <div>
                  <h3>{entry.degree}</h3>
                  <p className={styles.note}>
                    {entry.institution}
                    {entry.cgpa && `, CGPA ${entry.cgpa}`}
                  </p>
                  <ul className={styles.stones}>
                    {entry.coursework.map((course) => (
                      <li key={course}>{course}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
            <h3 className={styles.sub}>Certifications</h3>
            <ul className={styles.certs}>
              {certifications.map((cert) => (
                <li key={cert.name}>
                  {cert.name}
                  {(cert.issuer || cert.year) && <small>{[cert.issuer, cert.year].filter(Boolean).join(", ")}</small>}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
          <h2 id="timeline-h" className={styles.title}>Timeline</h2>
          <ol className={styles.timeline}>
            {timeline.map((entry) => (
              <Reveal as="li" duration={1.6} y={8} key={entry.year + entry.desc}>
                <span className={styles.year}>{entry.year}</span>
                <span>{entry.desc}</span>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <h2 id="curiosity-h" className={styles.title}>Interests</h2>
          <Reveal duration={1.6} y={8}>
            <ul className={styles.drift}>
              {interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </section>

        <Reveal duration={1.8} y={8} className={`${styles.statement} ${styles.statementEnd}`}>
          <p>
            {closingStatement.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </Reveal>

        <section id="contact" aria-labelledby="contact-h" className={`${styles.section} ${styles.contact}`}>
          <h2 id="contact-h" className={styles.contactTitle}>{profile.contact.headline.join(" ")}</h2>
          <Reveal duration={1.6} y={8}>
            <p className={styles.lead}>{profile.contact.pitch}</p>
            <p className={styles.note}>{profile.location.sentence}</p>
            <p className={styles.links}>
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
          </Reveal>
        </section>
      </div>
    </main>
  );
}
