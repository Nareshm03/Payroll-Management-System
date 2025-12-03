/**
 * PayrollPulse Design Tokens
 * Centralized theme variables for consistent styling
 */

export const tokens = {
  // Color Palette
  colors: {
    // Brand Colors
    brand: {
      blue: '#3B82F6',
      blueHover: '#2563EB',
      blueActive: '#1D4ED8',
      blueLight: '#DBEAFE',
    },
    // Semantic Colors
    semantic: {
      success: '#22C55E',
      successHover: '#16A34A',
      successBg: '#E6F7E6',
      successText: '#2E7D32',
      warning: '#F59E0B',
      warningHover: '#D97706',
      warningBg: '#FFF8E1',
      warningText: '#FF8F00',
      error: '#EF4444',
      errorHover: '#DC2626',
      errorBg: '#FFEBEE',
      errorText: '#C62828',
    },
    // Neutral Grayscale
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    // Light Mode
    light: {
      primary: '#3B82F6',
      primaryHover: '#2563EB',
      primaryActive: '#1D4ED8',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      border: '#E5E5E5',
      text: {
        primary: '#404040',
        secondary: '#737373',
        disabled: '#A3A3A3',
      },
    },
    // Dark Mode
    dark: {
      primary: '#60A5FA',
      primaryHover: '#3B82F6',
      primaryActive: '#2563EB',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      background: '#171717',
      surface: '#262626',
      border: '#404040',
      text: {
        primary: '#FAFAFA',
        secondary: '#A3A3A3',
        disabled: '#737373',
      },
    },
    // Status Colors
    status: {
      pending: { bg: '#FFF8E1', text: '#FF8F00' },
      approved: { bg: '#E6F7E6', text: '#2E7D32' },
      rejected: { bg: '#FFEBEE', text: '#C62828' },
    },
  },

  // Spacing (8px baseline grid)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      secondary: "'Lora', Georgia, serif",
    },
    fontSize: {
      h1: '2.5rem',    // 40px
      h2: '2rem',      // 32px
      h3: '1.75rem',   // 28px
      h4: '1.5rem',    // 24px
      h5: '1.25rem',   // 20px
      h6: '1rem',      // 16px
      body: '1rem',    // 16px
      small: '0.875rem', // 14px
      tiny: '0.75rem',   // 12px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Shadows
  shadows: {
    sm: '0 2px 8px rgba(0,0,0,0.08)',
    md: '0 4px 12px rgba(0,0,0,0.12)',
    lg: '0 8px 24px rgba(0,0,0,0.16)',
    dark: {
      sm: '0 4px 12px rgba(0,0,0,0.3)',
      md: '0 8px 16px rgba(0,0,0,0.4)',
      lg: '0 12px 24px rgba(0,0,0,0.5)',
    },
  },

  // Border Radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Breakpoints
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },

  // Transitions
  transitions: {
    fast: '0.15s ease',
    base: '0.2s ease',
    slow: '0.3s ease',
  },
};

export default tokens;
