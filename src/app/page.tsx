"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Node, Edge } from "reactflow";
import {
  Sparkles, Search, Dna, ArrowRight, Maximize2, Sliders, CheckCircle2,
  Globe, Zap, Shuffle, Layers,
} from "lucide-react";

const DnaCanvas = dynamic(() => import("@/components/DnaCanvas"), { ssr: false });
const EvolutionTree = dynamic(() => import("@/components/EvolutionTree"), { ssr: false });
const IdeaCards = dynamic(() => import("@/components/IdeaCards"), { ssr: false });
const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), { ssr: false });

export default function Home() {
  const [triggerMutation, setTriggerMutation] = useState(0);
  const [problemInput, setProblemInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [dnaParameters, setDnaParameters] = useState({ creativity: 0.4, logic: 0.6, mutationRate: 0.35 });

  const [nodes, setNodes] = useState<Node[]>([
    { id: "root", type: "customNode", position: { x: 180, y: 60 }, data: { title: "Maritime Shipping Carbon", desc: "Goal: Decarbonize intercontinental cargo routes", type: "Input Node", dotColor: "#d6b6f6" } },
    { id: "node-2", type: "customNode", position: { x: 30, y: 190 }, data: { title: "Rigid Wing PV Sails", desc: "Deploy automated solid sails lined with solar cells", type: "Mutation A", dotColor: "#2a9d99" } },
    { id: "node-3", type: "customNode", position: { x: 330, y: 190 }, data: { title: "Liquid Hydrogen Fuel Cells", desc: "Auxiliary power supply using cryogenic H2 storage", type: "Mutation B", dotColor: "#62aef0" } },
    { id: "node-4", type: "customNode", position: { x: 180, y: 320 }, data: { title: "Helios Eco-Freighter", desc: "Optimal synergy of wind, solar, and hydrogen energy systems", type: "Synthesis", dotColor: "#0075de" } },
  ]);
  const [edges, setEdges] = useState<Edge[]>([
    { id: "e1-2", source: "root", target: "node-2", animated: true, style: { stroke: "#e6e6e6" } },
    { id: "e1-3", source: "root", target: "node-3", animated: true, style: { stroke: "#e6e6e6" } },
    { id: "e2-4", source: "node-2", target: "node-4", animated: true, style: { stroke: "#0075de" } },
    { id: "e3-4", source: "node-3", target: "node-4", animated: true, style: { stroke: "#0075de" } },
  ]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemInput.trim() || isGenerating) return;
    setIsGenerating(true);
    setTriggerMutation((prev) => prev + 1);
    setTimeout(() => {
      const newNodeId = `node-custom-${Date.now()}`;
      const count = nodes.filter((n) => n.id.startsWith("node-custom")).length;
      const newNode: Node = { id: newNodeId, type: "customNode", position: { x: count % 2 === 0 ? 30 : 330, y: 450 + Math.floor(count / 2) * 110 }, data: { title: problemInput, desc: `Engineered with creativity coef ${dnaParameters.creativity.toFixed(2)}.`, type: `Mutation #${triggerMutation + 1}`, dotColor: "#0075de" } };
      const newEdge: Edge = { id: `e4-custom-${newNodeId}`, source: "node-4", target: newNodeId, animated: true, style: { stroke: "#0075de", strokeWidth: 1.5 } };
      setNodes((prev) => [...prev, newNode]);
      setEdges((prev) => [...prev, newEdge]);
      setProblemInput("");
      setIsGenerating(false);
    }, 850);
  };

  return (
    <div className="relative min-h-screen text-black select-none antialiased">
      <ThreeBackground variant="both" />
      <DnaCanvas triggerMutation={triggerMutation} dnaParameters={dnaParameters} />

      {/* Dark Hero Band */}
      <section className="relative overflow-hidden bg-[#213183]/95 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#62aef0] blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#d6b6f6] blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#0075de] blur-[120px] opacity-40" />
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs text-white/80 mb-6 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#62aef0] animate-pulse" />
              <span className="font-medium text-[11px] tracking-wide">AI-Powered Idea Engine</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.0] tracking-[-2px] mb-4">
              Generate.<br />Evolve.<br />Build.
            </h1>
            <p className="text-base text-white/70 max-w-lg leading-relaxed font-normal mb-8">
              IdeaDNA fetches ideas from Devpost, Product Hunt, GitHub, HN, and Reddit — then enhances them with AI to create unique, market-viable concepts.
            </p>
            <div className="flex items-center gap-3">
              <a href="/generate" className="bg-notionBlue text-white hover:bg-[#0060b8] text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-notionBlue/25 flex items-center gap-1.5 transition-all">
                Start Free <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#canvas-section" className="bg-white/10 text-white hover:bg-white/20 text-sm font-semibold px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-sm transition-all">
                3D Explorer
              </a>
            </div>
            <div className="flex items-center gap-6 mt-8 text-xs text-white/50 flex-wrap">
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> 5 Data Sources</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> AI Enhancement</span>
              <span className="flex items-center gap-1"><Shuffle className="w-3.5 h-3.5" /> Uniqueness Score</span>
              <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Vector Search</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f6f5f4] to-transparent" />
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <section id="generate-section" className="w-full text-left md:max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-notionBorder text-xs text-notionGray notion-shadow-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-notionBlue animate-pulse" />
            <span className="font-medium text-[11px]">Try It Now</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black leading-[1.08] tracking-tighter mb-4">
            Sequence thoughts. <br />Mutate ideas. <br />Assemble blueprint.
          </h1>
          <p className="text-base text-notionGray max-w-lg leading-relaxed font-normal mb-8">
            IdeaDNA translates chaotic human concepts into clean, evolutionary diagrams using custom genetic mutation paths. Explore visual blueprints that morph and adapt to your specs.
          </p>
          <div className="max-w-lg w-full relative z-20">
            <form onSubmit={handleGenerate} className="notion-glass border border-notionBorder p-1.5 rounded-[4px] notion-shadow flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 pl-2.5 flex-1">
                <Search className="w-4 h-4 text-notionGray shrink-0" />
                <input type="text" placeholder="Enter a concept (e.g. Solar cargo drone)..." value={problemInput} onChange={(e) => setProblemInput(e.target.value)} className="bg-transparent border-none outline-none text-sm text-black placeholder-notionGray w-full" disabled={isGenerating} />
              </div>
              <button type="submit" disabled={isGenerating} className="bg-notionBlue text-white hover:bg-[#0060b8] text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50">
                {isGenerating ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Generate</span> <Sparkles className="w-3.5 h-3.5" /></>}
              </button>
            </form>
          </div>
        </section>

        <div className="h-[1px] w-full bg-notionBorder my-16 opacity-60" />

        <section id="canvas-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-4 text-left">
            <div className="flex items-center gap-1.5 mb-2"><Sliders className="w-4 h-4 text-notionBlue" /><span className="text-xs font-bold uppercase tracking-wider text-notionGray">DNA Coefficients</span></div>
            <h2 className="text-2xl font-extrabold text-black tracking-tight leading-snug mb-3">Configure 3D Double Helix</h2>
            <p className="text-sm text-notionGray leading-relaxed mb-6">Adjust variables to mutate the wireframe strands in real-time.</p>
            <div className="bg-white notion-border p-5 rounded-xl notion-shadow flex flex-col gap-5">
              {[
                { label: "Creativity Coef. (Scale)", key: "creativity", min: 0.1, max: 1.5, step: 0.05 },
                { label: "Logic Rigor (Density)", key: "logic", min: 0.2, max: 1.0, step: 0.05 },
                { label: "Mutation Coefficient", key: "mutationRate", min: 0.1, max: 0.8, step: 0.05 },
              ].map((s) => (
                <div key={s.key} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-black">
                    <span>{s.label}</span>
                    <span className="font-mono text-notionBlue font-bold">{dnaParameters[s.key as keyof typeof dnaParameters].toFixed(2)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={dnaParameters[s.key as keyof typeof dnaParameters]} onChange={(e) => setDnaParameters((prev) => ({ ...prev, [s.key]: parseFloat(e.target.value) }))} className="w-full h-1 bg-[#f0f0f0] rounded-lg appearance-none cursor-pointer accent-notionBlue" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 flex flex-col justify-center h-full min-h-[220px] bg-white/20 border border-dashed border-notionBorder rounded-xl px-6 py-8 items-center text-center backdrop-blur-sm">
            <Maximize2 className="w-5 h-5 text-notionBlue mb-3 animate-pulse" />
            <h3 className="text-sm font-semibold text-black tracking-tight mb-1">Active 3D viewport connected</h3>
            <p className="text-xs text-notionGray max-w-sm leading-normal">Scroll down or hover on the background grid to tilt and explore the active double helix wireframe nodes.</p>
          </div>
        </section>

        <section id="evolution-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-4 text-left">
            <div className="flex items-center gap-1.5 mb-2"><Dna className="w-4 h-4 text-notionBlue" /><span className="text-xs font-bold uppercase tracking-wider text-notionGray">Idea Evolution</span></div>
            <h2 className="text-2xl font-extrabold text-black tracking-tight leading-snug mb-3">Mutated Node Tree</h2>
            <p className="text-sm text-notionGray leading-relaxed mb-6">Concept connections assemble automatically inside this interactive React Flow map.</p>
            <div className="bg-white notion-border p-4 rounded-xl notion-shadow text-xs flex flex-col gap-3">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2a9d99]" /><span className="font-semibold">Reactive updates enabled</span></div>
              <p className="text-notionGray leading-normal">Using the input generator above automatically inserts a new concept node linked to the final output node.</p>
            </div>
          </div>
          <div className="lg:col-span-8 w-full h-[400px]">
            <EvolutionTree nodes={nodes} edges={edges} />
          </div>
        </section>

        <section id="features-section" className="text-center py-8">
          <div className="max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-black tracking-tight mb-3">Sequencing Architecture</h2>
            <p className="text-sm text-notionGray leading-relaxed">Explore the core principles used to map human intelligence onto digital conceptual strands.</p>
          </div>
          <IdeaCards />
        </section>
      </main>
    </div>
  );
}
