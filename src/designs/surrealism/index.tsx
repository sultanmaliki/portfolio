"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { dreamSans, dreamSerif } from "./fonts";
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

// The shapes the interests drift as: a moon, a cloud, a block, a stone, and so on.
const OBJECTS = ["objMoon", "objCloud", "objBlock", "objStone", "objPill", "objDisc", "objShard"] as const;
const css = (vars: Record<string, string | number>) => vars as unknown as CSSProperties;

/** The edge where the sky melts into the night below. Decorative. */
const Melt = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 1440 150" preserveAspectRatio="none" className={className}>
    <path
      fill="currentColor"
      d="M0,150 V46 C70,46 70,108 118,108 S176,40 260,40 S330,128 376,128 S440,44 520,44 S590,98 636,98 S700,40 784,40 S846,140 898,140 S968,42 1052,42 S1118,116 1166,116 S1228,40 1312,40 S1380,100 1440,52 V150 Z"
    />
  </svg>
);

/**
 * Surrealism. Reading this as: developer portfolio for recruiters, as a dream: a dusk sky with a
 * moon the size of a building, monoliths floating at different depths, a sky that melts into the
 * night below. The strangeness lives in the scenery and the layout; the DOM order stays plain and
 * logical, text sits on solid cream cards, and the parallax and drifting stop for reduced motion.
 */
