import React from 'react';

const Logo = ({ className = '', size = 32, theme = 'light' }) => {
  const primary = theme === 'dark' ? '#FAFAFA' : '#0F172A';
  const accent = '#3B82F6'; // Premium blue

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M20 0L37.3205 10V30L20 40L2.67949 30V10L20 0Z" fill={accent} fillOpacity="0.1"/>
      <path d="M20 5L33 12.5V27.5L20 35L7 27.5V12.5L20 5Z" stroke={primary} strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M20 13L28 17.5V25L20 29L12 25V17.5L20 13Z" fill={accent}/>
    </svg>
  );
};

export default Logo;
