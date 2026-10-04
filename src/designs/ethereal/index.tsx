"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { etherealSans, etherealSerif } from "./fonts";
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

/** Slow light that follows the pointer a little. Fine pointers only; it never re-renders React. */
function Mist() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 35, damping: 22 });
  const sy = useSpring(y, { stiffness: 35, damping: 22 });
  const nearX = useTransform(sx, (v) => v * 46);
  const nearY = useTransform(sy, (v) => v * 36);
  const farX = useTransform(sx, (v) => v * -28);
  const farY = useTransform(sy, (v) => v * -22);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <div aria-hidden className={styles.mist}>
      <span className={styles.rays} />
      <motion.span className={`${styles.orb} ${styles.orbLilac}`} style={{ x: nearX, y: nearY }} />
      <motion.span className={`${styles.orb} ${styles.orbSky}`} style={{ x: farX, y: farY }} />
      <motion.span className={`${styles.orb} ${styles.orbPearl}`} style={{ x: nearX, y: farY }} />
    </div>
  );
}

/**
 * Ethereal. Reading this as: developer portfolio for recruiters, pale and luminous: pearl, lilac and
 * sky gradients, soft light rays, floating orbs, content that emerges from mist. Text is deep
 * indigo on pale surfaces (never pale on pale) and all of the drifting stops for reduced motion.
 */
export default function EtherealDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="ethereal" className={`${etherealSans.variable} ${etherealSerif.variable} ${styles.page}`}>
      <SkipLink />
      <Mist />

      <div className={styles.wrap}>
        <nav aria-label="Sections" className={`${styles.card} ${styles.nav}`}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <header className={styles.hero}>
          <p className={`${styles.card} ${styles.status}`}>
            <strong>{profile.availability.status}</strong>
            <span>{profile.availability.detail}</span>
          </p>
          <h1 className={styles.name}>
            <span className={styles.nameLight}>{profile.givenName}</span> <span className={styles.nameBold}>{profile.familyName}</span>
          </h1>
          <p className={styles.role}>{profile.tagline.join(", ")}</p>
          <p className={styles.actions}>
            <a {...resume} className={styles.primary}>
              <FileText aria-hidden size={18} strokeWidth={1.5} />
              Resume
            </a>
            <a {...mail} className={styles.ghost}>
              <Mail aria-hidden size={18} strokeWidth={1.5} />
              <span translate="no">{profile.email}</span>
            </a>
          </p>
        </header>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <h2 id="story-h" className={styles.title}>Story</h2>
          <Reveal blur={10} y={26} duration={1.2} className={`${styles.card} ${styles.panel}`}>
            <p className={styles.lead}>{profile.summary}</p>
          </Reveal>
          <ul className={styles.quotes}>
            {story.quotes.map((quote, i) => (
              <Reveal as="li" blur={10} y={26} duration={1.2} delay={i * 0.12} key={quote}>
                {quote}
              </Reveal>
            ))}
          </ul>
          <div className={styles.stagger}>
            {[story.paragraphs.slice(0, 2), story.paragraphs.slice(2)].map((group, i) => (
              <Reveal blur={10} y={26} duration={1.2} key={i} className={`${styles.card} ${styles.panel} ${i ? styles.drop : ""}`}>
                {group.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Reveal>
            ))}
          </div>
          <Reveal blur={8} y={20} duration={1.2}>
            <p className={styles.refrain}>
              {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
            </p>
          </Reveal>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <h2 id="skills-h" className={styles.title}>Skills</h2>
          <div className={styles.skillGrid}>
            {skills.map((category, i) => (
              <Reveal as="article" blur={10} y={26} duration={1.2} delay={i * 0.08} key={category.title} className={`${styles.card} ${styles.panel} ${i % 2 ? styles.drop : ""}`}>
                <h3>{category.title}</h3>
                <p className={styles.aside}>{category.subtitle}</p>
                <ul className={styles.pills}>
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
            <Reveal as="article" blur={10} y={26} duration={1.2} key={job.company + job.period} className={`${styles.card} ${styles.panel}`}>
              <h3 className={styles.big}>{job.role}</h3>
              <p className={styles.aside}>
                {job.company}, {job.period}
              </p>
              <ul className={styles.bullets}>
                {job.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <ul className={styles.pills}>
                {job.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {job.link && (
                <p>
                  <a href={job.link.href} target="_blank" rel="noopener noreferrer" translate="no" className={styles.inline}>
                    {job.link.label} <ArrowUpRight aria-hidden size={16} strokeWidth={1.5} />
                  </a>
                </p>
              )}
            </Reveal>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <h2 id="projects-h" className={styles.title}>Projects</h2>
          <div className={styles.drift}>
            {projects.map((project, i) => (
              <Reveal as="article" blur={10} y={30} duration={1.3} key={project.repo.name} className={`${styles.card} ${styles.panel} ${styles.project} ${i % 2 ? styles.right : styles.left}`}>
                <p className={styles.aside}>{project.kind}</p>
                <h3 className={styles.big}>{project.title}</h3>
                <p>{project.summary}</p>
                <ul className={styles.bullets}>
                  {project.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className={styles.pills}>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {project.facts && <p className={styles.aside}>{project.facts.join(", ")}</p>}
                <p className={styles.actions}>
                  <a {...project.code} className={styles.ghost}>
                    Code<span className="sr-only"> for {project.title}</span>
                  </a>
                  {project.demo && (
                    <a {...project.demo} className={styles.primary}>
                      Live demo<span className="sr-only"> of {project.title}</span>
                    </a>
                  )}
                </p>
              </Reveal>
            ))}
          </div>

          {moreRepos.length > 0 && (
            <Reveal blur={8} y={24} duration={1.2} className={`${styles.card} ${styles.panel}`}>
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
          <div className={styles.skillGrid}>
            {education.map((entry) => (
              <Reveal as="article" blur={10} y={26} duration={1.2} key={entry.institution} className={`${styles.card} ${styles.panel}`}>
                <h3>{entry.degree}</h3>
                <p className={styles.aside}>
                  {entry.institution}, {entry.period}
                  {entry.cgpa && `, CGPA ${entry.cgpa}`}
                </p>
                <ul className={styles.pills}>
                  {entry.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <Reveal blur={10} y={26} duration={1.2} delay={0.1} className={`${styles.card} ${styles.panel} ${styles.drop}`}>
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
          <ol className={styles.path}>
            {timeline.map((entry, i) => (
              <Reveal as="li" blur={8} y={20} duration={1.1} delay={i * 0.04} key={entry.year + entry.desc}>
                <span aria-hidden className={styles.glow} />
                <span className={styles.year}>{entry.year}</span>
                <span>{entry.desc}</span>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <h2 id="curiosity-h" className={styles.title}>Interests</h2>
          <ul className={styles.floaters}>
            {interests.map((item) => (
              <li key={item} className={styles.floater}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <Reveal blur={12} y={30} duration={1.4} className={`${styles.card} ${styles.panel} ${styles.contact}`}>
            <h2 id="contact-h" className={styles.contactTitle}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className={styles.lead}>{profile.contact.pitch}</p>
            <p className={styles.aside}>{profile.location.sentence}</p>
            <p className={`${styles.actions} ${styles.center}`}>
              {contactLinks.map((link) => (
                <a key={link.id} {...link.props} className={link.id === "resume" ? styles.primary : styles.ghost}>
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={() => copy(profile.email)} className={styles.ghost}>
                {copied ? <Check aria-hidden size={16} strokeWidth={1.5} /> : <Copy aria-hidden size={16} strokeWidth={1.5} />}
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
