import React from 'react';
import pucMinasLogo from 'figma:asset/d855a05773ff405761192988e146ea95e05b8e40.png';

interface PUCMinasLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  alt?: string;
}

const sizeMap = {
  xs: '40px',
  sm: '60px',
  md: '80px',
  lg: '120px',
  xl: '160px',
  '2xl': '200px',
};

export function PUCMinasLogo({ 
  size = 'md', 
  className = '',
  alt = 'Brasão PUC Minas'
}: PUCMinasLogoProps) {
  return (
    <img 
      src={pucMinasLogo} 
      alt={alt}
      className={className}
      style={{ 
        width: sizeMap[size], 
        height: 'auto',
        objectFit: 'contain'
      }}
    />
  );
}
