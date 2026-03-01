import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/verify-admin";
import {
  updateSiteContent,
  getSiteContent,
  isValidSection,
  type SiteContentMap,
} from "@/lib/site-content";

export async function GET(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.valid) return session.response;

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
    console.error("GET admin content error:", err);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.valid) return session.response;

  try {
    const body = await request.json();
    const { section, data } = body as {
      section: string;
      data: SiteContentMap[keyof SiteContentMap];
    };
    if (!section || !data) {
      return NextResponse.json(
        { error: "Missing section or data" },
        { status: 400 }
      );
    }
    if (!isValidSection(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }
    await updateSiteContent(section, data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH admin content error:", err);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}
