"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { projectApi, ideaApi } from "@/lib/api";
import { ChevronRight, Download, FileText, Monitor, Tablet, Smartphone, Eye, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

type DeviceType = "desktop" | "tablet" | "mobile";
type TabType = "blueprint" | "mockup";

const deviceWidths: Record<DeviceType, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

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
  }>;
}

interface BlueprintData {
  overview: string;
  prd: Record<string, unknown>;
  tech_stack: Record<string, unknown>;
  database_schema: Record<string, unknown>;
  api_design: Record<string, unknown>;
  user_flow: Array<unknown>;
  implementation_plan: Record<string, unknown>;
}

interface MockupData {
  id: number;
  html: string;
  style_variant?: string;
}

const blueprintSectionsMeta = [
  { id: "overview", label: "Project Overview", field: "overview" },
  { id: "prd", label: "PRD", field: "prd" },
  { id: "tech-stack", label: "Tech Stack", field: "tech_stack" },
  { id: "database", label: "Database Schema", field: "database_schema" },
  { id: "api", label: "API Design", field: "api_design" },
  { id: "user-flow", label: "User Flow", field: "user_flow" },
  { id: "implementation", label: "Implementation Plan", field: "implementation_plan" },
];

function formatBlueprintContent(value: unknown): string {
  if (!value) return "No data available.";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((v: unknown) => typeof v === "string" ? v : JSON.stringify(v, null, 2)).join("\n");
  return JSON.stringify(value, null, 2);
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null);
  const [mockup, setMockup] = useState<MockupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("blueprint");
  const [expandedSection, setExpandedSection] = useState<string>("overview");
  const [device, setDevice] = useState<DeviceType>("desktop");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectId = Number(params.id);
        const proj = await projectApi.get(projectId);
        setProject(proj as unknown as ProjectData);

        const ideas = await projectApi.ideas(projectId);
        const projAny = proj as unknown as ProjectData;
        const selectedIdea = ideas.find((i) => i.id === projAny.selected_idea_id) || ideas[0];

        if (selectedIdea) {
          try {
            const bp = await ideaApi.blueprint(selectedIdea.id);
            setBlueprint(bp as unknown as BlueprintData);
          } catch {
            setBlueprint(null);
          }
          try {
            const mu = await ideaApi.mockup(selectedIdea.id);
            setMockup(mu as unknown as MockupData);
          } catch {
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

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

  const handleSectionCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

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
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold text-red-700">{error}</span>
            </div>
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
            <button onClick={() => setActiveTab("blueprint")} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors ${
              activeTab === "blueprint" ? "text-notionBlue border-b-2 border-notionBlue bg-notionBlue/5" : "text-notionGray hover:text-black"
            }`}>
              <FileText className="w-3.5 h-3.5" /> Blueprint
            </button>
            <button onClick={() => setActiveTab("mockup")} className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors ${
              activeTab === "mockup" ? "text-notionBlue border-b-2 border-notionBlue bg-notionBlue/5" : "text-notionGray hover:text-black"
            }`}>
              <Eye className="w-3.5 h-3.5" /> UI Mockup
            </button>
          </div>

          {activeTab === "blueprint" && (
            <div className="divide-y divide-notionBorder">
              {blueprintSectionsMeta.map((sec) => {
                const expanded = expandedSection === sec.id;
                const content = blueprint ? formatBlueprintContent((blueprint as unknown as Record<string, unknown>)[sec.field]) : "Loading...";
                return (
                  <div key={sec.id}>
                    <button onClick={() => setExpandedSection(expanded ? "" : sec.id)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f6f5f4] transition-colors">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${expanded ? "bg-notionBlue" : "bg-notionBorder"}`} />
                        <span className="text-sm font-semibold">{sec.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-notionGray transition-transform ${expanded ? "rotate-90" : ""}`} />
                    </button>
                    {expanded && (
                      <div className="px-4 pb-4">
                        <div className="text-xs text-notionGray leading-relaxed bg-[#fafafa] border border-notionBorder rounded-[8px] p-3 whitespace-pre-line font-mono">
                          {content}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="ghost" size="sm" onClick={() => handleSectionCopy(content)}>
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

          {activeTab === "mockup" && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setDevice("desktop")} className={`p-1.5 rounded-[6px] border transition-all ${device === "desktop" ? "border-notionBlue bg-notionBlue/5" : "border-notionBorder"}`}>
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDevice("tablet")} className={`p-1.5 rounded-[6px] border transition-all ${device === "tablet" ? "border-notionBlue bg-notionBlue/5" : "border-notionBorder"}`}>
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDevice("mobile")} className={`p-1.5 rounded-[6px] border transition-all ${device === "mobile" ? "border-notionBlue bg-notionBlue/5" : "border-notionBorder"}`}>
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
                <Button variant="utility" size="sm" onClick={handleExportMockup}>
                  <Download className="w-3 h-3" /> HTML
                </Button>
              </div>

              <div className="bg-[#f0f0f0] rounded-xl border border-notionBorder overflow-hidden notion-shadow">
                <div className="bg-[#1a1a2e] text-white px-4 py-2 text-xs font-mono flex items-center justify-between">
                  <span>preview.html — {mockup?.style_variant || "Modern"}</span>
                  <span className="text-[10px] opacity-60">{device} view</span>
                </div>
                <div className="flex justify-center p-4" style={{ minHeight: "400px" }}>
                  {mockup ? (
                    <div style={{ width: deviceWidths[device], transition: "width 0.3s ease" }}>
                      <iframe
                        srcDoc={mockup.html}
                        className="w-full bg-white rounded-[8px] border border-notionBorder"
                        style={{ height: "500px", border: "none" }}
                        title="UI Mockup Preview"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-16 text-notionGray">
                      <Eye className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">No UI mockup generated yet</p>
                      <p className="text-xs mt-1">Select this idea to generate a mockup</p>
                    </div>
                  )}
                </div>
              </div>
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
              <Button variant="utility" size="sm" onClick={() => handleExportBlueprint("markdown")}>
                <Download className="w-3 h-3" /> Export All
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
