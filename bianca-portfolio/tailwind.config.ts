import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#F5F0EB",
        "bg-secondary": "#FFFFFF",
        "bg-accent-block": "#E8E2DA",
        "bg-dark-section": "#1A1A1A",
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B6560",
        "text-on-dark": "#F5F0EB",
        accent: "#1A1A1A",
        "accent-hover": "#3A3A3A",
        border: "#D4CEC6",
        "badge-bg": "#FFFFFF",
        "badge-border": "#D4CEC6",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
