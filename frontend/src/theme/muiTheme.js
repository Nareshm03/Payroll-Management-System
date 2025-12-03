import { createTheme } from '@mui/material/styles';
import { brandConfig } from './brandConfig';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6',
      dark: '#2563EB',
      light: '#DBEAFE',
    },
    secondary: {
      main: '#8B5CF6',
    },
    error: {
      main: '#EF4444',
      dark: '#DC2626',
      light: '#FFEBEE',
    },
    warning: {
      main: '#F59E0B',
      dark: '#D97706',
      light: '#FFF8E1',
    },
    success: {
      main: '#22C55E',
      dark: '#16A34A',
      light: '#E6F7E6',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#404040',
      secondary: '#737373',
      disabled: '#A3A3A3',
    },
  },
  typography: {
    fontFamily: brandConfig.typography.fontFamily.primary,
    h1: {
      fontFamily: brandConfig.typography.fontFamily.secondary,
      fontWeight: brandConfig.typography.fontWeight.bold,
      fontSize: brandConfig.typography.fontSize.h1,
    },
    h2: {
      fontWeight: brandConfig.typography.fontWeight.semibold,
      fontSize: brandConfig.typography.fontSize.h2,
    },
    h3: {
      fontWeight: brandConfig.typography.fontWeight.semibold,
      fontSize: brandConfig.typography.fontSize.h3,
    },
    button: {
      fontWeight: brandConfig.typography.fontWeight.medium,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60A5FA',
      dark: '#2563EB',
      light: '#93C5FD',
    },
    secondary: {
      main: '#A78BFA',
    },
    error: {
      main: '#F87171',
      dark: '#DC2626',
      light: '#FEE2E2',
    },
    warning: {
      main: '#FBBF24',
      dark: '#D97706',
      light: '#FEF3C7',
    },
    success: {
      main: '#34D399',
      dark: '#059669',
      light: '#D1FAE5',
    },
    background: {
      default: '#171717',
      paper: '#262626',
    },
    text: {
      primary: '#FAFAFA',
      secondary: '#A3A3A3',
      disabled: '#737373',
    },
  },
  typography: {
    fontFamily: brandConfig.typography.fontFamily.primary,
    h1: {
      fontFamily: brandConfig.typography.fontFamily.secondary,
      fontWeight: brandConfig.typography.fontWeight.bold,
      fontSize: brandConfig.typography.fontSize.h1,
    },
    h2: {
      fontWeight: brandConfig.typography.fontWeight.semibold,
      fontSize: brandConfig.typography.fontSize.h2,
    },
    h3: {
      fontWeight: brandConfig.typography.fontWeight.semibold,
      fontSize: brandConfig.typography.fontSize.h3,
    },
    button: {
      fontWeight: brandConfig.typography.fontWeight.medium,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        },
      },
    },
  },
});
