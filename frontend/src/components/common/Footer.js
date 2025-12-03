import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 6,
        borderTop: '1px solid #E5E5E5',
        backgroundColor: '#FFFFFF'
      }}
    >
      <Typography
        sx={{
          fontSize: '14px',
          color: '#737373',
          textAlign: 'center'
        }}
      >
        PayrollPulse © 2025 — Internal HR System
      </Typography>
    </Box>
  );
};

export default Footer;
