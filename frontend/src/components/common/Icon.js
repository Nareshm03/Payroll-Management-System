import React from 'react';

const Icon = ({ 
  component: Component, 
  size = 24, 
  strokeWidth = 2,
  className = '',
  color,
  ...props 
}) => {
  return (
    <Component
      sx={{
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        strokeWidth: strokeWidth,
        color: color,
        ...props.sx
      }}
      className={className}
      {...props}
    />
  );
};

export default Icon;
