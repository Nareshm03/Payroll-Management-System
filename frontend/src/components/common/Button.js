import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50',
    danger: 'bg-error text-white hover:bg-red-600',
    success: 'bg-success text-white hover:bg-green-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
