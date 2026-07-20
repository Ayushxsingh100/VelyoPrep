import React from "react";

interface VeyloPrepLogoProps {
  className?: string;
  size?: number;
}

export const VeyloPrepLogo: React.FC<VeyloPrepLogoProps> = ({ className = "w-5 h-5", size }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sleek V shape structure in monochrome (currentColor) representing Veylo */}
      <path
        d="M25 38 L50 72"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Upward-climbing career elevation path (electric blue) */}
      <path
        d="M50 72 L80 25"
        stroke="#3b82f6"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Sleek minimalist arrow indicator representing advancement */}
      <path
        d="M62 25 H80 V43"
        stroke="#3b82f6"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
