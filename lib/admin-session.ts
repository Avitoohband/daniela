import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const SEP = ".";

function encodeBase64Url(buf: Buffer): string {
  return buf.toString("base64url");
}

function decodeBase64Url(str: string): Buffer | null {
  try {
    return Buffer.from(str, "base64url");
  } catch {
    return null;
  }
}

export function createSessionCookie(expiresAtMs: number, secret: string): string {
  const payload = JSON.stringify({ exp: expiresAtMs });
  const payloadB64 = encodeBase64Url(Buffer.from(payload, "utf8"));
  const sig = createHmac("sha256", secret).update(payloadB64).digest();
  const sigB64 = encodeBase64Url(sig);
  return `${payloadB64}${SEP}${sigB64}`;
}

export function verifySessionCookie(
  value: string | undefined,
  secret: string
): { valid: boolean; exp?: number } {
  if (!value || typeof value !== "string") return { valid: false };
  const i = value.lastIndexOf(SEP);
  if (i === -1) return { valid: false };
  const payloadB64 = value.slice(0, i);
  const sigB64 = value.slice(i + 1);
  const sigBuf = decodeBase64Url(sigB64);
  if (!sigBuf || sigBuf.length !== 32) return { valid: false };
  const expectedSig = createHmac("sha256", secret).update(payloadB64).digest();
  if (expectedSig.length !== sigBuf.length || !timingSafeEqual(expectedSig, sigBuf))
    return { valid: false };
  const payloadBuf = decodeBase64Url(payloadB64);
  if (!payloadBuf) return { valid: false };
  let payload: { exp?: number };
  try {
    payload = JSON.parse(payloadBuf.toString("utf8"));
  } catch {
    return { valid: false };
  }
  const exp = typeof payload.exp === "number" ? payload.exp : 0;
  if (exp <= Date.now()) return { valid: false, exp };
  return { valid: true, exp };
}

export { COOKIE_NAME };
