"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate, scoreBgColor } from "@/lib/utils";
import type { Project, ProjectMode } from "@/lib/types";
import {
  Plus,
  Search,
  Lightbulb,
  Dna,
  Code2,
  Clock,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";

const mockProjects: Project[] = [
  { id: "1", title: "Solar Cargo Drone Platform", mode: "generate", status: "selected", createdAt: "2026-06-20", platform: "WEB", overallScore: 88, ideaCount: 6 },
  { id: "2", title: "AI Study Buddy", mode: "generate", status: "completed", createdAt: "2026-06-18", platform: "MOBILE", overallScore: 74, ideaCount: 5 },
  { id: "3", title: "Blockchain Voting System", mode: "evolve", status: "draft", createdAt: "2026-06-15", platform: "BLOCKCHAIN", overallScore: 82, ideaCount: 4 },
  { id: "4", title: "E-commerce API Analysis", mode: "analyze", status: "completed", createdAt: "2026-06-12", platform: "API_BACKEND", overallScore: 91 },
  { id: "5", title: "Smart Garden IoT", mode: "generate", status: "draft", createdAt: "2026-06-10", platform: "IOT", overallScore: 65, ideaCount: 8 },
  { id: "6", title: "Health Tracker Evolution", mode: "evolve", status: "selected", createdAt: "2026-06-08", platform: "MOBILE", overallScore: 79, ideaCount: 3 },
];

const modeIcons: Record<ProjectMode, React.ReactNode> = {
  generate: <Lightbulb className="w-3.5 h-3.5" />,
  evolve: <Dna className="w-3.5 h-3.5" />,
  analyze: <Code2 className="w-3.5 h-3.5" />,
};

const modeLabels: Record<ProjectMode, string> = {
  generate: "Generate",
  evolve: "Evolve",
  analyze: "Analyze",
};

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<ProjectMode | "all">("all");

  const filtered = mockProjects.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (modeFilter !== "all" && p.mode !== modeFilter) return false;

    return true;
  });

  const stats = [
    { icon: Lightbulb, label: "Total Projects", value: "12", color: "text-notionBlue" },
    { icon: TrendingUp, label: "Avg. Score", value: "79", color: "text-stickerTeal" },
    { icon: Target, label: "Ideas Generated", value: "34", color: "text-stickerPurple" },
    { icon: Zap, label: "Selection Rate", value: "68%", color: "text-stickerSky" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-xs text-notionGray mt-0.5">Manage your IdeaDNA projects</p>
          </div>
          <Link href="/generate">
            <Button size="sm">
              <Plus className="w-3.5 h-3.5" /> New Project
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-notionBorder rounded-xl notion-shadow p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-[11px] text-notionGray font-medium">{s.label}</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-notionBorder rounded-xl notion-shadow mb-6">
          <div className="p-4 border-b border-notionBorder">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-notionGray" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-notionBorder rounded-[4px] outline-none focus:border-notionBlue"
                />
              </div>
              <div className="flex gap-2">
                {(["all", "generate", "evolve", "analyze"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setModeFilter(m)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                      modeFilter === m
                        ? "bg-notionBlue text-white border-notionBlue"
                        : "text-notionGray border-notionBorder hover:text-black"
                    }`}
                  >
                    {m === "all" ? "All" : modeLabels[m]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-notionBorder">
            {filtered.map((p) => (
              <Link key={p.id} href={`/project/${p.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-[#f6f5f4] transition-colors group">
                <div className="w-8 h-8 rounded-[8px] border border-notionBorder flex items-center justify-center bg-white shrink-0">
                  {modeIcons[p.mode]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">{p.title}</span>
                    <Badge variant={p.mode === "generate" ? "purple" : p.mode === "evolve" ? "teal" : "sky"}>{modeLabels[p.mode]}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-notionGray flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(p.createdAt)}
                    </span>
                    {p.platform && <span className="text-[11px] text-notionGray">{p.platform}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {p.overallScore && (
                    <span className={`text-xs font-bold font-mono ${scoreBgColor(p.overallScore)} px-2 py-0.5 rounded-full`}>
                      {p.overallScore}
                    </span>
                  )}
                  <span className={`text-[11px] font-medium capitalize ${
                    p.status === "selected" ? "text-notionBlue" : p.status === "completed" ? "text-stickerTeal" : "text-notionGray"
                  }`}>
                    {p.status}
                  </span>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-notionGray">
                No projects found. <Link href="/generate" className="text-notionBlue hover:underline">Create your first project</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
