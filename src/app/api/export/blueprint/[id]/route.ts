import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const format = _request.nextUrl.searchParams.get("format") || "markdown";
  const url = `${API_BASE}/api/export/blueprint/${id}/${format}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 });
    }
    const text = await res.text();
    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": format === "json" ? "application/json" : "text/markdown",
        "Content-Disposition": `attachment; filename="blueprint-${id}.${format === "json" ? "json" : "md"}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export service unavailable" }, { status: 502 });
  }
}
