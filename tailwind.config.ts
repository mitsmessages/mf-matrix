import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#FDFCFB",
          100: "#FAF8F5",
          200: "#F5F2EB",
          300: "#ECE6DA",
          400: "#E2DAC8",
          500: "#D4C9B2",
          600: "#BAAC90",
          700: "#9E8F73",
          800: "#756852",
          900: "#4D4334",
        },
        stone: {
          850: "#23201D",
          950: "#141210",
        },
        brand: {
          amber: "#B45309",
          amberLight: "#FEF3C7",
          forest: "#15803D",
          forestLight: "#DCFCE7",
          ruby: "#B91C1C",
          rubyLight: "#FEE2E2",
          navy: "#1E293B",
          gold: "#D97706",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
        serif: ["Newsreader", "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        "soft-sm": "0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.02)",
        "soft-md": "0 4px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)",
        "soft-lg": "0 12px 28px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
        "scale-in": "scale-in 150ms ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
