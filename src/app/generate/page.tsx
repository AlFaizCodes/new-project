"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ideaApi, userApi,
  type GeneratorCard, type UserProfile,
} from "@/lib/api";
import {
  Sparkles, Search, ArrowUpRight, Lightbulb, ChevronDown,
  RefreshCw, CheckCircle2, Loader2, Zap, Users, DollarSign, Clock,
  BookOpen, Target, BarChart3, UserCheck,
} from "lucide-react";

const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), { ssr: false });

const PLATFORMS = [
  { id: "WEB", label: "Web App", icon: "🌐" },
  { id: "MOBILE", label: "Mobile App", icon: "📱" },
  { id: "AI_ML", label: "AI/ML", icon: "🤖" },
  { id: "BLOCKCHAIN", label: "Blockchain", icon: "⛓️" },
  { id: "IOT", label: "IoT", icon: "📡" },
  { id: "DESKTOP", label: "Desktop", icon: "💻" },
  { id: "EXTENSION", label: "Extension", icon: "🧩" },
  { id: "API_BACKEND", label: "API/Backend", icon: "🔌" },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: "text-emerald-600 bg-emerald-50 border-emerald-200",
  MEDIUM: "text-amber-600 bg-amber-50 border-amber-200",
  HARD: "text-red-600 bg-red-50 border-red-200",
};

const VERDICT_COLORS: Record<string, string> = {
  EXCELLENT: "text-emerald-600",
  GOOD: "text-blue-600",
  AVERAGE: "text-amber-600",
  POOR: "text-red-600",
};

