"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useStore } from "@/store/useStore";
import { LogIn, GitBranch, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuth({ email, name: email.split("@")[0] });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-48px-160px)] flex items-center justify-center bg-[#f6f5f4] px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white shadow-sm mx-auto mb-3">
            <span className="text-sm font-bold">I</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-notionGray mt-1">Sign in to your IdeaDNA account</p>
        </div>

        <div className="bg-white border border-notionBorder rounded-xl notion-shadow p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full">
              <LogIn className="w-4 h-4" /> Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-notionBorder" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-notionGray">or continue with</span></div>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="secondary" className="w-full">
              <GitBranch className="w-4 h-4" /> Continue with GitHub
            </Button>
            <Button variant="secondary" className="w-full">
              <Mail className="w-4 h-4" /> Continue with Google
            </Button>
          </div>
        </div>

        <p className="text-xs text-notionGray text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-notionBlue hover:underline font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
