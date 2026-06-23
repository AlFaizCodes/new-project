"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-semibold text-black">{label}</label>}
      <input
        className={cn(
          "bg-white border border-notionBorder rounded-[4px] px-2.5 py-2 text-sm text-black placeholder-notionGray outline-none transition-all focus:border-notionBlue focus:notion-shadow-sm",
          error && "border-red-400",
          className
        )}
        {...props}
      />
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}
