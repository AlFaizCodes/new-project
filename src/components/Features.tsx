"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    title: "AI Idea Generation",
    description: "6-agent pipeline transforms your thoughts into scored, actionable project ideas with market analysis.",
    accent: "from-blue-500/20 to-purple-500/20",
    borderAccent: "group-hover:border-blue-400/40",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: "Smart Scoring",
    description: "8-dimension analysis rates ideas on originality, feasibility, market fit, scalability, and revenue potential.",
    accent: "from-teal-500/20 to-cyan-500/20",
    borderAccent: "group-hover:border-teal-400/40",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: "Evolution Engine",
    description: "Critic and Evolver agents iteratively improve your ideas through AI-driven evolution with visual tree mapping.",
    accent: "from-purple-500/20 to-pink-500/20",
    borderAccent: "group-hover:border-purple-400/40",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
      </svg>
    ),
    title: "Code Archaeology",
    description: "6-agent pipeline analyzes existing codebases to extract hidden ideas, patterns, and innovation opportunities.",
    accent: "from-orange-500/20 to-amber-500/20",
    borderAccent: "group-hover:border-orange-400/40",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export function Features() {
  return (
    <section className="relative bg-bg-base py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block text-xs font-semibold text-ink-muted uppercase tracking-[0.2em] mb-4">
            Platform Capabilities
          </span>
          <h2 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-ink leading-tight tracking-[-0.02em]">
            Everything you need to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0075de] to-[#d6b6f6]">
              evolve your ideas
            </span>
          </h2>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardVariants}
              className="group relative"
            >
              <div
                className={`relative h-full bg-white/60 backdrop-blur-sm border border-hairline ${feature.borderAccent} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Subtle gradient background on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-ink/5 flex items-center justify-center text-ink mb-4 group-hover:bg-ink/10 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-display text-base font-semibold text-ink mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
