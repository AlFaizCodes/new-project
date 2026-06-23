import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#f6f5f4] border-t border-notionBorder py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center bg-white">
            <span className="text-[10px] font-bold">I</span>
          </div>
          <span className="font-bold text-sm tracking-tight">IdeaDNA</span>
        </div>

        <div className="flex gap-8 text-xs font-medium text-notionGray">
          <Link href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-black">
            GitHub
          </Link>
          <Link href="#" className="hover:text-black">
            Privacy
          </Link>
          <Link href="#" className="hover:text-black">
            Terms
          </Link>
        </div>

        <p className="text-[11px] text-notionGray font-mono">
          &copy; 2026 IdeaDNA AI. Structured conceptually.
        </p>
      </div>
    </footer>
  );
}
