"use client";

import type { CSSProperties } from "react";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { hand, serif, typewriter } from "./fonts";
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

const NOTE_COLOURS = ["noteYellow", "notePink", "noteBlue", "noteGreen"] as const;
const tilt = (deg: number) => ({ "--tilt": `${deg}deg` }) as CSSProperties;

const Tape = ({ className = "" }: { className?: string }) => <span aria-hidden className={`${styles.tape} ${className}`} />;

/**
 * Scrapbook. Reading this as: developer portfolio for recruiters, as a desk covered in paper:
 * taped polaroids, sticky notes, an index card, a ticket stub, a postcard, with handwriting for
 * the margin notes and a plain book serif for everything that must be read. Pieces settle into
 * place with a small rotation; text never sits on a busy texture.
 */
export default function ScrapbookDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="scrapbook" className={`${hand.variable} ${typewriter.variable} ${serif.variable} ${styles.page}`}>
      <SkipLink />
      <div className={styles.wrap}>
        <nav aria-label="Sections" className={styles.nav}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <header className={styles.hero}>
          <Reveal rotate={-3} y={14} className={`${styles.paper} ${styles.nameCard}`} style={tilt(-1.5)}>
            <Tape />
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.role}>{profile.tagline.join(" / ")}</p>
            <p className={styles.scribble}>{profile.location.sentence}</p>
          </Reveal>

          <Reveal rotate={4} y={14} delay={0.1} className={styles.stampWrap} style={tilt(3)}>
            <p className={styles.stamp}>
              <strong>{profile.availability.status}</strong>
              <span>{profile.availability.detail}</span>
            </p>
          </Reveal>

          <Reveal rotate={-2} y={14} delay={0.2} className={styles.heroLinks} style={tilt(-1)}>
            <a {...resume} className={styles.tag}>Resume</a>
            <a {...mail} className={styles.tag} translate="no">{profile.email}</a>
          </Reveal>
        </header>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.title}>Story</h2>
          <div className={styles.storyGrid}>
            <Reveal rotate={-2} className={`${styles.torn}`} style={tilt(-0.8)}>
              <div className={styles.tornInner}>
                <p className={styles.lead}>{profile.summary}</p>
              </div>
            </Reveal>
            <ul className={styles.notes}>
              {story.quotes.map((quote, i) => (
                <Reveal as="li" rotate={i % 2 ? 4 : -4} delay={i * 0.1} key={quote} className={`${styles.sticky} ${styles[NOTE_COLOURS[i + 1]]}`} style={tilt([-2.5, 2, -1.5][i])}>
                  <Tape className={styles.tapeCorner} />
                  {quote}
                </Reveal>
              ))}
            </ul>
          </div>
          <div className={styles.paragraphs}>
            {story.paragraphs.map((paragraph, i) => (
              <Reveal as="p" rotate={i % 2 ? 1.5 : -1.5} key={paragraph} className={`${styles.paper} ${styles.snippet}`} style={tilt(i % 2 ? 0.8 : -0.8)}>
                {paragraph}
              </Reveal>
            ))}
          </div>
          <p className={styles.refrain}>
            {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <mark>{story.refrain.punchline.emphasis}</mark>
          </p>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <h2 id="skills-h" className={styles.title}>Skills</h2>
          <div className={styles.skillWall}>
            {skills.map((category, i) => (
              <Reveal as="article" rotate={i % 2 ? 4 : -4} delay={i * 0.07} key={category.title} className={`${styles.sticky} ${styles.skillNote} ${styles[NOTE_COLOURS[i]]}`} style={tilt([-1.8, 1.4, -1, 2][i])}>
                <Tape className={styles.tapeCorner} />
                <h3>{category.title}</h3>
                <p className={styles.scribble}>{category.subtitle}</p>
                <ul className={styles.itemList}>
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
            <Reveal as="article" rotate={-1.5} key={job.company + job.period} className={styles.indexCard} style={tilt(-0.6)}>
              <Tape />
              <p className={styles.scribble}>{job.period}</p>
              <h3>{job.role}</h3>
              <p className={styles.company}>{job.company}</p>
              <ul className={styles.ruled}>
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
            </Reveal>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <h2 id="projects-h" className={styles.title}>Projects</h2>
          <div className={styles.polaroids}>
            {projects.map((project, i) => (
              <Reveal as="article" rotate={i % 2 ? 4 : -4} delay={i * 0.08} key={project.repo.name} className={`${styles.polaroid} ${i === 0 ? styles.polaroidWide : ""}`} style={tilt([-1.2, 1.4, -0.8][i % 3])}>
                <Tape />
                <div className={styles.photo}>
                  <p className={styles.kind}>{project.kind}</p>
                  <h3>{project.title}</h3>
                </div>
                <div className={styles.caption}>
                  <p>{project.summary}</p>
                  <ul className={styles.ruled}>
                    {project.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <ul className={styles.chips}>
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {project.facts && <p className={styles.scribble}>{project.facts.join(", ")}</p>}
                  <p className={styles.linkRow}>
                    <a {...project.code} className={styles.tag}>
                      Code<span className="sr-only"> for {project.title}</span>
                    </a>
                    {project.demo && (
                      <a {...project.demo} className={`${styles.tag} ${styles.tagSolid}`}>
                        Live demo<span className="sr-only"> of {project.title}</span>
                      </a>
                    )}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {moreRepos.length > 0 && (
            <Reveal rotate={-1} className={`${styles.paper} ${styles.repoSheet}`} style={tilt(0.4)}>
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
              <Reveal as="article" rotate={-2} key={entry.institution} className={`${styles.paper} ${styles.idCard}`} style={tilt(-0.8)}>
                <Tape />
                <p className={styles.scribble}>{entry.period}</p>
                <h3>{entry.degree}</h3>
                <p>
                  {entry.institution}
                  {entry.cgpa && `. CGPA ${entry.cgpa}`}
                </p>
                <ul className={styles.chips}>
                  {entry.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <ul className={styles.stubs}>
              {certifications.map((cert, i) => (
                <Reveal as="li" rotate={i % 2 ? 3 : -3} delay={i * 0.06} key={cert.name} className={styles.stub} style={tilt([1.2, -1, 0.8, -1.4][i % 4])}>
                  <strong>{cert.name}</strong>
                  {(cert.issuer || cert.year) && <small>{[cert.issuer, cert.year].filter(Boolean).join(", ")}</small>}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
          <h2 id="timeline-h" className={styles.title}>Timeline</h2>
          <ol className={styles.film}>
            {timeline.map((entry, i) => (
              <Reveal as="li" rotate={i % 2 ? 4 : -4} delay={i * 0.05} key={entry.year + entry.desc} className={styles.frame} style={tilt([-1.5, 1.2, -0.8, 1.6, -1, 0.8][i % 6])}>
                <span className={styles.year}>{entry.year}</span>
                <span>{entry.desc}</span>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <h2 id="curiosity-h" className={styles.title}>Interests</h2>
          <ul className={styles.stickers}>
            {interests.map((item, i) => (
              <li key={item} className={`${styles.badge} ${styles[NOTE_COLOURS[i % 4]]}`} style={tilt([-3, 2, -1.5, 3][i % 4])}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <Reveal rotate={-1.5} className={styles.postcard} style={tilt(-0.7)}>
            <Tape />
            <div className={styles.postMain}>
              <h2 id="contact-h" className={styles.contactTitle}>
                {profile.contact.headline.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p>{profile.contact.pitch}</p>
              <p className={styles.scribble}>{profile.location.sentence}</p>
            </div>
            <div className={styles.address}>
              <span aria-hidden className={styles.postStamp} />
              <ul>
                {contactLinks.map((link) => (
                  <li key={link.id}>
                    <a {...link.props}>{link.label}</a>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={() => copy(profile.email)} className={styles.copy}>
                    {copied ? "Copied" : "Copy email"}
                    <span className="sr-only"> address</span>
                  </button>
                </li>
              </ul>
            </div>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
