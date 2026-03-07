"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import faqData from "@/data/faq.json";

export default function FAQ() {
  const prefersReducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-bg-primary">
      <div className="max-w-3xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] as const }}
        >
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-text-primary">
            {faqData.heading}
          </h2>
        </motion.div>

        {/* Accordion items - staggered */}
        <div className="divide-y divide-border">
          {faqData.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1.0] as const,
                }}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between py-6 text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-body font-bold text-text-primary text-lg">
                    {item.question}
                  </span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 text-text-primary transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "max-h-40 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="font-body text-text-secondary leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
