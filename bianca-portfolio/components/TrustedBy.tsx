"use client";

import { motion, useReducedMotion } from "framer-motion";
import trustedByData from "@/data/trustedBy.json";

export default function TrustedBy() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          className="text-sm font-body uppercase tracking-widest text-text-secondary text-center mb-8"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {trustedByData.heading}
        </motion.p>
        <div className="flex flex-wrap justify-center gap-4">
          {trustedByData.logos.map((logo, index) => (
            <motion.span
              key={logo}
              className="inline-flex items-center px-6 py-3 rounded-full bg-badge-bg border border-badge-border font-body text-sm text-text-primary whitespace-nowrap"
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            >
              {logo}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
