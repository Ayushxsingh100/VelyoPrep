import React from "react";

export interface AppLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function AppLoader({ size = "md", text }: AppLoaderProps) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-2">
      <div className={`${sizeMap[size]} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`} />
      {text && <span className="text-xs text-zinc-400 font-mono">{text}</span>}
    </div>
  );
}
