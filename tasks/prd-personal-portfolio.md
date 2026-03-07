# PRD: Personal Portfolio Website — Bianca Sato

## Introduction

A personal portfolio website for **Bianca Sato**, a designer, to establish a professional brand, showcase work, and provide a point of contact for opportunities and collaboration. Built with Next.js (App Router) and Tailwind CSS, the site is a single-page scrolling experience with a dark, editorial aesthetic. All content is hardcoded via JSON files — no CMS, no backend. Sections include: Hero, About, Projects, Skills, Experience, and Contact.

## Identity & Design Direction

Bianca's portfolio should feel like a **refined, dark-mode editorial space** — not a generic template. The design communicates precision, intentionality, and craft.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0B0B0F` | Main background — near-black with a cool undertone |
| `--bg-secondary` | `#131318` | Cards, alternating sections |
| `--bg-elevated` | `#1C1C24` | Hover states, navbar, elevated surfaces |
| `--text-primary` | `#EAEAEF` | Primary text — cool off-white |
| `--text-secondary` | `#7A7A88` | Secondary/muted text |
| `--accent` | `#4F7AE8` | Primary accent — sharp, confident blue |
| `--accent-muted` | `#4F7AE833` | Glow effects, hover highlights |
| `--border` | `#23232E` | Subtle borders and dividers |

### Typography
- **Display/Headings:** A distinctive serif or geometric sans — e.g., `Syne`, `Clash Display`, or `General Sans`. Not Inter, not Roboto.
- **Body:** `Satoshi`, `Outfit`, or `DM Sans` — clean with character.
- **Monospace accent:** `JetBrains Mono` or `IBM Plex Mono` for tags, labels, and small details.

### Design Principles
1. **Dark-first** — the entire site lives on a dark canvas; light text, subtle borders, sharp accents
2. **Generous whitespace** — sections breathe; nothing feels cramped
3. **Subtle motion** — CSS-only fade-ins on scroll, smooth hover transitions; no animation library
4. **Typographic hierarchy** — oversized section numbers, clear heading/body contrast
5. **Grid discipline with intentional breaks** — mostly structured, but hero and occasional elements break the grid for visual interest

---

## Goals

- Establish a professional online presence for personal branding and thought leadership
- Showcase design projects with descriptions, tools used, and links
- Present skills and professional experience in a clear, scannable format
- Provide a way for visitors to get in touch
- Deliver a fast, responsive, and accessible experience
- Keep content easy to update via local JSON/Markdown files (no CMS)

## User Stories

### US-001: Project scaffolding and layout
**Description:** As a developer, I want a Next.js project with Tailwind CSS and a responsive layout shell so that all pages share a consistent structure.

**Acceptance Criteria:**
- [ ] Next.js app created with TypeScript and Tailwind CSS configured
- [ ] Custom theme tokens applied (colors, fonts, spacing from Identity section above)
- [ ] Responsive navigation bar with links to all sections (Hero, About, Projects, Skills, Experience, Contact)
- [ ] Navbar is fixed, semi-transparent with `backdrop-blur` over dark background
- [ ] Active section highlighted in navbar via Intersection Observer
- [ ] Footer with copyright and social links (Behance, LinkedIn, Instagram)
- [ ] Mobile hamburger menu with smooth slide-in or fade animation
- [ ] Smooth scroll behavior enabled globally
- [ ] Semantic HTML throughout (`<header>`, `<main>`, `<section>`, `<footer>`)
- [ ] Typecheck and lint pass
- [ ] Verify in browser using dev-browser skill

### US-002: Hero section
**Description:** As a visitor, I want to see an engaging hero section when I land on the site so that I immediately understand who Bianca is and what she does.

**Acceptance Criteria:**
- [ ] Full-viewport hero (100vh) with dark background
- [ ] Name "Bianca Tomoe Sato" displayed prominently in the display font, large scale
- [ ] Short tagline/title underneath (e.g., "Designer")
- [ ] One-liner description with personality
- [ ] CTA button in accent color linking to Projects or Contact section
- [ ] Staggered fade-in animation on load (name → tagline → description → CTA)
- [ ] Scroll indicator at the bottom (animated arrow or line)
- [ ] Hero content sourced from `data/hero.json`
- [ ] Responsive: text stacks vertically on mobile, scales gracefully
- [ ] Typecheck and lint pass
- [ ] Verify in browser using dev-browser skill

