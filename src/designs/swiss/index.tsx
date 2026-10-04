"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { swissGrotesk } from "./fonts";
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

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Swiss design. Reading this as: developer portfolio for recruiters, in the International
 * Typographic Style: a strict twelve-column grid, flush-left ragged-right text, one grotesque in
 * three sizes, numerals as structure, and red as the only colour. Restraint is the whole effect.
 */
export default function SwissDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();
  const [grid, setGrid] = useState(false);

  return (
    <main id="top" data-design="swiss" className={`${swissGrotesk.variable} ${styles.page}`}>
      <ViewerTheme slug="swiss" fonts={`${swissGrotesk.variable}`} entrance="snap" />
      <SkipLink />

      {/* Column guides, toggled from the header. Purely visual. */}
      <div aria-hidden className={`${styles.guides} ${grid ? styles.guidesOn : ""}`}>
        <div className={styles.guidesInner}>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>

      <div className={styles.wrap}>
        <header className={styles.masthead}>
          <p className={styles.role}>{profile.jobTitle}</p>
          <nav aria-label="Sections" className={styles.nav}>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <button type="button" aria-pressed={grid} onClick={() => setGrid((v) => !v)} className={styles.gridToggle}>
            {grid ? "Hide grid" : "Show grid"}
          </button>
        </header>

        <section aria-label="Introduction" className={styles.hero}>
          <h1 className={styles.name}>
            <span>{profile.givenName}</span>{" "}
            <span>{profile.familyName}</span>
          </h1>
          <div className={styles.heroRow}>
            <div className={styles.heroStatus}>
              <p className={styles.strong}>{profile.availability.status}</p>
              <p>{profile.availability.detail}</p>
            </div>
            <ul className={styles.heroRoles}>
              {profile.tagline.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li>{profile.location.city}, {profile.location.region}</li>
            </ul>
            <ul className={styles.heroLinks}>
              <li>
                <a {...resume}>
                  Resume <ArrowUpRight aria-hidden size={22} strokeWidth={1.75} />
                </a>
              </li>
              <li>
                <a {...mail}>
                  <span translate="no">{profile.email}</span> <ArrowUpRight aria-hidden size={22} strokeWidth={1.75} />
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section id="story" aria-labelledby="story-h" className={styles.row}>
          <div className={styles.head}>
            <span aria-hidden className={styles.num}>01</span>
            <h2 id="story-h">Story</h2>
          </div>
          <Reveal y={0} className={styles.body}>
            <p className={styles.display}>{profile.summary}</p>
            <div className={styles.cols}>
              {story.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
            <ul className={styles.quotes}>
              {story.quotes.map((quote) => (
                <li key={quote}>{quote}</li>
              ))}
            </ul>
            <p className={styles.refrain}>
              {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
            </p>
          </Reveal>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.row}>
          <div className={styles.head}>
            <span aria-hidden className={styles.num}>02</span>
            <h2 id="skills-h">Skills</h2>
          </div>
          <Reveal y={0} className={`${styles.body} ${styles.skillGrid}`}>
            {skills.map((category) => (
              <div key={category.title}>
                <h3>{category.title}</h3>
                <p className={styles.muted}>{category.subtitle}</p>
                <ul>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="experience" aria-labelledby="experience-h" className={styles.row}>
          <div className={styles.head}>
            <span aria-hidden className={styles.num}>03</span>
            <h2 id="experience-h">Experience</h2>
          </div>
          <div className={styles.body}>
            {experience.map((job) => (
              <Reveal as="article" y={0} key={job.company + job.period} className={styles.job}>
                <p className={styles.period}>{job.period}</p>
                <div>
                  <h3 className={styles.strong}>{job.role}</h3>
                  <p className={styles.muted}>{job.company}</p>
                  <div className={styles.cols}>
                    {job.highlights.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  <p className={styles.tags}>{job.tags.join(" / ")}</p>
                  {job.link && (
                    <p>
                      <a href={job.link.href} target="_blank" rel="noopener noreferrer" translate="no">
                        {job.link.label}
                      </a>
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.row}>
          <div className={styles.head}>
            <span aria-hidden className={styles.num}>04</span>
            <h2 id="projects-h">Projects</h2>
          </div>
          <div className={styles.body}>
            {projects.map((project, i) => (
              <Reveal as="article" y={0} key={project.repo.name} className={styles.project}>
                <p aria-hidden className={styles.bigNum}>{pad(i + 1)}</p>
                <div className={styles.projectMain}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.muted}>{project.kind}</p>
                  <p>{project.summary}</p>
                  <p className={styles.actions}>
                    <a {...project.code}>
                      Code<span className="sr-only"> for {project.title}</span>
                    </a>
                    {project.demo && (
                      <a {...project.demo}>
                        Live demo<span className="sr-only"> of {project.title}</span>
                      </a>
                    )}
                  </p>
                </div>
                <div className={styles.projectSide}>
                  {project.highlights.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p className={styles.tags}>{project.stack.join(" / ")}</p>
                  {project.facts && <p className={`${styles.tags} ${styles.facts}`}>{project.facts.join(" / ")}</p>}
                </div>
              </Reveal>
            ))}

            {moreRepos.length > 0 && (
              <>
                <h3 className={styles.sub}>More from GitHub</h3>
                <ul className={styles.table}>
                  {moreRepos.map(({ repo, link }) => (
                    <li key={repo.name}>
                      <a {...link} translate="no" className={styles.strong}>
                        {repo.name}
                      </a>
                      <span>{repo.description}</span>
                      <span className={styles.muted}>
                        {repo.language ? `${repo.language}, ` : ""}
                        {monthYear(repo.pushed_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>

        <section id="education" aria-labelledby="education-h" className={styles.row}>
          <div className={styles.head}>
            <span aria-hidden className={styles.num}>05</span>
            <h2 id="education-h">Education</h2>
          </div>
          <Reveal y={0} className={styles.body}>
            {education.map((entry) => (
              <article key={entry.institution} className={styles.job}>
                <p className={styles.period}>{entry.period}</p>
                <div>
                  <h3 className={styles.strong}>{entry.degree}</h3>
                  <p className={styles.muted}>
                    {entry.institution}
                    {entry.cgpa && `, CGPA ${entry.cgpa}`}
                  </p>
                  <p className={styles.tags}>{entry.coursework.join(" / ")}</p>
                </div>
              </article>
            ))}
            <h3 className={styles.sub}>Certifications</h3>
            <ul className={styles.table}>
              {certifications.map((cert) => (
                <li key={cert.name}>
                  <span className={styles.strong}>{cert.name}</span>
                  <span>{cert.issuer}</span>
                  <span className={styles.muted}>{cert.year}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="timeline" aria-labelledby="timeline-h" className={styles.row}>
          <div className={styles.head}>
            <span aria-hidden className={styles.num}>06</span>
            <h2 id="timeline-h">Timeline</h2>
          </div>
          <Reveal y={0} className={styles.body}>
            <ol className={styles.years}>
              {timeline.map((entry) => (
                <li key={entry.year + entry.desc}>
                  <span className={styles.year}>{entry.year}</span>
                  <span>{entry.desc}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.row}>
          <div className={styles.head}>
            <span aria-hidden className={styles.num}>07</span>
            <h2 id="curiosity-h">Interests</h2>
          </div>
          <Reveal y={0} className={styles.body}>
            <ul className={styles.interests}>
              {interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={`${styles.row} ${styles.contact}`}>
          <div className={styles.head}>
            <span aria-hidden className={styles.num}>08</span>
            <h2 id="contact-h">Contact</h2>
          </div>
          <div className={styles.body}>
            <p className={styles.contactLine}>
              {profile.contact.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className={styles.cols}>{profile.contact.pitch}</p>
            <p className={styles.muted}>{profile.location.sentence}</p>
            <ul className={styles.table}>
              {contactLinks.map((link) => (
                <li key={link.id}>
                  <a {...link.props} className={`${styles.strong} ${styles.arrowLink}`}>
                    {link.label} <ArrowUpRight aria-hidden size={18} strokeWidth={1.75} />
                  </a>
                  <span className={styles.muted}>{link.id === "email" ? profile.email : link.href.replace(/^https?:\/\//, "")}</span>
                  {link.id === "email" ? (
                    <button type="button" onClick={() => copy(profile.email)} className={styles.copy}>
                      {copied ? "Copied" : "Copy"}
                      <span className="sr-only"> email address</span>
                    </button>
                  ) : (
                    <span />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
