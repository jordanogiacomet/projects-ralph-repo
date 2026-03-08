const siteLinks = [
  { label: "Home", href: "#home" },
  { label: "Sobre", href: "#about" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Contato", href: "#contact" },
];

const socialLinks = [
  { label: "Behance", href: "https://www.behance.net/biancasato1" },
  { label: "LinkedIn", href: "www.linkedin.com/in/bianca-tomoe-sato-968703268" },
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
              Designer gráfico e de marca, criando experiências digitais significativas.
            </p>
          </div>

          {/* Site links */}
          <div>
            <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-4 text-text-on-dark/50">
              Mapa do Site
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
              Vamos se Conectar
            </h4>
            <ul className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
            &copy; {new Date().getFullYear()} Bianca Sato. Todos os Direitos Reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
