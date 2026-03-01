import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/verify-admin";
import {
  getAddressedByOptions,
  addAddressedByOption,
  removeAddressedByOption,
} from "@/lib/addressed-by-options";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.valid) return session.response;

  try {
    const names = await getAddressedByOptions();
    return NextResponse.json({ names });
  } catch (err) {
    console.error("GET addressed-by error:", err);
    return NextResponse.json(
      { error: "Failed to fetch options" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.valid) return session.response;

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name : "";
    if (!name.trim()) {
      return NextResponse.json(
        { error: "Missing name" },
        { status: 400 }
      );
    }
    const names = await addAddressedByOption(name);
    return NextResponse.json({ names });
  } catch (err) {
    console.error("POST addressed-by error:", err);
    return NextResponse.json(
      { error: "Failed to add option" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.valid) return session.response;

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name : "";
    const names = await removeAddressedByOption(name);
    return NextResponse.json({ names });
  } catch (err) {
    console.error("DELETE addressed-by error:", err);
    return NextResponse.json(
      { error: "Failed to remove option" },
      { status: 500 }
    );
  }
}
