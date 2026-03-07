"use client";

import { motion, useReducedMotion } from "framer-motion";
import experienceData from "@/data/experience.json";

export default function Experience() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="experience" className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading - slide in from left */}
        <motion.div
          className="mb-16"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] as const }}
        >
          <p className="text-text-secondary font-body text-sm uppercase tracking-widest mb-4">
            {experienceData.sectionLabel}
          </p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-text-primary">
            {experienceData.sectionLabel}
          </h2>
        </motion.div>

        {/* Timeline entries */}
        <div className="relative">
          {/* Vertical connector line */}
          <motion.div
            className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border"
            initial={prefersReducedMotion ? {} : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />

          <div className="space-y-0">
            {experienceData.items.map((item, index) => (
              <motion.div
                key={item.company}
                className="relative pl-8 md:pl-20 py-8 border-b border-border last:border-b-0"
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1.0] as const,
                }}
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-0 md:left-8 top-10 w-3 h-3 rounded-full bg-accent -translate-x-[6px]"
                  initial={prefersReducedMotion ? {} : { scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + index * 0.15,
                    ease: "easeOut",
                  }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
