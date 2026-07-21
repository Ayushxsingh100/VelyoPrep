import React from "react";

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  isDark?: boolean;
  action?: React.ReactNode;
}

export function AppHeader({ title, subtitle, isDark = true, action }: AppHeaderProps) {
  return (
    <header className={`px-4 py-3 border-b flex items-center justify-between ${
      isDark ? "bg-[#18181B]/80 border-zinc-800 text-white" : "bg-white/80 border-zinc-200 text-zinc-900"
    }`}>
      <div>
        <h1 className="text-base font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}
