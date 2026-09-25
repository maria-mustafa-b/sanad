import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  randomBytes,
  randomUUID,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { demoMode, demoRoot, get, insert } from "@/lib/database/repository";
import type { Actor } from "@/lib/domain/types";
import { AppError } from "@/lib/api/errors";
export async function supabaseSession() {
  const jar = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new AppError(
      "CONFIG_REQUIRED",
      "Configure Supabase before signing in.",
      503,
    );
  return createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        for (const { name, value, options } of values)
          jar.set(name, value, {
            ...options,
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
      },
    },
  });
}
async function secret() {
  await mkdir(demoRoot(), { recursive: true, mode: 0o700 });
  const file = path.join(demoRoot(), "session.key");
  try {
    await writeFile(file, randomBytes(32).toString("hex"), {
      flag: "wx",
      mode: 0o600,
    });
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
  }
  return readFile(file, "utf8");
}
async function sign(value: string) {
  return createHmac("sha256", await secret())
    .update(value)
    .digest("hex");
}
export async function startDemo() {
  if (!demoMode())
    throw new AppError(
      "DEMO_DISABLED",
      "Demo sessions are disabled in Supabase mode.",
      403,
    );
  const id = randomUUID();
  await insert("users", { id, role: "user" });
  await insert("profiles", {
    id,
    display_name: "Demo explorer",
    preferred_language: "en",
    accessibility: {},
  });
  const value = `${id}.${Date.now() + 86400000}`;
  const jar = await cookies();
  jar.set("sanad_demo", `${value}.${await sign(value)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 86400,
  });
  return { id, demo: true };
}
export async function actor(): Promise<Actor> {
  if (demoMode()) {
    const token = (await cookies()).get("sanad_demo")?.value || "";
    const [id, expiry, signature] = token.split(".");
    if (!id || !expiry || !signature || Number(expiry) < Date.now())
      throw new AppError("UNAUTHORIZED", "Please start a demo session.", 401);
    const expected = await sign(`${id}.${expiry}`);
    if (
      signature.length !== expected.length ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    )
      throw new AppError("UNAUTHORIZED", "Your session is invalid.", 401);
    const user = await get("users", id);
    return { id, role: user.role, demo: true };
  }
  const client = await supabaseSession();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user)
    throw new AppError("UNAUTHORIZED", "Please sign in.", 401);
  const user = await get("users", data.user.id);
  return {
    id: data.user.id,
    email: data.user.email,
    role: user.role,
    demo: false,
  };
}
export async function logout() {
  if (demoMode()) (await cookies()).delete("sanad_demo");
  else {
    const { error } = await (await supabaseSession()).auth.signOut();
    if (error)
      throw new AppError("AUTH_FAILED", "Could not sign out. Try again.", 503);
  }
}
