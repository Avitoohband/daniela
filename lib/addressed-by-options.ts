import { getDb } from "./db";

const COLLECTION = "addressed_by_options";
const DEFAULT_NAMES = ["דניאל", "אלה"];

export async function getAddressedByOptions(): Promise<string[]> {
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({});
  if (doc && Array.isArray(doc.names)) {
    return doc.names;
  }
  await db.collection(COLLECTION).insertOne({ names: DEFAULT_NAMES });
  return DEFAULT_NAMES;
}

export async function addAddressedByOption(name: string): Promise<string[]> {
  const trimmed = name.trim();
  if (!trimmed) return getAddressedByOptions();

  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({});
  const current = doc && Array.isArray(doc.names) ? doc.names : DEFAULT_NAMES;
  if (current.includes(trimmed)) return current;

  const updated = [...current, trimmed];
  if (doc) {
    await db.collection(COLLECTION).updateOne({ _id: doc._id }, { $set: { names: updated } });
  } else {
    await db.collection(COLLECTION).insertOne({ names: updated });
  }
  return updated;
}

export async function removeAddressedByOption(name: string): Promise<string[]> {
  const trimmed = name.trim();
  const db = await getDb();
  const doc = await db.collection(COLLECTION).findOne({});
  const current = doc && Array.isArray(doc.names) ? doc.names : DEFAULT_NAMES;
  const updated = current.filter((n) => n !== trimmed);
  if (doc) {
    await db.collection(COLLECTION).updateOne({ _id: doc._id }, { $set: { names: updated } });
  }
  return updated;
}
