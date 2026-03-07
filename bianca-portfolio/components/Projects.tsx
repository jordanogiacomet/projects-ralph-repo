"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import projectsData from "@/data/projects.json";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="py-24 bg-bg-primary"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ease-out ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-text-secondary font-body text-sm uppercase tracking-widest mb-4">
            {projectsData.sectionLabel}
          </p>
          <p className="font-body text-text-secondary text-lg max-w-2xl">
            {projectsData.description}
          </p>
        </div>

        {/* Project cards */}
        <div className="space-y-16">
          {projectsData.items.map((project, index) => (
            <div
              key={project.title}
              className={`transition-all duration-700 ease-out ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: visible ? `${(index + 1) * 200}ms` : "0ms" }}
            >
              {/* Image placeholder */}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
