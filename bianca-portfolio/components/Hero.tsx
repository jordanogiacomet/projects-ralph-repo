"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import heroData from "@/data/hero.json";
import aboutData from "@/data/about.json";


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
      </div>
    </section>
  );
}
