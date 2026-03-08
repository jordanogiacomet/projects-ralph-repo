/**
 * SocialPosts — Social Media Design Showcase
 *
 * Extensible card-based component for displaying social media post designs.
 * Cards are rendered via a switch/map on `post.type`. To add a new post type:
 *   1. Add the new type's data shape to data/socialPosts.json
 *   2. Add a new card sub-component inside this file (e.g. QuoteCard)
 *   3. Add a case in the renderCard switch below
 * The grid, filters, metadata, and animations don't need to change.
 */
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import socialPostsData from "@/data/socialPosts.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PortuguesePost {
  id: number;
  type: "portuguese";
  word: string;
  pronunciation: string | null;
  classification: string;
  definitions: string[];
}

interface JapanesePost {
  id: number;
  type: "japanese";
  characters: string;
  romanization: string;
  meaning: string | null;
  divider?: boolean;
  bullets?: string[];
}

type Post = PortuguesePost | JapanesePost;

// ---------------------------------------------------------------------------
// Sub-components (all defined inside this file per acceptance criteria)
// ---------------------------------------------------------------------------

function PortugueseCard({ post }: { post: PortuguesePost }) {
  const isLongWord = post.word.length > 10;

  return (
    <div
      className="relative flex flex-col justify-between bg-bg-primary rounded-xl overflow-hidden"
      style={{
        aspectRatio: "1 / 1",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Burgundy accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 rounded-l-xl"
        style={{ width: "6px", backgroundColor: "#6B1A1A" }}
      />

      <div className="flex flex-col flex-1 p-6 pl-8">
        {/* Word */}
        <h3
          className="font-display font-bold text-text-primary leading-tight"
          style={{
            fontSize: isLongWord
              ? "clamp(1.2rem, 4vw, 1.6rem)"
              : "clamp(1.6rem, 5vw, 2.2rem)",
          }}
        >
          {post.word}
        </h3>

        {/* Pronunciation + classification */}
        {(post.pronunciation || post.classification) && (
          <p className="font-body text-text-secondary mt-1" style={{ fontSize: "0.7rem" }}>
            {post.pronunciation && <>({post.pronunciation}) </>}
            {post.classification && <>[{post.classification}]</>}
          </p>
        )}

        {/* Definitions */}
        <div className="mt-3 flex-1">
          {post.definitions.map((def, i) => (
            <p
              key={i}
              className="font-body text-text-secondary leading-relaxed"
              style={{ fontSize: "0.72rem" }}
            >
              {def}
            </p>
          ))}
        </div>
      </div>

      {/* Handle at bottom */}
      <p
        className="font-body text-text-secondary px-6 pl-8 pb-4"
        style={{ fontSize: "0.65rem", opacity: 0.6 }}
      >
        {socialPostsData.client}
      </p>
    </div>
  );
}

function JapaneseCard({ post }: { post: JapanesePost }) {
  return (
    <div
      className="relative flex flex-col justify-between rounded-xl overflow-hidden"
      style={{
        aspectRatio: "1 / 1",
        background: "linear-gradient(145deg, #6B1A1A, #8B2E2E)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Diagonal stripe overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 11px)",
        }}
      />

      <div className="relative flex flex-col items-center justify-center flex-1 p-6 text-center">
        {/* Characters */}
        <h3
          className="font-display font-bold leading-tight"
          style={{
            color: "#F5F0EB",
            fontSize: "clamp(2rem, 6vw, 3rem)",
          }}
        >
          {post.characters}
        </h3>

        {/* Romanization */}
        <p
          className="font-body mt-2"
          style={{
            color: "#F5F0EB",
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
            opacity: 0.85,
          }}
        >
          [{post.romanization}]
        </p>

        {/* Divider line */}
        {post.divider && (
          <hr
            className="my-3 border-0"
            style={{
              width: "40px",
              height: "1px",
              backgroundColor: "rgba(245, 240, 235, 0.3)",
            }}
          />
        )}

        {/* Meaning */}
        {post.meaning && (
          <p
            className="font-body italic mt-2"
            style={{ color: "#F5F0EB", fontSize: "0.8rem", opacity: 0.85 }}
          >
            {post.meaning}
          </p>
        )}

        {/* Bullets */}
        {post.bullets && (
          <div className="mt-3 space-y-1">
            {post.bullets.map((bullet, i) => (
              <p
                key={i}
                className="font-body"
                style={{ color: "#F5F0EB", fontSize: "0.72rem", opacity: 0.85 }}
              >
                &#10022; {bullet}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Handle at bottom */}
      <p
        className="relative font-body text-center pb-4"
        style={{ color: "#F5F0EB", fontSize: "0.65rem", opacity: 0.5 }}
      >
        {socialPostsData.client}
      </p>
    </div>
  );
}

type FilterType = "all" | "portuguese" | "japanese";

function FilterTabs({
  active,
  onChange,
}: {
  active: FilterType;
  onChange: (f: FilterType) => void;
}) {
  const tabs: { label: string; value: FilterType }[] = [
    { label: "Todos", value: "all" },
    { label: "Português", value: "portuguese" },
    { label: "日本語", value: "japanese" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className="font-body text-sm px-5 py-2 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: isActive ? "#6B1A1A" : "transparent",
              color: isActive ? "#F5F0EB" : "#1A1A1A",
              border: isActive ? "1px solid #6B1A1A" : "1px solid #D4CEC6",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SocialPosts() {
  const prefersReducedMotion = useReducedMotion();
  const [filter, setFilter] = useState<FilterType>("all");

  const posts = socialPostsData.posts as Post[];
  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.type === filter);

  const containerVariants = prefersReducedMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      };

  const cardVariants = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1.0] as const,
          },
        },
      };

  function renderCard(post: Post) {
    switch (post.type) {
      case "portuguese":
        return <PortugueseCard post={post} />;
      case "japanese":
        return <JapaneseCard post={post} />;
      default:
        return null;
    }
  }

  return (
    <section
      id="social-posts"
      aria-label="Social Media Design Showcase"
      className="py-24 bg-bg-primary"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="mb-12"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1.0] as const,
          }}
        >
          <p
            className="font-body text-text-secondary text-sm uppercase mb-4"
            style={{ letterSpacing: "0.2em" }}
          >
            {socialPostsData.sectionLabel}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-primary mb-4">
            Design para{" "}
            <em className="font-display italic">Redes Sociais</em>
          </h2>
          <p className="font-body text-text-secondary text-lg max-w-2xl">
            {socialPostsData.description.split(socialPostsData.client)[0]}
            <span className="font-medium" style={{ color: "#6B1A1A" }}>
              {socialPostsData.client}
            </span>
            {socialPostsData.description.split(socialPostsData.client)[1] || ""}
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="mb-10"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1.0] as const,
          }}
        >
          <FilterTabs active={filter} onChange={setFilter} />
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          key={filter}
        >
          {filtered.map((post) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              className="transition-all duration-[400ms]"
              style={{
                transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: -4,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                    }
              }
            >
              {renderCard(post)}
            </motion.div>
          ))}
        </motion.div>

        {/* Project metadata footer */}
        <div
          className="mt-12 pt-8 flex flex-wrap items-center gap-x-8 gap-y-4"
          style={{ borderTop: "1px solid #D4CEC6" }}
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 flex-1 min-w-0">
            <p className="font-body text-sm text-text-secondary">
              <span className="text-text-primary font-medium">Cliente:</span>{" "}
              {socialPostsData.client}
            </p>
            <p className="font-body text-sm text-text-secondary">
              <span className="text-text-primary font-medium">Tipo:</span>{" "}
              Social Media Design
            </p>
            <p className="font-body text-sm text-text-secondary">
              <span className="text-text-primary font-medium">Posts:</span>{" "}
              {posts.length}
            </p>
          </div>
          <a
            href="https://instagram.com/psicologamarinahiga"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm px-5 py-2 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: "#1A1A1A",
              color: "#F5F0EB",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "#6B1A1A";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "#1A1A1A";
            }}
          >
            Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
