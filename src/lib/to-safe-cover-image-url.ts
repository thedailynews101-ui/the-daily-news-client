/**
 * Returns a URL safe to pass to `next/image`, or "" when the value is a
 * known HTML gallery/share page (e.g. ImgBB viewer links) rather than a
 * direct image asset.
 */
const HTML_GALLERY_HOSTS = new Set([
  "ibb.co.com",
  "www.ibb.co.com",
  "ibb.co",
  "www.ibb.co",
]);

export function toSafeCoverImageUrl(url: string | null | undefined): string {
  if (!url?.trim()) return "";

  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (HTML_GALLERY_HOSTS.has(hostname)) return "";
    return url;
  } catch {
    return "";
  }
}
