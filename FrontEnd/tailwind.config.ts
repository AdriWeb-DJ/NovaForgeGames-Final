/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          light: '#1a1a2e',
          DEFAULT: '#0f0f1a',
          dark: '#080810',
        },
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        mydark: {
          "primary": "#7c3aed",      // morado
          "secondary": "#2563eb",    // azul
          "accent": "#0ea5e9",       // azul claro
          "neutral": "#18181b",      // negro/gris oscuro
          "base-100": "#0a0a14",     // fondo negro
          "info": "#2563eb",
          "success": "#22d3ee",
          "warning": "#facc15",
          "error": "#ef4444",
        },
      },
    ],
    darkTheme: "mydark",
  },
}
