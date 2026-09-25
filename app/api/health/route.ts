import { adminDb, demoMode } from "@/lib/database/repository";

export async function GET() {
  if (!demoMode()) {
    try {
      const { error } = await adminDb()
        .from("services")
        .select("id", { head: true });
      if (error) throw error;
    } catch {
      return Response.json(
        {
          success: false,
          data: { service: "sanad", status: "unavailable", mode: "supabase" },
        },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
  }
  return Response.json(
    {
      success: true,
      data: {
        service: "sanad",
        status: "ok",
        mode: demoMode() ? "demo" : "supabase",
        database: demoMode() ? "local_demo" : "connected",
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
