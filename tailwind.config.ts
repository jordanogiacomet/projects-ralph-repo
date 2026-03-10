import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/blocks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-dark-section': 'var(--bg-dark-section)',
        'bg-dark-elevated': 'var(--bg-dark-elevated)',
        'surface-primary': 'var(--surface-primary)',
        'surface-secondary': 'var(--surface-secondary)',
        'surface-muted': 'var(--surface-muted)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-on-dark': 'var(--text-on-dark)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          light: 'var(--accent-soft)',
          soft: 'var(--accent-soft)',
          strong: 'var(--accent-strong)',
        },
        highlight: 'var(--highlight)',
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        'cta-green': {
          DEFAULT: 'var(--cta-green)',
          hover: 'var(--cta-green-hover)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-open-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-manrope)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['clamp(2.75rem, 5vw, 4.75rem)', { lineHeight: '0.95', letterSpacing: '-0.05em' }],
        'display-md': ['clamp(2.4rem, 4vw, 3.75rem)', { lineHeight: '0.98', letterSpacing: '-0.045em' }],
        'display-sm': ['clamp(2rem, 3vw, 3rem)', { lineHeight: '1', letterSpacing: '-0.04em' }],
        'heading-2xl': ['clamp(1.9rem, 2.4vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.035em' }],
        'heading-xl': ['1.875rem', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body-md': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.65' }],
        'label-sm': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.08em' }],
        'meta-sm': ['0.8125rem', { lineHeight: '1.4' }],
      },
      spacing: {
        card: 'var(--space-card)',
        form: 'var(--space-form)',
        'section-tight': 'var(--space-section-tight)',
        section: 'var(--space-section)',
        'section-loose': 'var(--space-section-loose)',
      },
      maxWidth: {
        content: 'var(--container-content)',
        reading: 'var(--container-reading)',
        wide: 'var(--container-wide)',
      },
      borderRadius: {
        button: 'var(--radius-button)',
        field: 'var(--radius-field)',
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
        strong: 'var(--shadow-strong)',
      },
    },
  },
  plugins: [],
}

export default config
