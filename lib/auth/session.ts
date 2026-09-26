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
  const id = randomUUID();
  try {
    if (demoMode()) {
      await insert("users", { id, role: "user" });
      await insert("profiles", {
        id,
        display_name: "Demo explorer",
        preferred_language: "en",
        accessibility: {},
      });
    }
  } catch {
    // ignore
  }
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
  const jar = await cookies();
  const token = jar.get("sanad_demo")?.value;
  if (token) {
    const [id, expiry, signature] = token.split(".");
    if (id && expiry && signature && Number(expiry) >= Date.now()) {
      try {
        const expected = await sign(`${id}.${expiry}`);
        if (
          signature.length === expected.length &&
          timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
        ) {
          return { id, role: "user", demo: true };
        }
      } catch {
        // fallback
      }
    }
  }

  if (demoMode()) {
    const defaultId = "00000000-0000-0000-0000-000000000001";
    return { id: defaultId, role: "user", demo: true };
  }

  try {
    const client = await supabaseSession();
    const { data, error } = await client.auth.getUser();
    if (!error && data?.user) {
      const user = await get("users", data.user.id);
      return {
        id: data.user.id,
        email: data.user.email,
        role: user?.role || "user",
        demo: false,
      };
    }
  } catch {
    // fallback
  }

  const defaultId = "00000000-0000-0000-0000-000000000001";
  return { id: defaultId, role: "user", demo: true };
}

export async function logout() {
  const jar = await cookies();
  jar.delete("sanad_demo");
  try {
    const client = await supabaseSession();
    await client.auth.signOut();
  } catch {
    // fallback
  }
}
