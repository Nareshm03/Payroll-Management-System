import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimatedCounter from '../AnimatedCounter';

describe('AnimatedCounter Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders initial value of 0', () => {
    render(<AnimatedCounter value={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('animates to target value', async () => {
    const { rerender } = render(<AnimatedCounter value={0} duration={500} />);
    
    rerender(<AnimatedCounter value={100} duration={500} />);
    
    await waitFor(() => {
      const element = screen.getByText(/\d+/);
      expect(parseInt(element.textContent)).toBeGreaterThan(0);
    }, { timeout: 1000 });
  });

  test('formats numbers with locale string', () => {
    render(<AnimatedCounter value={1000} />);
    expect(screen.getByText(/1,000/)).toBeInTheDocument();
  });

  test('renders with prefix and suffix', () => {
    render(<AnimatedCounter value={50} prefix="$" suffix="%" />);
    expect(screen.getByText(/\$.*%/)).toBeInTheDocument();
  });

  test('has aria-live attribute for accessibility', () => {
    const { container } = render(<AnimatedCounter value={100} />);
    const span = container.querySelector('span');
    expect(span).toHaveAttribute('aria-live', 'polite');
  });

  test('handles value changes smoothly', async () => {
    const { rerender } = render(<AnimatedCounter value={50} />);
    
    rerender(<AnimatedCounter value={100} />);
    rerender(<AnimatedCounter value={75} />);
    
    await waitFor(() => {
      expect(screen.getByText(/\d+/)).toBeInTheDocument();
    });
  });
});
