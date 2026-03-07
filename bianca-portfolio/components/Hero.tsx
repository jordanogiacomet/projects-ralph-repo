"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import heroData from "@/data/hero.json";
import aboutData from "@/data/about.json";

const icons = [
  <svg key="0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>,
  <svg key="1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>,
  <svg key="2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>,
  <svg key="3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>,
];

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const fadeUp = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1.0] as const },
        };

  return (
    <section id="home" ref={sectionRef} className="min-h-screen bg-bg-primary pt-24 pb-16 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div>
            <motion.p
              className="text-text-secondary font-body text-lg mb-4"
              {...fadeUp(0)}
            >
              {heroData.greeting}
            </motion.p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight text-text-primary mb-6">
              <motion.span className="inline-block" {...fadeUp(0.15)}>
                {heroData.titleLines[0]}{" "}
              </motion.span>
              <motion.em className="italic inline-block" {...fadeUp(0.3)}>
                {heroData.titleLines[1]}{" "}
              </motion.em>
              <motion.span className="block" {...fadeUp(0.45)}>
                {heroData.titleLines[2]}
              </motion.span>
            </h1>
            <motion.p
              className="text-text-secondary font-body text-lg max-w-lg mb-8"
              {...fadeUp(0.6)}
            >
              {heroData.description}
            </motion.p>
            <motion.a
              href={heroData.cta.link}
              className="inline-block bg-accent text-text-on-dark font-body font-medium px-8 py-3 rounded-full hover:bg-accent-hover transition-colors"
              {...fadeUp(0.75)}
            >
              {heroData.cta.text}
            </motion.a>
          </div>

          {/* Right column - profile photo with parallax */}
          <motion.div
            className="flex justify-center lg:justify-end"
            {...fadeUp(0.3)}
            style={prefersReducedMotion ? {} : { y: imageY }}
          >
            <div className="w-80 h-96 md:w-96 md:h-[28rem] rounded-2xl bg-bg-accent-block border-2 border-border overflow-hidden relative">
              <Image
                src={aboutData.profileImage}
                alt={heroData.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 320px, 384px"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* Highlight cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {heroData.highlights.map((highlight, index) => (
            <motion.div
              key={highlight.label}
              className="bg-bg-secondary border border-border rounded-xl p-6"
              {...fadeUp(0.9 + index * 0.15)}
            >
              <div className="text-text-primary mb-3">
                {icons[index]}
              </div>
              <h3 className="font-display text-lg text-text-primary mb-1">
                {highlight.label}
              </h3>
              <p className="text-text-secondary font-body text-sm">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
