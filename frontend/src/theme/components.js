/**
 * PayrollPulse Component Style Specifications
 * Standardized component styling rules
 */

import tokens from './tokens';

export const componentStyles = {
  // Buttons
  button: {
    primary: {
      height: '40px',
      padding: '12px 24px',
      borderRadius: tokens.borderRadius.md,
      fontSize: tokens.typography.fontSize.body,
      fontWeight: tokens.typography.fontWeight.medium,
      textTransform: 'none',
      boxShadow: tokens.shadows.sm,
      transition: tokens.transitions.base,
    },
    secondary: {
      height: '40px',
      padding: '12px 24px',
      borderRadius: tokens.borderRadius.md,
      fontSize: tokens.typography.fontSize.body,
      fontWeight: tokens.typography.fontWeight.regular,
      textTransform: 'none',
    },
    small: {
      height: '32px',
      padding: '8px 16px',
      fontSize: tokens.typography.fontSize.small,
    },
    large: {
      height: '48px',
      padding: '16px 32px',
      fontSize: tokens.typography.fontSize.h6,
    },
  },

  // Cards
  card: {
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.lg,
    boxShadow: tokens.shadows.sm,
    border: `1px solid ${tokens.colors.light.border}`,
    transition: tokens.transitions.base,
  },

  // Tables
  table: {
    container: {
      borderRadius: tokens.borderRadius.md,
      border: `1px solid ${tokens.colors.light.border}`,
      overflow: 'hidden',
    },
    header: {
      backgroundColor: tokens.colors.light.surface,
      fontSize: tokens.typography.fontSize.tiny,
      fontWeight: tokens.typography.fontWeight.semibold,
      textTransform: 'uppercase',
      padding: '12px 16px',
      color: tokens.colors.light.text.secondary,
    },
    row: {
      height: '56px',
      borderBottom: `1px solid ${tokens.colors.light.border}`,
      transition: tokens.transitions.base,
      hover: {
        backgroundColor: '#f5f5f5',
      },
    },
    cell: {
      fontSize: tokens.typography.fontSize.small,
      padding: '12px 16px',
      color: tokens.colors.light.text.primary,
    },
  },

  // Sidebar/Navigation
  sidebar: {
    width: '240px',
    backgroundColor: tokens.colors.light.surface,
    borderRight: `1px solid ${tokens.colors.light.border}`,
    item: {
      height: '40px',
      padding: '8px 16px',
      borderRadius: tokens.borderRadius.md,
      fontSize: tokens.typography.fontSize.small,
      fontWeight: tokens.typography.fontWeight.medium,
      transition: tokens.transitions.base,
      hover: {
        backgroundColor: 'rgba(26, 188, 156, 0.1)',
      },
      active: {
        backgroundColor: tokens.colors.light.secondary,
        color: '#FFFFFF',
      },
    },
    nested: {
      paddingLeft: tokens.spacing.xl,
    },
  },

  // Modals
  modal: {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      maxWidth: '600px',
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.lg,
      boxShadow: tokens.shadows.lg,
      backgroundColor: tokens.colors.light.background,
    },
  },

  // Badges/Status Tags
  badge: {
    padding: '4px 12px',
    borderRadius: tokens.borderRadius.md,
    fontSize: tokens.typography.fontSize.tiny,
    fontWeight: tokens.typography.fontWeight.medium,
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
  },

  // Form Elements
  input: {
    height: '40px',
    padding: '0 12px',
    borderRadius: tokens.borderRadius.md,
    fontSize: tokens.typography.fontSize.small,
    border: `1px solid ${tokens.colors.light.border}`,
    transition: tokens.transitions.base,
    focus: {
      borderColor: tokens.colors.light.secondary,
      outline: 'none',
      boxShadow: `0 0 0 2px rgba(26, 188, 156, 0.2)`,
    },
  },
};

export default componentStyles;
