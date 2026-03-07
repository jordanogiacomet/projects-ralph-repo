"use client";

import { useEffect, useRef, useState } from "react";
import aboutData from "@/data/about.json";

export default function About() {
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

  const imageLabels = [
    "Brand Design",
    "UI Mockup",
    "Typography",
    "Color Palette",
    "Mobile App",
    "Wireframe",
    "Logo Design",
    "Prototype",
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 bg-bg-primary"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column - text */}
          <div
            className={`transition-all duration-700 ease-out ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-text-secondary font-body text-sm uppercase tracking-widest mb-4">
              {aboutData.sectionLabel}
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-text-primary mb-8">
              {aboutData.headline}
            </h2>
            {aboutData.bio.map((paragraph, index) => (
              <p
                key={index}
                className="text-text-secondary font-body text-lg leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Right column - image grid */}
          <div
            className={`transition-all duration-700 ease-out delay-200 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              {imageLabels.map((label, index) => {
                const isLarge = index === 0 || index === 5;
                return (
                  <div
                    key={label}
                    className={`rounded-xl bg-bg-accent-block border border-border overflow-hidden flex items-center justify-center ${
                      isLarge ? "row-span-2 min-h-[240px]" : "min-h-[120px]"
                    }`}
                  >
                    <span className="text-text-secondary font-body text-sm">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
