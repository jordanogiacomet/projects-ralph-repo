"use client";

import { useEffect, useRef, useState } from "react";
import faqData from "@/data/faq.json";

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="py-24 bg-bg-primary"
    >
      <div className="max-w-3xl mx-auto px-6">
        {/* Heading */}
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-text-primary">
            {faqData.heading}
          </h2>
        </div>

        {/* Accordion items */}
        <div className="divide-y divide-border">
          {faqData.items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`transition-all duration-700 ease-out ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
