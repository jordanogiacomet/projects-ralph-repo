"use client";

import { useEffect, useRef, useState } from "react";
import skillsData from "@/data/skills.json";

export default function Skills() {
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 bg-bg-primary"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-text-secondary font-body text-sm uppercase tracking-widest mb-4">
            {skillsData.sectionLabel}
          </p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-text-primary">
            {skillsData.heading}
          </h2>
        </div>

        {/* Stats grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 transition-all duration-700 ease-out delay-200 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {skillsData.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="font-display text-5xl md:text-6xl text-text-primary">
                {stat.value}
              </span>
              <p className="font-body text-text-secondary text-sm mt-2 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <div
          className={`text-center mb-20 transition-all duration-700 ease-out delay-200 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <a
            href="#contact"
            className="inline-block bg-accent text-text-on-dark font-body text-sm uppercase tracking-wider px-8 py-4 rounded-full hover:bg-accent-hover transition-colors"
          >
            Get in touch
          </a>
        </div>

        {/* Skill categories */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-12 transition-all duration-700 ease-out delay-300 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {skillsData.categories.map((category) => (
            <div key={category.name}>
              <h3 className="font-display text-2xl text-text-primary mb-6">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="bg-badge-bg border border-badge-border font-body text-text-primary text-sm px-4 py-2 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
