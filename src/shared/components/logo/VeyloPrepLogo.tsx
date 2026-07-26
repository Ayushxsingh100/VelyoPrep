import React from "react";

interface VeyloPrepLogoProps {
  className?: string;
}

export function VeyloPrepLogo({ className = "w-6 h-6" }: VeyloPrepLogoProps) {
  return (
    <img
      src="/pwa-192x192.png"
      alt="VeyloPrep Logo"
      className={`${className} object-contain`}
    />
  );
}
