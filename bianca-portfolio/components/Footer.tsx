const siteLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "Behance", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-dark-section text-text-on-dark py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">
              Bianca Sato
            </h3>
            <p className="font-body text-sm text-text-on-dark/70">
              UI/UX &amp; Brand Designer crafting meaningful digital
              experiences.
            </p>
          </div>

          {/* Site links */}
          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-4 text-text-on-dark/50">
              Sitemap
            </h4>
            <ul className="flex flex-col gap-3">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-text-on-dark/70 hover:text-text-on-dark transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-4 text-text-on-dark/50">
              Connect
            </h4>
            <ul className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-text-on-dark/70 hover:text-text-on-dark transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-text-on-dark/20 pt-8 text-center">
          <p className="font-body text-sm text-text-on-dark/50">
            &copy; {new Date().getFullYear()} Bianca Sato. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
