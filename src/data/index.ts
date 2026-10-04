import { certifications, education } from "./education";
import { experience } from "./experience";
import { featuredProjects } from "./projects";
import { interests, profile, skills, story, timeline } from "./profile";

/**
 * The single source of truth for portfolio content.
 *
 * Every design imports `portfolio` and arranges it its own way; no design owns any content.
 * GitHub repos are the one live data source, see `useRepos()` in "@/lib/useRepos".
 */
export const portfolio = {
  profile,
  story,
  skills,
  timeline,
  interests,
  experience,
  education,
  certifications,
  featuredProjects,
};

export type Portfolio = typeof portfolio;

export { SITE_URL, seo } from "./site";
export type { ContactLink, SkillCategory, TimelineEntry, Story } from "./profile";
export type { ExperienceEntry } from "./experience";
export type { EducationEntry } from "./education";
export type { FeaturedProject } from "./projects";
