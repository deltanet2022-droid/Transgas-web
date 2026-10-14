import type { Config } from 'tailwindcss';

// Tokens extraídos del HTML de referencia (transgas-portal-premium-v4-premium.html).
// El sistema visual completo (componentes) vive en src/app/globals.css y usa las
// mismas variables; estos tokens permiten usar la paleta como utilidades de Tailwind.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#071b33', 800: '#0b2a4e' },
        blue: { 600: '#0b6fb8', 700: '#1279c4' },
        cyan: { 400: '#54c6ed' },
        surface: { 50: '#f4f8fb', 100: '#eaf2f9' },
        ink: '#14293d',
        muted: '#607387',
        line: '#d7e4ee',
        ok: '#16956d',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        panel: '22px',
        card: '20px',
        'card-sm': '18px',
        pill: '999px',
      },
      boxShadow: {
        std: '0 18px 55px rgba(8,30,57,.12)',
        soft: '0 7px 22px rgba(8,30,57,.04)',
      },
    },
  },
  plugins: [],
};

export default config;
