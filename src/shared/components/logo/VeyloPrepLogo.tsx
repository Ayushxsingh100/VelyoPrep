import React from "react";

interface VeyloPrepLogoProps {
  className?: string;
}

export function VeyloPrepLogo({ className = "w-6 h-6" }: VeyloPrepLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="vpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* Dynamic V Shield Logo */}
      <path
        d="M20 20 L50 85 L80 20 L62 20 L50 58 L38 20 Z"
        fill="url(#vpGrad)"
      />
      <circle cx="50" cy="22" r="6" fill="#60A5FA" />
    </svg>
  );
}
