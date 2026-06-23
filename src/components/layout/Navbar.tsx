"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/service", label: "service" },
  { href: "/resources", label: "patient resources" },
  { href: "/about", label: "about us" },
  { href: "/education", label: "education center" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-6 md:py-10 bg-gradient-to-b from-[#f1f1f1]/80 to-transparent backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-20 grid grid-cols-12 gap-x-4 md:gap-x-8 items-center">
        {/* Left: Logo */}
        <div className="col-span-6 md:col-span-3 flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C12 2 14 6 14 8C14 10 13 12 12 12C11 12 10 10 10 8C10 6 12 2 12 2Z" fill="#1a1a1a"/>
            <path d="M12 22C12 22 14 18 14 16C14 14 13 12 12 12C11 12 10 14 10 16C10 18 12 22 12 22Z" fill="#1a1a1a"/>
            <path d="M2 12C2 12 6 10 8 10C10 10 12 11 12 12C12 13 10 14 8 14C6 14 2 12 2 12Z" fill="#1a1a1a"/>
            <path d="M22 12C22 12 18 10 16 10C14 10 12 11 12 12C12 13 14 14 16 14C18 14 22 12 22 12Z" fill="#1a1a1a"/>
          </svg>
          <span className="font-display text-lg md:text-xl font-semibold tracking-tight text-[#1a1a1a]">
            mėntality
          </span>
        </div>

        {/* Center: Nav Links (desktop) */}
        <nav className="hidden md:flex col-span-6 items-center justify-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors lowercase tracking-wide"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-4">
          <Link
            href="/help"
            className="hidden md:inline text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors lowercase tracking-wide"
          >
            find help
          </Link>
          <Link
            href="/register"
            className="hidden md:inline-flex items-center gap-1.5 bg-[#1a1a1a] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors"
          >
            get started <span className="text-sm leading-none">→</span>
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative w-6 h-6 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
              className="absolute w-5 h-[1.5px] bg-zinc-800 rounded-full"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="absolute w-5 h-[1.5px] bg-zinc-800 rounded-full"
              transition={{ duration: 0.15 }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
              className="absolute w-5 h-[1.5px] bg-zinc-800 rounded-full"
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden mt-4 mx-8 bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200/60 shadow-lg overflow-hidden"
          >
            <div className="flex flex-col py-3 px-4 gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-zinc-600 hover:text-zinc-900 px-3 py-2.5 rounded-lg hover:bg-zinc-100 transition-colors lowercase"
                >
                  {l.label}
                </Link>
              ))}
              <hr className="my-2 border-zinc-200" />
              <Link
                href="/help"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-zinc-600 hover:text-zinc-900 px-3 py-2.5 rounded-lg hover:bg-zinc-100 transition-colors lowercase"
              >
                find help
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="mt-1 bg-[#1a1a1a] text-white text-sm font-semibold px-4 py-2.5 rounded-full text-center hover:bg-zinc-800 transition-colors"
              >
                get started →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
