import React from "react";

export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  isDark?: boolean;
  padded?: boolean;
  bordered?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function AppCard({
  isDark = true,
  padded = true,
  bordered = true,
  className = "",
  children,
  ...props
}: AppCardProps) {
  const bgStyle = isDark ? "bg-[#18181B]" : "bg-white";
  const borderStyle = bordered
    ? isDark
      ? "border border-zinc-800"
      : "border border-zinc-200"
    : "";
  const paddingStyle = padded ? "p-4" : "";

  return (
    <div
      className={`rounded-xl transition-colors duration-150 ${bgStyle} ${borderStyle} ${paddingStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
