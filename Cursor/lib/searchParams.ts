export type SearchParamValue = string | number | boolean | undefined | null;

export function setParam(sp: URLSearchParams, key: string, value: SearchParamValue) {
  if (value === undefined || value === null || value === '') {
    sp.delete(key);
    return;
  }
  sp.set(key, String(value));
}

export function buildUrl(pathname: string, params: Record<string, SearchParamValue>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) setParam(sp, k, v);
  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function withUpdatedParams(current: URLSearchParams, patch: Record<string, SearchParamValue>) {
  const next = new URLSearchParams(current.toString());
  for (const [k, v] of Object.entries(patch)) setParam(next, k, v);
  return next;
}

