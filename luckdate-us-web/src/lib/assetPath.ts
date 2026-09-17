/**
 * Prefix public asset paths with Next.js basePath (needed for GitHub Pages).
 * next/image and next/link handle this automatically; raw <video>/<img>/href do not.
 */
export function assetPath(path: string): string {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
