"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Node, Edge } from "reactflow";
import {
  Sparkles,
  Search,
  Dna,
  BookOpen,
  ArrowRight,
  Maximize2,
  Sliders,
  CheckCircle2,
} from "lucide-react";

// Dynamically import client components to prevent Next.js SSR hydration mismatches
const DnaCanvas = dynamic(() => import("@/components/DnaCanvas"), {
  ssr: false,
});
const EvolutionTree = dynamic(() => import("@/components/EvolutionTree"), {
  ssr: false,
});
const IdeaCards = dynamic(() => import("@/components/IdeaCards"), {
  ssr: false,
});

export default function Home() {
  const [triggerMutation, setTriggerMutation] = useState(0);
  const [problemInput, setProblemInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // DNA configuration parameters altered by sliders
  const [dnaParameters, setDnaParameters] = useState({
    creativity: 0.4,
    logic: 0.6,
    mutationRate: 0.35,
  });

  // Concept evolution tree state
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "root",
      type: "customNode",
      position: { x: 180, y: 60 },
      data: {
        title: "Maritime Shipping Carbon",
        desc: "Goal: Decarbonize intercontinental cargo routes",
        type: "Input Node",
        dotColor: "#d6b6f6",
      },
    },
    {
      id: "node-2",
      type: "customNode",
      position: { x: 30, y: 190 },
      data: {
        title: "Rigid Wing PV Sails",
        desc: "Deploy automated solid sails lined with solar cells",
        type: "Mutation A",
        dotColor: "#2a9d99",
      },
    },
    {
      id: "node-3",
      type: "customNode",
      position: { x: 330, y: 190 },
      data: {
        title: "Liquid Hydrogen Fuel Cells",
        desc: "Auxiliary power supply using cryogenic H2 storage",
        type: "Mutation B",
        dotColor: "#62aef0",
      },
    },
    {
      id: "node-4",
      type: "customNode",
      position: { x: 180, y: 320 },
      data: {
        title: "Helios Eco-Freighter",
        desc: "Optimal synergy of wind, solar, and hydrogen energy systems",
        type: "Synthesis",
        dotColor: "#0075de",
      },
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    {
      id: "e1-2",
      source: "root",
      target: "node-2",
      animated: true,
      style: { stroke: "#e6e6e6" },
    },
    {
      id: "e1-3",
      source: "root",
      target: "node-3",
      animated: true,
      style: { stroke: "#e6e6e6" },
    },
    {
      id: "e2-4",
      source: "node-2",
      target: "node-4",
      animated: true,
      style: { stroke: "#0075de" },
    },
    {
      id: "e3-4",
      source: "node-3",
      target: "node-4",
      animated: true,
      style: { stroke: "#0075de" },
    },
  ]);

  // Handle Idea Generation and Particle mutation trigger
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemInput.trim() || isGenerating) return;

    setIsGenerating(true);
    
    // Trigger particle explosion inside 3D Canvas
    setTriggerMutation((prev) => prev + 1);

    setTimeout(() => {
      // Create a new child mutation node in React Flow
      const newNodeId = `node-custom-${Date.now()}`;
      
      // Determine the position offset of the new node
      const currentCustomCount = nodes.filter((n) => n.id.startsWith("node-custom")).length;
      const xOffset = currentCustomCount % 2 === 0 ? 30 : 330;
      const yOffset = 450 + Math.floor(currentCustomCount / 2) * 110;

      const newNode: Node = {
        id: newNodeId,
        type: "customNode",
        position: { x: xOffset, y: yOffset },
        data: {
          title: problemInput,
          desc: `Engineered from Helios core under logic coef ${dnaParameters.logic.toFixed(2)}.`,
          type: `Mutation #${triggerMutation + 1}`,
          dotColor: "#0075de",
        },
      };

      // Connect new node from the synthesis base (node-4)
      const newEdge: Edge = {
        id: `e4-custom-${newNodeId}`,
        source: "node-4",
        target: newNodeId,
        animated: true,
        style: { stroke: "#0075de", strokeWidth: 1.5 },
      };

      setNodes((prev) => [...prev, newNode]);
      setEdges((prev) => [...prev, newEdge]);
      setProblemInput("");
      setIsGenerating(false);
    }, 850);
  };

  const handleSliderChange = (param: string, value: number) => {
    setDnaParameters((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  return (
    <div className="relative min-h-screen text-black select-none antialiased">
      {/* 3D Background Canvas */}
      <DnaCanvas triggerMutation={triggerMutation} dnaParameters={dnaParameters} />

      {/* Premium Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#f6f5f4]/80 backdrop-blur-md border-b border-notionBorder notion-shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto h-12 px-6 flex items-center justify-between">
          {/* Logo / Wordmark */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center bg-white shadow-sm">
              <span className="text-[10px] font-bold">I</span>
            </div>
            <span className="font-bold text-sm tracking-tight">IdeaDNA</span>
            <span className="bg-[#f0f0f0] text-[9px] font-semibold text-notionGray px-1.5 py-0.5 rounded uppercase font-mono">
              v1.0
            </span>
          </div>

          {/* Centered Navigation Menu */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-notionGray">
            <a href="#canvas-section" className="hover:text-black transition-colors">
              3D Sandbox
            </a>
            <a href="#evolution-section" className="hover:text-black transition-colors">
              Evolution Tree
            </a>
            <a href="#features-section" className="hover:text-black transition-colors">
              Framework
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors flex items-center gap-1">
              Docs <BookOpen className="w-3.5 h-3.5" />
            </a>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <button className="text-xs font-semibold text-black hover:bg-black/5 px-3 py-1.5 rounded-md transition-all">
              Sign In
            </button>
            <a
              href="#generate-section"
              className="bg-notionBlue text-white hover:bg-[#0060b8] text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1 transition-all"
            >
              Start Free <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section Container */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Off-Center Spacious Value Proposition Header */}
        <section id="hero" className="w-full text-left md:max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-notionBorder text-xs text-notionGray notion-shadow-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-notionBlue animate-pulse" />
            <span className="font-medium text-[11px]">AI Ideation Sequencer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black leading-[1.08] tracking-tighter mb-4">
            Sequence thoughts. <br />
            Mutate ideas. <br />
            Assemble blueprint.
          </h1>
          <p className="text-base text-notionGray max-w-lg leading-relaxed font-normal mb-8">
            IdeaDNA translates chaotic human concepts into clean, evolutionary diagrams using custom genetic mutation paths. Explore visual blueprints that morph and adapt to your specs.
          </p>

          {/* Glassmorphism Notion Input Box (border-radius: 4px) */}
          <div id="generate-section" className="max-w-lg w-full relative z-20">
            <form
              onSubmit={handleGenerate}
              className="notion-glass border border-notionBorder p-1.5 rounded-[4px] notion-shadow flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 pl-2.5 flex-1">
                <Search className="w-4 h-4 text-notionGray shrink-0" />
                <input
                  type="text"
                  placeholder="Enter a concept (e.g. Solar cargo drone)..."
                  value={problemInput}
                  onChange={(e) => setProblemInput(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-black placeholder-notionGray w-full"
                  disabled={isGenerating}
                />
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                className="bg-notionBlue text-white hover:bg-[#0060b8] text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Generate <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
            <div className="flex items-center gap-2 mt-2.5 px-1">
              <span className="text-[10px] text-notionGray font-mono">
                🔥 Try: Solar cargo aircraft
              </span>
              <span className="text-[10px] text-notionGray font-mono">•</span>
              <span className="text-[10px] text-notionGray font-mono">
                Press Enter to mutate the 3D grid
              </span>
            </div>
          </div>
        </section>

        {/* Separator / Breadcrumb Indicator */}
        <div className="h-[1px] w-full bg-notionBorder my-16 opacity-60" />

        {/* Section 1: DNA Explorer Sandbox (3D Interaction Sliders) */}
        <section id="canvas-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-4 text-left">
            <div className="flex items-center gap-1.5 mb-2">
              <Sliders className="w-4 h-4 text-notionBlue" />
              <span className="text-xs font-bold uppercase tracking-wider text-notionGray">
                DNA Coefficients
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-black tracking-tight leading-snug mb-3">
              Configure 3D Double Helix
            </h2>
            <p className="text-sm text-notionGray leading-relaxed mb-6">
              Adjust variables to mutate the wireframe strands in real-time. Notice how changes directly deform or scale the 3D model.
            </p>

            {/* Parameter Sliders Panel */}
            <div className="bg-white notion-border p-5 rounded-xl notion-shadow flex flex-col gap-5">
              {/* Creativity Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-black">
                  <span className="flex items-center gap-1">
                    Creativity Coef. (Scale)
                  </span>
                  <span className="font-mono text-notionBlue font-bold">
                    {dnaParameters.creativity.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                  value={dnaParameters.creativity}
                  onChange={(e) => handleSliderChange("creativity", parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#f0f0f0] rounded-lg appearance-none cursor-pointer accent-notionBlue"
                />
              </div>

              {/* Logic Rigor Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-black">
                  <span className="flex items-center gap-1">
                    Logic Rigor (Density)
                  </span>
                  <span className="font-mono text-notionBlue font-bold">
                    {dnaParameters.logic.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={dnaParameters.logic}
                  onChange={(e) => handleSliderChange("logic", parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#f0f0f0] rounded-lg appearance-none cursor-pointer accent-notionBlue"
                />
              </div>

              {/* Mutation Rate Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs font-semibold text-black">
                  <span className="flex items-center gap-1">
                    Mutation Coefficient
                  </span>
                  <span className="font-mono text-notionBlue font-bold">
                    {dnaParameters.mutationRate.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={dnaParameters.mutationRate}
                  onChange={(e) => handleSliderChange("mutationRate", parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#f0f0f0] rounded-lg appearance-none cursor-pointer accent-notionBlue"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-center h-full min-h-[220px] bg-white/20 border border-dashed border-notionBorder rounded-xl px-6 py-8 items-center text-center backdrop-blur-sm">
            <Maximize2 className="w-5 h-5 text-notionBlue mb-3 animate-pulse" />
            <h3 className="text-sm font-semibold text-black tracking-tight mb-1">
              Active 3D viewport connected
            </h3>
            <p className="text-xs text-notionGray max-w-sm leading-normal">
              Scroll down or hover on the background grid to tilt and explore the active double helix wireframe nodes.
            </p>
          </div>
        </section>

        {/* Section 2: Interactive Concept Evolution Tree Overlay */}
        <section id="evolution-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-4 text-left">
            <div className="flex items-center gap-1.5 mb-2">
              <Dna className="w-4 h-4 text-notionBlue" />
              <span className="text-xs font-bold uppercase tracking-wider text-notionGray">
                Idea Evolution
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-black tracking-tight leading-snug mb-3">
              Mutated Node Tree
            </h2>
            <p className="text-sm text-notionGray leading-relaxed mb-6">
              Concept connections assemble automatically inside this interactive React Flow map. Zoom, pan, or inspect nodes step-by-step.
            </p>

            <div className="bg-white notion-border p-4 rounded-xl notion-shadow text-xs flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2a9d99]" />
                <span className="font-semibold">Reactive updates enabled</span>
              </div>
              <p className="text-notionGray leading-normal">
                Using the input generator above automatically inserts a new concept node linked to the final output node.
              </p>
            </div>
          </div>

          {/* Interactive React Flow Tree Viewer */}
          <div className="lg:col-span-8 w-full h-[400px]">
            <EvolutionTree nodes={nodes} edges={edges} />
          </div>
        </section>

        {/* Section 3: Framer Motion Idea cards */}
        <section id="features-section" className="text-center py-8">
          <div className="max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-black tracking-tight mb-3">
              Sequencing Architecture
            </h2>
            <p className="text-sm text-notionGray leading-relaxed">
              Explore the core principles used to map human intelligence onto digital conceptual strands.
            </p>
          </div>

          <IdeaCards />
        </section>
      </main>

      {/* Clean Notion-style Footer */}
      <footer className="bg-white border-t border-notionBorder py-12 relative z-10 notion-shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center bg-[#f6f5f4]">
              <span className="text-[10px] font-bold">I</span>
            </div>
            <span className="font-bold text-sm tracking-tight">IdeaDNA</span>
          </div>

          <div className="flex gap-8 text-xs font-medium text-notionGray">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-black">
              GitHub repository
            </a>
            <a href="#" className="hover:text-black">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black">
              Terms of Service
            </a>
          </div>

          <p className="text-[11px] text-notionGray font-mono">
            © 2026 IdeaDNA AI. Structured conceptually.
          </p>
        </div>
      </footer>
    </div>
  );
}
