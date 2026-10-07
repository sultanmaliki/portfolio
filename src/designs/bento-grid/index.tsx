"use client";

import { Fragment } from "react";
import { ArrowUpRight, Briefcase, Check, Copy, FileText, GitBranch, Mail, MapPin, Star } from "lucide-react";
import Reveal from "../shared/Reveal";
import SkipLink from "../shared/SkipLink";
import { monthYear, usePortfolio } from "../shared/usePortfolio";
import { bentoMono, bentoSans } from "./fonts";
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

const ICONS = { github: GitBranch, linkedin: Briefcase, email: Mail, resume: FileText } as const;

/**
 * Bento grid. Reading this as: developer portfolio for recruiters, as a modular grid of rounded
 * tiles in mixed sizes. Every tile carries exactly one idea; the grid is rebuilt for each group so
 * the cell count always matches the content, and it collapses to one column with the most
 * important tiles (name, availability, links) first. Light and dark follow the system setting.
 */
export default function BentoGridDesign() {
  const { profile, story, skills, timeline, interests, experience, education, certifications, projects, moreRepos, contactLinks, copied, copy, resume, mail } = usePortfolio();

  const allRepos = [...projects.map((p) => p.repo), ...moreRepos.map((m) => m.repo)];
  const latest = [...allRepos].sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))[0];
  const latestLink = moreRepos.find((m) => m.repo.name === latest?.name)?.link ?? projects.find((p) => p.repo.name === latest?.name)?.code;
  const [paragraphsA, paragraphsB] = [story.paragraphs.slice(0, 2), story.paragraphs.slice(2)];

  return (
    <main id="top" data-design="bento-grid" className={`${bentoSans.variable} ${bentoMono.variable} ${styles.page}`}>
      <ViewerTheme slug="bento-grid" fonts={`${bentoSans.variable} ${bentoMono.variable}`} entrance="pop" />
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

        <section aria-label="Introduction" className={styles.group}>
          <Reveal className={`${styles.tile} ${styles.s8} ${styles.r2} ${styles.hero}`}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.role}>{profile.tagline.join(", ")}</p>
            <p className={styles.where}>
              <MapPin aria-hidden size={16} strokeWidth={1.75} />
              {profile.location.city}, {profile.location.region}
            </p>
          </Reveal>
          <Reveal delay={0.05} className={`${styles.tile} ${styles.s4} ${styles.dark}`}>
            <p className={styles.tileLabel}>Availability</p>
            <p className={styles.statusLine}>{profile.availability.status}</p>
            <p className={styles.mutedOnDark}>{profile.availability.detail}</p>
          </Reveal>
          <Reveal delay={0.1} className={`${styles.tile} ${styles.s4} ${styles.links}`}>
            <a {...resume} className={styles.primary}>
              <FileText aria-hidden size={18} strokeWidth={1.75} />
              Resume
            </a>
            <a {...mail} className={styles.pill}>
              <Mail aria-hidden size={18} strokeWidth={1.75} />
              <span translate="no">{profile.email}</span>
            </a>
          </Reveal>
        </section>

        <section id="story" aria-labelledby="story-h" className={styles.groupBlock}>
          <h2 id="story-h" className={styles.groupTitle}>Story</h2>
          <div className={styles.group}>
            <Reveal className={`${styles.tile} ${styles.s7} ${styles.r2}`}>
              <p className={styles.lead}>{profile.summary}</p>
            </Reveal>
            <Reveal delay={0.05} className={`${styles.tile} ${styles.s5} ${styles.r2} ${styles.blue}`}>
              <blockquote className={styles.quote}>
                {story.quotes.map((quote) => (
                  <p key={quote}>{quote}</p>
                ))}
              </blockquote>
            </Reveal>
            <Reveal className={`${styles.tile} ${styles.s6} ${styles.tint}`}>
              {paragraphsA.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </Reveal>
            <Reveal delay={0.05} className={`${styles.tile} ${styles.s6}`}>
              {paragraphsB.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </Reveal>
            <Reveal className={`${styles.tile} ${styles.s12} ${styles.dark} ${styles.refrain}`}>
              <p>
                {story.refrain.lines.join(" ")} {story.refrain.punchline.lead} <em>{story.refrain.punchline.emphasis}</em>
              </p>
            </Reveal>
          </div>
        </section>

        <section id="skills" aria-labelledby="skills-h" className={styles.groupBlock}>
          <h2 id="skills-h" className={styles.groupTitle}>Skills</h2>
          <div className={styles.group}>
            {skills.map((category, i) => (
              <Reveal
                as="article"
                key={category.title}
                delay={i * 0.04}
                className={`${styles.tile} ${[styles.s5, styles.s7, styles.s7, styles.s5][i % 4]} ${[styles.plain, styles.tint, styles.dark, styles.warm][i % 4]}`}
              >
                <h3>{category.title}</h3>
                <p className={styles.tileLabel}>{category.subtitle}</p>
                <ul className={styles.chips}>
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-h" className={styles.groupBlock}>
          <h2 id="experience-h" className={styles.groupTitle}>Experience</h2>
          <div className={styles.group}>
            {experience.map((job) => (
              <Fragment key={job.company + job.period}>
                <Reveal as="article" className={`${styles.tile} ${styles.s8}`}>
                  <h3>{job.role}</h3>
                  <ul className={styles.bullets}>
                    {job.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={0.05} className={`${styles.tile} ${styles.s4} ${styles.blue}`}>
                  <p className={styles.tileLabel}>{job.period}</p>
                  <p className={styles.statusLine}>{job.company}</p>
                  <ul className={`${styles.chips} ${styles.chipsOnBlue}`}>
                    {job.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {job.link && (
                    <a href={job.link.href} target="_blank" rel="noopener noreferrer" translate="no" className={styles.inline}>
                      {job.link.label} <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} />
                    </a>
                  )}
                </Reveal>
              </Fragment>
            ))}
          </div>
        </section>

        <section id="projects" aria-labelledby="projects-h" className={styles.groupBlock}>
          <h2 id="projects-h" className={styles.groupTitle}>Projects</h2>
          <div className={styles.group}>
            {projects.map((project, i) => (
              <Reveal
                as="article"
                key={project.repo.name}
                delay={i * 0.05}
                className={`${styles.tile} ${i === 0 ? `${styles.s7} ${styles.r2} ${styles.featured}` : `${styles.s5} ${i === 1 ? styles.tint : styles.plain}`}`}
              >
                <p className={styles.tileLabel}>{project.kind}</p>
                <h3 className={i === 0 ? styles.bigTitle : undefined}>{project.title}</h3>
                <p>{project.summary}</p>
                {i === 0 && (
                  <ul className={styles.bullets}>
                    {project.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
                <ul className={styles.chips}>
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {project.facts && <p className={styles.facts}>{project.facts.join(", ")}</p>}
                <p className={styles.row}>
                  <a {...project.code} className={styles.pill}>
                    Code<span className="sr-only"> for {project.title}</span>
                    <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} />
                  </a>
                  {project.demo && (
                    <a {...project.demo} className={styles.primary}>
                      Live demo<span className="sr-only"> of {project.title}</span>
                      <ArrowUpRight aria-hidden size={16} strokeWidth={1.75} />
                    </a>
                  )}
                </p>
              </Reveal>
            ))}

            {latest && (
              <Reveal className={`${styles.tile} ${styles.s4} ${styles.dark}`}>
                <p className={styles.tileLabel}>On GitHub</p>
                <p className={styles.bigNumber}>{allRepos.length}</p>
                <p className={styles.mutedOnDark}>public projects. Latest push:</p>
                <p className={styles.row}>
                  {latestLink && (
                    <a {...latestLink} translate="no" className={styles.inlineLight}>
                      {latest.name}
                    </a>
                  )}
                  {latest.stargazers_count > 0 && (
                    <span className={styles.stars}>
                      <Star aria-hidden size={14} strokeWidth={1.75} />
                      {latest.stargazers_count}
                    </span>
                  )}
                </p>
              </Reveal>
            )}

            {moreRepos.length > 0 && (
              <Reveal delay={0.05} className={`${styles.tile} ${styles.s8}`}>
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
          </div>
        </section>

        <section id="education" aria-labelledby="education-h" className={styles.groupBlock}>
          <h2 id="education-h" className={styles.groupTitle}>Education</h2>
          <div className={styles.group}>
            {education.map((entry) => (
              <Reveal as="article" key={entry.institution} className={`${styles.tile} ${styles.s7} ${styles.tint}`}>
                <p className={styles.tileLabel}>{entry.period}</p>
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
            <Reveal delay={0.05} className={`${styles.tile} ${styles.s5}`}>
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

        <section id="timeline" aria-labelledby="timeline-h" className={styles.groupBlock}>
          <h2 id="timeline-h" className={styles.groupTitle}>Timeline</h2>
          <ol className={styles.group}>
            {timeline.map((entry, i) => {
              const last = i === timeline.length - 1;
              const span = last ? styles.s8 : i === timeline.length - 2 ? styles.s4 : styles.s3;
              return (
                <Reveal as="li" key={entry.year + entry.desc} delay={i * 0.03} className={`${styles.tile} ${styles.timeTile} ${span} ${last ? styles.blue : ""}`}>
                  <span className={styles.year}>{entry.year}</span>
                  <span>{entry.desc}</span>
                </Reveal>
              );
            })}
          </ol>
        </section>

        <section id="curiosity" aria-labelledby="curiosity-h" className={styles.groupBlock}>
          <h2 id="curiosity-h" className={styles.groupTitle}>Interests</h2>
          <div className={styles.group}>
            <Reveal className={`${styles.tile} ${styles.s12} ${styles.warm}`}>
              <ul className={`${styles.chips} ${styles.chipsLarge}`}>
                {interests.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-h" className={styles.groupBlock}>
          <h2 id="contact-h" className={`${styles.groupTitle} ${styles.groupTitleBig}`}>{profile.contact.headline.join(" ")}</h2>
          <div className={styles.group}>
            <Reveal className={`${styles.tile} ${styles.s7} ${styles.dark}`}>
              <p className={styles.contactLead}>{profile.contact.pitch}</p>
              <p className={styles.mutedOnDark}>{profile.location.sentence}</p>
              <p className={styles.row}>
                <a {...mail} className={styles.primaryOnDark} translate="no">{profile.email}</a>
                <button type="button" onClick={() => copy(profile.email)} className={styles.pillOnDark}>
                  {copied ? <Check aria-hidden size={16} strokeWidth={1.75} /> : <Copy aria-hidden size={16} strokeWidth={1.75} />}
                  {copied ? "Copied" : "Copy"}
                  <span className="sr-only"> email address</span>
                </button>
              </p>
            </Reveal>
            <Reveal delay={0.05} className={`${styles.tile} ${styles.s5} ${styles.links}`}>
              {contactLinks.map((link) => {
                const Icon = ICONS[link.id];
                return (
                  <a key={link.id} {...link.props} className={link.id === "resume" ? styles.primary : styles.pill}>
                    <Icon aria-hidden size={18} strokeWidth={1.75} />
                    {link.label}
                  </a>
                );
              })}
            </Reveal>
          </div>
        </section>
      </div>
    </main>
  );
}
