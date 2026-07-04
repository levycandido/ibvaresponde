// @ts-nocheck
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B5FEF',
        'primary-accent': '#7C5CFF',
        'surface': '#FFFFFF',
        'surface-2': '#F1F3F9',
        'text-muted': '#64748B',
        'border-light': '#E5E7EF',
        success: '#2F9461',
        'success-soft': '#E8F8EF',
        warning: '#B98A13',
        'warning-soft': '#FFF5CC',
        error: '#D94A38',
        'error-soft': '#FFECE8',
      },
      backgroundColor: {
        'bg-primary': '#F7F8FC',
      },
      borderRadius: {
        'xl': '28px',
        'lg': '22px',
        'md': '16px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'nav-h': '78px',
      },
      fontSize: {
        'eyebrow': ['13px', { fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase' }],
      },
    },
  },
  plugins: [],
}
export default config
