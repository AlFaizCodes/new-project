"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { Menu, X, BookOpen, ArrowRight } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, user } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/generate", label: "Generate" },
    { href: "/evolve", label: "Evolve" },
    { href: "/analyze", label: "Analyze" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f6f5f4]/80 backdrop-blur-md border-b border-notionBorder notion-shadow-sm">
      <div className="max-w-6xl mx-auto h-12 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer shrink-0">
          <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center bg-white shadow-sm">
            <span className="text-[10px] font-bold">I</span>
          </div>
          <span className="font-bold text-sm tracking-tight">IdeaDNA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-notionGray">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-black transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors flex items-center gap-1">
            Docs <BookOpen className="w-3.5 h-3.5" />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button variant="utility" size="sm">
                {user?.name || "Dashboard"}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-xs font-semibold text-black hover:bg-black/5 px-3 py-1.5 rounded-md transition-all">
                Sign In
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Start Free <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5 rounded-md hover:bg-black/5">
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-notionBorder bg-white notion-shadow">
          <div className="flex flex-col px-6 py-4 gap-3">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-notionGray hover:text-black" onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="https://github.com" target="_blank" rel="noreferrer" className="text-sm text-notionGray hover:text-black flex items-center gap-1">
              Docs <BookOpen className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
