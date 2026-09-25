export interface EducationEntry {
  degree: string;
  institution: string;
  /** Display string, e.g. "2022 – 2026". */
  period: string;
  /** e.g. "7.39 / 10". */
  cgpa?: string;
  coursework: string[];
}

export const education: EducationEntry[] = [
  {
    degree: "B.E. in Computer Science Engineering",
    institution: "Anjuman Institute of Technology and Management (VTU)",
    period: "2022 – 2026",
    cgpa: "7.39 / 10",
    coursework: ["Full Stack Development (Java)", "SQL & NoSQL Databases", "React", "JavaScript", "HTML & CSS"],
  },
];

export const certifications: { name: string; issuer: string; year: string }[] = [
  { name: "AI/ML, Generative AI & Prompt Engineering", issuer: "Vstand4U", year: "2026" },
  { name: "Project Management", issuer: "LearnTube", year: "2024" },
  { name: "Data Visualization & GitHub", issuer: "AITM", year: "2023" },
  { name: "AWS Workshop", issuer: "", year: "" },
];
