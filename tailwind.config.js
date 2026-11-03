/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#173b8f",
          DEFAULT: "#2563eb",
          electric: "#3B82F6",
          dark: "#173B8F",
        },
        navy: {
          900: "#101828",
          800: "#1e293b",
          700: "#334155",
          DEFAULT: "#101828",
        },
        growth: {
          light: "#dcfce7",
          DEFAULT: "#22c55e",
          dark: "#15803d",
        },
        insight: {
          light: "#fef3c7",
          DEFAULT: "#facc15",
          dark: "#b45309",
        },
        ground: "#f8fafc",
        surface: "#ffffff",
        subtle: "#f1f5f9",
        borderline: "#e2e8f0",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text", "Segoe UI", "sans-serif"],
        mono: ["SF Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        apple: "20px",
        card: "16px",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        apple: "0 10px 30px -10px rgba(0, 0, 0, 0.07)",
        card: "0 4px 20px -2px rgba(16, 24, 40, 0.06)",
        float: "0 20px 40px -15px rgba(37, 99, 235, 0.12)",
      },
    },
  },
  plugins: [],
};

