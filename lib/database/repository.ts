import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Row, Table } from "@/lib/domain/types";
import { AppError } from "@/lib/api/errors";
export const demoMode = () => process.env.SANAD_MODE !== "supabase";
export const demoRoot = () =>
  process.env.DEMO_STORAGE_PATH || path.join(process.cwd(), ".sanad-demo");
export function adminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new AppError(
      "CONFIG_REQUIRED",
      "Supabase server configuration is missing.",
      503,
    );
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
type State = Partial<Record<Table, Row[]>>;
let queue: Promise<unknown> = Promise.resolve();
async function local<T>(fn: (state: State) => T, save = false): Promise<T> {
  const task = queue.then(async () => {
    if (process.env.VERCEL)
      throw new AppError(
        "DEMO_HOSTING_UNSUPPORTED",
        "Use Supabase mode on Vercel; the local demo needs persistent disk.",
        503,
      );
    await mkdir(demoRoot(), { recursive: true, mode: 0o700 });
    const file = path.join(demoRoot(), "database.json");
    let state: State = {};
    try {
      state = JSON.parse(await readFile(file, "utf8"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    const result = fn(state);
    if (save) {
      const tmp = file + ".tmp";
      await writeFile(tmp, JSON.stringify(state), { mode: 0o600 });
      await rename(tmp, file);
    }
    return result;
  });
  queue = task.catch(() => {});
  return task;
}
export async function list(
  table: Table,
  filter: Record<string, unknown> = {},
): Promise<Row[]> {
  if (demoMode())
    return local((s) =>
      (s[table] || []).filter((r) =>
        Object.entries(filter).every(([k, v]) => r[k] === v),
      ),
    );
  let q = adminDb().from(table).select("*");
  for (const [k, v] of Object.entries(filter))
    q = v === null ? q.is(k, null) : q.eq(k, v);
  const { data, error } = await q
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error)
    throw new AppError(
      "DATABASE_ERROR",
      "The database request failed. Check migrations and configuration.",
      503,
    );
  return data as Row[];
}
export async function get(
  table: Table,
  id: string,
  user?: string,
): Promise<Row> {
  const rows = await list(table, { id, ...(user ? { user_id: user } : {}) });
  if (!rows[0])
    throw new AppError("NOT_FOUND", "This record was not found.", 404);
  return rows[0];
}
export async function insert(
  table: Table,
  values: Record<string, unknown>,
): Promise<Row> {
  const now = new Date().toISOString();
  const row = {
    id: randomUUID(),
    created_at: now,
    updated_at: now,
    ...values,
  } as Row;
  if (demoMode())
    return local((s) => {
      const rows = (s[table] ??= []);
      if (rows.some((r) => r.id === row.id))
        throw new AppError("CONFLICT", "This record already exists.", 409);
      rows.push(row);
      return row;
    }, true);
  const { data, error } = await adminDb()
    .from(table)
    .insert(row)
    .select()
    .single();
  if (error)
    throw new AppError("DATABASE_ERROR", "The record could not be saved.", 503);
  return data as Row;
}
export async function update(
  table: Table,
  id: string,
  values: Record<string, unknown>,
  user?: string,
  expected?: Record<string, unknown>,
): Promise<Row> {
  if (demoMode())
    return local((s) => {
      const row = (s[table] || []).find(
        (r) => r.id === id && (!user || r.user_id === user),
      );
      if (!row)
        throw new AppError("NOT_FOUND", "This record was not found.", 404);
      if (expected && !Object.entries(expected).every(([k, v]) => row[k] === v))
        throw new AppError(
          "CONFLICT",
          "This record changed. Refresh and try again.",
          409,
        );
      Object.assign(row, values, { updated_at: new Date().toISOString() });
      return row;
    }, true);
  let q = adminDb()
    .from(table)
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (user) q = q.eq("user_id", user);
  for (const [k, v] of Object.entries(expected || {})) q = q.eq(k, v);
  const { data, error } = await q.select().maybeSingle();
  if (error) throw new AppError("DATABASE_ERROR", "The update failed.", 503);
  if (!data)
    throw new AppError(
      "CONFLICT",
      "The record changed or is unavailable.",
      409,
    );
  return data as Row;
}
export async function remove(table: Table, id: string, user: string) {
  if (demoMode())
    return local((s) => {
      s[table] = (s[table] || []).filter(
        (r) => !(r.id === id && r.user_id === user),
      );
    }, true);
  const { error } = await adminDb()
    .from(table)
    .delete()
    .eq("id", id)
    .eq("user_id", user);
  if (error) throw new AppError("DATABASE_ERROR", "The deletion failed.", 503);
}
