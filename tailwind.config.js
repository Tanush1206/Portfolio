/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Tokens are redefined per section by [data-theme] in index.css, so a
      // component written once renders correctly on a light band and on a
      // dark one. Raw channels are what let the opacity modifiers work.
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
      },
      borderColor: {
        DEFAULT: 'rgb(var(--line) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        shell: '1440px',
      },
      transitionTimingFunction: {
        entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
        overlay: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      animation: {
        'fade-rise': 'fade-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        marquee: 'marquee 38s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
      },
      // Keyframes live in index.css so the reduced-motion override and the
      // token layer stay in one file.
      keyframes: {},
    },
  },
  plugins: [],
};