export default function SurrealismDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  const heroRef = useRef<HTMLElement>(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const moonY = useTransform(scrollYProgress, [0, 1], calm ? [0, 0] : [0, 140]);
  const nearY = useTransform(scrollYProgress, [0, 1], calm ? [0, 0] : [0, -170]);
  const farY = useTransform(scrollYProgress, [0, 1], calm ? [0, 0] : [0, -70]);

  return (
    <main id="top" data-design="surrealism" className={`${dreamSerif.variable} ${dreamSans.variable} ${styles.page}`}>
      <ViewerTheme slug="surrealism" fonts={`${dreamSerif.variable} ${dreamSans.variable}`} entrance="drop" />
      <SkipLink />

      <header ref={heroRef} className={styles.hero}>
        <div aria-hidden className={styles.scene}>
          <motion.span className={styles.moon} style={{ y: moonY }} />
          <span className={`${styles.cloud} ${styles.cloudA}`} />
          <span className={`${styles.cloud} ${styles.cloudB}`} />
          <motion.span className={`${styles.monolith} ${styles.m1}`} style={{ y: farY }} />
          <motion.span className={`${styles.monolith} ${styles.m2}`} style={{ y: nearY }} />
          <motion.span className={`${styles.monolith} ${styles.m3}`} style={{ y: farY }} />
        </div>

        <nav aria-label="Sections" className={styles.nav}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <div className={styles.heroBody}>
          <p className={styles.status}>
            <strong>{profile.availability.status}</strong>
            <span>{profile.availability.detail}</span>
          </p>
          <h1 className={styles.name}>
            <span>{profile.givenName}</span>{" "}
            <span className={styles.nameItalic}>{profile.familyName}</span>
          </h1>
          <p className={styles.role}>{profile.tagline.join(", ")}</p>
          <p className={styles.actions}>
            <a {...resume} className={`${styles.button} ${styles.buttonGold}`}>Resume</a>
            <a {...mail} className={styles.button} translate="no">{profile.email}</a>
          </p>
        </div>
        <Melt className={styles.melt} />
      </header>

      <div className={styles.night}>
        <div className={styles.content}>
          <section id="story" aria-labelledby="story-h" className={styles.section}>
            <h2 id="story-h" className={styles.title}>Story</h2>
            <Reveal className={`${styles.card} ${styles.tiltLeft}`}>
              <p className={styles.lead}>{profile.summary}</p>
              <div className={styles.twoCol}>
                {story.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </Reveal>
            <ul className={styles.quotes}>
              {story.quotes.map((quote, i) => (
                <Reveal as="li" key={quote} delay={i * 0.1} className={styles.quote} style={css({ "--shift": `${i * 3}rem` })}>
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
            <div className={styles.pillars}>
              {skills.map((category, i) => (
                <Reveal as="article" key={category.title} delay={i * 0.08} className={`${styles.card} ${styles.pillar}`} style={css({ "--drop": `${(i % 2) * 2.5}rem` })}>
                  <h3>{category.title}</h3>
                  <p className={styles.muted}>{category.subtitle}</p>
                  <ul className={styles.items}>
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
              <Reveal as="article" key={job.company + job.period} className={`${styles.card} ${styles.tiltRight}`}>
                <p className={styles.badge}>{job.period}</p>
                <h3 className={styles.big}>{job.role}</h3>
                <p className={styles.muted}>{job.company}</p>
                <ul className={styles.bullets}>
                  {job.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className={styles.items}>
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
            <div className={styles.projects}>
              {projects.map((project, i) => (
                <Reveal as="article" key={project.repo.name} delay={i * 0.06} className={`${styles.card} ${styles.project} ${i % 2 ? styles.tiltRight : styles.tiltLeft}`}>
                  <p className={styles.badge}>{project.kind}</p>
                  <h3 className={styles.big}>{project.title}</h3>
                  <p>{project.summary}</p>
                  <ul className={styles.bullets}>
                    {project.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {/* The hidden layer: wipes in on hover or focus, always visible on touch screens */}
                  <div className={styles.layer}>
                    <p className={styles.layerLabel}>Built with</p>
                    <ul className={styles.items}>
                      {project.stack.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {project.facts && <p className={styles.muted}>{project.facts.join(", ")}</p>}
                  </div>
                  <p className={styles.actions}>
                    <a {...project.code} className={styles.buttonDark}>
                      Code<span className="sr-only"> for {project.title}</span>
                    </a>
                    {project.demo && (
                      <a {...project.demo} className={`${styles.buttonDark} ${styles.buttonDarkSolid}`}>
                        Live demo<span className="sr-only"> of {project.title}</span>
                      </a>
                    )}
                  </p>
                </Reveal>
              ))}
            </div>
            {moreRepos.length > 0 && (
              <Reveal className={`${styles.card} ${styles.repoCard}`}>
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
                <Reveal as="article" key={entry.institution} className={`${styles.card} ${styles.tiltLeft}`}>
                  <p className={styles.badge}>{entry.period}</p>
                  <h3>{entry.degree}</h3>
                  <p>
                    {entry.institution}
                    {entry.cgpa && `. CGPA ${entry.cgpa}`}
                  </p>
                  <ul className={styles.items}>
                    {entry.coursework.map((course) => (
                      <li key={course}>{course}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
              <Reveal delay={0.08} className={`${styles.card} ${styles.tiltRight}`}>
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
            <ol className={styles.stairs}>
              {timeline.map((entry, i) => (
                <Reveal as="li" key={entry.year + entry.desc} className={styles.step} style={css({ "--i": i })}>
                  <span className={styles.year}>{entry.year}</span>
                  <span>{entry.desc}</span>
                </Reveal>
              ))}
            </ol>
          </section>

          <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
            <h2 id="curiosity-h" className={styles.title}>Interests</h2>
            <ul className={styles.sky}>
              {interests.map((item, i) => (
                <li key={item} className={`${styles.obj} ${styles[OBJECTS[i % OBJECTS.length]]}`} style={css({ "--d": `${i * -1.7}s` })}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="contact" aria-labelledby="contact-h" className={styles.section}>
            <Reveal className={`${styles.card} ${styles.contact}`}>
              <h2 id="contact-h" className={styles.contactTitle}>
                {profile.contact.headline.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className={styles.lead}>{profile.contact.pitch}</p>
              <p className={styles.muted}>{profile.location.sentence}</p>
              <p className={styles.actions}>
                {contactLinks.map((link) => (
                  <a key={link.id} {...link.props} className={`${styles.buttonDark} ${link.id === "resume" ? styles.buttonDarkSolid : ""}`}>
                    {link.label}
                  </a>
                ))}
                <button type="button" onClick={() => copy(profile.email)} className={styles.buttonDark}>
                  {copied ? "Copied" : "Copy email"}
                  <span className="sr-only"> address</span>
                </button>
              </p>
            </Reveal>
          </section>
        </div>
      </div>
    </main>
  );
}
