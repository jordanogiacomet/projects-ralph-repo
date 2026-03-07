"use client";

import { useEffect, useRef, useState } from "react";
import pricingData from "@/data/pricing.json";

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-24 bg-bg-primary"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-text-primary mb-4">
            {pricingData.heading}
          </h2>
          <p className="font-body text-text-secondary text-lg max-w-2xl mx-auto">
            {pricingData.description}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingData.plans.map((plan, index) => {
            const isHighlighted = index === 1;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-700 ease-out ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                } ${
                  isHighlighted
                    ? "border-accent bg-accent text-text-on-dark md:scale-105 md:py-12 shadow-xl"
                    : "border-border bg-bg-secondary text-text-primary"
                }`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                {isHighlighted && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-bg-primary text-text-primary font-body text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-border">
                    Recommended
                  </span>
                )}

                <p
                  className={`font-body text-sm uppercase tracking-widest mb-1 ${
                    isHighlighted ? "text-text-on-dark/70" : "text-text-secondary"
                  }`}
                >
                  {plan.subtitle}
                </p>
                <h3
                  className={`font-display text-2xl mb-6 ${
                    isHighlighted ? "text-text-on-dark" : "text-text-primary"
                  }`}
                >
                  {plan.name}
                </h3>

                <p
                  className={`font-display text-4xl md:text-5xl mb-8 ${
                    isHighlighted ? "text-text-on-dark" : "text-text-primary"
                  }`}
                >
                  {plan.price}
                </p>

                <ul className="flex-1 space-y-4 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 font-body text-sm">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          isHighlighted ? "text-text-on-dark" : "text-accent"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`block text-center font-body text-sm uppercase tracking-wider px-8 py-4 rounded-full transition-colors ${
                    isHighlighted
                      ? "bg-bg-primary text-text-primary hover:bg-bg-accent-block"
                      : "bg-accent text-text-on-dark hover:bg-accent-hover"
                  }`}
                >
                  Get Started
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
