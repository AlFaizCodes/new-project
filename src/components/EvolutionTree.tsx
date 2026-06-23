"use client";

import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

// Customized node structure that looks exactly like a premium Notion document block
const CustomNode = ({ data }: { data: { title: string; desc: string; type: string; dotColor: string } }) => {
  return (
    <div className="flex flex-col text-left max-w-[200px]">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: data.dotColor || "#0075de" }}
        />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-notionGray">
          {data.type}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-black leading-tight tracking-tight mb-1">
        {data.title}
      </h4>
      <p className="text-[11px] text-notionGray leading-normal font-normal">
        {data.desc}
      </p>
    </div>
  );
};

interface EvolutionTreeProps {
  nodes: Node[];
  edges: Edge[];
}

export default function EvolutionTree({ nodes, edges }: EvolutionTreeProps) {
  // Use React Flow's custom nodes mapping
  const nodeTypes = useMemo(
    () => ({
      customNode: CustomNode,
    }),
    []
  );

  return (
    <div className="w-full h-full min-h-[380px] bg-white notion-border rounded-xl notion-shadow relative overflow-hidden">
      {/* Notion Document Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 border-b border-notionBorder bg-[#fafafa] flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-60" />
          <span className="text-xs text-notionGray font-medium ml-2 font-mono">
            concept_evolution_tree.json
          </span>
        </div>
        <div className="text-[11px] text-notionGray font-medium">
          Interactive Map (Drag/Zoom)
        </div>
      </div>

      {/* React Flow Component */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e6e6e6" gap={16} size={1} />
        <Controls showInteractive={false} className="react-flow__controls" />
      </ReactFlow>
    </div>
  );
}
