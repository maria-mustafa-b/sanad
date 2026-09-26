/** Shared API client for the SANAD Next.js backend (proxied via Vite in dev). */

export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = {
  success?: false;
  error?: { code?: string; message?: string };
  message?: string;
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const baseUrl = () => (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '';

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${baseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = new Headers(init.headers || {});

  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: init.credentials ?? 'include',
  });

  let json: ApiSuccess<T> | ApiFailure | null = null;
  try {
    json = (await res.json()) as ApiSuccess<T> | ApiFailure;
  } catch {
    json = null;
  }

  if (!res.ok || !json || !('success' in json) || json.success !== true) {
    const fail = json as ApiFailure | null;
    throw new ApiError(
      fail?.error?.message || fail?.message || `Request failed (${res.status})`,
      res.status,
      fail?.error?.code
    );
  }

  return (json as ApiSuccess<T>).data;
}
