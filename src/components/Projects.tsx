"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, GitBranch } from "lucide-react";

const PROJECTS = [
  {
    title: "Ethereal UI",
    description: "A component library for modern, fluid, and animated interfaces.",
    tags: ["React", "Framer Motion", "Tailwind"],
    link: "#",
    github: "#",
  },
  {
    title: "Quantum Engine",
    description: "High-performance WebGL renderer for interactive 3D experiences.",
    tags: ["Three.js", "WebGL", "TypeScript"],
    link: "#",
    github: "#",
  },
  {
    title: "VibeCheck",
    description: "Real-time sentiment analysis dashboard with smooth data visualization.",
    tags: ["Next.js", "D3.js", "WebSockets"],
    link: "#",
    github: "#",
  },
  {
    title: "Noir CMS",
    description: "A headless CMS with a dark-mode first design and blazing fast API.",
    tags: ["Node.js", "GraphQL", "PostgreSQL"],
    link: "#",
    github: "#",
  }
];

export default function Projects() {
  return (
    <section className="min-h-screen bg-[#121212] py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Selected Work</h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
            A showcase of recent projects blending high-end design with robust engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-8 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] flex flex-col justify-between"
            >
              {/* Subtle gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-semibold text-white tracking-tight">{project.title}</h3>
                  <div className="flex gap-3 text-gray-400">
                    <a href={project.github} className="hover:text-white transition-colors">
                      <GitBranch size={20} />
                    </a>
                    <a href={project.link} className="hover:text-white transition-colors">
                      <ArrowUpRight size={20} />
                    </a>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-8 font-light leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
                {project.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 text-xs font-medium text-gray-300 bg-white/5 rounded-full border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
