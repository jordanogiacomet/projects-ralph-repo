/**
 * Certifications — Professional Certificates Showcase
 *
 * Extensible card-based component for displaying professional certificates
 * in a two-column masonry-style grid layout.
 *
 * To add a new certificate:
 *   1. Append an object to the items array in data/certifications.json
 *   2. No component changes needed
 * If a new category is added, it automatically appears in the filter and as a badge.
 */
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import certData from "@/data/certifications.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CertItem {
  id: number;
  title: string;
  institution: string;
  category: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const categoryLabels: Record<string, string> = {
  produtividade: "Produtividade",
  comunicação: "Comunicação",
  marketing: "Marketing",
  criatividade: "Criatividade",
  educação: "Educação",
  tecnologia: "Tecnologia",
  idioma: "Idioma",
};

function getCategoryLabel(cat: string): string {
  return categoryLabels[cat] || cat;
}

// Derive unique categories from the data
function getCategories(items: CertItem[]): string[] {
  const seen = new Set<string>();
  const cats: string[] = [];
  for (const item of items) {
    if (!seen.has(item.category)) {
      seen.add(item.category);
      cats.push(item.category);
    }
  }
  return cats;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CertCard({ item }: { item: CertItem }) {
  return (
    <article
      className="relative bg-bg-secondary border border-border hover:border-text-primary/30 rounded-lg p-5 transition-all duration-300 ease-in-out hover:-translate-y-0.5"
    >
      {/* Category badge — top right */}
      <span className="absolute top-4 right-4 bg-badge-bg border border-badge-border rounded-full px-2.5 py-0.5 font-body uppercase text-text-secondary"
        style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}
      >
        {getCategoryLabel(item.category)}
      </span>

      {/* Institution — visual anchor */}
      <h3 className="font-display font-bold text-text-primary pr-24" style={{ fontSize: "1rem" }}>
        {item.institution}
      </h3>

      {/* Certificate title */}
      <p className="font-body text-text-secondary mt-1.5" style={{ fontSize: "0.85rem" }}>
        {item.title}
      </p>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const items = certData.items as CertItem[];
const categories = getCategories(items);

export default function Certifications() {
  const prefersReducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState("todos");

  const filteredItems =
    activeFilter === "todos"
      ? items
      : items.filter((item) => item.category === activeFilter);

  // Split heading to italicize "Formação"
  const headingParts = certData.heading.split(certData.headingItalic);

  // Animation variants
  const containerVariants = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.06,
          },
        },
      };

  const cardVariants = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1.0] as const,
          },
        },
      };

  return (
    <section
      id="certifications"
      aria-label="Certificados e Formação"
      className="py-24 bg-bg-primary"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="mb-12"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1.0] as const,
          }}
        >
          <p
            className="text-text-secondary font-body text-sm uppercase mb-4"
            style={{ letterSpacing: "0.2em" }}
          >
            {certData.sectionLabel}
          </p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-text-primary mb-3">
            {headingParts[0]}
            <em>{certData.headingItalic}</em>
            {headingParts[1] || ""}
          </h2>
          <p className="font-body text-text-secondary text-lg">
            {certData.description}
          </p>
        </motion.div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveFilter("todos")}
            className={`rounded-full px-4 py-1.5 font-body text-sm transition-colors duration-200 ${
              activeFilter === "todos"
                ? "bg-accent text-text-on-dark"
                : "bg-badge-bg border border-badge-border text-text-secondary hover:text-text-primary"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`rounded-full px-4 py-1.5 font-body text-sm transition-colors duration-200 ${
                activeFilter === cat
                  ? "bg-accent text-text-on-dark"
                  : "bg-badge-bg border border-badge-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <motion.div
          key={activeFilter}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {filteredItems.map((item) => (
            <motion.div key={item.id} variants={cardVariants}>
              <CertCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
