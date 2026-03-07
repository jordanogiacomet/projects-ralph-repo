"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import projectsData from "@/data/projects.json";

export default function Projects() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="portfolio" className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] as const }}
        >
          <p className="text-text-secondary font-body text-sm uppercase tracking-widest mb-4">
            {projectsData.sectionLabel}
          </p>
          <p className="font-body text-text-secondary text-lg max-w-2xl">
            {projectsData.description}
          </p>
        </motion.div>

        {/* Project cards - scale from 0.95 to 1 */}
        <div className="space-y-16">
          {projectsData.items.map((project, index) => (
            <motion.div
              key={project.title}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1.0] as const,
              }}
            >
              {/* Image */}
              <div className="group relative rounded-xl overflow-hidden bg-bg-accent-block border border-border mb-6">
                <div className="aspect-[16/9] relative transition-transform duration-500 group-hover:scale-[1.02]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                </div>
                <div className="absolute inset-0 bg-text-primary/0 group-hover:bg-text-primary/10 transition-colors duration-300 rounded-xl" />
              </div>

              {/* Project info */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-text-primary mb-2">
                    {project.title}
                  </h3>
                  <p className="font-body text-text-secondary text-base mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-badge-bg border border-badge-border font-body text-text-primary text-xs px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 shrink-0">
                  <a
                    href={project.links.live}
                    className="font-body text-sm text-text-primary underline underline-offset-4 hover:text-accent-hover transition-colors"
                  >
                    Live Site
                  </a>
                  <a
                    href={project.links.behance}
                    className="font-body text-sm text-text-primary underline underline-offset-4 hover:text-accent-hover transition-colors"
                  >
                    Behance
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
