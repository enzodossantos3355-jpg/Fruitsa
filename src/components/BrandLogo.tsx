import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="64" height="64" rx="14" fill="#172033" />
        <path
          d="M14 23V16C14 14.8954 14.8954 14 16 14H23"
          stroke="#E2E8F0"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M50 23V16C50 14.8954 49.1046 14 48 14H41"
          stroke="#E2E8F0"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M14 41V48C14 49.1046 14.8954 50 16 50H23"
          stroke="#E2E8F0"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M50 41V48C50 49.1046 49.1046 50 48 50H41"
          stroke="#E2E8F0"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="32" cy="34" r="11" fill="#2563EB" />
        <path
          d="M32 21.5C32 18.2 34.6 15.6 38.5 15.5C38.4 19.2 35.8 21.5 32 21.5Z"
          fill="#0EA5E9"
        />
        <path d="M29.5 29.5L36.8 34L29.5 38.5V29.5Z" fill="#FFFFFF" />
      </svg>
      {!compact && (
        <span className="text-[17px] font-semibold tracking-[-0.02em] text-[#172033]">
          Fruit<span className="text-[#2563EB]">Studio</span>
        </span>
      )}
    </span>
  );
};
