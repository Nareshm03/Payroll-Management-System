import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: 'var(--text-secondary)',
          transition: 'all 200ms ease-out',
          '&:hover': {
            transform: 'rotate(180deg)',
            color: 'var(--text-primary)',
          },
        }}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
