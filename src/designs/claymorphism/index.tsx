"use client";

import { ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { clayDisplay, clayText } from "./fonts";
import styles from "./styles.module.css";
import ViewerTheme from "@/components/viewer/viewerTheme";
import "./viewer.css";

const NAV = [
  ["story", "Story"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["timeline", "Timeline"],
  ["contact", "Contact"],
] as const;

// Clay colours rotate in a fixed order so every section feels like the same box of modelling clay.
const CLAY = ["pink", "blue", "butter", "mint", "lilac", "peach"] as const;
const tone = (i: number) => styles[CLAY[i % CLAY.length]];

/**
 * Claymorphism. Reading this as: developer portfolio for recruiters, friendly and tactile: pastel
 * modelling clay with thick soft shadows and an inner highlight, big radii, rounded type. Text is
 * always dark plum on the pastel (never pastel on pastel). Buttons squish when pressed.
 */
export default function ClaymorphismDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="claymorphism" className={`${clayDisplay.variable} ${clayText.variable} ${styles.page}`}>
      <ViewerTheme slug="claymorphism" fonts={`${clayDisplay.variable} ${clayText.variable}`} entrance="pop" />
      <SkipLink />

      <div aria-hidden className={styles.blobs}>
        <span className={`${styles.blob} ${styles.blobA}`} />
        <span className={`${styles.blob} ${styles.blobB}`} />
        <span className={`${styles.blob} ${styles.blobC}`} />
      </div>

      <div className={styles.wrap}>
        <nav aria-label="Sections" className={`${styles.clay} ${styles.nav}`}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <header className={styles.hero}>
          <p className={`${styles.clay} ${styles.mint} ${styles.status}`}>
            <strong>{profile.availability.status}</strong>
            <span>{profile.availability.detail}</span>
          </p>
          <h1 className={styles.name}>
            <span>{profile.givenName}</span>{" "}
            <span className={styles.nameAccent}>{profile.familyName}</span>
          </h1>
          <p className={styles.role}>{profile.tagline.join(" and ")}</p>
          <p className={styles.actions}>
            <a {...resume} className={`${styles.clay} ${styles.button} ${styles.primary}`}>
              <FileText aria-hidden size={20} strokeWidth={2.25} />
              Resume
            </a>
            <a {...mail} className={`${styles.clay} ${styles.button}`}>
              <Mail aria-hidden size={20} strokeWidth={2.25} />
              <span translate="no">{profile.email}</span>
            </a>
          </p>
        </header>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.title}>Story</h2>
          <Reveal className={`${styles.clay} ${styles.card}`}>
            <p className={styles.lead}>{profile.summary}</p>
            <div className={styles.twoCol}>
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <ul className={styles.bubbles}>
            {story.quotes.map((quote, i) => (
              <Reveal as="li" key={quote} delay={i * 0.08} y={24} scale={0.94} className={`${styles.clay} ${styles.bubble} ${tone(i + 1)}`}>
                {quote}
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <p className={styles.refrain}>
              {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <mark>{story.refrain.punchline.emphasis}</mark>
            </p>
          </Reveal>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <h2 id="skills-h" className={styles.title}>Skills</h2>
          <div className={styles.skillGrid}>
            {skills.map((category, i) => (
              <Reveal as="article" key={category.title} delay={i * 0.06} className={`${styles.clay} ${styles.card} ${tone(i)}`}>
                <h3>{category.title}</h3>
                <p className={styles.muted}>{category.subtitle}</p>
                <ul className={styles.pile}>
                  {category.items.map((item) => (
                    <li key={item} className={styles.pill}>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-h" className={styles.section}>
          <h2 id="experience-h" className={styles.title}>Experience</h2>
          {experience.map((job) => (
            <Reveal as="article" key={job.company + job.period} className={`${styles.clay} ${styles.card} ${styles.butter}`}>
              <div className={styles.jobHead}>
                <h3>{job.role}</h3>
                <p className={`${styles.clay} ${styles.pill} ${styles.pillWhite}`}>{job.period}</p>
              </div>
              <p className={styles.muted}>{job.company}</p>
              <ul className={styles.bullets}>
                {job.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ul className={styles.pile}>
                {job.tags.map((tag) => (
                  <li key={tag} className={styles.pill}>
                    {tag}
                  </li>
                ))}
              </ul>
              {job.link && (
                <p>
                  <a href={job.link.href} target="_blank" rel="noopener noreferrer" translate="no" className={styles.inline}>
                    {job.link.label} <ArrowUpRight aria-hidden size={16} strokeWidth={2.25} />
                  </a>
                </p>
              )}
            </Reveal>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <h2 id="projects-h" className={styles.title}>Projects</h2>
          <div className={styles.projectGrid}>
            {projects.map((project, i) => (
              <Reveal as="article" key={project.repo.name} delay={i * 0.05} className={`${styles.clay} ${styles.card} ${tone(i + 2)} ${i === 0 ? styles.wide : ""}`}>
                <p className={`${styles.clay} ${styles.pill} ${styles.pillWhite}`}>{project.kind}</p>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p>{project.summary}</p>
                <ul className={styles.bullets}>
                  {project.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className={styles.pile}>
                  {project.stack.map((item) => (
                    <li key={item} className={styles.pill}>
                      {item}
                    </li>
                  ))}
                </ul>
                {project.facts && <p className={styles.muted}>{project.facts.join(", ")}</p>}
                <p className={styles.actions}>
                  <a {...project.code} className={`${styles.clay} ${styles.button} ${styles.small}`}>
                    Code<span className="sr-only"> for {project.title}</span>
                  </a>
                  {project.demo && (
                    <a {...project.demo} className={`${styles.clay} ${styles.button} ${styles.small} ${styles.primary}`}>
                      Live demo<span className="sr-only"> of {project.title}</span>
                    </a>
                  )}
                </p>
              </Reveal>
            ))}
          </div>

          {moreRepos.length > 0 && (
            <>
              <h3 className={styles.subTitle}>More from GitHub</h3>
              <ul className={styles.repoGrid}>
                {moreRepos.map(({ repo, link }, i) => (
                  <li key={repo.name} className={`${styles.clay} ${styles.repo} ${tone(i + 1)}`}>
                    <a {...link} translate="no">{repo.name}</a>
                    <p>{repo.description}</p>
                    <small>{[repo.language, monthYear(repo.pushed_at)].filter(Boolean).join(", ")}</small>
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
              <Reveal as="article" key={entry.institution} className={`${styles.clay} ${styles.card} ${styles.blue}`}>
                <h3>{entry.degree}</h3>
                <p className={styles.muted}>
                  {entry.institution}, {entry.period}
                </p>
                {entry.cgpa && <p className={`${styles.clay} ${styles.pill} ${styles.pillWhite}`}>CGPA {entry.cgpa}</p>}
                <ul className={styles.pile}>
                  {entry.coursework.map((course) => (
                    <li key={course} className={styles.pill}>
                      {course}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <Reveal delay={0.06} className={`${styles.clay} ${styles.card} ${styles.lilac}`}>
              <h3>Certifications</h3>
              <ul className={styles.certs}>
                {certifications.map((cert) => (
                  <li key={cert.name} className={`${styles.clay} ${styles.cert}`}>
                    <strong>{cert.name}</strong>
                    {(cert.issuer || cert.year) && <small>{[cert.issuer, cert.year].filter(Boolean).join(", ")}</small>}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
          <h2 id="timeline-h" className={styles.title}>Timeline</h2>
          <ol className={styles.stones}>
            {timeline.map((entry, i) => (
              <Reveal as="li" key={entry.year + entry.desc} delay={i * 0.05} className={styles.stoneItem}>
                <span className={`${styles.clay} ${styles.stone} ${tone(i)}`}>{entry.year}</span>
                <span>{entry.desc}</span>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <h2 id="curiosity-h" className={styles.title}>Interests</h2>
          <ul className={styles.balloons}>
            {interests.map((item, i) => (
              <li key={item} className={`${styles.clay} ${styles.balloon} ${tone(i + 3)}`}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <Reveal className={`${styles.clay} ${styles.card} ${styles.contact}`}>
            <h2 id="contact-h" className={styles.contactTitle}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className={styles.lead}>{profile.contact.pitch}</p>
            <p className={styles.muted}>{profile.location.sentence}</p>
            <p className={styles.actions}>
              {contactLinks.map((link) => (
                <a key={link.id} {...link.props} className={`${styles.clay} ${styles.button} ${link.id === "resume" ? styles.primary : ""}`}>
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={() => copy(profile.email)} className={`${styles.clay} ${styles.button}`}>
                {copied ? <Check aria-hidden size={18} strokeWidth={2.25} /> : <Copy aria-hidden size={18} strokeWidth={2.25} />}
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
