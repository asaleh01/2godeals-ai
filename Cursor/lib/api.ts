export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function toQueryString(params: Record<string, string | number | boolean | undefined | null>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export async function apiGet<T>(
  path: string,
  opts?: {
    params?: Record<string, string | number | boolean | undefined | null>;
    signal?: AbortSignal;
    // keep client-side requests fresh by default
    cache?: RequestCache;
  }
): Promise<T> {
  const url = `${path}${opts?.params ? toQueryString(opts.params) : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    signal: opts?.signal,
    cache: opts?.cache ?? 'no-store',
    headers: { Accept: 'application/json' },
  });

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      typeof body === 'object' && body && 'error' in (body as any)
        ? String((body as any).error)
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, body);
  }

  return body as T;
}

