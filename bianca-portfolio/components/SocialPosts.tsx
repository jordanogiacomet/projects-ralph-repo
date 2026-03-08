/**
 * SocialPosts — Social Media Design Showcase
 *
 * Displays actual Instagram post images in a horizontal carousel.
 * Images are loaded from /public/images/insta-XX.png.
 *
 * To add new posts:
 *   1. Add the image to /public/images/ (e.g. insta-13.png)
 *   2. Add the entry to data/socialPosts.json with the correct type and image path
 *   The carousel, filters, metadata, and animations don't need to change.
 */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import socialPostsData from "@/data/socialPosts.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PortuguesePost {
  id: number;
  type: "portuguese";
  image: string;
  word: string;
  pronunciation: string | null;
  classification: string;
  definitions: string[];
}

interface JapanesePost {
  id: number;
  type: "japanese";
  image: string;
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

function PostImageCard({ post }: { post: Post }) {
  const alt =
    post.type === "portuguese"
      ? `Post sobre a palavra "${post.word}"`
      : `Post sobre "${post.characters}"`;

  return (
    <div
      className="relative rounded-xl overflow-hidden h-full"
      style={{
        aspectRatio: "1 / 1",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <Image
        src={post.image}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        quality={90}
      />
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const cardsPerView = useCardsPerView();
  const posts = socialPostsData.posts as Post[];

  const totalSlides = Math.max(1, Math.ceil(posts.length / cardsPerView));

  // Clamp currentSlide when cardsPerView changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [cardsPerView]);

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
                {posts.map((post) => (
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
                    <PostImageCard post={post} />
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