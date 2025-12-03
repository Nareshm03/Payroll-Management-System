/**
 * Design Tokens - PayrollPulse Premium
 * Inspired by Linear, Supabase, and Stripe
 */

export const designTokens = {
  // Spacing Scale (8px baseline grid)
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '20px',
      xl: '24px',
      '2xl': '32px',
    },
    lineHeight: {
      xs: '18px',
      sm: '21px',
      base: '24px',
      lg: '30px',
      xl: '36px',
      '2xl': '48px',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Colors - Light Mode
  colors: {
    light: {
      // Accent
      accent: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
      },
      // Neutral
      neutral: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
      },
      // Semantic
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      // Backgrounds
      bg: {
        base: '#FFFFFF',
        elevated: '#F8FAFC',
        floating: '#FFFFFF',
      },
      // Text
      text: {
        primary: '#0F172A',
        secondary: '#475569',
        tertiary: '#64748B',
        disabled: '#94A3B8',
      },
      // Borders
      border: {
        primary: '#E2E8F0',
        secondary: '#CBD5E1',
        focus: '#3B82F6',
      },
    },
    // Colors - Dark Mode
    dark: {
      // Accent
      accent: {
        50: '#1E3A8A',
        100: '#1E40AF',
        500: '#60A5FA',
        600: '#3B82F6',
        700: '#2563EB',
      },
      // Neutral
      neutral: {
        50: '#0F172A',
        100: '#1E293B',
        200: '#334155',
        300: '#475569',
        400: '#64748B',
        500: '#94A3B8',
        600: '#CBD5E1',
        700: '#E2E8F0',
        800: '#F1F5F9',
        900: '#F8FAFC',
      },
      // Semantic
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
      // Backgrounds
      bg: {
        base: '#0F172A',
        elevated: '#1E293B',
        floating: '#334155',
      },
      // Text
      text: {
        primary: '#F1F5F9',
        secondary: '#CBD5E1',
        tertiary: '#94A3B8',
        disabled: '#64748B',
      },
      // Borders
      border: {
        primary: '#334155',
        secondary: '#475569',
        focus: '#60A5FA',
      },
    },
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },

  // Border Radius
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px',
  },

  // Animation
  animation: {
    duration: {
      fast: '100ms',
      base: '200ms',
      slow: '300ms',
    },
    easing: {
      easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Layout
  layout: {
    sidebar: {
      width: '240px',
      headerHeight: '68px',
      itemHeight: '36px',
      iconSize: '16px',
    },
    topbar: {
      height: '64px',
      searchWidth: '280px',
      avatarSize: '32px',
      iconSize: '20px',
    },
    content: {
      padding: '24px',
      maxWidth: '1440px',
    },
  },

  // Grid
  grid: {
    columns: 12,
    gutter: '24px',
    breakpoints: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px',
    },
  },

  // Components
  components: {
    button: {
      height: '40px',
      padding: '0 20px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 500,
    },
    input: {
      height: '40px',
      padding: '0 12px',
      borderRadius: '6px',
      fontSize: '14px',
    },
    card: {
      padding: {
        sm: '16px',
        md: '20px',
        lg: '24px',
      },
      borderRadius: '12px',
    },
    table: {
      rowHeight: '56px',
      headerHeight: '48px',
      cellPadding: '12px',
    },
  },
};

export default designTokens;
