"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ArchaeologyReport } from "@/lib/types";
import {
  Code2,
  GitBranch,
  Globe,
  Loader2,
  ChevronRight,
  CheckCircle2,
  Download,
  Lightbulb,
  TrendingUp,
  Target,
  BarChart3,
} from "lucide-react";

const mockReport: ArchaeologyReport = {
  codeAnalysis: "Detected: Python 3.11, FastAPI framework, PostgreSQL, Redis caching. Clean architecture with repository pattern. 87% test coverage across 142 test files. Well-structured async/await throughout.",
  patterns: "Repository Pattern (data layer), Service Layer (business logic), Observer (event hooks), Factory (model serializers), Singleton (config manager with env override). Confidence: 92%",
  evolutionTimeline: "v1.0 (2024-01): Initial monolith with basic CRUD + SQLite\nv2.0 (2024-06): FastAPI migration + PostgreSQL + Redis caching layer\nv3.0 (2024-12): Microservices split, async processing, WebSocket support\nv4.0 (2025-04): Current — event-driven architecture with Kafka, Kubernetes deployment",
  developerPsychology: "Architect is experienced (senior+), prefers explicit over implicit patterns. Tests-first approach visible in commit history. Trade-off: chose FastAPI over Django for performance despite higher boilerplate. Regret: 'Should have added observability from v1.'",
  scores: { originality: 72, feasibility: 88, market: 65, complexity: 81 },
  futureVersions: [
    "v5.0: Add GraphQL gateway + BFF pattern for mobile clients",
    "v5.1: Event sourcing + CQRS for audit trails",
    "v6.0: Multi-tenant architecture with isolated databases",
    "v6.5: AI-powered anomaly detection for system metrics",
  ],
};

const tabs = [
  { id: "paste", label: "Paste Code", icon: Code2 },
  { id: "github", label: "GitHub URL", icon: GitBranch },
  { id: "website", label: "Website URL", icon: Globe },
];

export default function AnalyzePage() {
  const [tab, setTab] = useState("paste");
  const [code, setCode] = useState("");
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ArchaeologyReport | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "paste" && !code.trim()) return;
    if (tab !== "paste" && !url.trim()) return;
    setIsAnalyzing(true);
    setReport(null);
    setTimeout(() => {
      setReport(mockReport);
      setIsAnalyzing(false);
    }, 3000);
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const sections = report
    ? [
        { id: "analysis", label: "Code Analysis", content: report.codeAnalysis, icon: Code2 },
        { id: "patterns", label: "Design Patterns", content: report.patterns, icon: Lightbulb },
        { id: "timeline", label: "Evolution Timeline", content: report.evolutionTimeline, icon: TrendingUp },
        { id: "psychology", label: "Developer Psychology", content: report.developerPsychology, icon: Target },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl">
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-1">
            <Code2 className="w-4 h-4 text-notionBlue" />
            <span className="text-xs font-bold uppercase tracking-wider text-notionGray">Code Archaeology</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Analyze Code</h1>
          <p className="text-xs text-notionGray mt-0.5">Reverse-engineer developer thinking from any codebase</p>
        </div>

        <form onSubmit={handleAnalyze} className="bg-white border border-notionBorder rounded-xl notion-shadow overflow-hidden mb-6 max-w-2xl">
          <div className="flex border-b border-notionBorder">
            {tabs.map((t) => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                tab === t.id ? "text-notionBlue border-b-2 border-notionBlue bg-notionBlue/5" : "text-notionGray hover:text-black"
              }`}>
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {tab === "paste" && (
              <textarea
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 text-xs font-mono border border-notionBorder rounded-[4px] outline-none focus:border-notionBlue resize-none bg-[#fafafa]"
              />
            )}
            {tab === "github" && (
              <input type="url" placeholder="https://github.com/username/repository" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 text-sm border border-notionBorder rounded-[4px] outline-none focus:border-notionBlue" />
            )}
            {tab === "website" && (
              <div>
                <input type="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 text-sm border border-notionBorder rounded-[4px] outline-none focus:border-notionBlue" />
                <p className="text-[10px] text-notionGray mt-1.5">Only public websites. Ensure you have permission to analyze.</p>
              </div>
            )}

            <div className="mt-4">
              <Button type="submit" disabled={isAnalyzing || (tab === "paste" ? !code.trim() : !url.trim())}>
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
                {isAnalyzing ? "Excavating code..." : "Analyze"}
              </Button>
            </div>
          </div>
        </form>

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-notionBlue animate-spin mb-3" />
            <p className="text-sm font-semibold">Running 6-agent pipeline...</p>
            <div className="flex gap-2 mt-3">
              {["Parsing", "Patterns", "History", "Psychology", "Scoring", "Evolution"].map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${i <= 2 ? "bg-notionBlue" : "bg-notionBorder"}`} />
                  <span className={`text-[9px] font-mono ${i <= 2 ? "text-notionBlue" : "text-notionGray"}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {report && !isAnalyzing && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">Archaeology Report</h2>
                <Badge variant="sky">6 agents</Badge>
              </div>
              <Button variant="secondary" size="sm">
                <Download className="w-3 h-3" /> Export PDF
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {[
                { label: "Originality", value: report.scores.originality, color: "text-stickerPurple" },
                { label: "Feasibility", value: report.scores.feasibility, color: "text-stickerTeal" },
                { label: "Market Potential", value: report.scores.market, color: "text-stickerSky" },
                { label: "Complexity Match", value: report.scores.complexity, color: "text-notionBlue" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-notionBorder rounded-xl notion-shadow p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-notionGray font-medium">{s.label}</span>
                    <BarChart3 className={`w-3.5 h-3.5 ${s.color}`} />
                  </div>
                  <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
                  <span className="text-[10px] text-notionGray ml-1">/100</span>
                </div>
              ))}
            </div>

            <div className="bg-white border border-notionBorder rounded-xl notion-shadow overflow-hidden mb-6">
              {sections.map((sec) => {
                const expanded = expandedSections.includes(sec.id);
                return (
                  <div key={sec.id} className="border-b border-notionBorder last:border-b-0">
                    <button onClick={() => toggleSection(sec.id)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f6f5f4] transition-colors">
                      <div className="flex items-center gap-2">
                        <sec.icon className="w-4 h-4 text-notionBlue" />
                        <span className="text-sm font-semibold">{sec.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-notionGray transition-transform ${expanded ? "rotate-90" : ""}`} />
                    </button>
                    {expanded && <div className="px-4 pb-4 text-xs text-notionGray leading-relaxed whitespace-pre-line">{sec.content}</div>}
                  </div>
                );
              })}
            </div>

            <div className="bg-white border border-notionBorder rounded-xl notion-shadow p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-notionGray mb-3">Suggested Future Versions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {report.futureVersions.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-[8px] border border-notionBorder hover:border-black/30 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-stickerTeal mt-0.5 shrink-0" />
                    <span className="text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!report && !isAnalyzing && (
          <div className="text-center py-16">
            <Code2 className="w-10 h-10 text-notionGray/30 mx-auto mb-3" />
            <p className="text-sm text-notionGray">Paste code or enter a URL to analyze</p>
            <p className="text-xs text-notionGray mt-1">Our 6-agent pipeline will reverse-engineer the architecture</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
