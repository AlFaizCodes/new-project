"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 10000, suffix: "+", label: "Ideas Generated" },
  { value: 2500, suffix: "+", label: "Projects Created" },
  { value: 8, suffix: "", label: "Scoring Dimensions" },
  { value: 99, suffix: "%", label: "Uptime Reliability" },
];

function AnimatedCounter({ value, suffix, label }: StatItem) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
    return num.toString();
  };

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-ink tracking-tight"
      >
        {formatNumber(count)}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0075de] to-[#d6b6f6]">
          {suffix}
        </span>
      </motion.div>
      <p className="mt-1 text-sm text-ink-muted font-medium">{label}</p>
    </div>
  );
}

export function Stats() {
  return (
    <section className="relative bg-bg-base py-20 md:py-28 overflow-hidden">
      {/* Subtle decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-hairline to-transparent" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <AnimatedCounter key={stat.label} {...stat} />
          ))}
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-hairline rounded-2xl px-6 py-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0075de] to-[#d6b6f6] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <p className="text-sm text-ink-secondary leading-relaxed text-left">
              <span className="font-semibold text-ink">Built with care.</span>{" "}
              Every idea goes through our multi-agent AI pipeline for maximum quality.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
