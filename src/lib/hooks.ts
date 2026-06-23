import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userApi,
  generatorApi,
  curatedApi,
  projectApi,
  archaeologyApi,
  mockupApi,
  scoreApi,
  ideaApi,
  type UserProfile,
} from "./api";

// ─── User Hooks ───
export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => userApi.getProfile(),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: UserProfile) => userApi.createOrUpdateProfile(profile),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user", "profile"] }),
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ["user", "stats"],
    queryFn: () => userApi.getStats(),
  });
}

// ─── Generator Hooks ───
export function useGeneratorFull(input: string, platform?: string, userProfile?: UserProfile) {
  return useQuery({
    queryKey: ["generator", "full", input, platform, userProfile],
    queryFn: () => generatorApi.full(input, platform, userProfile),
    enabled: !!input,
  });
}

// ─── Project Hooks ───
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => projectApi.list(),
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectApi.get(id),
    enabled: !!id,
  });
}

export function useProjectIdeas(projectId: number) {
  return useQuery({
    queryKey: ["project", projectId, "ideas"],
    queryFn: () => projectApi.ideas(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title?: string; mode?: string; original_input: string; platform?: string }) =>
      projectApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

// ─── Curated Ideas Hooks ───
export function useCuratedIdeas(params?: { platform?: string; complexity?: string }) {
  return useQuery({
    queryKey: ["curated", params],
    queryFn: () => curatedApi.list(params),
  });
}

// ─── Archaeology Hooks ───
export function useAnalyzeCode(code: string) {
  return useQuery({
    queryKey: ["archaeology", "code", code],
    queryFn: () => archaeologyApi.analyzeCode(code),
    enabled: !!code,
  });
}

// ─── Mockup Hooks ───
export function useMockupStyles() {
  return useQuery({
    queryKey: ["mockup", "styles"],
    queryFn: () => mockupApi.styles(),
  });
}

export function useMockupScreens() {
  return useQuery({
    queryKey: ["mockup", "screens"],
    queryFn: () => mockupApi.screens(),
  });
}

// ─── Score Hooks ───
export function useBenchmarks(platform?: string) {
  return useQuery({
    queryKey: ["score", "benchmarks", platform],
    queryFn: () => scoreApi.benchmarks(platform),
  });
}

// ─── Idea Hooks ───
export function useTrendingIdeas() {
  return useQuery({
    queryKey: ["ideas", "trending"],
    queryFn: () => ideaApi.trending(),
  });
}

export function useSimilarIdeas(ideaId: number) {
  return useQuery({
    queryKey: ["ideas", "similar", ideaId],
    queryFn: () => ideaApi.similar(ideaId),
    enabled: !!ideaId,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => ideaApi.categories(),
  });
}
