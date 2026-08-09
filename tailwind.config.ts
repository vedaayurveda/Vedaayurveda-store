import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: '#1F5E3B',      // Primary
        gold: '#C09B3C',        // Accent
        ivory: '#F0F6F0',       // Background / surface
        lime: '#8BC53F',        // High-contrast accent — CTAs, active badges, health/progress indicators (used sparingly, ~10%)
        surface: {
          DEFAULT: '#F0F6F0',
          'container-low': '#EAF1EA',
          container: '#E3ECE3',
          'container-high': '#E6F4EA',
          'container-highest': '#E6F4EA',
        },
      },
      fontFamily: {
        // Wired to next/font variables set in app/layout.tsx
        display: ['var(--font-display)', 'Fraunces', 'Playfair Display', 'serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        24: '96px',
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '30px',
        full: '999px',
      },
      screens: {
        xs: '0px',
        sm: '600px',
        md: '840px',
        lg: '1200px',
        xl: '1440px',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
}

export default config
