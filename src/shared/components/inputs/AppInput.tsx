import React from "react";

export interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isDark?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export function AppInput({
  label,
  error,
  isDark = true,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: AppInputProps) {
  const bgStyle = isDark
    ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-blue-500"
    : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-blue-500";

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label className={`text-xs font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && <div className="absolute left-3 text-zinc-400 pointer-events-none">{leftIcon}</div>}
        <input
          className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-150 outline-none ${
            leftIcon ? "pl-9" : ""
          } ${rightIcon ? "pr-9" : ""} ${bgStyle} ${className}`}
          {...props}
        />
        {rightIcon && <div className="absolute right-3 text-zinc-400">{rightIcon}</div>}
      </div>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
}
