/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // `<alpha-value>` is the placeholder Tailwind substitutes when a class
      // carries an opacity modifier. It only works because the custom
      // properties hold RGB channel triples — see the note in index.css.
      //
      // Eight colours, and `query` is reserved for the visitor's query alone.
      // Borders are `muted` at low alpha rather than a ninth token.
      colors: {
        void: 'rgb(var(--void) / <alpha-value>)',
        panel: 'rgb(var(--panel) / <alpha-value>)',
        ivory: 'rgb(var(--ivory) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        ml: 'rgb(var(--cluster-ml) / <alpha-value>)',
        eng: 'rgb(var(--cluster-eng) / <alpha-value>)',
        data: 'rgb(var(--cluster-data) / <alpha-value>)',
        query: 'rgb(var(--query) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Newsreader', 'Georgia', 'serif'],
        mono: ['Departure Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      // The spec scale: 12 / 14 / 16 / 20 / 28 / 44 / 72, one hero size only.
      // Departure Mono is exempt and runs at 11/22 — see index.css.
      fontSize: {
        xs: ['12px', { lineHeight: '18px' }],
        sm: ['14px', { lineHeight: '22px' }],
        base: ['16px', { lineHeight: '26px' }],
        md: ['20px', { lineHeight: '28px' }],
        lg: ['28px', { lineHeight: '34px' }],
        xl: ['44px', { lineHeight: '48px' }],
        hero: ['72px', { lineHeight: '72px', letterSpacing: '-0.02em' }],
      },
      // Deliberately no spacing override. Redefining the core 1–5 scale
      // silently turns every `p-4` written later into something else.
    },
  },
  plugins: [],
};
