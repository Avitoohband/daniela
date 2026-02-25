import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/verify-admin";
import { updateServiceRequest } from "@/lib/service-requests";
import type { ServiceRequestStatus } from "@/lib/service-requests";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifyAdminSession();
  if (!session.valid) return session.response;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const status = body.status as ServiceRequestStatus | undefined;
    const addressedBy = typeof body.addressedBy === "string" ? body.addressedBy : undefined;
    const agreedPrice = typeof body.agreedPrice === "string" ? body.agreedPrice : undefined;
    const agreedTime = typeof body.agreedTime === "string" ? body.agreedTime : undefined;
    const notes = typeof body.notes === "string" ? body.notes : undefined;

    const validStatuses: ServiceRequestStatus[] = ["pending", "addressed", "not_relevant"];
    const updateData: Parameters<typeof updateServiceRequest>[1] = {};
    if (status && validStatuses.includes(status)) updateData.status = status;
    if (addressedBy !== undefined) updateData.addressedBy = addressedBy;
    if (agreedPrice !== undefined) updateData.agreedPrice = agreedPrice;
    if (agreedTime !== undefined) updateData.agreedTime = agreedTime;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await updateServiceRequest(id, updateData);
    if (!updated) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }
    return NextResponse.json({
      _id: updated._id.toString(),
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      message: updated.message,
      status: updated.status,
      addressedBy: updated.addressedBy ?? "",
      agreedPrice: updated.agreedPrice ?? "",
      agreedTime: updated.agreedTime ?? "",
      notes: updated.notes ?? "",
      createdAt: updated.createdAt.toISOString(),
      addressedAt: updated.addressedAt?.toISOString() ?? null,
    });
  } catch (err) {
    console.error("PATCH request error:", err);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}
