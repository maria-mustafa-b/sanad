import { afterAll, describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { get, insert, list, update } from "../../lib/database/repository";
import { randomUUID } from "node:crypto";
const directory = await mkdtemp(join(tmpdir(), "sanad-test-"));
process.env.SANAD_MODE = "demo";
process.env.DEMO_STORAGE_PATH = directory;
afterAll(async () => rm(directory, { recursive: true, force: true }));
describe("demo persistence and ownership", () => {
  it("keeps records across reads and rejects another user's modifications", async () => {
    const owner = randomUUID();
    const outsider = randomUUID();
    const row = await insert("claims", {
      user_id: owner,
      original_text: "Sample",
      status: "DRAFT",
    });
    expect((await list("claims", { user_id: owner })).map((r) => r.id)).toContain(row.id);
    await expect(get("claims", row.id, outsider)).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(update("claims", row.id, { status: "ISSUED" }, outsider)).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(update("claims", row.id, { status: "ISSUED" }, owner, { status: "USER_CONFIRMED" })).rejects.toMatchObject({ code: "CONFLICT" });
    expect((await get("claims", row.id, owner)).status).toBe("DRAFT");
  });
});
