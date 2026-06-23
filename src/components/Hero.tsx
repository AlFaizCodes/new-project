"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4";

export function Hero() {
  return (
    <section className="relative min-h-[110vh] sm:min-h-[140vh] w-full flex flex-col items-center justify-start overflow-hidden bg-bg-base">
      {/* Background Video */}
      <div className="absolute top-[15vh] sm:top-[20vh] left-0 w-full h-[95vh] sm:h-[120vh] z-0 pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-100">
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-b from-bg-base to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="max-w-7xl w-full mx-auto px-8 md:px-16 lg:px-20 relative z-10 grid grid-cols-12 gap-x-4 md:gap-x-8 pt-[25vh] sm:pt-[30vh]">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-sans text-[clamp(2.5rem,8vw,6rem)] leading-[1.05] tracking-[-0.03em] font-bold text-ink"
          >
            <span className="text-ink">Remix: Mentality offers</span>
            <br />
            <span className="text-ink-secondary">information</span>
            <br />
            <span className="text-ink-secondary">and resources to help you manage</span>
            <br />
            <span className="text-ink-secondary">
              your{' '}
              <span className="w-[16px] md:w-[42px] lg:w-[62px] border-[2px] border-ink rounded-full inline-flex items-center justify-center align-middle mx-1 md:mx-2 relative" style={{ height: '1em', top: '-0.05em' }}>
                <span className="w-2 h-2 bg-ink rounded-full inline-block" />
              </span>{' '}
              mental wellbeing.
            </span>
          </motion.h1>

          {/* Search Pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 md:mt-10 max-w-md"
          >
            <div className="bg-surface rounded-[6px] border border-hairline p-1 pl-4 flex items-center shadow-sm">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="bg-transparent border-none outline-none text-sm text-ink placeholder-ink-muted w-full"
              />
              <button className="bg-ink text-white w-9 h-9 rounded-full flex items-center justify-center shrink-0 hover:bg-ink-secondary transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex items-center gap-3"
          >
            <Link
              href="/register"
              className="bg-notionBlue text-white hover:bg-[#0060b8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all inline-flex items-center gap-1.5"
            >
              Start Free <span className="text-sm leading-none">→</span>
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-ink-secondary hover:text-ink transition-colors px-4 py-2.5"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Edge Anchors */}
      <div className="hidden md:block absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-10">
        <div className="bg-surface/70 backdrop-blur-md border border-hairline rounded-full px-3 py-1.5 text-xs font-medium text-ink-secondary shadow-sm">
          <span className="text-ink">pl</span>
          <span className="mx-1.5 text-hairline">—</span>
          <span>en</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-8 md:left-12 z-10 text-xs text-ink-muted font-medium">
        2024
      </div>

      <div className="absolute bottom-6 right-8 md:right-12 z-10 text-xs text-ink-muted font-medium">
        mental health tools
      </div>
    </section>
  );
}
