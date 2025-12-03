import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatCard from '../StatCard';
import { People } from '@mui/icons-material';

describe('StatCard Component', () => {
  const defaultProps = {
    title: 'Total Employees',
    value: 150,
    icon: <People />,
    color: 'primary'
  };

  test('renders stat card with correct title and value', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByLabelText(/Total Employees: 150/i)).toBeInTheDocument();
  });

  test('displays loading state correctly', () => {
    render(<StatCard {...defaultProps} loading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('shows trend indicator when provided', () => {
    render(<StatCard {...defaultProps} trend="up" trendValue="5 pending" />);
    expect(screen.getByText('5 pending')).toBeInTheDocument();
  });

  test('displays updated timestamp when provided', () => {
    render(<StatCard {...defaultProps} updated="Updated 10:30 AM" />);
    expect(screen.getByText('Updated 10:30 AM')).toBeInTheDocument();
  });

  test('applies hover effects on mouse enter', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    const card = container.firstChild;
    
    fireEvent.mouseEnter(card);
    expect(card).toHaveStyle({ transform: expect.stringContaining('translateY') });
  });

  test('handles different color variants', () => {
    const colors = ['primary', 'success', 'warning', 'error'];
    colors.forEach(color => {
      const { rerender } = render(<StatCard {...defaultProps} color={color} />);
      expect(screen.getByLabelText(/Total Employees/i)).toBeInTheDocument();
      rerender(<StatCard {...defaultProps} color={color} />);
    });
  });

  test('renders with string value', () => {
    render(<StatCard {...defaultProps} value="$5,000" />);
    expect(screen.getByText('$5,000')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<StatCard {...defaultProps} />);
    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('aria-label');
  });
});
