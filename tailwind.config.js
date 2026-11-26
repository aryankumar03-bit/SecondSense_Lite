/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        obsidian: '#07090d',
        surface: '#0d121a',
      },
      boxShadow: {
        glow: '0 0 36px -8px rgba(34, 211, 238, 0.28)',
      },
    },
  },
  plugins: [],
};
