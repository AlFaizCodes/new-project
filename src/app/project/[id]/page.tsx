"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import RadarChart from "@/components/RadarChart";
import { projectApi, ideaApi, mockupApi, scoreApi } from "@/lib/api";
import { ChevronRight, Download, FileText, Monitor, Tablet, Smartphone, Eye, CheckCircle2, Loader2, AlertTriangle, RefreshCw, BarChart3 } from "lucide-react";

type DeviceType = "desktop" | "tablet" | "mobile";
type TabType = "blueprint" | "mockup" | "scores";

const deviceWidths: Record<DeviceType, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const styleVariants = ["MODERN", "MINIMAL", "PLAYFUL", "CORPORATE", "DARK"];
const screenTypes = ["landing", "dashboard", "mobile", "settings"];

interface ProjectData {
  id: number;
  title: string;
  mode: string;
  status: string;
  platform?: string;
  selected_idea_id?: number | null;
  ideas?: Array<{
    id: number;
    title: string;
    innovation_score?: number;
    feasibility_score?: number;
    description?: string;
    platform?: string;
    tags?: string[];
    suggested_stack?: Record<string, string>;
  }>;
}

interface MockupData {
  id: number;
  html: string;
  style_variant?: string;
}

function formatBlueprintContent(value: unknown): string {
  if (!value) return "No data available.";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((v: unknown) => typeof v === "string" ? v : JSON.stringify(v, null, 2)).join("\n");
  return JSON.stringify(value, null, 2);
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [blueprint, setBlueprint] = useState<Record<string, unknown> | null>(null);
  const [mockup, setMockup] = useState<MockupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("blueprint");
  const [expandedSection, setExpandedSection] = useState<string>("overview");
  const [device, setDevice] = useState<DeviceType>("desktop");

  // Guide 5: Mockup customisation
  const [mockupStyle, setMockupStyle] = useState("MODERN");
  const [mockupScreen, setMockupScreen] = useState("landing");
  const [generatingMockup, setGeneratingMockup] = useState(false);

  // Guide 6: Scoring
  const [scores, setScores] = useState<Record<string, unknown> | null>(null);
  const [loadingScores, setLoadingScores] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      const projectId = Number(params.id);
      const proj = await projectApi.get(projectId);
      setProject(proj as unknown as ProjectData);

      const ideas = await projectApi.ideas(projectId);
      const projAny = proj as unknown as ProjectData;
      const selectedIdea = ideas.find((i) => i.id === projAny.selected_idea_id) || ideas[0];
      (projAny as ProjectData).ideas = ideas as unknown as ProjectData["ideas"];
      setProject(projAny);

      if (selectedIdea) {
        try {
          const bp = await ideaApi.blueprint(selectedIdea.id);
          setBlueprint(bp as unknown as Record<string, unknown>);
        } catch {
          setBlueprint(null);
        }
        try {
          const mu = await ideaApi.mockup(selectedIdea.id);
          setMockup(mu as unknown as MockupData);
        } catch {
          setMockup(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  const handleGenerateMockup = async () => {
    const projectId = Number(params.id);
    const ideas = project?.ideas || [];
    const first = ideas[0];
    if (!first) return;

    setGeneratingMockup(true);
    try {
      const result = await mockupApi.generate(first.id, projectId, mockupStyle, mockupScreen);
      setMockup({
        id: first.id,
        html: result.data.html,
        style_variant: result.data.style_variant,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mockup generation failed");
    } finally {
      setGeneratingMockup(false);
    }
  };

  const handleExportBlueprint = (format: "markdown" | "json") => {
    const ideas = project?.ideas || [];
    const first = ideas[0];
    if (!first) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/export/blueprint/${first.id}/${format}`;
    window.open(url, "_blank");
  };

  const handleExportMockup = () => {
    if (!mockup) return;
    const blob = new Blob([mockup.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mockup-${params.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleLoadScores = async () => {
    const ideas = project?.ideas || [];
    const first = ideas[0];
    if (!first) return;

    setLoadingScores(true);
    try {
      const scoreResult = await scoreApi.scoreIdea({
        title: first.title,
        description: first.description || "",
        platform: first.platform,
        innovation_score: first.innovation_score,
        feasibility_score: first.feasibility_score,
      });
      setScores(scoreResult.data);
      setActiveTab("scores");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scoring failed");
    } finally {
      setLoadingScores(false);
    }
  };

  const blueprintSectionsMeta = [
    { id: "overview", label: "Project Overview", field: "overview" },
    { id: "prd", label: "PRD", field: "prd" },
    { id: "tech-stack", label: "Tech Stack", field: "tech_stack" },
    { id: "database", label: "Database Schema", field: "database_schema" },
    { id: "api", label: "API Design", field: "api_design" },
    { id: "user-flow", label: "User Flow", field: "user_flow" },
    { id: "implementation", label: "Implementation Plan", field: "implementation_plan" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-6 h-6 text-notionBlue animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-6xl">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold text-red-700">{error}</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-notionGray font-mono">Project / {params.id}</span>
              <Badge variant="purple">{project?.mode || "Generate"}</Badge>
              {project?.status === "SELECTED" && <Badge variant="default">Selected</Badge>}
            </div>
            <h1 className="text-xl font-bold tracking-tight">{project?.title || "Untitled Project"}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleLoadScores} disabled={loadingScores}>
              {loadingScores ? <Loader2 className="w-3 h-3 animate-spin" /> : <BarChart3 className="w-3 h-3" />}
              Score
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleExportBlueprint("markdown")}>
              <Download className="w-3 h-3" /> Export MD
            </Button>
            <Button variant="utility" size="sm" onClick={() => handleExportBlueprint("json")}>
              <FileText className="w-3 h-3" /> JSON
            </Button>
          </div>
        </div>

        <div className="bg-white border border-notionBorder rounded-xl notion-shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-notionBorder">
            {(["blueprint", "mockup", "scores"] as TabType[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === tab ? "text-notionBlue border-b-2 border-notionBlue bg-notionBlue/5" : "text-notionGray hover:text-black"
                }`}>
                {tab === "blueprint" && <FileText className="w-3.5 h-3.5" />}
                {tab === "mockup" && <Eye className="w-3.5 h-3.5" />}
                {tab === "scores" && <BarChart3 className="w-3.5 h-3.5" />}
                {tab === "blueprint" ? "Blueprint" : tab === "mockup" ? "UI Mockup" : "Scores"}
              </button>
            ))}
          </div>

          {/* ── Blueprint ── */}
          {activeTab === "blueprint" && (
            <div className="divide-y divide-notionBorder">
              {blueprintSectionsMeta.map((sec) => {
                const expanded = expandedSection === sec.id;
                const content = blueprint ? formatBlueprintContent(blueprint[sec.field]) : "Not generated yet. Select this idea in the generator to create a blueprint.";
                return (
                  <div key={sec.id}>
                    <button onClick={() => setExpandedSection(expanded ? "" : sec.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f6f5f4] transition-colors">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${expanded ? "bg-notionBlue" : "bg-notionBorder"}`} />
                        <span className="text-sm font-semibold">{sec.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-notionGray transition-transform ${expanded ? "rotate-90" : ""}`} />
                    </button>
                    {expanded && (
                      <div className="px-4 pb-4">
                        <div className="text-xs text-notionGray leading-relaxed bg-[#fafafa] border border-notionBorder rounded-[8px] p-3 whitespace-pre-line font-mono">{content}</div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="ghost" size="sm" onClick={() => handleCopyContent(content)}>
                            <Download className="w-3 h-3" /> Copy
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Mockup ── */}
          {activeTab === "mockup" && (
            <div className="p-4">
              {/* Style & Screen Picker */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-notionGray uppercase">Style:</span>
                  {styleVariants.map((s) => (
                    <button key={s} onClick={() => setMockupStyle(s)}
                      className={`text-[10px] px-2 py-1 rounded-full border transition-all ${
                        mockupStyle === s ? "bg-notionBlue text-white border-notionBlue" : "border-notionBorder hover:border-black"
                      }`}>{s}</button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-notionGray uppercase">Screen:</span>
                  {screenTypes.map((s) => (
                    <button key={s} onClick={() => setMockupScreen(s)}
                      className={`text-[10px] px-2 py-1 rounded-full border transition-all capitalize ${
                        mockupScreen === s ? "bg-notionBlue text-white border-notionBlue" : "border-notionBorder hover:border-black"
                      }`}>{s}</button>
                  ))}
                </div>
                <Button variant="utility" size="sm" onClick={handleGenerateMockup} disabled={generatingMockup}>
                  {generatingMockup ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  Generate
                </Button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setDevice("desktop")}
                    className={`p-1.5 rounded-[6px] border transition-all ${device === "desktop" ? "border-notionBlue bg-notionBlue/5" : "border-notionBorder"}`}>
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDevice("tablet")}
                    className={`p-1.5 rounded-[6px] border transition-all ${device === "tablet" ? "border-notionBlue bg-notionBlue/5" : "border-notionBorder"}`}>
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDevice("mobile")}
                    className={`p-1.5 rounded-[6px] border transition-all ${device === "mobile" ? "border-notionBlue bg-notionBlue/5" : "border-notionBorder"}`}>
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
                <Button variant="utility" size="sm" onClick={handleExportMockup}>
                  <Download className="w-3 h-3" /> HTML
                </Button>
              </div>

              <div className="bg-[#f0f0f0] rounded-xl border border-notionBorder overflow-hidden notion-shadow">
                <div className="bg-[#1a1a2e] text-white px-4 py-2 text-xs font-mono flex items-center justify-between">
                  <span>preview.html — {mockup?.style_variant || mockupStyle} / {mockupScreen}</span>
                  <span className="text-[10px] opacity-60">{device} view</span>
                </div>
                <div className="flex justify-center p-4" style={{ minHeight: "400px" }}>
                  {mockup ? (
                    <div style={{ width: deviceWidths[device], transition: "width 0.3s ease" }}>
                      <iframe srcDoc={mockup.html} className="w-full bg-white rounded-[8px] border border-notionBorder"
                        style={{ height: "500px", border: "none" }} title="UI Mockup Preview" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-16 text-notionGray">
                      <Eye className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">No UI mockup generated yet</p>
                      <p className="text-xs mt-1">Select a style and screen type, then click Generate</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Scores ── */}
          {activeTab === "scores" && (
            <div className="p-4">
              {scores ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold tracking-tight">Innovation Scores</h3>
                    <Badge variant="default">{scores.verdict as string}</Badge>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Radar Chart */}
                    <div className="bg-[#fafafa] border border-notionBorder rounded-xl p-4 flex-shrink-0">
                      <RadarChart
                        data={[
                          { axis: "originality", value: (scores.originality || 50) as number },
                          { axis: "feasibility", value: (scores.feasibility || 50) as number },
                          { axis: "market_potential", value: (scores.market_potential || 50) as number },
                          { axis: "complexity_match", value: (scores.complexity_match || 50) as number },
                          { axis: "scalability", value: (scores.scalability || 50) as number },
                          { axis: "revenue_potential", value: (scores.revenue_potential || 50) as number },
                          { axis: "competitive_edge", value: (scores.competitive_edge || 50) as number },
                          { axis: "time_to_market", value: (scores.time_to_market || 50) as number },
                        ]}
                        size={260}
                      />
                    </div>

                    {/* Score Details */}
                    <div className="flex-1 space-y-2">
                      {[
                        { key: "originality", label: "Originality" },
                        { key: "feasibility", label: "Feasibility" },
                        { key: "market_potential", label: "Market Potential" },
                        { key: "complexity_match", label: "Complexity Match" },
                        { key: "scalability", label: "Scalability" },
                        { key: "revenue_potential", label: "Revenue Potential" },
                        { key: "competitive_edge", label: "Competitive Edge" },
                        { key: "time_to_market", label: "Time to Market" },
                      ].map((dim) => {
                        const val = (scores[dim.key] || 50) as number;
                        return (
                          <div key={dim.key} className="flex items-center gap-3">
                            <span className="text-[10px] font-medium text-notionGray w-28 text-right">{dim.label}</span>
                            <div className="flex-1 h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${val}%`,
                                  backgroundColor: val >= 80 ? "#16a34a" : val >= 60 ? "#ca8a04" : "#dc2626",
                                }} />
                            </div>
                            <span className="text-[11px] font-bold w-8 text-right"
                              style={{ color: val >= 80 ? "#16a34a" : val >= 60 ? "#ca8a04" : "#dc2626" }}>{val}</span>
                          </div>
                        );
                      })}

                      {/* Recommendation */}
                      {(scores.recommendation as string) && (
                        <div className="mt-4 pt-4 border-t border-notionBorder">
                          <span className="text-[10px] font-semibold text-notionGray uppercase">Recommendation</span>
                          <p className="text-xs text-black mt-1">{scores.recommendation as string}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-notionGray">
                  <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No scores yet</p>
                  <p className="text-xs mt-1">Click the Score button to analyze this idea</p>
                </div>
              )}
            </div>
          )}
        </div>

        {blueprint && (
          <div className="bg-notionBlue/5 border border-notionBlue/30 rounded-xl p-4 notion-shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-notionBlue" />
                <span className="text-sm font-semibold">Blueprint & UI mockup ready</span>
              </div>
              <div className="flex gap-2">
                {scores && (
                  <Badge variant="sky">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {(scores.overall as number) || 0}/100
                  </Badge>
                )}
                <Button variant="utility" size="sm" onClick={() => handleExportBlueprint("markdown")}>
                  <Download className="w-3 h-3" /> Export All
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
