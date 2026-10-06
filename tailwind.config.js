/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: {
          DEFAULT: 'var(--surface)',
          secondary: 'var(--surface-secondary)',
          elevated: 'var(--surface-elevated)'
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)'
        },
        border: 'var(--border)',
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
          hover: 'var(--accent-hover)',
          muted: 'var(--accent-muted)'
        },
        dark: {
          900: '#07080a',
          800: '#0e1117',
          700: '#171b23',
          600: '#232936',
          500: '#353e52'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Cabinet Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        wide: '0.04em',
        wider: '0.08em',
        widest: '0.15em'
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'marquee-slow': 'marquee 50s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 }
        }
      }
    },
  },
  plugins: [],
}
