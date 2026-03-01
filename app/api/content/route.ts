import { NextRequest, NextResponse } from "next/server";
import { getSiteContent, isValidSection } from "@/lib/site-content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    if (section) {
      if (!isValidSection(section)) {
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
      }
      const data = await getSiteContent(section);
      return NextResponse.json(data);
    }
    const data = await getSiteContent();
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET content error:", err);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
