import React from "react";

export interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  isDark?: boolean;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function AppButton({
  variant = "primary",
  size = "md",
  isLoading = false,
  isDark = true,
  className = "",
  disabled,
  children,
  ...props
}: AppButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  }[size];

  let variantStyles = "";
  switch (variant) {
    case "primary":
      variantStyles = "bg-blue-600 hover:bg-blue-500 text-white shadow-sm active:scale-[0.98]";
      break;
    case "secondary":
      variantStyles = isDark
        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700"
        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300";
      break;
    case "ghost":
      variantStyles = isDark
        ? "bg-transparent hover:bg-zinc-800/60 text-zinc-300"
        : "bg-transparent hover:bg-zinc-200/60 text-zinc-700";
      break;
    case "danger":
      variantStyles = "bg-red-600 hover:bg-red-500 text-white shadow-sm active:scale-[0.98]";
      break;
    case "outline":
      variantStyles = isDark
        ? "border border-zinc-700 text-zinc-200 hover:bg-zinc-800/40"
        : "border border-zinc-300 text-zinc-800 hover:bg-zinc-100";
      break;
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <svg className="w-4 h-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
