import React from "react";

export interface AppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isDark?: boolean;
  children: React.ReactNode;
}

export function AppDialog({ isOpen, onClose, title, isDark = true, children }: AppDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl transition-all ${
        isDark ? "bg-[#18181B] border-zinc-800 text-zinc-100" : "bg-white border-zinc-200 text-zinc-900"
      }`}>
        <div className="flex items-center justify-between border-b pb-3 mb-4 border-zinc-800/60">
          <h3 className="font-semibold text-base">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
