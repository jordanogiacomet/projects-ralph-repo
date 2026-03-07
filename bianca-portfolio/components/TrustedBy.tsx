import trustedByData from "@/data/trustedBy.json";

export default function TrustedBy() {
  return (
    <section className="py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-sm font-body uppercase tracking-widest text-text-secondary text-center mb-8">
          {trustedByData.heading}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {trustedByData.logos.map((logo) => (
            <span
              key={logo}
              className="inline-flex items-center px-6 py-3 rounded-full bg-badge-bg border border-badge-border font-body text-sm text-text-primary whitespace-nowrap"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
