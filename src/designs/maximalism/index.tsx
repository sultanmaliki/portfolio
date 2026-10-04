"use client";

import { Fragment, useState } from "react";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { maxAbril, maxBowlby, maxSyne } from "./fonts";
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

const TONES = ["tonePink", "toneBlue", "toneGreen", "tonePurple"] as const;
const COLLAGE = ["collagePink", "collageYellow", "collageBlue", "collageGreen", "collagePurple", "collageOrange"] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Maximalism. Reading this as: developer portfolio for recruiters, as a wall of overlapping
 * posters: clashing saturated colour, stacked type, stripes, dots and checks, one marquee. It is
 * loud on purpose and strict underneath: body text always sits on a solid panel with a verified
 * contrast pair, the patterns only live on frames and backdrops, and a "Calm" switch (also on by
 * default for reduced motion) removes every animation and pattern.
 */
export default function MaximalismDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();
  // Reduced motion also turns calm mode on, but in CSS (see styles.module.css); this is the visitor's own switch
  const [calm, setCalm] = useState(false);
  const allSkills = skills.flatMap((category) => category.items);
  const nameWords = profile.name.split(" ");

  return (
    <main id="top" data-design="maximalism" className={`${maxBowlby.variable} ${maxAbril.variable} ${maxSyne.variable} ${styles.page} ${calm ? styles.calm : ""}`}>
      <SkipLink />

      <div className={styles.wrap}>
        <div className={styles.topbar}>
          <nav aria-label="Sections" className={styles.nav}>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <button type="button" aria-pressed={calm} onClick={() => setCalm((v) => !v)} className={styles.calmToggle}>
            Calm mode
          </button>
        </div>

        <header className={styles.hero}>
          <div className={styles.heroBackdrop} aria-hidden />
          <div className={styles.heroPanel}>
            <h1 className={styles.name}>
              {nameWords.map((word, i) => (
                <Fragment key={word}>
                  <span className={`${styles.word} ${styles[`word${i % 3}`]}`}>{word}</span>{" "}
                </Fragment>
              ))}
            </h1>
            <p className={styles.role}>{profile.tagline.join(" + ")}</p>
            <p className={styles.actions}>
              <a {...resume} className={`${styles.button} ${styles.buttonYellow}`}>Resume</a>
              <a {...mail} className={`${styles.button} ${styles.buttonWhite}`} translate="no">{profile.email}</a>
            </p>
          </div>
          <p className={styles.burst}>
            <strong>{profile.availability.status}</strong>
            <span>{profile.availability.detail}</span>
          </p>
          <p aria-hidden className={styles.disc}>{profile.location.city}</p>
        </header>

        {/* The one marquee. The skills are listed properly below, so this is decoration. */}
        <div aria-hidden className={styles.marquee}>
          <div className={styles.track}>
            {[0, 1].map((copyIndex) => (
              <ul key={copyIndex} className={styles.marqueeSet}>
                {allSkills.map((item) => (
                  <li key={`${copyIndex}-${item}`}>{item}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <span aria-hidden className={`${styles.backdrop} ${styles.dots}`} />
          <h2 id="story-h" className={styles.title}>Story</h2>
          <div className={`${styles.panel} ${styles.white}`}>
            <p className={styles.lead}>{profile.summary}</p>
            <div className={styles.twoCol}>
              {story.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
          <ul className={styles.shout}>
            {story.quotes.map((quote, i) => (
              <li key={quote} className={styles[TONES[(i + 1) % TONES.length]]}>
                {quote}
              </li>
            ))}
          </ul>
          <p className={styles.refrain}>
            {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <mark>{story.refrain.punchline.emphasis}</mark>
          </p>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <span aria-hidden className={`${styles.backdrop} ${styles.checks}`} />
          <h2 id="skills-h" className={styles.title}>Skills</h2>
          <div className={styles.grid2}>
            {skills.map((category, i) => (
              <article key={category.title} className={`${styles.panel} ${styles[TONES[i % TONES.length]]}`}>
                <h3>{category.title}</h3>
                <p>{category.subtitle}</p>
                <ul className={styles.chips}>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-h" className={styles.section}>
          <span aria-hidden className={`${styles.backdrop} ${styles.stripes}`} />
          <h2 id="experience-h" className={styles.title}>Experience</h2>
          {experience.map((job) => (
            <article key={job.company + job.period} className={`${styles.panel} ${styles.black}`}>
              <div className={styles.jobHead}>
                <h3>{job.role}</h3>
                <p className={styles.stamp}>{job.period}</p>
              </div>
              <p className={styles.accentText}>{job.company}</p>
              <ul className={styles.bullets}>
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
            </article>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <span aria-hidden className={`${styles.backdrop} ${styles.zigzag}`} />
          <h2 id="projects-h" className={styles.title}>Projects</h2>
          <div className={styles.posters}>
            {projects.map((project, i) => (
              <article key={project.repo.name} className={`${styles.panel} ${styles.white} ${styles.poster} ${i % 2 ? styles.tiltRight : styles.tiltLeft}`} data-shadow={i % 3}>
                <p aria-hidden className={styles.bigNumber}>{pad(i + 1)}</p>
                <p className={styles.stamp}>{project.kind}</p>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.lead}>{project.summary}</p>
                <ul className={styles.bullets}>
                  {project.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className={styles.chips}>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {project.facts && (
                  <ul className={styles.facts}>
                    {project.facts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                )}
                <p className={styles.actions}>
                  <a {...project.code} className={`${styles.button} ${styles.buttonWhite}`}>
                    Code<span className="sr-only"> for {project.title}</span>
                  </a>
                  {project.demo && (
                    <a {...project.demo} className={`${styles.button} ${styles.buttonPink}`}>
                      Live demo<span className="sr-only"> of {project.title}</span>
                    </a>
                  )}
                </p>
              </article>
            ))}
          </div>
          {moreRepos.length > 0 && (
            <div className={`${styles.panel} ${styles.white}`}>
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
            </div>
          )}
        </section>

        <section id="education" aria-labelledby="education-h" className={styles.section}>
          <span aria-hidden className={`${styles.backdrop} ${styles.dots}`} />
          <h2 id="education-h" className={styles.title}>Education</h2>
          <div className={styles.grid2}>
            {education.map((entry) => (
              <article key={entry.institution} className={`${styles.panel} ${styles.toneGreen}`}>
                <p className={styles.stamp}>{entry.period}</p>
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
              </article>
            ))}
            <div className={`${styles.panel} ${styles.white}`}>
              <h3>Certifications</h3>
              <ul className={styles.certList}>
                {certifications.map((cert) => (
                  <li key={cert.name}>
                    <span>{cert.name}</span>
                    {(cert.issuer || cert.year) && <small>{[cert.issuer, cert.year].filter(Boolean).join(", ")}</small>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="timeline" aria-labelledby="timeline-h" className={styles.section}>
          <span aria-hidden className={`${styles.backdrop} ${styles.checks}`} />
          <h2 id="timeline-h" className={styles.title}>Timeline</h2>
          <ol className={styles.zig}>
            {timeline.map((entry, i) => (
              <li key={entry.year + entry.desc} className={`${styles.zigItem} ${styles[TONES[i % TONES.length]]}`}>
                <span className={styles.year}>{entry.year}</span>
                <span>{entry.desc}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <span aria-hidden className={`${styles.backdrop} ${styles.stripes}`} />
          <h2 id="curiosity-h" className={styles.title}>Interests</h2>
          <ul className={styles.collage}>
            {interests.map((item, i) => (
              <li key={item} className={`${styles.shape} ${styles[COLLAGE[i % COLLAGE.length]]}`}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <span aria-hidden className={`${styles.backdrop} ${styles.dots}`} />
          <div className={`${styles.panel} ${styles.tonePink} ${styles.contact}`}>
            <h2 id="contact-h" className={styles.contactTitle}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className={styles.lead}>{profile.contact.pitch}</p>
            <p>{profile.location.sentence}</p>
            <p className={styles.actions}>
              {contactLinks.map((link) => (
                <a key={link.id} {...link.props} className={`${styles.button} ${link.id === "resume" ? styles.buttonYellow : styles.buttonWhite}`}>
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={() => copy(profile.email)} className={`${styles.button} ${styles.buttonWhite}`}>
                {copied ? "Copied" : "Copy email"}
                <span className="sr-only"> address</span>
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
