import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { expect, test } from "vitest";
test("migration enforces ownership, denies anonymous private reads and prevents role escalation", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema public,auth to anon,authenticated,service_role; grant execute on function auth.uid() to anon,authenticated;`,
    );
    await db.exec(
      readFileSync("supabase/migrations/202609250001_foundation.sql", "utf8"),
    );
    const a = "00000000-0000-4000-8000-000000000001",
      b = "00000000-0000-4000-8000-000000000002";
    await db.exec(
      `insert into auth.users values ('${a}'),('${b}'); insert into public.claims(id,user_id,original_text) values ('10000000-0000-4000-8000-000000000001','${a}','fictional A'),('10000000-0000-4000-8000-000000000002','${b}','fictional B');`,
    );
    await db.exec(`set role authenticated; set request.jwt.claim.sub='${a}';`);
    const claims = await db.query<{ original_text: string }>(
      "select original_text from public.claims",
    );
    expect(claims.rows).toEqual([{ original_text: "fictional A" }]);
    await expect(
      db.exec("update public.users set role='admin'"),
    ).rejects.toThrow();
    await expect(
      db.exec(
        "insert into public.claims(user_id,original_text) values ('00000000-0000-4000-8000-000000000001','bypass')",
      ),
    ).rejects.toThrow();
    await db.exec("set role anon");
    await expect(
      db.query("select * from public.credentials"),
    ).rejects.toThrow();
    await db.exec("reset role");
    await expect(
      db.exec(
        `insert into public.claim_facts(user_id,claim_id,name,value,provenance) values ('${a}','10000000-0000-4000-8000-000000000002','issue','"test"','USER_REPORTED')`,
      ),
    ).rejects.toThrow();
  } finally {
    await db.close();
  }
}, 30000);
