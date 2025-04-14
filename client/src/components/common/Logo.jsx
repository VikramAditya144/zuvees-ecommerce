// src/components/common/Logo.jsx
import React from 'react';

const Logo = ({ className = '' }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="8" fill="#660E36" />
      <path
        d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20Z"
        fill="white"
      />
      <path
        d="M20 15L22.5 19.5H17.5L20 15Z"
        fill="#660E36"
      />
      <path
        d="M20 25L17.5 20.5H22.5L20 25Z"
        fill="#660E36"
      />
      <path
        d="M15 20L19.5 17.5V22.5L15 20Z"
        fill="#660E36"
      />
      <path
        d="M25 20L20.5 22.5V17.5L25 20Z"
        fill="#660E36"
      />
    </svg>
  );
};

export default Logo;