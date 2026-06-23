import { create } from "zustand";
import type { UserProfile, Project } from "@/lib/types";

interface AppState {
  isAuthenticated: boolean;
  user: { email: string; name: string; id?: number } | null;
  profile: UserProfile | null;
  activeProjectId: string | null;
  selectedIdeaId: string | null;
  projects: Project[];
  isLoadingProfile: boolean;

  setAuth: (user: { email: string; name: string; id?: number } | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setActiveProjectId: (id: string | null) => void;
  setSelectedIdeaId: (id: string | null) => void;
  setProjects: (projects: Project[]) => void;
  setLoadingProfile: (loading: boolean) => void;
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
}

function profileToBackend(profile: UserProfile): Record<string, unknown> {
  const skillLevelMap: Record<string, string> = {
    beginner: "BEGINNER",
    intermediate: "INTERMEDIATE",
    advanced: "ADVANCED",
  };
  return {
    skill_level: skillLevelMap[profile.skillLevel] || "BEGINNER",
    budget: profile.budget,
    team_size: profile.teamSize,
    timeline: profile.timeline,
    tech_prefs: profile.techPreferences || [],
    industry: profile.industry || null,
  };
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  profile: null,
  activeProjectId: null,
  selectedIdeaId: null,
  projects: [],
  isLoadingProfile: false,

  setAuth: (user) => set({ isAuthenticated: !!user, user }),
  setProfile: (profile) => {
    set({ profile });
    // Sync to API
    if (profile && typeof window !== "undefined") {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      fetch(`${API_BASE}/api/user/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileToBackend(profile)),
      }).catch(() => {});
    }
  },
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setSelectedIdeaId: (id) => set({ selectedIdeaId: id }),
  setProjects: (projects) => set({ projects }),
  setLoadingProfile: (loading) => set({ isLoadingProfile: loading }),
  addProject: (project) => set((s) => ({ projects: [project, ...s.projects] })),
  removeProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
}));
