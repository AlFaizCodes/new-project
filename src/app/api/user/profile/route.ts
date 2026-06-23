import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ profile: null });
}

export async function PUT() {
  return NextResponse.json({ message: "Profile updated" });
}
