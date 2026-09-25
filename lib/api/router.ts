import { z } from "zod";
import { actor, startDemo, logout, supabaseSession } from "@/lib/auth/session";
import { demoMode, get, update, list } from "@/lib/database/repository";
import { AppError } from "./errors";
import { sameOrigin, rateLimit, jsonBody } from "./security";
import { apiError } from "./response";
export const ok = (data: unknown, status = 200) =>
  Response.json(
    { success: true, data },
    { status, headers: { "Cache-Control": "no-store" } },
  );
export async function dispatch(request: Request) {
  try {
    sameOrigin(request);
    const url = new URL(request.url),
      p = url.pathname.replace(/^\/api\//, "").split("/"),
      method = request.method;
    rateLimit(`ip:${request.headers.get("x-forwarded-for") || "local"}`, 300);
    if (p[0] === "auth") {
      if (p[1] === "demo" && method === "POST")
        return ok(await startDemo(), 201);
      if (p[1] === "logout" && method === "POST") {
        await logout();
        return ok({ signedOut: true });
      }
      if (p[1] === "me" && method === "GET") return ok(await actor());
      if (
        ["login", "register", "refresh"].includes(p[1]) &&
        method === "POST"
      ) {
        rateLimit(
          `auth:${request.headers.get("x-forwarded-for") || "local"}`,
          12,
        );
        if (demoMode())
          throw new AppError(
            "DEMO_MODE",
            "Use Try Demo, or configure SANAD_MODE=supabase for accounts.",
            409,
          );
        const client = await supabaseSession();
        if (p[1] === "refresh") {
          const { error } = await client.auth.refreshSession();
          if (error)
            throw new AppError("UNAUTHORIZED", "Please sign in again.", 401);
          return ok({ refreshed: true });
        }
        const input = z
          .object({
            email: z.email().max(254),
            password: z.string().min(10).max(128),
          })
          .parse(await jsonBody(request));
        if (p[1] === "register") {
          const { data, error } = await client.auth.signUp(input);
          if (error)
            throw new AppError(
              "AUTH_FAILED",
              "Registration failed. Check the details or try signing in.",
            );
          return ok({ confirmationRequired: !data.session }, 201);
        }
        const { error } = await client.auth.signInWithPassword(input);
        if (error)
          throw new AppError(
            "AUTH_FAILED",
            "Email or password is incorrect.",
            401,
          );
        return ok(await actor());
      }
    }
    if (p[0] === "profile") {
      const user = await actor();
      if (method === "GET") return ok(await get("profiles", user.id));
      if (method === "PATCH") {
        const body = z
          .object({
            display_name: z.string().max(80),
            preferred_language: z.enum(["en", "ar", "hi", "ur"]),
            accessibility: z.object({
              larger_text: z.boolean(),
              reduced_motion: z.boolean(),
              screen_reader: z.boolean(),
            }),
          })
          .parse(await jsonBody(request));
        return ok(await update("profiles", user.id, body));
      }
    }
    if (p[0] === "health" && p[1] === "database") {
      await actor();
      await list("services");
      return ok({ status: "ok", mode: demoMode() ? "local_demo" : "supabase" });
    }
    throw new AppError("NOT_FOUND", "Endpoint not found.", 404);
  } catch (error) {
    if (error instanceof z.ZodError)
      return apiError(
        "VALIDATION_ERROR",
        "Check the request fields and try again.",
        400,
      );
    if (error instanceof AppError)
      return apiError(error.code, error.message, error.status);
    return apiError(
      "INTERNAL_ERROR",
      "Something went wrong. Please try again.",
      500,
    );
  }
}