**Data structure (`data/hero.json`):**
```json
{
  "name": "Bianca Tomoe Sato",
  "tagline": "Designer",
  "description": "Building thoughtful digital experiences with clean design and sharp intention.",
  "cta": {
    "text": "See my work",
    "link": "#projects"
  }
}
```

### US-003: About section
**Description:** As a visitor, I want to read an about section so that I can learn more about Bianca beyond the job title.

**Acceptance Criteria:**
- [ ] Section with heading, bio paragraph(s), and optional profile image placeholder
- [ ] Content sourced from `data/about.json`
- [ ] Layout: text in a wider column, image or decorative element on the side
- [ ] Generous whitespace, consistent with dark editorial aesthetic
- [ ] Section number displayed as large muted text (e.g., "01" in `--text-secondary`)
- [ ] Fade-in on scroll
- [ ] Typecheck and lint pass
- [ ] Verify in browser using dev-browser skill

**Data structure (`data/about.json`):**
```json
{
  "sectionNumber": "01",
  "heading": "About",
  "bio": [
    "I'm Bianca — a designer who cares about craft. I create digital experiences that are intentional, accessible, and a pleasure to interact with.",
    "When I'm not designing, you'll find me exploring new visual references, experimenting with tools, or thinking about the intersection of art and functionality."
  ],
  "profileImage": "/images/profile-placeholder.jpg"
}
```

### US-004: Projects section
**Description:** As a visitor, I want to browse a list of projects so that I can see what Bianca has designed and explore further.

**Acceptance Criteria:**
- [ ] Grid of project cards: 1 column on mobile, 2 columns on desktop
- [ ] Each card shows: title, short description, tool/tech tags, and links (live site, Behance)
- [ ] Cards use `--bg-secondary` background with `--border` border
- [ ] Hover effect: subtle elevation (translateY) + accent glow (`box-shadow` with `--accent-muted`)
- [ ] Tool tags as small pill badges in monospace font
- [ ] Section number as large muted decorative element ("02")
- [ ] Projects data sourced from `data/projects.json`
- [ ] Typecheck and lint pass
- [ ] Verify in browser using dev-browser skill

**Data structure (`data/projects.json`):**
```json
{
  "sectionNumber": "02",
  "heading": "Projects",
  "items": [
    {
      "title": "Project Name",
      "description": "Brief description of the design project and the problem it solves.",
      "tags": ["Figma", "Illustrator", "Branding"],
      "links": {
        "live": "https://example.com",
        "behance": "https://behance.net/biancasato/project"
      }
    }
  ]
}
```

### US-005: Skills section
**Description:** As a visitor, I want to see a summary of design skills so that I can quickly assess Bianca's areas of expertise.

**Acceptance Criteria:**
- [ ] Skills displayed in categorized groups (e.g., "Design", "Tools", "Other")
- [ ] Each skill shown as a labeled badge/tag in monospace font
- [ ] Badges use subtle background (`--bg-elevated`) and border (`--border`)
- [ ] Skills data sourced from `data/skills.json`
- [ ] Clean, scannable layout with clear category headings
- [ ] Section number ("03") as decorative element
- [ ] Typecheck and lint pass
- [ ] Verify in browser using dev-browser skill

**Data structure (`data/skills.json`):**
```json
{
  "sectionNumber": "03",
  "heading": "Skills",
  "categories": [
    {
      "name": "Design",
      "items": ["UI/UX", "Branding", "Visual Identity", "Typography"]
    },
    {
      "name": "Tools",
      "items": ["Figma", "Adobe Illustrator", "Photoshop", "After Effects"]
    },
    {
      "name": "Other",
      "items": ["Prototyping", "Design Systems", "User Research", "Motion Design"]
    }
  ]
}
```

### US-006: Experience section
**Description:** As a visitor, I want to see a timeline of professional experience so that I can understand Bianca's career at a glance.

