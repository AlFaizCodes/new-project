import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ platforms: ["Web", "Mobile", "AI/ML", "Blockchain", "IoT", "Desktop", "Extension", "API"] });
}
