"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Lightbulb,
  Dna,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generate Ideas", icon: Lightbulb },
  { href: "/evolve", label: "Evolve Idea", icon: Dna },
  { href: "/analyze", label: "Analyze Code", icon: Search },
  { href: "/onboarding", label: "My Profile", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-48px)]">
      <aside className="hidden md:flex flex-col w-56 border-r border-notionBorder bg-white notion-shadow-sm shrink-0">
        <div className="flex flex-col gap-1 p-3 pt-6">
          {sidebarLinks.map((l) => {
            const active = pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-[5px] text-xs font-medium transition-colors",
                  active
                    ? "bg-[#f0f0f0] text-black"
                    : "text-notionGray hover:text-black hover:bg-black/5"
                )}
              >
                <l.icon className="w-4 h-4 shrink-0" />
                {l.label}
              </Link>
            );
          })}
        </div>
        <div className="mt-auto p-3 border-t border-notionBorder">
          <div className="flex items-center gap-2 px-3 py-2 text-[11px] text-notionGray">
            <Sparkles className="w-3 h-3" />
            <span>v1.0 &middot; IdeaDNA</span>
          </div>
        </div>
      </aside>
      <main className="flex-1 bg-[#f6f5f4] min-h-full">
        {children}
      </main>
    </div>
  );
}