**Acceptance Criteria:**
- [ ] Vertical timeline or stacked card list of experience entries
- [ ] Each entry shows: company name, role/title, date range, and a brief description
- [ ] Timeline line or connector in `--accent` or `--border` color
- [ ] Entries ordered most recent to oldest
- [ ] Experience data sourced from `data/experience.json`
- [ ] Section number ("04") as decorative element
- [ ] Fade-in on scroll for each entry
- [ ] Typecheck and lint pass
- [ ] Verify in browser using dev-browser skill

**Data structure (`data/experience.json`):**
```json
{
  "sectionNumber": "04",
  "heading": "Experience",
  "items": [
    {
      "company": "Company Name",
      "role": "Designer",
      "period": "2023 — Present",
      "description": "Led visual identity projects and collaborated with cross-functional teams to deliver cohesive brand experiences."
    }
  ]
}
```

### US-007: Contact section
**Description:** As a visitor, I want a way to send a message so that I can reach out for opportunities or collaboration.

**Acceptance Criteria:**
- [ ] Contact section with heading, short prompt, and form
- [ ] Form fields: Name, Email, Message — styled consistently with dark theme
- [ ] Input fields use `--bg-secondary` background, `--border` border, `--text-primary` text
- [ ] Focus state: accent-colored border or glow
- [ ] Client-side validation: all fields required, valid email format
- [ ] Submit button in `--accent` color with hover state
- [ ] On submission: show inline success message (no backend; static handler or mailto)
- [ ] Social links displayed alongside form (Behance, LinkedIn, Instagram, email)
- [ ] Section number ("05") as decorative element
- [ ] Typecheck and lint pass
- [ ] Verify in browser using dev-browser skill

### US-008: SEO and performance
**Description:** As a site owner, I want proper meta tags and optimized performance so that the site ranks well and loads quickly.

**Acceptance Criteria:**
- [ ] Page title: "Bianca Tomoe Sato — Designer"
- [ ] Meta description set for the homepage
- [ ] Open Graph tags (og:title, og:description, og:image) configured
- [ ] All images use Next.js `<Image>` component for optimization
- [ ] Lighthouse performance score >= 90 on desktop
- [ ] Typecheck and lint pass

---

## Functional Requirements

- **FR-1:** Built with Next.js (App Router) and TypeScript
- **FR-2:** Styled with Tailwind CSS using the custom dark theme defined in Identity section
- **FR-3:** All content stored in JSON files under `data/` directory
- **FR-4:** Navbar highlights active section and supports smooth scroll
- **FR-5:** Fully responsive across mobile, tablet, and desktop
- **FR-6:** Project cards link out to live demos and/or Behance projects
- **FR-7:** Contact form validates inputs client-side before showing success state
- **FR-8:** Semantic HTML elements used throughout for accessibility
- **FR-9:** CSS-only transitions and animations (no animation libraries)

## Non-Goals

- No backend server or database — all content is static/hardcoded
- No CMS integration (Contentful, Sanity, etc.)
- No blog or writing section
- No authentication or user accounts
- No animation library (Framer Motion, GSAP) — CSS transitions only
- No light/dark theme toggle — ships dark only
- No analytics integration in v1

## Technical Considerations

- Next.js App Router with static export (`output: 'export'`) for deployment to Vercel, Netlify, or GitHub Pages
- Tailwind CSS with extended theme config matching the color/typography tokens above
- JSON data files imported directly into components — no API routes
- TypeScript interfaces for each data type (Project, Skill, Experience, HeroContent, etc.)
- Google Fonts loaded via `next/font` for display and body typefaces
- Intersection Observer for scroll-based active nav and fade-in animations

**Folder structure:**
```
app/
  layout.tsx
  page.tsx
  globals.css
components/
  Navbar.tsx
  Hero.tsx
  About.tsx
  Projects.tsx
  Skills.tsx
  Experience.tsx
  Contact.tsx
  Footer.tsx
  SectionHeading.tsx
  ProjectCard.tsx
  SkillBadge.tsx
  ExperienceEntry.tsx
data/
  hero.json
  about.json
  projects.json
  skills.json
  experience.json
public/
  images/
```

## Success Metrics

- Site loads in under 2 seconds on a standard connection
- Lighthouse performance score >= 90
- All sections render correctly on mobile, tablet, and desktop
- Visitor can navigate to any section within one click
- Contact form validates and provides feedback without page reload
- Visual design is cohesive, dark-themed, and does not look like a generic template
