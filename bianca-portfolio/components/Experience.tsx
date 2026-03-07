"use client";

import { useEffect, useRef, useState } from "react";
import experienceData from "@/data/experience.json";

export default function Experience() {
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
      id="experience"
      ref={sectionRef}
      className="py-24 bg-bg-primary"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div
          className={`mb-16 transition-all duration-700 ease-out ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-text-secondary font-body text-sm uppercase tracking-widest mb-4">
            {experienceData.sectionLabel}
          </p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-text-primary">
            {experienceData.sectionLabel}
          </h2>
        </div>

        {/* Timeline entries */}
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className={`absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border transition-all duration-700 ease-out delay-200 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="space-y-0">
            {experienceData.items.map((item, index) => (
              <div
                key={item.company}
                className={`relative pl-8 md:pl-20 py-8 border-b border-border last:border-b-0 transition-all duration-700 ease-out ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 md:left-8 top-10 w-3 h-3 rounded-full bg-accent -translate-x-[6px] transition-all duration-500 ${
                    visible ? "scale-100" : "scale-0"
                  }`}
                  style={{ transitionDelay: `${300 + index * 150}ms` }}
                />

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-8">
                  <div className="flex-1">
                    <h3 className="font-display text-2xl text-text-primary">
                      {item.company}
                    </h3>
                    <p className="font-body text-text-primary text-lg mt-1">
                      {item.role}
                    </p>
                    <p className="font-body text-text-secondary text-base mt-3">
                      {item.description}
                    </p>
                  </div>
                  <span className="font-body text-text-secondary text-sm uppercase tracking-wide whitespace-nowrap md:mt-2">
                    {item.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
