export function apiError(code: string, message: string, status: number) {
  return Response.json(
    { success: false, error: { code, message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
