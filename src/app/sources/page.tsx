"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import dynamic from "next/dynamic";
import {
  Globe, Database, RefreshCw, CheckCircle2, XCircle, Clock,
  ExternalLink, Key, Server, Activity,
} from "lucide-react";

const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), { ssr: false });

const sources = [
  { name: "Devpost", icon: "🏆", url: "devpost.com/software", type: "Public Scrape", status: "connected", lastFetch: "2 min ago", ideas: 142, rateLimit: "Unlimited" },
  { name: "Product Hunt", icon: "🚀", url: "api.producthunt.com/v2", type: "API (free tier)", status: "connected", lastFetch: "15 min ago", ideas: 89, rateLimit: "100 req/min" },
  { name: "GitHub", icon: "💻", url: "api.github.com/search", type: "API (token)", status: "connected", lastFetch: "5 min ago", ideas: 234, rateLimit: "60 req/hr" },
  { name: "Hacker News", icon: "📰", url: "hacker-news.firebaseio.com", type: "Firebase API", status: "connected", lastFetch: "1 min ago", ideas: 67, rateLimit: "Unlimited" },
  { name: "Reddit", icon: "💬", url: "oauth.reddit.com", type: "API (OAuth)", status: "connected", lastFetch: "10 min ago", ideas: 156, rateLimit: "100 req/min" },
  { name: "Indie Hackers", icon: "🏗️", url: "indiehackers.com", type: "Scrape", status: "pending", lastFetch: "—", ideas: 0, rateLimit: "Manual" },
  { name: "Crunchbase", icon: "🏢", url: "api.crunchbase.com", type: "API (paid)", status: "disabled", lastFetch: "—", ideas: 0, rateLimit: "Paid plan" },
];

const stats = [
  { label: "Total Ideas", value: "688", icon: Database, color: "text-notionBlue" },
  { label: "Active Sources", value: "5", icon: Server, color: "text-stickerTeal" },
  { label: "Today's Fetches", value: "1,247", icon: Activity, color: "text-stickerPurple" },
  { label: "AI Enhanced", value: "342", icon: RefreshCw, color: "text-stickerSky" },
];

export default function SourcesPage() {
  const [fetching, setFetching] = useState<string | null>(null);

  const handleFetch = async (source: string) => {
    setFetching(source);
    await new Promise((r) => setTimeout(r, 2000));
    setFetching(null);
  };

  return (
    <DashboardLayout>
      <ThreeBackground variant="particles" />
      <div className="p-6 max-w-6xl relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Globe className="w-4 h-4 text-notionBlue" />
              <span className="text-xs font-bold uppercase tracking-wider text-notionGray">Data Sources</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Source Integration Hub</h1>
            <p className="text-xs text-notionGray mt-0.5">Manage API connections, trigger fetches, monitor rate limits</p>
          </div>
          <Button onClick={() => handleFetch("all")} disabled={fetching === "all"}>
            <RefreshCw className={`w-3.5 h-3.5 ${fetching === "all" ? "animate-spin" : ""}`} />
            Fetch All Sources
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/90 backdrop-blur-md border border-notionBorder rounded-xl notion-shadow p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-[11px] text-notionGray font-medium">{s.label}</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {sources.map((source) => (
            <div key={source.name} className="bg-white/90 backdrop-blur-md border border-notionBorder rounded-xl notion-shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{source.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{source.name}</span>
                      <Badge variant={source.type === "API (paid)" ? "default" : source.type.includes("API") ? "teal" : "sky"}>
                        {source.type}
                      </Badge>
                      {source.status === "connected" && <CheckCircle2 className="w-3.5 h-3.5 text-stickerTeal" />}
                      {source.status === "pending" && <Clock className="w-3.5 h-3.5 text-yellow-500" />}
                      {source.status === "disabled" && <XCircle className="w-3.5 h-3.5 text-notionGray" />}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-notionGray">
                      <span>{source.url}</span>
                      <span className="flex items-center gap-1"><Key className="w-3 h-3" /> {source.rateLimit}</span>
                      {source.lastFetch !== "—" && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {source.lastFetch}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-bold">{source.ideas}</span>
                    <span className="text-[10px] text-notionGray ml-1">ideas</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="utility" size="sm" onClick={() => handleFetch(source.name.toLowerCase().replace(" ", ""))} disabled={fetching === source.name.toLowerCase() || source.status === "disabled"}>
                      <RefreshCw className={`w-3 h-3 ${fetching === source.name.toLowerCase() ? "animate-spin" : ""}`} />
                      Fetch
                    </Button>
                    <a href={`https://${source.url}`} target="_blank" rel="noreferrer">
                      <Button variant="ghost" size="sm"><ExternalLink className="w-3 h-3" /></Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
