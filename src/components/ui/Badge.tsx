import React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "purple" | "teal" | "sky";
  className?: string;
}) {
  const variants = {
    default: "bg-[#f0f0f0] text-notionGray",
    purple: "bg-stickerPurple/20 text-[#391c57]",
    teal: "bg-stickerTeal/20 text-stickerTeal",
    sky: "bg-stickerSky/20 text-notionBlue",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider font-mono",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
