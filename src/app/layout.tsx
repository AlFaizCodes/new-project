import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/lib/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IdeaDNA — AI Conceptual Sequencing & Blueprint Platform",
  description: "A premium AI platform that maps, sequences, and mutates unstructured concepts like genetic code, featuring interactive 3D WebGL canvases and custom step-by-step evolution trees.",
  keywords: ["AI platform", "Concept mapping", "Idea DNA", "Visual blueprinting", "Next.js R3F", "Notion-style design"],
  authors: [{ name: "IdeaDNA Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
