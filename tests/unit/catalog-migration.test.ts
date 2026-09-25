import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
test("all workflow migrations and curated sources apply to PostgreSQL", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema public,auth to anon,authenticated,service_role;create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);`,
    );
    for (const migration of [
      "202609250001_foundation.sql",
      "202609250002_workflows.sql",
      "202609250003_service_catalog.sql",
      "202609250004_verification_metrics.sql",
    ])
      await db.exec(readFileSync(`supabase/migrations/${migration}`, "utf8"));
    expect(
      (
        await db.query<{ count: number }>(
          "select count(*)::integer as count from public.services where published",
        )
      ).rows[0].count,
    ).toBe(22);
    expect(
      (
        await db.query<{ count: number }>(
          "select count(*)::integer as count from public.service_sources",
        )
      ).rows[0].count,
    ).toBe(22);
    expect(
      (
        await db.query<{ count: number }>(
          "select count(*)::integer as count from storage.buckets where id='sanad-documents' and public=false",
        )
      ).rows[0].count,
    ).toBe(1);
  } finally {
    await db.close();
  }
}, 30000);
