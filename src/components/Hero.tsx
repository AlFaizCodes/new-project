"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        {/* Top gradient fade from bg-base */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-bg-base via-bg-base/80 to-transparent" />
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-bg-base via-bg-base/70 to-transparent" />
        {/* Overall dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-6xl w-full mx-auto px-6 md:px-12 lg:px-16 pt-[18vh] sm:pt-[22vh] pb-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div {...fadeUp(0)} className="mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-white/90 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              AI-Powered Mental Health Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            {...fadeUp(0.1)}
            className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.02em] font-bold text-white"
          >
            Your mind deserves
            <br />
            <span className="text-brand-green">better tools.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-base md:text-lg text-white/75 leading-relaxed max-w-lg"
          >
            Information and resources to help you manage your mental wellbeing — powered by AI that understands you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div {...fadeUp(0.3)} className="mt-10 flex items-center gap-4">
            <Link
              href="/register"
              className="bg-white text-ink hover:bg-brand-green hover:text-black text-sm font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300 inline-flex items-center gap-2 group"
            >
              Start Free
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div {...fadeUp(0.4)} className="mt-7 flex items-center gap-4">
            <Link
              href="/register"
              className="bg-white text-ink hover:bg-brand-green hover:text-black text-sm font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300 inline-flex items-center gap-2 group"
            >
              Start Free
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors px-4 py-3 border border-white/20 rounded-full backdrop-blur-sm hover:bg-white/10"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Edge Anchors */}
      <div className="hidden md:block absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-20">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-xs font-medium text-white/70 shadow-sm">
          <span className="text-white">pl</span>
          <span className="mx-1.5 text-white/30">—</span>
          <span>en</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-8 md:left-12 z-20 text-xs text-white/50 font-medium">
        2024
      </div>

      <div className="absolute bottom-6 right-8 md:right-12 z-20 text-xs text-white/50 font-medium">
        mental health tools
      </div>
    </section>
  );
}
