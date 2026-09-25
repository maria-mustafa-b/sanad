import { describe, it, expect } from "vitest";
import { environmentSchema } from "../../lib/config";
import { apiError } from "../../lib/api/response";
describe("configuration guardrails", () => {
  it("defaults to simulation without external secrets", () =>
    expect(environmentSchema.parse({}).BLOCKCHAIN_MODE).toBe("mock"));
  it("refuses real mode without wallet configuration", () =>
    expect(
      environmentSchema.safeParse({ BLOCKCHAIN_MODE: "real" }).success,
    ).toBe(false));
  it("rejects unknown providers", () =>
    expect(
      environmentSchema.safeParse({ AI_PROVIDER: "unknown" }).success,
    ).toBe(false));
  it("accepts empty optional template values", () =>
    expect(
      environmentSchema.safeParse({
        NEXT_PUBLIC_SUPABASE_URL: "",
        AI_API_KEY: "",
      }).success,
    ).toBe(true));
  it("returns structured non-cacheable API errors", async () => {
    const response = apiError("UNAUTHORIZED", "Please sign in.", 401);
    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Please sign in." },
    });
  });
});
