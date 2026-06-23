"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useStore } from "@/store/useStore";
import { UserPlus, GitBranch, Mail } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuth({ email, name });
    router.push("/onboarding");
  };

  return (
    <div className="min-h-[calc(100vh-48px-160px)] flex items-center justify-center bg-[#f6f5f4] px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white shadow-sm mx-auto mb-3">
            <span className="text-sm font-bold">I</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
          <p className="text-sm text-notionGray mt-1">Start evolving your ideas with AI</p>
        </div>

        <div className="bg-white border border-notionBorder rounded-xl notion-shadow p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Full name" type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <Button type="submit" className="w-full">
              <UserPlus className="w-4 h-4" /> Create Account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-notionBorder" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-notionGray">or continue with</span></div>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="secondary" className="w-full"><GitBranch className="w-4 h-4" /> Continue with GitHub</Button>
            <Button variant="secondary" className="w-full"><Mail className="w-4 h-4" /> Continue with Google</Button>
          </div>
        </div>

        <p className="text-xs text-notionGray text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-notionBlue hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
