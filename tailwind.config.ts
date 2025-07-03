import type {Config} from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/**/*.{js,jsx}' // nếu dùng js
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#2563eb', // màu xanh chủ đạo (tuỳ chọn)
        secondary: '#10b981' // màu xanh lá chủ đạo (tuỳ chọn)
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif']
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};

export default config;
