export async function GET() {
  return Response.json(
    {
      success: true,
      data: {
        service: "sanad",
        status: "ok",
        phase: "foundation",
        integrations: "not_yet_connected",
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