export default function GeneratePage() {
  const [selectedPlatform, setSelectedPlatform] = useState("WEB");
  const [problem, setProblem] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [cards, setCards] = useState<GeneratorCard[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState<number | null>(null);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [deepDiveLoading, setDeepDiveLoading] = useState(false);

  useEffect(() => {
    userApi.getProfile().then((u) => setProfile({
      skill_level: u.skill_level,
      budget: u.budget,
      team_size: u.team_size,
      timeline: u.timeline,
      tech_prefs: u.tech_prefs,
      industry: u.industry || undefined,
    })).catch(() => {});
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || isGenerating) return;
    setIsGenerating(true);
    setCards([]);
    setSelectedIdeaId(null);

    try {
      const result = await ideaApi.generate(problem, selectedPlatform);
      if (result.data.project_id) setProjectId(result.data.project_id);
      setCards(result.data.cards || []);
    } catch {
      // Fallback mock cards using curated idea style
      setCards([
        { title: "AI Study Companion", description: "Personalized AI tutor adapting to each student's learning style using GPT-4.", problem_statement: problem, solution: "AI-powered adaptive learning platform", key_features: ["Adaptive learning", "Progress tracking", "AI tutoring"], innovation_score: 88, feasibility_score: 75, difficulty: "MEDIUM", difficulty_badge: { variant: "sky", label: "Medium" }, platform: selectedPlatform, platform_icon: "🤖", suggested_stack: { frontend: "React", backend: "Python", database: "PostgreSQL" }, upgrade_notes: ["Personalized for beginner"], tags: ["AI", "Education"], scores: { originality: 85, feasibility: 78, market_potential: 90, complexity_match: 72, overall: 82, verdict: "GOOD" }, card_colors: { bg: "bg-blue-50", border: "border-blue-400", badge: "blue", score: "text-blue-600" }, overall_score: 82, is_curated: false, curated_source: null },
        { title: "SkillSwap Marketplace", description: "Peer-to-peer skill exchange using time-based credits — no money needed.", problem_statement: problem, solution: "P2P skill bartering platform", key_features: ["Skill listing", "Time credits", "Matching"], innovation_score: 82, feasibility_score: 68, difficulty: "MEDIUM", difficulty_badge: { variant: "sky", label: "Medium" }, platform: selectedPlatform, platform_icon: "🌐", suggested_stack: { frontend: "Next.js", backend: "Node.js", database: "PostgreSQL" }, upgrade_notes: ["Simplified for MVP"], tags: ["Marketplace", "Community"], scores: { originality: 88, feasibility: 65, market_potential: 80, complexity_match: 70, overall: 76, verdict: "GOOD" }, card_colors: { bg: "bg-blue-50", border: "border-blue-400", badge: "blue", score: "text-blue-600" }, overall_score: 76, is_curated: false, curated_source: null },
        { title: "GreenCommute Router", description: "AI route planner optimizing for lowest carbon footprint across all transport.", problem_statement: problem, solution: "Carbon-first navigation", key_features: ["Multi-modal", "Carbon calc", "Route opt"], innovation_score: 90, feasibility_score: 55, difficulty: "HARD", difficulty_badge: { variant: "default", label: "Hard" }, platform: selectedPlatform, platform_icon: "📱", suggested_stack: { frontend: "Flutter", backend: "Python", database: "PostgreSQL" }, upgrade_notes: ["Advanced AI integration"], tags: ["Climate", "AI", "Maps"], scores: { originality: 92, feasibility: 52, market_potential: 78, complexity_match: 60, overall: 70, verdict: "GOOD" }, card_colors: { bg: "bg-amber-50", border: "border-amber-400", badge: "amber", score: "text-amber-600" }, overall_score: 70, is_curated: false, curated_source: null },
        { title: "DevHealth Dashboard", description: "Developer wellness tool analyzing coding patterns to prevent burnout.", problem_statement: problem, solution: "Code pattern wellness analysis", key_features: ["Pattern analysis", "Burnout risk", "Insights"], innovation_score: 76, feasibility_score: 82, difficulty: "MEDIUM", difficulty_badge: { variant: "sky", label: "Medium" }, platform: selectedPlatform, platform_icon: "💻", suggested_stack: { frontend: "React", backend: "Python", database: "PostgreSQL" }, upgrade_notes: ["Focused on solo devs"], tags: ["Developer", "Wellness"], scores: { originality: 78, feasibility: 80, market_potential: 65, complexity_match: 75, overall: 74, verdict: "GOOD" }, card_colors: { bg: "bg-blue-50", border: "border-blue-400", badge: "blue", score: "text-blue-600" }, overall_score: 74, is_curated: false, curated_source: null },
        { title: "Hackathon Hub", description: "End-to-end hackathon platform — idea gen, team matching, project management.", problem_statement: problem, solution: "All-in-one hackathon management", key_features: ["Idea gen", "Team matching", "Judging"], innovation_score: 80, feasibility_score: 72, difficulty: "MEDIUM", difficulty_badge: { variant: "sky", label: "Medium" }, platform: selectedPlatform, platform_icon: "🧩", suggested_stack: { frontend: "Next.js", backend: "Supabase", database: "PostgreSQL" }, upgrade_notes: ["Added team features"], tags: ["Hackathon", "Community"], scores: { originality: 82, feasibility: 70, market_potential: 85, complexity_match: 68, overall: 76, verdict: "GOOD" }, card_colors: { bg: "bg-blue-50", border: "border-blue-400", badge: "blue", score: "text-blue-600" }, overall_score: 76, is_curated: false, curated_source: null },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelect = async (card: GeneratorCard) => {
    if (!card.id) return;
    setSelectedIdeaId(card.id);
    setDeepDiveLoading(true);
    try {
      if (projectId) {
        await ideaApi.select(card.id, projectId);
        window.location.href = `/project/${projectId}`;
      }
    } catch {
      // Fallback: navigate to project detail
      if (projectId) window.location.href = `/project/${projectId}`;
    } finally {
      setDeepDiveLoading(false);
    }
  };

  const plat = PLATFORMS.find((p) => p.id === selectedPlatform);

  return (
    <DashboardLayout>
      <ThreeBackground variant="particles" />
      <div className="p-6 max-w-6xl relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-1">
            <Lightbulb className="w-4 h-4 text-notionBlue" />
            <span className="text-xs font-bold uppercase tracking-wider text-notionGray">Idea Generator</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">AI-Powered Idea Engine</h1>
          <p className="text-xs text-notionGray mt-0.5">
            Curated database (500+ ideas) + AI upgrade — personalized to your profile
          </p>
        </div>

        {/* Profile Bar */}
        {profile && (
          <div className="bg-white/90 backdrop-blur-md border border-notionBorder rounded-xl p-3 mb-4 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-notionGray">
              <UserCheck className="w-3 h-3" /> {profile.skill_level}
            </span>
            <span className="flex items-center gap-1 text-notionGray">
              <DollarSign className="w-3 h-3" /> ${profile.budget}
            </span>
            <span className="flex items-center gap-1 text-notionGray">
              <Users className="w-3 h-3" /> {profile.team_size}
            </span>
            <span className="flex items-center gap-1 text-notionGray">
              <Clock className="w-3 h-3" /> {profile.timeline}
            </span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="bg-white/90 backdrop-blur-md border border-notionBorder rounded-xl notion-shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                className="flex items-center gap-2 px-3 py-2.5 border border-notionBorder rounded-[4px] text-xs font-medium bg-white hover:bg-[#f6f5f4] min-w-[130px]"
              >
                {plat?.icon} {plat?.label || "Select Platform"} <ChevronDown className="w-3 h-3 ml-auto" />
              </button>
              {showPlatformDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-notionBorder rounded-[8px] notion-shadow z-20 w-44 py-1 max-h-64 overflow-y-auto">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setSelectedPlatform(p.id); setShowPlatformDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#f6f5f4] flex items-center gap-2 ${selectedPlatform === p.id ? "font-semibold text-notionBlue" : "text-black"}`}
                    >
                      {p.icon} {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-notionGray" />
              <input
                type="text"
                placeholder='e.g. "AI tool for students"'
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 text-sm border border-notionBorder rounded-[4px] outline-none focus:border-notionBlue bg-white"
                disabled={isGenerating}
              />
            </div>
            <Button type="submit" disabled={isGenerating || !problem.trim()}>
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? "Searching Curated DB..." : "Generate Ideas"}
            </Button>
          </div>
        </form>

        {/* Pipeline Steps Indicator */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-notionBlue animate-spin mb-4" />
            <div className="text-center">
              <p className="text-sm font-bold">6-Stage Agent Pipeline Active</p>
              <div className="flex gap-2 mt-3 flex-wrap justify-center">
                {["Parse", "Retrieve", "Rank", "Upgrade", "Score", "Format"].map((s, i) => (
                  <div key={s} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${i <= 2 ? "bg-notionBlue animate-pulse" : "bg-notionBorder"}`} />
                    <span className={`text-[10px] font-mono ${i <= 2 ? "text-notionBlue" : "text-notionGray"}`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {cards.length > 0 && !isGenerating && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <h2 className="text-sm font-bold">Curated + AI-Upgraded Ideas</h2>
                <Badge variant="purple">{cards.length} ideas</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setCards([]); setProblem(""); }}>
                <RefreshCw className="w-3 h-3" /> New Search
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className={`group bg-white/90 backdrop-blur-md border rounded-xl p-5 notion-shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col ${
                    selectedIdeaId === (card.id || idx) ? "border-notionBlue ring-2 ring-notionBlue/30" : "border-notionBorder"
                  }`}
                  style={{ animationDelay: `${idx * 100}ms`, animation: "fadeInUp 0.5s ease-out both" }}
                >
                  {/* Header: Platform Icon + Difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{card.platform_icon}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[card.difficulty] || "text-gray-600 bg-gray-50 border-gray-200"}`}>
                        {card.difficulty_badge?.label || card.difficulty}
                      </span>
                    </div>
                    <span className={`text-xs font-bold font-mono ${VERDICT_COLORS[card.scores?.verdict] || "text-gray-600"}`}>
                      {card.scores?.overall || card.overall_score}/100
                    </span>
                  </div>

                  {/* Score Bar */}
                  <div className="flex gap-2 mb-3">
                    {[
                      { label: "Originality", value: card.scores?.originality },
                      { label: "Feasibility", value: card.scores?.feasibility },
                      { label: "Market", value: card.scores?.market_potential },
                    ].map((s) => (
                      <div key={s.label} className="flex-1">
                        <div className="text-[8px] text-notionGray uppercase mb-0.5">{s.label}</div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-notionBlue transition-all" style={{ width: `${s.value || 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold tracking-tight mb-1.5 leading-snug">{card.title}</h3>
                  <p className="text-xs text-notionGray leading-relaxed mb-3 flex-1 line-clamp-3">{card.description}</p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    {card.tags?.slice(0, 3).map((t) => (
                      <span key={t} className="text-[9px] bg-stickerPurple/10 text-stickerPurple px-1.5 py-0.5 rounded font-medium">{t}</span>
                    ))}
                    {card.upgrade_notes?.slice(0, 1).map((n) => (
                      <span key={n} className="text-[9px] bg-stickerTeal/10 text-stickerTeal px-1.5 py-0.5 rounded font-medium">↑ {n}</span>
                    ))}
                  </div>

                  {/* Stack */}
                  {card.suggested_stack && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {Object.entries(card.suggested_stack).slice(0, 3).map(([key, val]) => (
                        <span key={key} className="text-[9px] text-notionGray bg-[#f0f0f0] px-1.5 py-0.5 rounded font-mono">
                          {key}: {val as string}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Select / Selected */}
                  {selectedIdeaId === (card.id || idx) ? (
                    <div className="flex items-center gap-2 text-xs text-notionBlue font-semibold">
                      <Loader2 className={`w-4 h-4 ${deepDiveLoading ? "animate-spin" : ""}`} />
                      {deepDiveLoading ? "Generating Blueprint..." : <><CheckCircle2 className="w-4 h-4" /> Selected</>}
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => card.id ? handleSelect(card) : null}
                      disabled={!card.id}
                    >
                      Select & Deep Dive <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {cards.length === 0 && !isGenerating && (
          <div className="text-center py-20">
            <Lightbulb className="w-12 h-12 text-notionGray/30 mx-auto mb-3" />
            <p className="text-sm text-notionGray font-semibold">Enter a problem above</p>
            <p className="text-xs text-notionGray mt-1">AI searches 500+ curated ideas and upgrades them for you</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-notionGray">
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> 500+ curated ideas</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> AI upgrade pipeline</span>
              <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Profile-personalized</span>
              <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> 4D scoring</span>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DashboardLayout>
  );
}
