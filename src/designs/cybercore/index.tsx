"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { cybercoreMono, cybercoreOrbitron } from "./fonts";
import styles from "./styles.module.css";
import ViewerTheme from "@/components/viewer/viewerTheme";
import "./viewer.css";
import Egg from "./Egg";

const NAV = [
  ["story", "Story"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["education", "Education"],
  ["timeline", "Timeline"],
  ["contact", "Contact"],
] as const;

/**
 * A number that settles into place the first time it scrolls into view. The real value is rendered
 * from the start (so no-JS and screen readers always see it); the count-up is only decoration and is skipped
 * for reduced motion.
 */
function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const value = useMotionValue(to);
  const text = useTransform(value, (v) => String(Math.round(v)));
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const calm = useReducedMotion();

  useEffect(() => {
    if (!inView || calm) return;
    value.set(0);
    const controls = animate(value, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, calm, to, value]);

  return (
    <span ref={ref}>
      <motion.span>{text}</motion.span>
    </span>
  );
}

/**
 * Cybercore. Reading this as: developer portfolio for recruiters, as cold early-2000s futurism:
 * brushed-metal panels, thin cyan lines, HUD corner brackets and instrument readouts. The only
 * numbers shown are real ones (counts taken from the data), and the motion is limited to a slow
 * scan line and counters that settle. Body text stays full-contrast silver on near-black.
 */
export default function CybercoreDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();
  const skillCount = skills.reduce((total, category) => total + category.items.length, 0);
  const publicProjects = projects.length + moreRepos.length;

  return (
    <main id="top" data-design="cybercore" className={`${cybercoreOrbitron.variable} ${cybercoreMono.variable} ${styles.page}`}>
      <ViewerTheme slug="cybercore" fonts={`${cybercoreOrbitron.variable} ${cybercoreMono.variable}`} entrance="slide" />
      <Egg />
      <SkipLink />
      <div aria-hidden className={styles.gridLines} />

      <div className={styles.wrap}>
        <nav aria-label="Sections" className={styles.nav}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <header className={styles.hero}>
          <div className={`${styles.hud} ${styles.heroMain}`}>
            <span aria-hidden className={styles.scan} />
            <p className={styles.status}>
              <span aria-hidden className={styles.led} />
              <strong>{profile.availability.status}</strong>
              <span>{profile.availability.detail}</span>
            </p>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.role}>{profile.tagline.join(" | ")}</p>
            <p className={styles.actions}>
              <a {...resume} className={`${styles.button} ${styles.buttonSolid}`}>Resume</a>
              <a {...mail} className={styles.button} translate="no">{profile.email}</a>
            </p>
          </div>

          <dl className={`${styles.hud} ${styles.readout}`}>
            <div>
              <dt>Public projects</dt>
              <dd>
                <Counter to={publicProjects} />
              </dd>
            </div>
            <div>
              <dt>Featured builds</dt>
              <dd>
                <Counter to={projects.length} />
              </dd>
            </div>
            <div>
              <dt>Skills listed</dt>
              <dd>
                <Counter to={skillCount} />
              </dd>
            </div>
            <div>
              <dt>Certifications</dt>
              <dd>
                <Counter to={certifications.length} />
              </dd>
            </div>
          </dl>
        </header>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.title}>Story</h2>
          <Reveal className={styles.hud}>
            <p className={styles.lead}>{profile.summary}</p>
            <div className={styles.twoCol}>
              {story.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </Reveal>
          <ul className={styles.transmissions}>
            {story.quotes.map((quote, i) => (
              <Reveal as="li" key={quote} delay={i * 0.08}>
                {quote}
              </Reveal>
            ))}
          </ul>
          <p className={styles.refrain}>
            {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
          </p>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <h2 id="skills-h" className={styles.title}>Skills</h2>
          <div className={styles.grid2}>
            {skills.map((category, i) => (
              <Reveal as="article" key={category.title} delay={i * 0.06} className={styles.hud}>
                <div className={styles.panelHead}>
                  <h3>{category.title}</h3>
                  <p className={styles.mono}>{category.items.length} items</p>
                </div>
                <p className={styles.muted}>{category.subtitle}</p>
                <ul className={styles.tiles}>
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
            <Reveal as="article" key={job.company + job.period} className={styles.hud}>
              <div className={styles.panelHead}>
                <h3>{job.role}</h3>
                <p className={styles.mono}>{job.period}</p>
              </div>
              <p className={styles.muted}>{job.company}</p>
              <ul className={styles.log}>
                {job.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ul className={styles.tiles}>
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
          {projects.map((project) => (
            <Reveal as="article" key={project.repo.name} className={`${styles.hud} ${styles.module}`}>
              <div>
                <p className={styles.mono}>{project.kind}</p>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.lead}>{project.summary}</p>
                <ul className={styles.log}>
                  {project.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
              <dl className={styles.spec}>
                <div>
                  <dt>Stack</dt>
                  <dd>{project.stack.join(", ")}</dd>
                </div>
                {project.facts && (
                  <div>
                    <dt>Facts</dt>
                    <dd>{project.facts.join(", ")}</dd>
                  </div>
                )}
                <div>
                  <dt>Links</dt>
                  <dd className={styles.links}>
                    <a {...project.code} className={styles.button}>
                      Code<span className="sr-only"> for {project.title}</span>
                    </a>
                    {project.demo && (
                      <a {...project.demo} className={`${styles.button} ${styles.buttonSolid}`}>
                        Live demo<span className="sr-only"> of {project.title}</span>
                      </a>
                    )}
                  </dd>
                </div>
              </dl>
            </Reveal>
          ))}
          {moreRepos.length > 0 && (
            <Reveal className={styles.hud}>
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
          <div className={styles.grid2}>
            {education.map((entry) => (
              <Reveal as="article" key={entry.institution} className={styles.hud}>
                <p className={styles.mono}>{entry.period}</p>
                <h3>{entry.degree}</h3>
                <p>
                  {entry.institution}
                  {entry.cgpa && `. CGPA ${entry.cgpa}`}
                </p>
                <ul className={styles.tiles}>
                  {entry.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <Reveal delay={0.06} className={styles.hud}>
              <h3>Certifications</h3>
              <ul className={styles.certList}>
                {certifications.map((cert) => (
                  <li key={cert.name}>
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
          <ol className={styles.rail}>
            {timeline.map((entry, i) => (
              <Reveal as="li" key={entry.year + entry.desc} delay={i * 0.04}>
                <span aria-hidden className={styles.node} />
                <span className={styles.year}>{entry.year}</span>
                <span>{entry.desc}</span>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <h2 id="curiosity-h" className={styles.title}>Interests</h2>
          <ul className={`${styles.tiles} ${styles.tilesLarge}`}>
            {interests.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <Reveal className={`${styles.hud} ${styles.contact}`}>
            <h2 id="contact-h" className={styles.contactTitle}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className={styles.lead}>{profile.contact.pitch}</p>
            <p className={styles.muted}>{profile.location.sentence}</p>
            <p className={styles.actions}>
              {contactLinks.map((link) => (
                <a key={link.id} {...link.props} className={`${styles.button} ${link.id === "resume" ? styles.buttonSolid : ""}`}>
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={() => copy(profile.email)} className={styles.button}>
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
