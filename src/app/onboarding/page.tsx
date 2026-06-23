"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";
import type { UserProfile } from "@/lib/types";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

const questions = [
  {
    id: "skillLevel",
    title: "What's your skill level?",
    options: [
      { value: "beginner", label: "Beginner", desc: "Learning fundamentals, building small projects" },
      { value: "intermediate", label: "Intermediate", desc: "Comfortable with full-stack, some pro experience" },
      { value: "advanced", label: "Advanced", desc: "Senior dev, architect, or tech lead" },
    ],
  },
  {
    id: "budget",
    title: "What's your budget?",
    options: [
      { value: "0", label: "$0", desc: "Free tools only, open-source" },
      { value: "100-500", label: "$100 — $500", desc: "Can spend on hosting, domains, APIs" },
      { value: "500+", label: "$500+", desc: "Funded project, paid services" },
    ],
  },
  {
    id: "teamSize",
    title: "Team size?",
    options: [
      { value: "solo", label: "Just me", desc: "Solo developer" },
      { value: "small", label: "2–3 people", desc: "Small team" },
      { value: "large", label: "5+ people", desc: "Established team" },
    ],
  },
  {
    id: "timeline",
    title: "Project timeline?",
    options: [
      { value: "2weeks", label: "2 weeks", desc: "Hackathon or quick MVP" },
      { value: "1month", label: "1 month", desc: "Monthly sprint" },
      { value: "3months+", label: "3+ months", desc: "Long-term project" },
    ],
  },
  {
    id: "techPreferences",
    title: "Tech preferences (pick all that apply)",
    multi: true,
    options: [
      { value: "React", label: "React" },
      { value: "Node", label: "Node.js" },
      { value: "Python", label: "Python" },
      { value: "TypeScript", label: "TypeScript" },
      { value: "Flutter", label: "Flutter" },
      { value: "Go", label: "Go" },
      { value: "Rust", label: "Rust" },
      { value: "AI/ML", label: "AI / ML" },
    ],
  },
  {
    id: "industry",
    title: "Industry (optional)",
    options: [
      { value: "Education", label: "Education" },
      { value: "Healthcare", label: "Healthcare" },
      { value: "FinTech", label: "FinTech" },
      { value: "E-commerce", label: "E-commerce" },
      { value: "Productivity", label: "Productivity" },
      { value: "Gaming", label: "Gaming" },
      { value: "Social", label: "Social" },
      { value: "Other", label: "Other" },
    ],
  },
];

const questionLabels: Record<string, string> = {
  skillLevel: "Skill Level",
  budget: "Budget",
  teamSize: "Team Size",
  timeline: "Timeline",
  techPreferences: "Tech Preferences",
  industry: "Industry",
};

const answerLabels: Record<string, Record<string, string>> = {
  skillLevel: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
  budget: { "0": "$0", "100-500": "$100 — $500", "500+": "$500+" },
  teamSize: { solo: "Just me", small: "2–3 people", large: "5+ people" },
  timeline: { "2weeks": "2 weeks", "1month": "1 month", "3months+": "3+ months" },
  industry: {
    Education: "Education", Healthcare: "Healthcare", FinTech: "FinTech",
    "E-commerce": "E-commerce", Productivity: "Productivity", Gaming: "Gaming",
    Social: "Social", Other: "Other",
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile } = useStore();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const totalSteps = questions.length + 1;
  const isReviewStep = step === questions.length;
  const current = isReviewStep ? null : questions[step];
  const isFirst = step === 0;

  const handleSelect = (value: string) => {
    if (!current) return;
    if (current.multi) {
      const prev = (answers[current.id] as string[]) || [];
      const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      setAnswers({ ...answers, [current.id]: next });
    } else {
      setAnswers({ ...answers, [current.id]: value });
      setTimeout(() => setStep(step + 1), 200);
    }
  };

  const canContinue = () => {
    if (isReviewStep) return true;
    const val = answers[current!.id];
    if (!val) return false;
    if (current!.multi) return val.length > 0;
    return !!val;
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      skillLevel: (answers.skillLevel as string || "beginner") as UserProfile["skillLevel"],
      budget: answers.budget === "500+" ? 500 : answers.budget === "100-500" ? 300 : 0,
      teamSize: answers.teamSize === "solo" ? 1 : answers.teamSize === "small" ? 3 : 5,
      timeline: answers.timeline === "2weeks" ? "2 weeks" : answers.timeline === "1month" ? "1 month" : "3+ months",
      techPreferences: (answers.techPreferences as string[]) || [],
      industry: (answers.industry as string) || "",
    };
    setProfile(profile);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-48px-160px)] flex items-center justify-center bg-[#f6f5f4] px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= step ? "bg-notionBlue w-6" : "bg-notionBorder w-3"}`} />
            ))}
          </div>
          <p className="text-xs text-notionGray font-mono">Step {step + 1} of {totalSteps}</p>
        </div>

        <div className="bg-white border border-notionBorder rounded-xl notion-shadow p-6">
          {isReviewStep ? (
            <>
              <h2 className="text-xl font-bold tracking-tight mb-1">Review & Confirm</h2>
              <p className="text-xs text-notionGray mb-4">Check your answers before starting</p>
              <div className="space-y-3 mt-4">
                {questions.map((q) => {
                  const val = answers[q.id];
                  const label = q.multi
                    ? (val as string[] || []).map((v) => answerLabels[q.id]?.[v] || v).join(", ")
                    : answerLabels[q.id]?.[val as string] || (val as string) || "—";
                  return (
                    <div key={q.id} className="flex items-center justify-between py-2 border-b border-notionBorder/50 last:border-0">
                      <span className="text-xs text-notionGray font-medium">{questionLabels[q.id]}</span>
                      <span className="text-sm font-semibold text-right max-w-[60%]">{label || "—"}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-6">
                <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-3 h-3" /> Back
                </Button>
                <Button size="sm" onClick={handleFinish}>
                  Confirm <CheckCircle2 className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold tracking-tight mb-1">{current!.title}</h2>
              {current!.multi && <p className="text-xs text-notionGray mb-4">Select all that apply</p>}

              <div className={`${current!.multi ? "grid grid-cols-2 gap-2" : "flex flex-col gap-2"} mt-4`}>
                {current!.options.map((opt) => {
                  const selected = current!.multi
                    ? (answers[current!.id] || []).includes(opt.value)
                    : answers[current!.id] === opt.value;

                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`text-left p-3 rounded-[8px] border transition-all ${
                        selected
                          ? "border-notionBlue bg-notionBlue/5 notion-shadow-sm"
                          : "border-notionBorder hover:border-black/30 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{opt.label}</span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-notionBlue shrink-0" />}
                      </div>
                      {(opt as { desc?: string }).desc && (
                        <p className="text-[11px] text-notionGray mt-0.5">{(opt as { desc?: string }).desc}</p>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-6">
                <div>
                  {!isFirst && (
                    <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                      <ArrowLeft className="w-3 h-3" /> Back
                    </Button>
                  )}
                </div>
                {current!.multi ? (
                  <Button size="sm" disabled={!canContinue()} onClick={() => setStep(step + 1)}>
                    Next <ArrowRight className="w-3 h-3" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" disabled={!canContinue()} onClick={() => setStep(step + 1)}>
                    Skip
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
