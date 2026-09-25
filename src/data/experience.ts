export interface ExperienceEntry {
  role: string;
  company: string;
  /** Display string, e.g. "Feb 2026 – Jul 2026". */
  period: string;
  highlights: string[];
  tags: string[];
  link?: { label: string; href: string };
}

/** Newest first. Add new roles to the top of the list. */
export const experience: ExperienceEntry[] = [
  {
    role: "Full Stack Developer Intern (Java & AI)",
    company: "Vstand4U Solutions Pvt. Ltd.",
    period: "Feb 2026 – Jul 2026",
    highlights: [
      "Developed a standalone Hospital Management System in Core Java using the DAO design pattern, separating data-access logic from the UI for patient, doctor and appointment workflows.",
      "Designed a relational MySQL schema (patients, doctors, appointments linked by foreign keys) and implemented full CRUD operations through JDBC PreparedStatements to prevent SQL injection; managed builds with Maven.",
      "Trained in AI/ML, generative AI and prompt engineering, and applied LLM APIs in Java-based projects.",
    ],
    tags: ["Core Java", "DAO pattern", "JDBC", "MySQL", "Maven", "Generative AI", "Prompt engineering", "LLM APIs"],
    link: {
      label: "hospital-management-system",
      href: "https://github.com/sultanmaliki/hospital-management-system",
    },
  },
];
