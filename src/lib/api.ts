const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | undefined>;
}

async function api<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = "GET", body, params } = options;
  let url = `${API_BASE}${path}`;

  if (params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) search.set(k, String(v));
    });
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`API error: ${res.status} ${res.statusText} — ${err}`);
  }

  return res.json();
}

// ─── Types ───
export interface UserProfile {
  skill_level: string;
  budget: number;
  team_size: number;
  timeline: string;
  tech_prefs: string[];
  industry?: string;
  preferred_platform?: string;
  style_preference?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  skill_level: string;
  budget: number;
  team_size: number;
  timeline: string;
  tech_prefs: string[];
  industry: string | null;
}

export interface CuratedIdea {
  id: number;
  title: string;
  description: string;
  problem_statement: string;
  solution: string;
  key_features: string[];
  platform: string;
  sub_category: string | null;
  innovation_score: number;
  market_potential: number;
  complexity: string;
  suggested_stack: Record<string, string> | null;
  tags: string[];
  source: string | null;
  trending_score: number;
}

export interface IdeaCard {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  problem_statement: string | null;
  solution: string | null;
  key_features: string[];
  innovation_score: number;
  feasibility_score: number;
  difficulty: string;
  platform: string | null;
  tags: string[];
  suggested_stack: Record<string, string> | null;
  is_curated: boolean;
  curated_idea_id: number | null;
}

export interface ProjectResponse {
  id: number;
  title: string;
  mode: string;
  status: string;
  original_input: string;
  platform: string | null;
  selected_idea_id: number | null;
  created_at: string;
}

export interface BlueprintResponse {
  id: number;
  idea_id: number;
  overview: string;
  prd: Record<string, unknown>;
  tech_stack: Record<string, unknown>;
  database_schema: Record<string, unknown>;
  api_design: Record<string, unknown>;
  user_flow: Array<Record<string, unknown>>;
  implementation_plan: Record<string, unknown>;
  markdown: string | null;
  openapi_spec: string | null;
  mermaid_diagrams: Record<string, unknown> | null;
  created_at: string;
}

export interface UiMockupResponse {
  id: number;
  idea_id: number;
  html: string;
  css: string | null;
  style_variant: string;
  created_at: string;
}

export interface GeneratorCard {
  id?: number;
  title: string;
  description: string;
  problem_statement: string;
  solution: string;
  key_features: string[];
  innovation_score: number;
  feasibility_score: number;
  difficulty: string;
  difficulty_badge: { variant: string; label: string };
  platform: string;
  platform_icon: string;
  suggested_stack: Record<string, string>;
  upgrade_notes: string[];
  tags: string[];
  scores: {
    originality: number;
    feasibility: number;
    market_potential: number;
    complexity_match: number;
    overall: number;
    verdict: string;
  };
  card_colors: { bg: string; border: string; badge: string; score: string };
  overall_score: number;
  is_curated: boolean;
  curated_source: string | null;
}

export interface GeneratorResult {
  status: string;
  data: {
    parsed_input: {
      problem_statement: string;
      platform: string;
      target_audience: string;
      tone: string;
      keywords: string[];
    };
    retrieved_count: number;
    cards: GeneratorCard[];
  };
}

export interface LegacyGenerateResult {
  status: string;
  data: {
    original_concept: string;
    project_id: number | null;
    parsed_input: GeneratorResult["data"]["parsed_input"];
    retrieved_count: number;
    cards: GeneratorCard[];
  };
}

export interface SelectIdeaResult {
  status: string;
  data: {
    blueprint: Record<string, unknown>;
    mockup: { html: string; style_variant: string };
  };
}

// ─── API Methods ───
export const userApi = {
  getProfile: () => api<UserResponse>("/api/user/profile"),
  createOrUpdateProfile: (profile: UserProfile) =>
    api<UserResponse>("/api/user/profile", { method: "POST", body: profile }),
  patchProfile: (updates: Record<string, unknown>) =>
    api<UserResponse>("/api/user/profile", { method: "PATCH", body: updates }),
  listProjects: () =>
    api<{ projects: Record<string, unknown>[]; total: number }>("/api/user/projects"),
  getStats: () =>
    api<{ projects_total: number; ideas_total: number; avg_score: number; selection_rate: number }>("/api/user/stats"),
};

export const generatorApi = {
  full: (input: string, platform?: string, userProfile?: UserProfile) =>
    api<GeneratorResult>("/api/generator/full", {
      method: "POST",
      body: { input, platform, user_profile: userProfile },
    }),
};

export const curatedApi = {
  list: (params?: { platform?: string; complexity?: string; skip?: number; limit?: number }) =>
    api<CuratedIdea[]>("/api/curated", { params: params as Record<string, string | number | undefined> }),
  platforms: () => api<string[]>("/api/curated/platforms"),
  trending: (params?: { platform?: string; limit?: number }) =>
    api<CuratedIdea[]>("/api/curated/trending", { params: params as Record<string, string | number | undefined> }),
};

