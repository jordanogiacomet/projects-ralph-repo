"use client";

import { motion, useReducedMotion } from "framer-motion";
import skillsData from "@/data/skills.json";

export default function Skills() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      };

  const itemVariants = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const },
        },
      };

  return (
    <section id="skills" className="py-4 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
      
         

        {/* CTA button */}
        <motion.div
          className="text-center mb-20"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <a
            href="#contact"
            className="inline-block bg-accent text-text-on-dark font-body text-sm uppercase tracking-wider px-8 py-4 rounded-full hover:bg-accent-hover transition-colors"
          >
            Entre em Contato
          </a>
        </motion.div>

        {/* Skill categories - staggered children */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {skillsData.categories.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
