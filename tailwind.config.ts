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
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F5F7FA',
        'bg-dark-section': '#1A1A2E',
        'text-primary': '#1A1A1A',
        'text-secondary': '#555555',
        'text-on-dark': '#FFFFFF',
        accent: {
          DEFAULT: '#0056A6',
          hover: '#003D7A',
          light: '#E8F0FE',
        },
        border: '#E0E0E0',
        'cta-green': {
          DEFAULT: '#28A745',
          hover: '#1E7E34',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
