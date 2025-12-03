import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import tokens from '../../theme/tokens';

const EmptyState = ({ icon, title, description, actionLabel, onAction, secondaryLabel, onSecondary, statusText }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center'
      }}
      className="empty-state-animate"
    >
      <Box
        sx={{
          fontSize: '64px',
          mb: 3,
          opacity: 0.9,
          animation: 'float 3s ease-in-out infinite'
        }}
        role="img"
        aria-label="Empty state icon"
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 600,
          color: tokens.colors.light.text.primary,
          mb: 1.5,
          lineHeight: 1.4
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: '15px',
          color: tokens.colors.light.text.secondary,
          maxWidth: '480px',
          lineHeight: 1.6,
          mb: statusText ? 2 : 4
        }}
      >
        {description}
      </Typography>
      {statusText && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 3,
            px: 2,
            py: 1,
            borderRadius: '6px',
            backgroundColor: tokens.colors.brand.blueLight,
            border: `1px solid ${tokens.colors.brand.blue}20`
          }}
        >
          <Box
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: tokens.colors.semantic.success,
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          <Typography sx={{ fontSize: '13px', color: tokens.colors.light.text.secondary, fontWeight: 500 }}>
            {statusText}
          </Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {actionLabel && onAction && (
          <Button
            variant="contained"
            onClick={onAction}
            className="btn-transition"
            sx={{
              height: '44px',
              px: 3,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 500,
              backgroundColor: tokens.colors.brand.blue,
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
              '&:hover': {
                backgroundColor: tokens.colors.brand.blueDark,
                boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            {actionLabel}
          </Button>
        )}
        {secondaryLabel && onSecondary && (
          <Button
            variant="outlined"
            onClick={onSecondary}
            className="btn-transition"
            sx={{
              height: '44px',
              px: 3,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 500,
              borderColor: tokens.colors.light.border,
              color: tokens.colors.light.text.secondary,
              '&:hover': {
                borderColor: tokens.colors.brand.blue,
                backgroundColor: tokens.colors.brand.blueLight,
                color: tokens.colors.brand.blue
              }
            }}
          >
            {secondaryLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EmptyState;
