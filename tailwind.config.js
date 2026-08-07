/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "tertiary-fixed": "#6ffbbe",
        "surface-bright": "#393939",
        "on-background": "#e2e2e2",
        "on-primary-container": "#dad7ff",
        "surface-container": "#1f1f1f",
        "on-primary": "#1d00a5",
        "tertiary-fixed-dim": "#4edea3",
        "primary-container": "#4f46e5",
        "primary": "#c3c0ff",
        "on-error": "#690005",
        "on-secondary-container": "#c4abff",
        "outline-variant": "#464555",
        "error": "#ffb4ab",
        "surface-container-highest": "#353535",
        "surface-container-lowest": "#0e0e0e",
        "surface": "#131313",
        "error-container": "#93000a",
        "tertiary-container": "#006e4b",
        "surface-container-low": "#1b1b1b",
        "secondary-container": "#571bc1",
        "background": "#131313",
        "on-tertiary-container": "#67f4b7",
        "surface-tint": "#c3c0ff",
        "on-secondary-fixed-variant": "#5516be",
        "surface-container-high": "#2a2a2a",
        "on-primary-fixed-variant": "#3323cc",
        "inverse-on-surface": "#303030",
        "tertiary": "#4edea3",
        "inverse-primary": "#4d44e3",
        "outline": "#918fa1",
        "inverse-surface": "#e2e2e2",
        "on-error-container": "#ffdad6",
        "on-secondary": "#3c0091",
        "on-surface": "#e2e2e2",
        "primary-fixed-dim": "#c3c0ff",
        "on-tertiary-fixed": "#002113",
        "secondary-fixed": "#e9ddff",
        "secondary-fixed-dim": "#d0bcff",
        "surface-dim": "#131313",
        "on-primary-fixed": "#0f0069",
        "on-tertiary-fixed-variant": "#005236",
        "on-surface-variant": "#c7c4d8",
        "surface-variant": "#353535",
        "on-tertiary": "#003824",
        "primary-fixed": "#e2dfff",
        "on-secondary-fixed": "#23005c",
        "secondary": "#d0bcff"
      },
      fontFamily: {
        "headline-md": ["Space Grotesk", "sans-serif"],
        "body-sm": ["JetBrains Mono", "monospace"],
        "code-snippet": ["JetBrains Mono", "monospace"],
        "body-lg": ["JetBrains Mono", "monospace"],
        "headline-lg-mobile": ["Space Grotesk", "sans-serif"],
        "label-caps": ["JetBrains Mono", "monospace"],
        "display-lg": ["Space Grotesk", "sans-serif"],
        "headline-lg": ["Space Grotesk", "sans-serif"],
        "display": ["Space Grotesk", "sans-serif"],
        "body": ["JetBrains Mono", "monospace"],
        "mono": ["JetBrains Mono", "monospace"],
        "headline": ["Space Grotesk", "sans-serif"],
      },
      // Fluid type: each clamp()'s upper bound is the original desktop size,
      // so large screens render exactly as before while narrow screens scale
      // down instead of overflowing.
      fontSize: {
        "headline-md": ["clamp(22px, 4vw, 32px)", { lineHeight: "1.3", fontWeight: "500" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "code-snippet": ["clamp(12px, 2.5vw, 14px)", { lineHeight: "1.7", fontWeight: "400" }],
        "body-lg": ["clamp(15px, 2.5vw, 18px)", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-lg-mobile": ["clamp(30px, 8vw, 40px)", { lineHeight: "1.2", fontWeight: "600" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "700" }],
        "display-lg": ["clamp(44px, 9vw, 120px)", { lineHeight: "110%", letterSpacing: "-0.04em", fontWeight: "700" }],
        "headline-lg": ["clamp(32px, 6vw, 64px)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }]
      },
      spacing: {
        "unit": "8px",
        "container-max": "1440px",
        // These read the responsive custom properties declared in index.css
        // (20/80/16px on phones, scaling up at md and lg). Hardcoding the
        // desktop pixel values here silently disabled that scaling and left
        // phones with 128px of horizontal padding.
        "margin-safe": "var(--margin-safe)",
        "section-gap": "var(--section-gap)",
        "gutter": "var(--gutter)"
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};


