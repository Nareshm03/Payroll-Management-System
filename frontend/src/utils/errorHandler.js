import { showToast } from './toast';

export const handleApiError = (error, context = 'operation') => {
  // Network errors
  if (!error.response) {
    showToast.error('Network connection error. Please check your internet and try again.');
    return;
  }

  const status = error.response.status;
  const detail = error.response.data?.detail;

  // Server errors (5xx)
  if (status >= 500) {
    showToast.error(`Something went wrong while ${context}. Please try again.`);
    return;
  }

  // Client errors (4xx)
  if (status >= 400 && status < 500) {
    if (detail) {
      showToast.error(detail);
    } else {
      showToast.error('Invalid request. Please check your inputs and try again.');
    }
    return;
  }

  // Fallback
  showToast.error(`Failed to ${context}. Please try again.`);
};

export const validateField = (name, value, rules = {}) => {
  if (rules.required && !value) {
    return rules.requiredMessage || `${name} is required`;
  }

  if (rules.min !== undefined && parseFloat(value) < rules.min) {
    return rules.minMessage || `Must be at least ${rules.min}`;
  }

  if (rules.minValue !== undefined && parseFloat(value) <= rules.minValue) {
    return rules.minValueMessage || `Must be greater than ${rules.minValue}`;
  }

  if (rules.email && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return rules.emailMessage || 'Invalid email address';
    }
  }

  if (rules.minLength && value.length < rules.minLength) {
    return rules.minLengthMessage || `Must be at least ${rules.minLength} characters`;
  }

  if (rules.url && value) {
    try {
      new URL(value);
    } catch {
      return rules.urlMessage || 'Invalid URL format';
    }
  }

  return '';
};
