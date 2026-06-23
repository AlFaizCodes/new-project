"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight, Download, FileText, Monitor, Tablet, Smartphone, Eye, ExternalLink, CheckCircle2 } from "lucide-react";

type DeviceType = "desktop" | "tablet" | "mobile";

const deviceWidths: Record<DeviceType, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const blueprintSections = [
  { id: "overview", label: "Project Overview", content: "An autonomous drone delivery network powered by solar charging stations. The system uses AI-optimized flight paths to deliver packages within urban areas with zero emissions. Target market: eco-conscious e-commerce businesses and local delivery services." },
  { id: "prd", label: "PRD", content: "Objectives: Build a zero-emission drone delivery network. Key Features: Solar charging stations on rooftops, AI route optimization, real-time tracking, automated package handling. User Stories: As a business owner, I want to schedule deliveries. As a customer, I want real-time tracking. Acceptance Criteria: 95% on-time delivery rate, < 30min average delivery time." },
  { id: "tech-stack", label: "Tech Stack", content: "Frontend: Next.js 14 + TypeScript + Tailwind CSS + Mapbox GL. Backend: FastAPI + Celery + Redis + PostgreSQL. Drone Control: ROS 2 + PX4 Autopilot + MAVSDK. AI: PyTorch + ONNX Runtime + TensorRT. Infrastructure: AWS + Kubernetes + Terraform + Grafana." },
  { id: "database", label: "Database Schema", content: "Tables: users, drones, charging_stations, deliveries, flight_paths, packages, maintenance_logs. Key Relations: User 1:N Deliveries, Drone 1:N FlightPaths, ChargingStation 1:N Drones. Indexes: delivery_status, drone_location (GIST), flight_schedule. Partitioning: By month for flight_logs." },
  { id: "api", label: "API Design", content: "POST /api/deliveries — Create delivery, GET /api/deliveries/:id — Track delivery, POST /api/drones/:id/command — Send drone command, GET /api/stations/nearby — Find nearest charging station, WebSocket /ws/tracking — Real-time drone position updates." },
  { id: "user-flow", label: "User Flow", content: "1. Customer places order → 2. AI assigns optimal drone → 3. Drone launches from nearest station → 4. Real-time tracking displayed → 5. Drone lands at delivery point → 6. Package released → 7. Drone returns to station → 8. Customer confirms receipt" },
  { id: "implementation", label: "Implementation Plan", content: "Phase 1 (Weeks 1-4): Core infrastructure — drone control system, basic API, admin dashboard. Phase 2 (Weeks 5-8): AI route optimization, solar station management, mobile app. Phase 3 (Weeks 9-12): Real-time tracking, payment integration, security audit. Phase 4 (Weeks 13-16): Beta launch, performance tuning, documentation." },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"blueprint" | "mockup">("blueprint");
  const [expandedSection, setExpandedSection] = useState<string>("overview");
  const [device, setDevice] = useState<DeviceType>("desktop");

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-notionGray font-mono">Project / {params.id}</span>
              <Badge variant="purple">Generate</Badge>
              <Badge variant="default">Selected</Badge>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Solar Cargo Drone Network</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm"><Download className="w-3 h-3" /> Export</Button>
            <Button variant="utility" size="sm"><ExternalLink className="w-3 h-3" /> Share</Button>
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
              {blueprintSections.map((sec) => {
                const expanded = expandedSection === sec.id;
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
                        <div className="text-xs text-notionGray leading-relaxed bg-[#fafafa] border border-notionBorder rounded-[8px] p-3 whitespace-pre-line">
                          {sec.content}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="ghost" size="sm"><Download className="w-3 h-3" /> Copy</Button>
                          <Button variant="ghost" size="sm">Export Section</Button>
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
                <div className="flex gap-2">
                  <Button variant="utility" size="sm"><Download className="w-3 h-3" /> HTML</Button>
                  <Button variant="utility" size="sm"><Download className="w-3 h-3" /> ZIP</Button>
                </div>
              </div>

              <div className="bg-[#f0f0f0] rounded-xl border border-notionBorder overflow-hidden notion-shadow">
                <div className="bg-[#1a1a2e] text-white px-4 py-2 text-xs font-mono flex items-center justify-between">
                  <span>preview.html</span>
                  <span className="text-[10px] opacity-60">Dark theme / Modern style</span>
                </div>
                <div className="flex justify-center p-4" style={{ minHeight: "400px" }}>
                  <div
                    style={{ width: deviceWidths[device], transition: "width 0.3s ease" }}
                    className="bg-white rounded-[8px] border border-notionBorder overflow-hidden notion-shadow-sm"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center"><span className="text-[10px] text-white font-bold">I</span></div>
                          <span className="text-sm font-bold">IdeaDNA</span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-notionGray">
                          <span>Features</span><span>Pricing</span><span>Docs</span>
                        </div>
                      </div>
                      <div className="text-center py-8">
                        <h2 className="text-xl font-bold tracking-tight mb-2">Solar Cargo Drone Network</h2>
                        <p className="text-xs text-notionGray max-w-sm mx-auto mb-4">Zero-emission drone delivery powered by solar charging stations. Fast, green, and reliable.</p>
                        <div className="inline-flex items-center gap-2 bg-notionBlue text-white text-xs font-semibold px-4 py-2 rounded-full">
                          Get Started <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center border-t border-notionBorder pt-4 text-[10px] text-notionGray">
                        <div><span className="font-bold text-black text-xs">99.9%</span><br />Uptime</div>
                        <div><span className="font-bold text-black text-xs">5mi</span><br />Radius</div>
                        <div><span className="font-bold text-black text-xs">30min</span><br />Delivery</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-notionBlue/5 border border-notionBlue/30 rounded-xl p-4 notion-shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-notionBlue" />
              <span className="text-sm font-semibold">Blueprint & UI mockup ready</span>
            </div>
            <div className="flex gap-2">
              <Button variant="utility" size="sm"><Download className="w-3 h-3" /> Export All</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
