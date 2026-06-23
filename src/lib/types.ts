export type SkillLevel = "beginner" | "intermediate" | "advanced" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type Platform = "WEB" | "MOBILE" | "AI_ML" | "BLOCKCHAIN" | "IOT" | "DESKTOP" | "EXTENSION" | "API_BACKEND";
export type ProjectMode = "generate" | "evolve" | "analyze";
export type ProjectStatus = "draft" | "selected" | "completed";
export type IdeaStatus = "generated" | "selected";

export interface UserProfile {
  skillLevel: SkillLevel;
  budget: number;
  teamSize: number;
  timeline: string;
  techPreferences: string[];
  industry: string;
}

export interface Idea {
  id: string;
  projectId: string;
  title: string;
  description: string;
  innovationScore: number;
  feasibilityScore: number;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  status: IdeaStatus;
}

export interface Project {
  id: string;
  title: string;
  mode: ProjectMode;
  status: ProjectStatus;
  createdAt: string;
  platform?: Platform;
  overallScore?: number;
  ideaCount?: number;
}

export interface CriticReport {
  weaknesses: { severity: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL"; text: string }[];
  gaps: string[];
  risks: string[];
  opportunities: string[] | { impact: string; text: string }[];
  mutation_vectors?: string[];
}

export interface EvolutionNode {
  id: string;
  parentId: string | null;
  title: string;
  description: string;
  score: number;
  mutationTag: string;
}

export interface ArchaeologyReport {
  codeAnalysis: string;
  patterns: string;
  evolutionTimeline: string;
  developerPsychology: string;
  scores: Record<string, number>;
  futureVersions: string[];
}
