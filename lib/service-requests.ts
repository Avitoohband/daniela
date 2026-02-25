import { ObjectId } from "mongodb";
import { getDb } from "./db";

export type ServiceRequestStatus = "pending" | "addressed" | "not_relevant";

export interface ServiceRequest {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ServiceRequestStatus;
  addressedBy?: string;
  agreedPrice?: string;
  agreedTime?: string;
  notes?: string;
  createdAt: Date;
  addressedAt?: Date;
}

const COLLECTION = "service_requests";

export async function createServiceRequest(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<ServiceRequest> {
  const db = await getDb();
  const doc = {
    ...data,
    status: "pending" as const,
    createdAt: new Date(),
  };
  const result = await db.collection(COLLECTION).insertOne(doc);
  return {
    _id: result.insertedId,
    ...doc,
  } as ServiceRequest;
}

export async function getAllServiceRequests(): Promise<ServiceRequest[]> {
  const db = await getDb();
  const cursor = db
    .collection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 });
  const items = await cursor.toArray();
  return items.map((item) => ({
    ...item,
    _id: item._id,
    createdAt: item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt),
    addressedAt: item.addressedAt
      ? item.addressedAt instanceof Date
        ? item.addressedAt
        : new Date(item.addressedAt)
      : undefined,
  })) as ServiceRequest[];
}

export async function updateServiceRequest(
  id: string,
  data: Partial<{
    status: ServiceRequestStatus;
    addressedBy: string;
    agreedPrice: string;
    agreedTime: string;
    notes: string;
    addressedAt: Date;
  }>
): Promise<ServiceRequest | null> {
  const db = await getDb();
  const setDoc: Record<string, unknown> = { ...data };
  const unsetDoc: Record<string, 1> = {};
  if (data.status === "addressed" && !setDoc.addressedAt) {
    setDoc.addressedAt = new Date();
  }
  if (data.status === "not_relevant") {
    setDoc.addressedBy = "";
    setDoc.agreedPrice = "";
    setDoc.agreedTime = "";
    setDoc.notes = "";
    unsetDoc.addressedAt = 1;
  }
  const updateOp: Record<string, unknown> = {};
  if (Object.keys(setDoc).length > 0) updateOp.$set = setDoc;
  if (Object.keys(unsetDoc).length > 0) updateOp.$unset = unsetDoc;
  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    updateOp,
    { returnDocument: "after" }
  );
  if (!result) return null;
  return {
    ...result,
    _id: result._id,
    createdAt: result.createdAt instanceof Date ? result.createdAt : new Date(result.createdAt),
    addressedAt: result.addressedAt
      ? result.addressedAt instanceof Date
        ? result.addressedAt
        : new Date(result.addressedAt)
      : undefined,
  } as ServiceRequest;
}
