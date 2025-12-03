export const iconConfig = {
  sizes: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40
  },
  strokeWidth: 2,
  spacing: {
    text: 8,
    button: 8,
    card: 12
  },
  colors: {
    primary: '#1976D2',
    secondary: '#64748B',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  }
};

export const getIconStyle = (size = 'md', variant = 'outlined') => ({
  fontSize: iconConfig.sizes[size],
  width: iconConfig.sizes[size],
  height: iconConfig.sizes[size],
  strokeWidth: variant === 'outlined' ? iconConfig.strokeWidth : undefined
});
