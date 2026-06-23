"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { userApi } from "@/lib/api";
import type { Project, ProjectMode } from "@/lib/types";
import {
  Plus, Search, Lightbulb, Dna, Code2, Clock, TrendingUp, Target, Zap,
  Loader2, AlertTriangle, Trash2, Share2,
} from "lucide-react";

const modeIcons: Record<ProjectMode, React.ReactNode> = {
  generate: <Lightbulb className="w-3.5 h-3.5" />,
  evolve: <Dna className="w-3.5 h-3.5" />,
  analyze: <Code2 className="w-3.5 h-3.5" />,
};

const modeLabels: Record<string, string> = {
  GENERATOR: "Generate",
  EVOLUTION: "Evolve",
  ARCHAEOLOGY: "Analyze",
  generate: "Generate",
  evolve: "Evolve",
  analyze: "Analyze",
};

export default function DashboardPage() {
  const { profile } = useStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({ projects_total: 0, ideas_total: 0, avg_score: 0, selection_rate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, statsRes] = await Promise.all([
          userApi.listProjects(),
          userApi.getStats(),
        ]);
        setProjects(projRes.projects.map((p: Record<string, unknown>) => ({
          id: String(p.id),
          title: (p.title as string) || "Untitled",
          mode: (p.mode as ProjectMode) || "generate",
          status: (p.status as string)?.toLowerCase() as Project["status"] || "draft",
          createdAt: (p.created_at as string) || "",
          platform: p.platform as Project["platform"],
          overallScore: p.idea_count as number || 0,
          ideaCount: p.idea_count as number || 0,
        })));
        setStats(statsRes as { projects_total: number; ideas_total: number; avg_score: number; selection_rate: number });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = projects.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (modeFilter !== "all" && p.mode !== modeFilter) return false;
    return true;
  });

  const statCards = [
    { icon: Lightbulb, label: "Total Projects", value: stats.projects_total, color: "text-notionBlue" },
    { icon: TrendingUp, label: "Avg. Score", value: stats.avg_score, color: "text-stickerTeal" },
    { icon: Target, label: "Ideas Generated", value: stats.ideas_total, color: "text-stickerPurple" },
    { icon: Zap, label: "Selection Rate", value: `${stats.selection_rate}%`, color: "text-stickerSky" },
  ];

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this project?")) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      await fetch(`${API_BASE}/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 text-notionBlue animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-xs text-notionGray mt-0.5">
              {profile
                ? `${profile.skillLevel.charAt(0).toUpperCase() + profile.skillLevel.slice(1)} · ${profile.teamSize} person team`
                : "Welcome to IdeaDNA"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/onboarding">
              <Button variant="secondary" size="sm">Edit Profile</Button>
            </Link>
            <Link href="/generate">
              <Button size="sm"><Plus className="w-3.5 h-3.5" /> New Project</Button>
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-red-700">{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white border border-notionBorder rounded-xl notion-shadow p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-[11px] text-notionGray font-medium">{s.label}</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="bg-white border border-notionBorder rounded-xl notion-shadow mb-6">
          <div className="p-4 border-b border-notionBorder">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-notionGray" />
                <input type="text" placeholder="Search projects..." value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-notionBorder rounded-[4px] outline-none focus:border-notionBlue" />
              </div>
              <div className="flex gap-2">
                {["all", "generate", "evolve", "analyze"].map((m) => (
                  <button key={m} onClick={() => setModeFilter(m)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                      modeFilter === m ? "bg-notionBlue text-white border-notionBlue" : "text-notionGray border-notionBorder hover:text-black"
                    }`}>
                    {m === "all" ? "All" : modeLabels[m] || m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-notionBorder">
            {filtered.map((p) => (
              <Link key={p.id} href={`/project/${p.id}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[#f6f5f4] transition-colors group">
                <div className="w-8 h-8 rounded-[8px] border border-notionBorder flex items-center justify-center bg-white shrink-0">
                  {modeIcons[p.mode]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">{p.title}</span>
                    <Badge variant={p.mode === "generate" ? "purple" : p.mode === "evolve" ? "teal" : "sky"}>
                      {modeLabels[p.mode] || p.mode}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-notionGray flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(p.createdAt)}
                    </span>
                    {p.platform && <span className="text-[11px] text-notionGray">{p.platform}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(`${window.location.origin}/project/${p.id}`);
                  }}
                    className="p-1.5 rounded-[6px] border border-notionBorder hover:bg-[#f6f5f4] opacity-0 group-hover:opacity-100 transition-all"
                    title="Copy link">
                    <Share2 className="w-3 h-3 text-notionGray" />
                  </button>
                  <button onClick={(e) => handleDelete(e, p.id)}
                    className="p-1.5 rounded-[6px] border border-notionBorder hover:bg-red-50 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete">
                    <Trash2 className="w-3 h-3 text-notionGray hover:text-red-500" />
                  </button>
                  {p.ideaCount ? (
                    <span className="text-[11px] text-notionGray font-mono">{p.ideaCount} ideas</span>
                  ) : null}
                  <span className={`text-[11px] font-medium capitalize ${
                    p.status === "selected" ? "text-notionBlue" : p.status === "completed" ? "text-stickerTeal" : "text-notionGray"
                  }`}>{p.status}</span>
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
