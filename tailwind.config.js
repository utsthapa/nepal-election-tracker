/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e17',
        surface: '#111827',
        neutral: '#1e293b',
        nc: '#22c55e',
        uml: '#ef4444',
        maoist: '#991b1b',
        rsp: '#3b82f6',
        rpp: '#8b5cf6',
        jspn: '#ec4899',
        us: '#f97316',
        jp: '#14b8a6',
        lsp: '#a855f7',
        nup: '#06b6d4',
        others: '#f59e0b',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
