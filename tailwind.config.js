/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Changed to a modern Deep Violet theme
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed', // Main brand color
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Changed to a sleek Emerald theme
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        success: {
          50: '#F0FDF4',
          500: '#22C55E',
          700: '#15803D',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          700: '#B45309',
        },
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          700: '#B91C1C',
        },
      },
      fontFamily: {
        // Updated to use the new Outfit font we added in index.html
        sans: ['Outfit', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};


// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50: '#EFF6FF',
//           100: '#DBEAFE',
//           200: '#BFDBFE',
//           300: '#93C5FD',
//           400: '#60A5FA',
//           500: '#3B82F6',
//           600: '#2563EB',
//           700: '#1D4ED8',
//           800: '#1E40AF',
//           900: '#1E3A8A',
//           950: '#172554',
//         },
//         secondary: {
//           50: '#F0FDFA',
//           100: '#CCFBF1',
//           200: '#99F6E4',
//           300: '#5EEAD4',
//           400: '#2DD4BF',
//           500: '#14B8A6',
//           600: '#0D9488',
//           700: '#0F766E',
//           800: '#115E59',
//           900: '#134E4A',
//           950: '#042F2E',
//         },
//         accent: {
//           50: '#FFFBEB',
//           100: '#FEF3C7',
//           200: '#FDE68A',
//           300: '#FCD34D',
//           400: '#FBBF24',
//           500: '#F59E0B',
//           600: '#D97706',
//           700: '#B45309',
//           800: '#92400E',
//           900: '#78350F',
//           950: '#451A03',
//         },
//         success: {
//           50: '#F0FDF4',
//           500: '#22C55E',
//           700: '#15803D',
//         },
//         warning: {
//           50: '#FFFBEB',
//           500: '#F59E0B',
//           700: '#B45309',
//         },
//         error: {
//           50: '#FEF2F2',
//           500: '#EF4444',
//           700: '#B91C1C',
//         },
//       },
//       fontFamily: {
//         sans: ['Inter var', 'sans-serif'],
//       },
//       animation: {
//         'fade-in': 'fadeIn 0.5s ease-in-out',
//         'slide-in': 'slideIn 0.3s ease-out',
//       },
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         slideIn: {
//           '0%': { transform: 'translateY(10px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//       },
//     },
//   },
//   plugins: [],
// };