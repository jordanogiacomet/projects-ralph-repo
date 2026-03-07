"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import processData from "@/data/process.json";

export default function Process() {
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
      id="process"
      ref={sectionRef}
      className="py-24 bg-bg-primary"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column - heading + steps */}
          <div
            className={`transition-all duration-700 ease-out ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-text-primary mb-12">
              {processData.heading}
            </h2>

            <div className="space-y-0">
              {processData.steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`py-8 ${
                    index !== processData.steps.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <span className="font-display text-3xl text-text-secondary shrink-0">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-display text-xl md:text-2xl text-text-primary mb-2">
                        {step.title}
                      </h3>
                      <p className="font-body text-text-secondary text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - large image placeholder */}
          <div
            className={`transition-all duration-700 ease-out delay-200 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="rounded-xl bg-bg-accent-block border border-border overflow-hidden relative min-h-[400px] lg:min-h-[500px]">
              <Image
                src="/images/trabalho-6.svg"
                alt="Creative design process workspace"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
