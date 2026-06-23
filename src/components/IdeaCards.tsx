"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Sparkles, GitBranch } from "lucide-react";

interface CardItem {
  icon: React.ReactNode;
  category: string;
  dotColor: string;
  title: string;
  description: string;
  metric: string;
}

const cardsData: CardItem[] = [
  {
    icon: <Cpu className="w-5 h-5 text-black" />,
    category: "Sequence",
    dotColor: "#d6b6f6", // Sticker Purple
    title: "Cognitive DNA Mapping",
    description:
      "Break down complex, unstructured text queries into visual, sequenceable conceptual building blocks.",
    metric: "Match Accuracy: 99.4%",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-black" />,
    category: "Mutate",
    dotColor: "#2a9d99", // Sticker Teal
    title: "Synaptic Mutation",
    description:
      "Apply localized mutations to explore tangential variables and discover unexpected creative solutions.",
    metric: "Creativity Yield: +40%",
  },
  {
    icon: <GitBranch className="w-5 h-5 text-black" />,
    category: "Synthesize",
    dotColor: "#62aef0", // Sticker Sky
    title: "Evolutionary Synthesis",
    description:
      "Re-combine elements from different concept tracks into an executable structured design spec.",
    metric: "Assembly Speed: <0.5s",
  },
];

export default function IdeaCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-4 py-8">
      {cardsData.map((card, idx) => (
        <motion.div
          key={`idea-card-${idx}`}
          whileHover={{
            y: -6,
            boxShadow:
              "0 12px 30px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02)",
            borderColor: "#000000",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-white border border-[#e6e6e6] rounded-[12px] p-6 text-left flex flex-col justify-between notion-shadow transition-colors duration-200 cursor-pointer group"
        >
          <div>
            {/* Sticker Dot Palette Decorator */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: card.dotColor }}
                />
                <span className="text-xs font-semibold tracking-wider text-notionGray uppercase">
                  {card.category}
                </span>
              </div>
              <div className="p-2 bg-[#f6f5f4] rounded-lg notion-border opacity-80 group-hover:opacity-100 transition-opacity">
                {card.icon}
              </div>
            </div>

            <h3 className="text-lg font-bold text-black tracking-tight mb-2 leading-snug">
              {card.title}
            </h3>
            <p className="text-sm text-notionGray leading-relaxed font-normal mb-6">
              {card.description}
            </p>
          </div>

          <div className="pt-4 border-t border-[#f0f0f0] flex items-center justify-between mt-auto">
            <span className="text-[11px] font-mono text-notionGray">
              {card.metric}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-notionBlue group-hover:underline">
              Inspect Spec
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
