import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0E1A',
          secondary: '#0D1421',
          tertiary: '#111A2E'
        },
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          subtle: 'rgba(59,130,246,0.12)'
        },
        text: {
          primary: '#E8EDF5',
          secondary: '#8A9BB8',
          muted: '#4A5568'
        }
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)']
      }
    }
  },
  plugins: []
};

export default config;
