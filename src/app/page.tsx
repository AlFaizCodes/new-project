import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";

const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-base selection:bg-brand-green selection:text-black">
      {/* Subtle 3D particle background */}
      <ThreeBackground variant="particles" />

      {/* Page Sections */}
      <Hero />
      <Features />
      <Stats />
    </main>
  );
}
