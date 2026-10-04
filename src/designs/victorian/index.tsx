"use client";

import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { fell, garamond } from "./fonts";
import styles from "./styles.module.css";

const CONTENTS = [
  ["story", "A Biographical Sketch", "I"],
  ["skills", "Accomplishments", "II"],
  ["experience", "Employment", "III"],
  ["projects", "Works Published", "IV"],
  ["education", "Education", "V"],
  ["timeline", "Chronology", "VI"],
  ["curiosity", "Pursuits & Diversions", "VII"],
  ["contact", "Correspondence", "VIII"],
] as const;

/** A thin rule with a diamond in the middle, the Victorian printer's section break. */
const Rule = () => <div aria-hidden className={styles.rule} />;

/**
 * Victorian. Reading this as: developer portfolio for recruiters, set as a printed book of the
 * period: a title page, a table of contents with dotted leaders, framed plates with brass corners,
 * a drop cap, burgundy and brass on aged paper. The period face is for headings only; all running
 * text is a plain book serif at a comfortable size.
 */
export default function VictorianDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();
  const [firstParagraph, ...restParagraphs] = story.paragraphs;

  return (
    <main id="top" data-design="victorian" className={`${fell.variable} ${garamond.variable} ${styles.page}`}>
      <SkipLink />
      <div className={styles.wrap}>
        <header className={styles.titlePage}>
          <Rule />
          <p className={styles.prelude}>Being the portfolio of</p>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.subtitle}>
            {profile.tagline[0]}, <em>and</em> {profile.tagline[1]}
          </p>
          <Rule />

          <div className={styles.notice}>
            <p className={styles.noticeHead}>{profile.availability.status}</p>
            <p>{profile.availability.detail}</p>
          </div>

          <div className={styles.cardWrap}>
            <div className={styles.callingCard}>
              <p className={styles.cardName}>{profile.name}</p>
              <p className={styles.cardRole}>{profile.jobTitle}</p>
              <p className={styles.cardLinks}>
                <a {...resume}>Resume</a>
                <a {...mail} translate="no">{profile.email}</a>
              </p>
            </div>
          </div>

          <nav aria-label="Sections" className={styles.contents}>
            <p className={styles.contentsTitle}>Contents</p>
            <ol>
              {CONTENTS.map(([id, label, numeral]) => (
                <li key={id}>
                  <a href={`#${id}`}>
                    <span aria-hidden className={styles.numeral}>{numeral}.</span>
                    <span className={styles.label}>{label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.title}>A Biographical Sketch</h2>
          <Reveal className={styles.plate}>
            <p className={styles.lead}>{profile.summary}</p>
            <Rule />
            <div className={styles.columns}>
              <p className={styles.dropcap}>{firstParagraph}</p>
              {restParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <blockquote className={styles.quote}>
              {story.quotes.map((quote) => (
                <p key={quote}>{quote}</p>
              ))}
            </blockquote>
            <p className={styles.refrain}>
              {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
            </p>
          </Reveal>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <h2 id="skills-h" className={styles.title}>Accomplishments</h2>
          <Reveal className={`${styles.plate} ${styles.ledger}`}>
            {skills.map((category) => (
              <div key={category.title} className={styles.ledgerRow}>
                <h3>{category.title}</h3>
                <p className={styles.note}>{category.subtitle}</p>
                <ul className={styles.inlineList}>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="experience" aria-labelledby="experience-h" className={styles.section}>
          <h2 id="experience-h" className={styles.title}>Employment</h2>
          {experience.map((job) => (
            <Reveal as="article" key={job.company + job.period} className={styles.plate}>
              <p className={styles.note}>{job.period}</p>
              <h3 className={styles.entryTitle}>{job.role}</h3>
              <p className={styles.company}>{job.company}</p>
              <ul className={styles.bullets}>
                {job.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ul className={styles.inlineList}>
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
          <h2 id="projects-h" className={styles.title}>Works Published</h2>
          {projects.map((project) => (
            <Reveal as="article" key={project.repo.name} className={styles.plate}>
              <p className={styles.note}>{project.kind}</p>
              <h3 className={styles.workTitle}>{project.title}</h3>
              <p className={styles.lead}>{project.summary}</p>
              <ul className={styles.bullets}>
                {project.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ul className={styles.inlineList}>
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {project.facts && <p className={styles.note}>{project.facts.join(", ")}</p>}
              <p className={styles.linkRow}>
                <a {...project.code} className={styles.cardButton}>
                  Code<span className="sr-only"> for {project.title}</span>
                </a>
                {project.demo && (
                  <a {...project.demo} className={`${styles.cardButton} ${styles.cardButtonSolid}`}>
                    Live demo<span className="sr-only"> of {project.title}</span>
                  </a>
                )}
              </p>
            </Reveal>
          ))}
          {moreRepos.length > 0 && (
            <Reveal className={styles.plate}>
              <h3 className={styles.entryTitle}>Also catalogued on GitHub</h3>
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
          <Reveal className={`${styles.plate} ${styles.diploma}`}>
            {education.map((entry) => (
              <article key={entry.institution}>
                <h3 className={styles.entryTitle}>{entry.degree}</h3>
                <p className={styles.company}>{entry.institution}</p>
                <p className={styles.note}>
                  {entry.period}
                  {entry.cgpa && `, CGPA ${entry.cgpa}`}
                </p>
                <ul className={styles.inlineList}>
                  {entry.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </article>
            ))}
            <Rule />
            <h3 className={styles.sub}>Testimonials of Study</h3>
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
          <h2 id="timeline-h" className={styles.title}>Chronology</h2>
          <Reveal className={styles.plate}>
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
          <h2 id="curiosity-h" className={styles.title}>Pursuits &amp; Diversions</h2>
          <Reveal className={styles.plate}>
            <ul className={`${styles.inlineList} ${styles.pursuits}`}>
              {interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <h2 id="contact-h" className={styles.title}>Correspondence</h2>
          <Reveal className={`${styles.plate} ${styles.invitation}`}>
            <p className={styles.invite}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <Rule />
            <p className={styles.lead}>{profile.contact.pitch}</p>
            <p className={styles.note}>{profile.location.sentence}</p>
            <p className={styles.linkRow}>
              {contactLinks.map((link) => (
                <a key={link.id} {...link.props} className={`${styles.cardButton} ${link.id === "resume" ? styles.cardButtonSolid : ""}`}>
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={() => copy(profile.email)} className={styles.cardButton}>
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
