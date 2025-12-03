/**
 * Unified Design System Tokens
 * PayrollPulse - Production Ready
 */

export const unifiedTokens = {
  // 1. Spacing Scale (8-point system)
  spacing: {
    xs: '4px',
    s: '8px',
    m: '16px',
    l: '24px',
    xl: '32px',
    xxl: '48px'
  },

  // 2. Typography Scale
  typography: {
    h1: {
      size: '32px',
      lineHeight: '40px',
      weight: 600
    },
    h2: {
      size: '24px',
      lineHeight: '32px',
      weight: 600
    },
    body: {
      size: '16px',
      lineHeight: '24px',
      weight: 400
    },
    caption: {
      size: '12px',
      lineHeight: '16px',
      weight: 400
    },
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },

  // 3. Color Token Set
  colors: {
    // Brand Colors
    brand: {
      blue: '#3B82F6',
      blueHover: '#2563EB',
      blueActive: '#1D4ED8',
      blueLight: '#DBEAFE',
      blueDisabled: '#93C5FD'
    },
    // Semantic Colors
    semantic: {
      success: '#22C55E',
      successHover: '#16A34A',
      successActive: '#15803D',
      successBg: '#E6F7E6',
      successText: '#2E7D32',
      warning: '#F59E0B',
      warningHover: '#D97706',
      warningActive: '#B45309',
      warningBg: '#FFF8E1',
      warningText: '#FF8F00',
      error: '#EF4444',
      errorHover: '#DC2626',
      errorActive: '#B91C1C',
      errorBg: '#FFEBEE',
      errorText: '#C62828'
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
      900: '#171717'
    },
    light: {
      primary: {
        base: '#3B82F6',
        hover: '#2563EB',
        active: '#1D4ED8',
        disabled: '#93C5FD'
      },
      surface: {
        background: '#FFFFFF',
        foreground: '#F5F5F5'
      },
      border: {
        default: '#E5E5E5',
        subtle: '#F5F5F5'
      },
      success: {
        base: '#22C55E',
        hover: '#16A34A',
        active: '#15803D',
        bg: '#E6F7E6',
        text: '#2E7D32'
      },
      warning: {
        base: '#F59E0B',
        hover: '#D97706',
        active: '#B45309',
        bg: '#FFF8E1',
        text: '#FF8F00'
      },
      danger: {
        base: '#EF4444',
        hover: '#DC2626',
        active: '#B91C1C',
        bg: '#FFEBEE',
        text: '#C62828'
      },
      text: {
        primary: '#404040',
        secondary: '#737373',
        tertiary: '#A3A3A3',
        disabled: '#D4D4D4'
      }
    },
    dark: {
      primary: {
        base: '#60A5FA',
        hover: '#3B82F6',
        active: '#2563EB',
        disabled: '#1E3A8A'
      },
      surface: {
        background: '#171717',
        foreground: '#262626'
      },
      border: {
        default: '#404040',
        subtle: '#262626'
      },
      success: {
        base: '#34D399',
        hover: '#10B981',
        active: '#059669',
        bg: '#064E3B',
        text: '#34D399'
      },
      warning: {
        base: '#FBBF24',
        hover: '#F59E0B',
        active: '#D97706',
        bg: '#78350F',
        text: '#FBBF24'
      },
      danger: {
        base: '#F87171',
        hover: '#EF4444',
        active: '#DC2626',
        bg: '#7F1D1D',
        text: '#F87171'
      },
      text: {
        primary: '#FAFAFA',
        secondary: '#A3A3A3',
        tertiary: '#737373',
        disabled: '#525252'
      }
    }
  },

  // 4. Component Specifications
  components: {
    button: {
      primary: {
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 500,
        shadow: '0 1px 3px rgba(0,0,0,0.12)'
      },
      subtle: {
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 500
      },
      ghost: {
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 500
      }
    },
    input: {
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '16px',
      border: '1px solid'
    },
    modal: {
      overlayOpacity: 0.5,
      contentPadding: '24px',
      borderRadius: '12px',
      maxWidth: '600px',
      shadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
    },
    table: {
      headerPadding: '12px 16px',
      rowHeight: '56px',
      cellPadding: '12px 16px',
      borderColor: '#F0F0F0'
    }
  },

  // Transitions
  transitions: {
    fast: '0.15s ease',
    base: '0.2s ease',
    slow: '0.3s ease'
  },

  // Shadows
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
    lg: '0 8px 24px rgba(0,0,0,0.06)'
  },

  // Breakpoints
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px'
  }
};

export default unifiedTokens;
