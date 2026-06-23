"use client";

import React, { useState, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { CriticReport, EvolutionNode } from "@/lib/types";
import {
  Dna, AlertTriangle, ChevronRight, ArrowUpRight, Loader2, CheckCircle2,
  Target, TrendingUp, Shield, Zap, Layers,
} from "lucide-react";
import {
  ReactFlow, ReactFlowProvider, MiniMap, Controls, Background,
  useNodesState, useEdgesState,
  type Node, type Edge, type NodeProps, Handle, Position, MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

// ─── Mock Data ───
const mockCritic: CriticReport = {
  weaknesses: [
    { severity: "HIGH", text: "No clear differentiation from existing drone delivery services" },
    { severity: "MEDIUM", text: "Solar charging infrastructure requires significant upfront capital" },
    { severity: "HIGH", text: "Regulatory hurdles for autonomous drone flights in urban areas" },
    { severity: "LOW", text: "Weather dependency could cause inconsistent delivery times" },
  ],
  gaps: ["Last-mile delivery solution not addressed", "No user authentication or payment system", "Missing contingency for system failures"],
  risks: ["Battery technology may not advance fast enough", "Competing with well-funded logistics companies", "Public perception of drone noise and privacy"],
  opportunities: ["Partnership with existing logistics networks", "Government grants for green technology", "Expansion to emergency medical delivery"],
  mutation_vectors: ["AI_ENHANCED", "BLOCKCHAIN", "ANALYTICS", "ENTERPRISE", "SOCIAL_IMPACT"],
};

const mockEvolutionNodes: EvolutionNode[] = [
  { id: "root", parentId: null, title: "Solar Cargo Drone", description: "Original concept: autonomous solar drone delivery", score: 76, mutationTag: "Original" },
  { id: "n1", parentId: "root", title: "Hybrid Airship Network", description: "Lighter-than-air cargo airships with solar skin", score: 88, mutationTag: "Scale Shift" },
  { id: "n2", parentId: "root", title: "Drone Swarm Logistics", description: "Decentralized swarm of small drones", score: 82, mutationTag: "Architecture" },
  { id: "n3", parentId: "root", title: "Solar-Assisted Trucking", description: "Hybrid truck fleet with solar panel trailers", score: 71, mutationTag: "Pivot" },
  { id: "n4", parentId: "root", title: "Port-to-Port Autonomous", description: "Autonomous solar boats for inland waterways", score: 79, mutationTag: "Platform Shift" },
  { id: "n1-1", parentId: "n1", title: "Eco Luxury Airship", description: "Premium passenger airship", score: 64, mutationTag: "Premium Tier" },
];

// ─── Evolution Node Component ───
const scoreColors: Record<string, string> = {
  high: "#16a34a",
  mid: "#ca8a04",
  low: "#dc2626",
};

function getScoreColor(score: number): string {
  if (score >= 80) return scoreColors.high;
  if (score >= 60) return scoreColors.mid;
  return scoreColors.low;
}

function EvolutionNodeComponent({ data }: NodeProps) {
  const scoreColor = getScoreColor(data.score);
  return (
    <div className={`px-4 py-2 rounded-xl border-2 bg-white shadow-sm min-w-[140px] ${data.isSelected ? "border-notionBlue" : "border-gray-200"}`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="text-[11px] font-bold text-center leading-tight mb-1">{data.label}</div>
      <div className="text-[9px] text-center text-gray-500 mb-1.5">{data.mutationTag}</div>
      <div className="flex items-center justify-center gap-1">
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: scoreColor }}>
          <span className="text-[8px] font-bold text-white">{data.score}</span>
        </div>
        <span className={`text-[9px] font-medium ${data.isCurated ? "text-purple-600" : "text-gray-400"}`}>
          {data.isCurated ? "Curated" : "Generated"}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}

const nodeTypes = { evolutionNode: EvolutionNodeComponent };

// ─── Severity Colors ───
const severityColor: Record<string, string> = {
  HIGH: "text-red-600 bg-red-50 border-red-200",
  MEDIUM: "text-yellow-600 bg-yellow-50 border-yellow-200",
  LOW: "text-green-600 bg-green-50 border-green-200",
};

const mutationIcons: Record<string, React.ReactNode> = {
  AI_ENHANCED: <Zap className="w-3 h-3" />,
  BLOCKCHAIN: <Shield className="w-3 h-3" />,
  ANALYTICS: <TrendingUp className="w-3 h-3" />,
  ENTERPRISE: <Layers className="w-3 h-3" />,
  SOCIAL_IMPACT: <Target className="w-3 h-3" />,
};

// ─── Main Page ───
export default function EvolvePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);
  const [critic, setCritic] = useState<CriticReport | null>(null);
  const [selectedEvolved, setSelectedEvolved] = useState<string | null>(null);
  const [step, setStep] = useState<"input" | "critic" | "tree">("input");

  // React Flow state
  const flowNodes: Node[] = useMemo(() => {
    if (!mockEvolutionNodes.length) return [];
    return mockEvolutionNodes.map((n) => ({
      id: n.id,
      type: "evolutionNode",
      position: { x: 0, y: 0 }, // will be auto-layouted
      data: {
        label: n.title,
        score: n.score,
        mutationTag: n.mutationTag,
        description: n.description,
        isCurated: n.parentId === null,
        isSelected: selectedEvolved === n.id,
      },
    }));
  }, [selectedEvolved]);

  const flowEdges: Edge[] = useMemo(() => {
    return mockEvolutionNodes
      .filter((n) => n.parentId)
      .map((n) => ({
        id: `e-${n.parentId}-${n.id}`,
        source: n.parentId!,
        target: n.id,
        label: n.mutationTag,
        animated: true,
        style: { stroke: "#a0a0b0", strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#a0a0b0" },
        labelStyle: { fontSize: 9, fontWeight: 600, fill: "#6c6c80" },
      }));
  }, []);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setCritic(mockCritic);
      setIsAnalyzing(false);
      setStep("critic");
    }, 2000);
  };

  const handleEvolve = () => {
    setIsEvolving(true);
    setTimeout(() => {
      setIsEvolving(false);
      setStep("tree");
    }, 2000);
  };

  const handleSelectVersion = (id: string) => {
    setSelectedEvolved(id);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl">
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-1">
            <Dna className="w-4 h-4 text-notionBlue" />
            <span className="text-xs font-bold uppercase tracking-wider text-notionGray">Evolution Engine</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Evolve an Idea</h1>
          <p className="text-xs text-notionGray mt-0.5">Critic-first approach — identify weaknesses, then mutate</p>
        </div>

        {/* Step 1: Input */}
        {step === "input" && (
          <form onSubmit={handleAnalyze} className="bg-white border border-notionBorder rounded-xl notion-shadow p-6 max-w-2xl">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-black mb-1 block">Idea Title</label>
                <input type="text" placeholder="e.g. Solar-powered drone delivery" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-notionBorder rounded-[4px] outline-none focus:border-notionBlue" />
              </div>
              <div>
                <label className="text-xs font-semibold text-black mb-1 block">Description</label>
                <textarea placeholder="Describe your idea in detail..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 text-sm border border-notionBorder rounded-[4px] outline-none focus:border-notionBlue resize-none" />
              </div>
              <Button type="submit" disabled={isAnalyzing || !title.trim() || !description.trim()} className="self-start">
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Dna className="w-4 h-4" />}
                {isAnalyzing ? "Analyzing..." : "Analyze & Evolve"}
              </Button>
            </div>
          </form>
        )}

        {/* Loading: Critic Analysis */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-notionBlue animate-spin mb-3" />
            <p className="text-sm font-semibold">CriticAgent analyzing weaknesses...</p>
            <p className="text-xs text-notionGray mt-1">Low temperature (0.3) — brutally objective evaluation</p>
            <div className="flex gap-2 mt-4">
              {["Weaknesses", "Gaps", "Risks", "Mutations"].map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-notionBlue animate-pulse" />
                  <span className="text-[10px] text-notionGray font-mono">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Critic Report */}
        {critic && step === "critic" && !isEvolving && (
          <div>
            <div className="bg-white border border-notionBorder rounded-xl notion-shadow p-6 mb-6 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <h2 className="text-sm font-bold tracking-tight">Critic Report</h2>
                <Badge variant="default">AI Analysis</Badge>
              </div>

              <div className="mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-notionGray mb-2">Weaknesses</h3>
                <div className="flex flex-col gap-1.5">
                  {critic.weaknesses.map((w, i) => (
                    <div key={i} className={`text-xs px-3 py-2 rounded-[6px] border ${severityColor[w.severity]}`}>
                      <span className="font-bold uppercase mr-1.5">[{w.severity}]</span>
                      {w.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-4">
                <div>
                  <h3 className="font-semibold text-notionGray mb-1.5 uppercase tracking-wider">Gaps</h3>
                  <ul className="space-y-1">
                    {critic.gaps.map((g, i) => <li key={i} className="flex items-start gap-1"><ChevronRight className="w-3 h-3 text-red-400 mt-0.5 shrink-0" /><span className="text-notionGray">{g}</span></li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-notionGray mb-1.5 uppercase tracking-wider">Risks</h3>
                  <ul className="space-y-1">
                    {critic.risks.map((r, i) => <li key={i} className="flex items-start gap-1"><ChevronRight className="w-3 h-3 text-yellow-400 mt-0.5 shrink-0" /><span className="text-notionGray">{r}</span></li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-notionGray mb-1.5 uppercase tracking-wider">Mutation Vectors</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(critic as typeof mockCritic & { mutation_vectors?: string[] }).mutation_vectors?.map((mv) => (
                      <span key={mv} className="flex items-center gap-1 text-[10px] bg-stickerPurple/10 text-stickerPurple px-2 py-1 rounded-full font-medium">
                        {mutationIcons[mv] || <Zap className="w-3 h-3" />} {mv.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-notionBorder">
                <Button onClick={handleEvolve} disabled={isEvolving}>
                  {isEvolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Dna className="w-4 h-4" />}
                  {isEvolving ? "Creating mutations..." : "Generate Evolutions"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading: Evolution */}
        {isEvolving && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-notionBlue animate-spin mb-3" />
            <p className="text-sm font-semibold">EvolverAgent mutating...</p>
            <p className="text-xs text-notionGray mt-1">Medium temperature (0.6) — structured creativity</p>
            <div className="flex gap-2 mt-4">
              {["Mutation", "Enhance", "Score"].map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${s !== "Score" ? "bg-notionBlue animate-pulse" : "bg-notionBorder"}`} />
                  <span className="text-[10px] font-mono text-notionGray">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Evolution Tree (React Flow) */}
        {step === "tree" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">Evolution Tree</h2>
                <Badge variant="teal">{flowNodes.length} mutations</Badge>
              </div>
              {selectedEvolved && (
                <Button size="sm" onClick={() => window.location.href = `/project/evolved-${Date.now()}`}>
                  View Blueprint <ArrowUpRight className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="bg-white border border-notionBorder rounded-xl notion-shadow overflow-hidden" style={{ height: 480 }}>
              <ReactFlowProvider>
                <EvolutionTree
                  nodes={flowNodes}
                  edges={flowEdges}
                  onNodeClick={(nodeId) => handleSelectVersion(nodeId)}
                />
              </ReactFlowProvider>
            </div>

            {/* Version Selector */}
            <div className="mt-4 flex gap-2 flex-wrap">
              {mockEvolutionNodes.filter((n) => n.parentId !== null).map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedEvolved(n.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    selectedEvolved === n.id
                      ? "bg-notionBlue text-white border-notionBlue"
                      : "bg-white text-black border-notionBorder hover:border-black"
                  }`}
                >
                  {n.title.length > 20 ? n.title.slice(0, 20) + "…" : n.title}
                  <span className="ml-1 opacity-60">({n.score})</span>
                </button>
              ))}
            </div>

            {/* Selected Confirmation */}
            {selectedEvolved && (
              <div className="mt-6 bg-notionBlue/5 border border-notionBlue/30 rounded-xl p-4 notion-shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-notionBlue" />
                  <span className="text-sm font-semibold">Version selected — generating blueprint & UI mockup...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ─── Evolution Tree Sub-component ───
function EvolutionTree({
  nodes,
  edges,
  onNodeClick,
}: {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: (id: string) => void;
}) {
  const initialNodes: Node[] = useMemo(() => {
    if (!nodes.length) return [];
    // Manual layout: root at top center, children spread below
    const root = nodes.find((n) => n.id === "root");
    if (!root) return nodes;

    const children = nodes.filter((n) => n.id !== "root");
    const childrenCount = children.length;
    const startX = 300 - (childrenCount - 1) * 90;
    const positioned: Node[] = [
      { ...root, position: { x: 250, y: 20 } },
    ];
    children.forEach((child, idx) => {
      // Find children of children for level 2
      const grandChildren = nodes.filter(
        (n) => n.id !== "root" && n.id !== child.id && edges.some((e) => e.source === child.id && e.target === n.id)
      );
      positioned.push({
        ...child,
        position: { x: startX + idx * 180, y: 140 },
      });
      grandChildren.forEach((gc, gidx) => {
        positioned.push({
          ...gc,
          position: { x: startX + idx * 180 + (gidx - (grandChildren.length - 1) / 2) * 160, y: 270 },
        });
      });
    });
    return positioned;
  }, [nodes, edges]);

  const [rfNodes, , onNodesChange] = useNodesState(initialNodes);
  const [rfEdges, , onEdgesChange] = useEdgesState(edges);

  const onNodeClickHandler = useCallback((_event: React.MouseEvent, node: Node) => {
    onNodeClick(node.id);
  }, [onNodeClick]);

  return (
    <ReactFlow
      nodes={rfNodes}
      edges={rfEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClickHandler}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition="bottom-left"
      defaultEdgeOptions={{
        animated: true,
        style: { stroke: "#a0a0b0", strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#a0a0b0" },
      }}
    >
      <Controls />
      <MiniMap
        nodeColor={(n) => {
          const score = n.data?.score || 50;
          return score >= 80 ? scoreColors.high : score >= 60 ? scoreColors.mid : scoreColors.low;
        }}
        style={{ border: "1px solid #e6e6e6", borderRadius: 8 }}
      />
      <Background color="#e6e6e6" gap={20} />
    </ReactFlow>
  );
}
