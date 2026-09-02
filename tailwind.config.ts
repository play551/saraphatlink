import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-app)', 'Inter', 'IBM Plex Sans Thai', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef6ff',
          100: '#d9ebff',
          200: '#bcdcff',
          300: '#8ec6ff',
          400: '#59a6ff',
          500: '#3182ff',
          600: '#1a5ff5',
          700: '#154ae1',
          800: '#183eb6',
          900: '#1a398f',
          950: '#152457',
        },
        accent: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        surface: {
          light: '#f6f8fc',
          dark: '#080b14',
        },
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(at 12% 8%, rgba(49,130,255,0.18) 0px, transparent 55%), radial-gradient(at 88% 4%, rgba(217,70,239,0.14) 0px, transparent 50%), radial-gradient(at 72% 92%, rgba(34,211,238,0.16) 0px, transparent 52%)',
        'mesh-dark':
          'radial-gradient(at 10% 6%, rgba(49,130,255,0.26) 0px, transparent 55%), radial-gradient(at 90% 2%, rgba(217,70,239,0.20) 0px, transparent 50%), radial-gradient(at 70% 95%, rgba(20,184,166,0.18) 0px, transparent 52%)',
        'shine':
          'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.35) 50%, transparent 75%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 23, 42, 0.12)',
        'glass-lg': '0 20px 60px -12px rgba(15, 23, 42, 0.25)',
        'glow-brand': '0 0 0 1px rgba(49,130,255,0.35), 0 12px 40px -8px rgba(49,130,255,0.45)',
        'inner-top': 'inset 0 1px 0 0 rgba(255,255,255,0.22)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.5)' },
          '70%': { boxShadow: '0 0 0 8px rgba(34,197,94,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.45s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.22,1,0.36,1) both',
        'slide-in-right': 'slide-in-right 0.35s cubic-bezier(0.22,1,0.36,1) both',
        shimmer: 'shimmer 1.8s linear infinite',
        float: 'float 5s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
