"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "utility" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base = "font-medium transition-all duration-200 inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-notionBlue text-white hover:bg-[#0060b8] rounded-full shadow-sm",
    secondary: "bg-white text-black border border-notionBorder hover:bg-[#f6f5f4] rounded-full notion-shadow-sm",
    utility: "bg-white text-black border border-notionBorder hover:bg-[#f6f5f4] rounded-[8px]",
    ghost: "text-notionGray hover:text-black hover:bg-black/5 rounded-[8px]",
  };

  const sizes = {
    sm: "text-[11px] px-3 py-1.5",
    md: "text-xs font-semibold px-4 py-2",
    lg: "text-sm font-semibold px-5 py-2.5",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
