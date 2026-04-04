/**
 * Resolve an uploaded media URL, rewriting /uploads/ paths to /api/media/
 * to bypass Hostinger CDN image processing (which returns 422 errors).
 *
 * Priority:
 *  1. Absolute URLs (http/https) → return as-is
 *  2. /uploads/* paths → rewrite to /api/media/* (CDN bypass)
 *  3. Other relative paths → prepend API_URL
 */
const API_URL = import.meta.env.VITE_API_URL || "";

export function resolveMediaUrl(url: string): string {
    if (!url) return url;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads/")) {
        return `${API_URL}/api/media/${url.replace("/uploads/", "")}`;
    }
    return `${API_URL}${url}`;
}

/**
 * Get the original /uploads/ path as a fallback if /api/media/ also fails.
 */
export function getOriginalUploadUrl(url: string): string {
    if (!url) return url;
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
}

export default resolveMediaUrl;
