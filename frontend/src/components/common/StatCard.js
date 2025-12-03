import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import AnimatedCounter from './AnimatedCounter';
import { CircularProgress } from '@mui/material';

const StatCard = ({ title, value, icon, color = 'primary', trend, trendValue, updated, loading = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorMap = {
    primary: { icon: '#3B82F6', bg: 'rgba(59, 130, 246, 0.05)' },
    success: { icon: '#22C55E', bg: 'rgba(34, 197, 94, 0.05)' },
    warning: { icon: '#F59E0B', bg: 'rgba(245, 158, 11, 0.05)' },
    error: { icon: '#EF4444', bg: 'rgba(239, 68, 68, 0.05)' }
  };

  return (
    <div 
      role="article"
      aria-label={`${title}: ${value}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: isHovered ? '0 12px 32px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.06)',
        transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '120px',
        background: colorMap[color].bg,
        borderRadius: '50%',
        transform: 'translate(40%, -40%)',
        transition: 'transform 0.3s ease',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          color: colorMap[color].icon,
          background: colorMap[color].bg,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
        }}>
          {React.cloneElement(icon, { sx: { fontSize: 28 } })}
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '6px', background: trend === 'up' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
            {trend === 'up' ? (
              <TrendingUp sx={{ fontSize: 16, color: '#22C55E' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: '#EF4444' }} />
            )}
            <span style={{ fontSize: '12px', fontWeight: 600, color: trend === 'up' ? '#22C55E' : '#EF4444' }}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '8px', lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </p>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '36px' }}>
            <CircularProgress size={24} thickness={4} />
            <span style={{ fontSize: '16px', color: 'var(--text-tertiary)' }}>Loading...</span>
          </div>
        ) : (
          <p style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1 }}>
            {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
          </p>
        )}
        {updated && (
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
            {updated}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