export const projectApi = {
  list: (params?: { skip?: number; limit?: number }) =>
    api<ProjectResponse[]>("/api/projects", { params: params as Record<string, string | number | undefined> }),
  create: (data: { title?: string; mode?: string; original_input: string; platform?: string; description?: string }) =>
    api<ProjectResponse>("/api/projects", { method: "POST", body: data }),
  get: (id: number) => api<ProjectResponse>(`/api/projects/${id}`),
  ideas: (projectId: number) => api<IdeaCard[]>(`/api/projects/${projectId}/ideas`),
};

export interface ArchaeologyResult {
  code_analysis: string;
  patterns: string;
  evolution_timeline: string;
  developer_psychology: string;
  scores: Record<string, number>;
  future_versions: string[];
  detected_stack: Record<string, string[]>;
  architecture_grade: string;
}

export const archaeologyApi = {
  analyzeCode: (code: string) =>
    api<{ status: string; data: ArchaeologyResult }>("/api/archaeology/code", {
      method: "POST",
      body: { code },
    }),
  analyzeGithub: (url: string) =>
    api<{ status: string; data: ArchaeologyResult }>("/api/archaeology/github", {
      method: "POST",
      body: { url },
    }),
  analyzeWebsite: (url: string) =>
    api<{ status: string; data: ArchaeologyResult }>("/api/archaeology/website", {
      method: "POST",
      body: { url },
    }),
};

export const exportApi = {
  blueprintMarkdown: (ideaId: number) =>
    api<string>(`/api/export/blueprint/${ideaId}/markdown`),
  blueprintJson: (ideaId: number) =>
    api<{ status: string; data: Record<string, unknown> }>(`/api/export/blueprint/${ideaId}/json`),
  mockupHtml: (ideaId: number) =>
    api<string>(`/api/export/mockup/${ideaId}/html`),
};

export const mockupApi = {
  generate: (ideaId: number, projectId: number, styleVariant = "MODERN", screenType = "landing") =>
    api<{ status: string; data: { html: string; style_variant: string; screen_type: string; components: Record<string, boolean> } }>(
      "/api/mockup/generate", {
        method: "POST",
        body: { idea_id: ideaId, project_id: projectId, style_variant: styleVariant, screen_type: screenType },
      }),
  component: (ideaId: number, projectId: number, componentType: string, styleVariant = "MODERN") =>
    api<{ status: string; data: { html: string; component_name: string; style_variant: string } }>(
      "/api/mockup/component", {
        method: "POST",
        body: { idea_id: ideaId, project_id: projectId, component_type: componentType, style_variant: styleVariant },
      }),
  styles: () => api<{ styles: string[]; descriptions: Record<string, string> }>("/api/mockup/styles"),
  screens: () => api<{ screens: string[] }>("/api/mockup/screens"),
};

export const scoreApi = {
  scoreIdea: (idea: Record<string, unknown>, userProfile?: Record<string, unknown>, benchmarks?: Record<string, unknown>) =>
    api<{ status: string; data: Record<string, unknown> }>("/api/score/idea", {
      method: "POST",
      body: { idea, user_profile: userProfile, benchmarks },
    }),
  scoreBatch: (ideas: Record<string, unknown>[], userProfile?: Record<string, unknown>) =>
    api<{ status: string; data: Record<string, unknown>[] }>("/api/score/batch", {
      method: "POST",
      body: { ideas, user_profile: userProfile },
    }),
  benchmarks: (platform?: string) =>
    api<{ status: string; data: Record<string, unknown> }>("/api/score/benchmarks", { params: { platform } }),
};

export const ideaApi = {
  list: (params?: { source?: string; category?: string; skip?: number; limit?: number }) =>
    api<IdeaCard[]>("/api/ideas", { params: params as Record<string, string | number | undefined> }),
  get: (id: number) => api<IdeaCard>(`/api/ideas/${id}`),
  select: (ideaId: number, projectId: number) =>
    api<SelectIdeaResult>(`/api/ideas/select?project_id=${projectId}`, {
      method: "POST",
      body: { idea_id: ideaId },
    }),
  blueprint: (ideaId: number) => api<BlueprintResponse>(`/api/ideas/${ideaId}/blueprint`),
  mockup: (ideaId: number) => api<UiMockupResponse>(`/api/ideas/${ideaId}/mockup`),
  generate: (prompt: string, platform?: string, category?: string, count = 5) =>
    api<LegacyGenerateResult>("/api/ideas/generate", {
      method: "POST",
      body: { prompt, platform, category, count },
    }),
  similar: (ideaId: number) => api<IdeaCard[]>(`/api/ideas/similar?idea_id=${ideaId}`),
  trending: () => api<IdeaCard[]>("/api/ideas/trending"),
  vote: (ideaId: number, delta = 1) =>
    api<{ upvotes: number }>(`/api/ideas/${ideaId}/feedback?delta=${delta}`, { method: "POST" }),
  categories: () => api<{ categories: string[] }>("/api/categories"),
};
