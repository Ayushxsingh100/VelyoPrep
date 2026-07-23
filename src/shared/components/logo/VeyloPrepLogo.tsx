import React from "react";
import iconUrl from "@/media/icon.png";

interface VeyloPrepLogoProps {
  className?: string;
}

export function VeyloPrepLogo({ className = "w-6 h-6" }: VeyloPrepLogoProps) {
  return (
    <img
      src={iconUrl}
      alt="VeyloPrep Logo"
      className={`${className} object-contain`}
    />
  );
}
