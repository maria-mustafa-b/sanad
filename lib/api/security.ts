import { AppError } from "./errors";
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, max = 120) {
  const now = Date.now();
  for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
  const b = buckets.get(key) || { count: 0, reset: now + 60000 };
  b.count++;
  buckets.set(key, b);
  if (b.count > max)
    throw new AppError(
      "RATE_LIMITED",
      "Too many requests. Please wait a minute.",
      429,
    );
}
export function sameOrigin(request: Request) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return;
  const origin = request.headers.get("origin");
  const expected = new URL(process.env.NEXT_PUBLIC_APP_URL || request.url)
    .origin;
  if (origin && origin !== expected)
    throw new AppError("ORIGIN_REJECTED", "Cross-site request rejected.", 403);
  if (request.headers.get("sec-fetch-site") === "cross-site")
    throw new AppError("ORIGIN_REJECTED", "Cross-site request rejected.", 403);
}
export async function jsonBody(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new AppError("INVALID_CONTENT_TYPE", "Send JSON content.", 415);
  const text = await request.text();
  if (text.length > 64000)
    throw new AppError("TOO_LARGE", "The request is too large.", 413);
  try {
    return JSON.parse(text);
  } catch {
    throw new AppError("INVALID_JSON", "The request contains invalid JSON.");
  }
}
