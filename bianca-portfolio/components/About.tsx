"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import aboutData from "@/data/about.json";

const images = [
  { src: "/images/about-1.jpg", alt: "Brand design workspace" },
  { src: "/images/about-2.jpg", alt: "UI mockup on screen" },
  { src: "/images/about-3.jpg", alt: "Typography samples" },
  { src: "/images/about-4.jpg", alt: "Baby Chef brand identity design" },
  { src: "/images/about-5.jpg", alt: "Aura Tullis typography and branding" },
  { src: "/images/about-6.jpg", alt: "Wireframe sketches" },
  { src: "/images/about-7.jpg", alt: "Logo design process" },
  { src: "/images/about-8.jpg", alt: "Prototype interaction" },
];

export default function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column - text slides in from left */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] as const }}
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
          </motion.div>

          {/* Right column - image grid slides in from right */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] as const }}
          >
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => {
                const isLarge = index === 0 || index === 5;
                const isSvg = image.src.endsWith(".svg");
                return (
                  <div
                    key={image.alt}
                    className={`rounded-xl bg-bg-accent-block border border-border overflow-hidden relative ${
                      isLarge ? "row-span-2 min-h-[240px]" : "min-h-[120px]"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className={isSvg ? "object-contain p-2" : "object-cover"}
                      sizes={isLarge ? "(max-width: 768px) 50vw, 300px" : "(max-width: 768px) 50vw, 150px"}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
