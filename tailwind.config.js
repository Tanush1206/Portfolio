/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Colours resolve to the custom properties declared in src/index.css, so
    // the palette has exactly one source of truth.
    extend: {
      // `<alpha-value>` is the placeholder Tailwind substitutes when a class
      // carries an opacity modifier. It only works because the custom
      // properties hold RGB channel triples — see the note in index.css.
      colors: {
        backdrop: 'rgb(var(--backdrop) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        dim: 'rgb(var(--dim) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        ml: 'rgb(var(--cluster-ml) / <alpha-value>)',
        eng: 'rgb(var(--cluster-eng) / <alpha-value>)',
        data: 'rgb(var(--cluster-data) / <alpha-value>)',
      },
      fontFamily: {
        mono: ['Departure Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      // Departure Mono is drawn on an 11px grid. These are the only sizes that
      // land on it; anything between them renders soft.
      fontSize: {
        xs: ['11px', { lineHeight: '17px' }],
        base: ['22px', { lineHeight: '22px' }],
        lg: ['33px', { lineHeight: '33px' }],
      },
      // Deliberately no spacing override. Redefining the core 1–5 scale to an
      // 11px rhythm silently turns every `p-4` written later into 33px; the
      // rhythm is carried by explicit bracket values where it matters instead.
    },
  },
  plugins: [],
};
