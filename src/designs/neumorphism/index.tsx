"use client";

import { ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { useActiveSection } from "../shared/useActiveSection";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { neuRounded } from "./fonts";
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
const NAV_IDS = NAV.map(([id]) => id);

/**
 * Neumorphism. Reading this as: developer portfolio for recruiters, as one soft surface with
 * elements pushed out of it or pressed into it by a light and a dark shadow. The usual trap is
 * low contrast, so text is dark ink at full strength, every control also has a visible edge, and
 * focus is a solid blue ring.
 */
export default function NeumorphismDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();
  const active = useActiveSection(NAV_IDS);
  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <main id="top" data-design="neumorphism" className={`${neuRounded.variable} ${styles.page}`}>
      <SkipLink />
      <div className={styles.layout}>
        <aside className={styles.side}>
          <div className={styles.sideInner}>
            <div className={styles.monogram} aria-hidden>{initials}</div>
            <p className={styles.sideName}>{profile.name}</p>
            <p className={`${styles.well} ${styles.availability}`}>
              <span aria-hidden className={styles.led} />
              <span>
                <strong>{profile.availability.status}</strong>
                <small>{profile.availability.detail}</small>
              </span>
            </p>
            <nav aria-label="Sections" className={styles.nav}>
              <ul>
                {NAV.map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`} aria-current={active === id ? "location" : undefined}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className={styles.sideActions}>
              <a {...resume} className={`${styles.btn} ${styles.btnAccent}`}>
                <FileText aria-hidden size={18} strokeWidth={2} />
                Resume
              </a>
              <a {...mail} className={styles.btn}>
                <Mail aria-hidden size={18} strokeWidth={2} />
                Email me
              </a>
            </div>
          </div>
        </aside>

        <div className={styles.main}>
          <header className={`${styles.raised} ${styles.hero}`}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.role}>{profile.tagline.join(" / ")}</p>
            <p className={styles.muted}>{profile.location.sentence}</p>
            <p className={`${styles.well} ${styles.summary}`}>{profile.summary}</p>
          </header>

          <section id="story" aria-labelledby="story-h" className={styles.section}>
            <h2 id="story-h" className={styles.title}>Story</h2>
            <ul className={styles.quotes}>
              {story.quotes.map((quote) => (
                <li key={quote} className={styles.well}>
                  {quote}
                </li>
              ))}
            </ul>
            <Reveal className={`${styles.raised} ${styles.panel}`}>
              {story.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <p className={styles.refrain}>
                {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
              </p>
            </Reveal>
          </section>

          <section id="skills" aria-labelledby="skills-h" className={styles.section}>
            <h2 id="skills-h" className={styles.title}>Skills</h2>
            <div className={styles.grid2}>
              {skills.map((category, i) => (
                <Reveal as="article" key={category.title} delay={i * 0.05} className={`${styles.raised} ${styles.panel}`}>
                  <h3>{category.title}</h3>
                  <p className={styles.muted}>{category.subtitle}</p>
                  <ul className={styles.chips}>
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
              <Reveal as="article" key={job.company + job.period} className={`${styles.raised} ${styles.panel}`}>
                <h3>{job.role}</h3>
                <p className={styles.muted}>
                  {job.company}, {job.period}
                </p>
                <ul className={styles.bullets}>
                  {job.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className={`${styles.well} ${styles.tagWell}`}>
                  {job.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                {job.link && (
                  <p>
                    <a href={job.link.href} target="_blank" rel="noopener noreferrer" translate="no" className={styles.inline}>
                      {job.link.label} <ArrowUpRight aria-hidden size={16} strokeWidth={2} />
                    </a>
                  </p>
                )}
              </Reveal>
            ))}
          </section>

          <section id="projects" aria-labelledby="projects-h" className={styles.section}>
            <h2 id="projects-h" className={styles.title}>Projects</h2>
            {projects.map((project) => (
              <Reveal as="article" key={project.repo.name} className={`${styles.raised} ${styles.panel} ${styles.project}`}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.muted}>{project.kind}</p>
                <p>{project.summary}</p>
                <ul className={`${styles.well} ${styles.bulletWell}`}>
                  {project.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className={styles.chips}>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {project.facts && <p className={styles.muted}>{project.facts.join(", ")}</p>}
                <p className={styles.row}>
                  <a {...project.code} className={styles.btn}>
                    Code<span className="sr-only"> for {project.title}</span>
                  </a>
                  {project.demo && (
                    <a {...project.demo} className={`${styles.btn} ${styles.btnAccent}`}>
                      Live demo<span className="sr-only"> of {project.title}</span>
                    </a>
                  )}
                </p>
              </Reveal>
            ))}
            {moreRepos.length > 0 && (
              <Reveal className={`${styles.raised} ${styles.panel}`}>
                <h3>More from GitHub</h3>
                <ul className={styles.repoList}>
                  {moreRepos.map(({ repo, link }) => (
                    <li key={repo.name} className={styles.well}>
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
            <div className={styles.grid2}>
              {education.map((entry) => (
                <Reveal as="article" key={entry.institution} className={`${styles.raised} ${styles.panel}`}>
                  <h3>{entry.degree}</h3>
                  <p className={styles.muted}>
                    {entry.institution}, {entry.period}
                  </p>
                  {entry.cgpa && <p>CGPA {entry.cgpa}</p>}
                  <ul className={styles.chips}>
                    {entry.coursework.map((course) => (
                      <li key={course}>{course}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
              <Reveal delay={0.05} className={`${styles.raised} ${styles.panel}`}>
                <h3>Certifications</h3>
                <ul className={styles.certList}>
                  {certifications.map((cert) => (
                    <li key={cert.name} className={styles.well}>
                      <span>{cert.name}</span>
                      {(cert.issuer || cert.year) && <small>{[cert.issuer, cert.year].filter(Boolean).join(", ")}</small>}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
            <h2 id="timeline-h" className={styles.title}>Timeline</h2>
            <ol className={styles.timeline}>
              {timeline.map((entry) => (
                <li key={entry.year + entry.desc}>
                  <span aria-hidden className={styles.knob} />
                  <span className={styles.year}>{entry.year}</span>
                  <span>{entry.desc}</span>
                </li>
              ))}
            </ol>
          </section>

          <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
            <h2 id="curiosity-h" className={styles.title}>Interests</h2>
            <ul className={`${styles.chips} ${styles.chipsLarge}`}>
              {interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section id="contact" aria-labelledby="contact-h" className={styles.section}>
            <Reveal className={`${styles.raised} ${styles.panel} ${styles.contact}`}>
              <h2 id="contact-h" className={styles.contactTitle}>{profile.contact.headline.join(" ")}</h2>
              <p>{profile.contact.pitch}</p>
              <div className={`${styles.well} ${styles.emailWell}`}>
                <a {...mail} translate="no">{profile.email}</a>
                <button type="button" onClick={() => copy(profile.email)} className={styles.btn}>
                  {copied ? <Check aria-hidden size={16} strokeWidth={2} /> : <Copy aria-hidden size={16} strokeWidth={2} />}
                  {copied ? "Copied" : "Copy"}
                  <span className="sr-only"> email address</span>
                </button>
              </div>
              <p className={styles.muted}>{profile.location.sentence}</p>
              <p className={styles.row}>
                {contactLinks
                  .filter((link) => link.id !== "email")
                  .map((link) => (
                    <a key={link.id} {...link.props} className={`${styles.btn} ${link.id === "resume" ? styles.btnAccent : ""}`}>
                      {link.label}
                    </a>
                  ))}
              </p>
            </Reveal>
          </section>
        </div>
      </div>
    </main>
  );
}
