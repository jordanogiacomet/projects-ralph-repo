/**
 * SocialPosts — Social Media Design Showcase
 *
 * Extensible card-based component for displaying social media post designs
 * in a horizontal carousel. Cards are rendered via a switch/map on `post.type`.
 *
 * To add a new post type (e.g. 'quote', 'carousel', 'image'):
 *   1. Add the new type's data shape to data/socialPosts.json
 *   2. Add a new card sub-component inside this file (e.g. QuoteCard)
 *   3. Add a case in the renderCard switch below
 * The carousel, filters, metadata, and animations don't need to change.
 */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
// Sub-components
// ---------------------------------------------------------------------------

function PortugueseCard({ post }: { post: PortuguesePost }) {
  const isLongWord = post.word.length > 10;

  return (
    <div
      className="relative flex flex-col justify-between bg-bg-primary rounded-xl overflow-hidden h-full"
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

        {(post.pronunciation || post.classification) && (
          <p className="font-body text-text-secondary mt-1" style={{ fontSize: "0.7rem" }}>
            {post.pronunciation && <>({post.pronunciation}) </>}
            {post.classification && <>[{post.classification}]</>}
          </p>
        )}

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
      className="relative flex flex-col justify-between rounded-xl overflow-hidden h-full"
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
        <h3
          className="font-display font-bold leading-tight"
          style={{
            color: "#F5F0EB",
            fontSize: "clamp(2rem, 6vw, 3rem)",
          }}
        >
          {post.characters}
        </h3>

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

        {post.meaning && (
          <p
            className="font-body italic mt-2"
            style={{ color: "#F5F0EB", fontSize: "0.8rem", opacity: 0.85 }}
          >
            {post.meaning}
          </p>
        )}

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
// Carousel hooks
// ---------------------------------------------------------------------------

function useCardsPerView() {
  const [cpv, setCpv] = useState(3);

  useEffect(() => {
    function update() {
      if (window.innerWidth < 768) setCpv(1);
      else if (window.innerWidth < 1024) setCpv(2);
      else setCpv(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cpv;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SocialPosts() {
  const prefersReducedMotion = useReducedMotion();
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const cardsPerView = useCardsPerView();
  const posts = socialPostsData.posts as Post[];
  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.type === filter);

  const totalSlides = Math.max(1, Math.ceil(filtered.length / cardsPerView));

  // Clamp currentSlide when filter or cardsPerView changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [filter, cardsPerView]);

  const goTo = useCallback(
    (slide: number) => {
      setCurrentSlide(Math.max(0, Math.min(slide, totalSlides - 1)));
    },
    [totalSlides]
  );

  const goNext = useCallback(() => goTo(currentSlide + 1), [goTo, currentSlide]);
  const goPrev = useCallback(() => goTo(currentSlide - 1), [goTo, currentSlide]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    },
    [goNext, goPrev]
  );

  // Touch/pointer swipe
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStart.current) return;
      const dx = e.clientX - pointerStart.current.x;
      pointerStart.current = null;
      if (Math.abs(dx) > 50) {
        if (dx < 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev]
  );

  const gap = 20; // px
  const transitionDuration = prefersReducedMotion ? "0.15s" : "0.5s";

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

  const isFirst = currentSlide === 0;
  const isLast = currentSlide >= totalSlides - 1;

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
          <FilterTabs
            active={filter}
            onChange={(f) => {
              setFilter(f);
              setCurrentSlide(0);
            }}
          />
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1.0] as const,
          }}
        >
          <div
            className="relative"
            role="region"
            aria-roledescription="carousel"
            aria-label="Posts de redes sociais"
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Left arrow — hidden on mobile, shown on md+ */}
            {!isFirst && (
              <button
                onClick={goPrev}
                aria-label="Anterior"
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#1A1A1A",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#6B1A1A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1A1A1A";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* Right arrow — hidden on mobile, shown on md+ */}
            {!isLast && (
              <button
                onClick={goNext}
                aria-label="Próximo"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#1A1A1A",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#6B1A1A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1A1A1A";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* Carousel track */}
            <div className="overflow-hidden" style={{ margin: "0 -10px", padding: "0 10px" }}>
              <div
                ref={carouselRef}
                role="group"
                aria-roledescription="slide"
                className="flex touch-pan-y"
                style={{
                  gap: `${gap}px`,
                  transform: `translateX(calc(-${currentSlide * 100}% - ${currentSlide * gap}px))`,
                  transition: `transform ${transitionDuration} cubic-bezier(0.25, 0.1, 0.25, 1)`,
                }}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
              >
                {filtered.map((post) => (
                  <div
                    key={post.id}
                    className="flex-shrink-0 transition-all duration-[400ms]"
                    style={{
                      width: `calc((100% - ${(cardsPerView - 1) * gap}px) / ${cardsPerView})`,
                      transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {renderCard(post)}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile arrows — shown on mobile only */}
            <div className="flex md:hidden justify-center gap-4 mt-4">
              <button
                onClick={goPrev}
                aria-label="Anterior"
                disabled={isFirst}
                className="flex items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-30"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#1A1A1A",
                }}
                onMouseEnter={(e) => {
                  if (!isFirst) e.currentTarget.style.backgroundColor = "#6B1A1A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1A1A1A";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={goNext}
                aria-label="Próximo"
                disabled={isLast}
                className="flex items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-30"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#1A1A1A",
                }}
                onMouseEnter={(e) => {
                  if (!isLast) e.currentTarget.style.backgroundColor = "#6B1A1A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1A1A1A";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Slides">
              {Array.from({ length: totalSlides }).map((_, i) => {
                const isActive = i === currentSlide;
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Ir para slide ${i + 1}`}
                    role="tab"
                    aria-selected={isActive}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: isActive ? "10px" : "8px",
                      height: isActive ? "10px" : "8px",
                      backgroundColor: isActive ? "#6B1A1A" : "#D4CEC6",
                      transform: "scale(1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                );
              })}
            </div>
          </div>
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
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#6B1A1A";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#1A1A1A";
            }}
          >
            Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
