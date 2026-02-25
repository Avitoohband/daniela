import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/verify-admin";
import { getAllServiceRequests } from "@/lib/service-requests";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.valid) return session.response;

  try {
    const requests = await getAllServiceRequests();
    const serialized = requests.map((r) => ({
      _id: r._id.toString(),
      name: r.name,
      email: r.email,
      phone: r.phone,
      message: r.message,
      status: r.status,
      addressedBy: r.addressedBy ?? "",
      agreedPrice: r.agreedPrice ?? "",
      agreedTime: r.agreedTime ?? "",
      notes: r.notes ?? "",
      createdAt: r.createdAt.toISOString(),
      addressedAt: r.addressedAt?.toISOString() ?? null,
    }));
    return NextResponse.json(serialized);
  } catch (err) {
    console.error("GET requests error:", err);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
