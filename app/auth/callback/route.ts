import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Same-origin paths only: "//evil.com" or "@evil.com" must not leave the site.
  const requested = searchParams.get("redirect") || "";
  const redirectTarget = /^\/(?![/\\])/.test(requested) ? requested : "/dashboard";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (code && supabaseUrl && supabaseKey) {
    const jar = await cookies();
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
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
      },
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      return NextResponse.redirect(`${origin}${redirectTarget}`);
    }
  }

  // Redirect to dashboard
  return NextResponse.redirect(`${origin}${redirectTarget}`);
}
