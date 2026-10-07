"use client";

import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { bohoSans, bohoSerif } from "./fonts";
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

const PEBBLES = ["pebbleMustard", "pebbleSage", "pebblePeach"] as const;

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <header className={styles.titleWrap}>
      <span aria-hidden className={styles.sunDot} />
      <h2 id={id} className={styles.title}>{children}</h2>
      <span aria-hidden className={styles.weave} />
    </header>
  );
}

/**
 * Bohemian. Reading this as: developer portfolio for recruiters, warm and hand-made: terracotta,
 * mustard and sage, rainbow arches, woven bands, scalloped edges, leaves that sway a little.
 * Everything readable sits on a solid panel; the patterns only ever frame the content. Fills and
 * text are paired so each combination clears AA (dark ink on mustard and sage, cream on terracotta).
 */
export default function BohemianDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  return (
    <main id="top" data-design="bohemian" className={`${bohoSerif.variable} ${bohoSans.variable} ${styles.page}`}>
      <ViewerTheme slug="bohemian" fonts={`${bohoSerif.variable} ${bohoSans.variable}`} entrance="rise" />
      <Egg />
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
          <div className={styles.heroCopy}>
            <p className={styles.status}>
              <strong>{profile.availability.status}</strong>
              <span>{profile.availability.detail}</span>
            </p>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.role}>{profile.tagline.join(" and ")}</p>
            <p className={styles.actions}>
              <a {...resume} className={`${styles.button} ${styles.buttonSolid}`}>Resume</a>
              <a {...mail} className={styles.button} translate="no">{profile.email}</a>
            </p>
          </div>

          <div aria-hidden className={styles.arches}>
            <div className={`${styles.arch} ${styles.arch1}`}>
              <div className={`${styles.arch} ${styles.arch2}`}>
                <div className={`${styles.arch} ${styles.arch3}`}>
                  <div className={`${styles.arch} ${styles.arch4}`}>
                    <span className={styles.sun} />
                    <span className={`${styles.leaf} ${styles.leafA}`} />
                    <span className={`${styles.leaf} ${styles.leafB}`} />
                    <span className={`${styles.leaf} ${styles.leafC}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div aria-hidden className={styles.scallop} />

        <section id="story" aria-labelledby="story-h" className={styles.section}>
          <SectionTitle id="story-h">Story</SectionTitle>
          <Reveal className={styles.panel}>
            <p className={styles.lead}>{profile.summary}</p>
          </Reveal>
          <div className={styles.storyGrid}>
            <ul className={styles.quoteArch}>
              {story.quotes.map((quote) => (
                <li key={quote}>{quote}</li>
              ))}
            </ul>
            <Reveal className={styles.panel}>
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className={styles.refrain}>
                {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
              </p>
            </Reveal>
          </div>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.section}>
          <SectionTitle id="skills-h">Skills</SectionTitle>
          <div className={styles.woven}>
            <div className={styles.skillGrid}>
              {skills.map((category, i) => (
                <Reveal as="article" delay={i * 0.06} key={category.title} className={styles.panel}>
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
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-h" className={styles.section}>
          <SectionTitle id="experience-h">Experience</SectionTitle>
          {experience.map((job) => (
            <Reveal as="article" key={job.company + job.period} className={styles.job}>
              <div className={styles.jobHead}>
                <h3>{job.role}</h3>
                <p>
                  {job.company}, {job.period}
                </p>
              </div>
              <div className={styles.jobBody}>
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
              </div>
            </Reveal>
          ))}
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.section}>
          <SectionTitle id="projects-h">Projects</SectionTitle>
          <div className={styles.archGrid}>
            {projects.map((project, i) => (
              <Reveal as="article" delay={i * 0.08} key={project.repo.name} className={styles.archCard}>
                <div className={styles.archTop}>
                  <span aria-hidden className={`${styles.sunDot} ${styles.sunDotLarge}`} />
                  <p className={styles.kind}>{project.kind}</p>
                  <h3>{project.title}</h3>
                </div>
                <div className={styles.archBody}>
                  <p>{project.summary}</p>
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
                  {project.facts && <p className={styles.muted}>{project.facts.join(", ")}</p>}
                  <p className={styles.actions}>
                    <a {...project.code} className={styles.button}>
                      Code<span className="sr-only"> for {project.title}</span>
                    </a>
                    {project.demo && (
                      <a {...project.demo} className={`${styles.button} ${styles.buttonSolid}`}>
                        Live demo<span className="sr-only"> of {project.title}</span>
                      </a>
                    )}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {moreRepos.length > 0 && (
            <Reveal className={`${styles.panel} ${styles.repoPanel}`}>
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
          <SectionTitle id="education-h">Education</SectionTitle>
          <div className={styles.eduGrid}>
            {education.map((entry) => (
              <Reveal as="article" key={entry.institution} className={styles.panel}>
                <h3>{entry.degree}</h3>
                <p className={styles.muted}>
                  {entry.institution}, {entry.period}
                  {entry.cgpa && `, CGPA ${entry.cgpa}`}
                </p>
                <ul className={styles.chips}>
                  {entry.coursework.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
            <Reveal delay={0.08} className={styles.panel}>
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
          <SectionTitle id="timeline-h">Timeline</SectionTitle>
          <ol className={styles.path}>
            {timeline.map((entry) => (
              <Reveal as="li" key={entry.year + entry.desc}>
                <span aria-hidden className={styles.stop} />
                <div className={styles.stopCard}>
                  <span className={styles.year}>{entry.year}</span>
                  <span>{entry.desc}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.section}>
          <SectionTitle id="curiosity-h">Interests</SectionTitle>
          <ul className={styles.pebbles}>
            {interests.map((item, i) => (
              <li key={item} className={`${styles.pebble} ${styles[PEBBLES[i % PEBBLES.length]]}`}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.section}>
          <Reveal className={styles.contact}>
            <h2 id="contact-h" className={styles.contactTitle}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className={styles.contactLead}>{profile.contact.pitch}</p>
            <p>{profile.location.sentence}</p>
            <p className={`${styles.actions} ${styles.center}`}>
              {contactLinks.map((link) => (
                <a key={link.id} {...link.props} className={styles.cream}>
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={() => copy(profile.email)} className={styles.cream}>
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
