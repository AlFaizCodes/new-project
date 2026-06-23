import { create } from "zustand";
import type { UserProfile, Project } from "@/lib/types";

interface AppState {
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  profile: UserProfile | null;
  activeProjectId: string | null;
  selectedIdeaId: string | null;
  projects: Project[];

  setAuth: (user: { email: string; name: string } | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setActiveProjectId: (id: string | null) => void;
  setSelectedIdeaId: (id: string | null) => void;
  setProjects: (projects: Project[]) => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  profile: null,
  activeProjectId: null,
  selectedIdeaId: null,
  projects: [],
  setAuth: (user) => set({ isAuthenticated: !!user, user }),
  setProfile: (profile) => set({ profile }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  setSelectedIdeaId: (id) => set({ selectedIdeaId: id }),
  setProjects: (projects) => set({ projects }),
}));
