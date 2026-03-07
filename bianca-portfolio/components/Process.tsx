"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import processData from "@/data/process.json";

export default function Process() {
  const prefersReducedMotion = useReducedMotion();
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="process" className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column - heading + steps */}
          <div>
            <motion.h2
              className="font-display text-4xl md:text-5xl leading-tight text-text-primary mb-12"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] as const }}
            >
              {processData.heading}
            </motion.h2>

            <div className="space-y-0">
              {processData.steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className={`py-8 ${
                    index !== processData.steps.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + index * 0.15,
                    ease: [0.25, 0.1, 0.25, 1.0] as const,
                  }}
                >
                  <div className="flex items-start gap-6">
                    <span className="font-display text-3xl text-text-secondary shrink-0">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-display text-xl md:text-2xl text-text-primary mb-2">
                        {step.title}
                      </h3>
                      <p className="font-body text-text-secondary text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column - large image with parallax */}
          <div ref={imageRef}>
            <motion.div
              className="rounded-xl bg-bg-accent-block border border-border overflow-hidden relative min-h-[400px] lg:min-h-[500px]"
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] as const }}
              style={prefersReducedMotion ? {} : { y: imageY }}
            >
              <Image
                src="/images/trabalho-6.svg"
                alt="Creative design process workspace"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
