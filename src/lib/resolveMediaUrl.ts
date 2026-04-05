/**
 * Resolve an uploaded media URL for display.
 *
 * Handles all URL formats:
 *  1. Absolute URLs (http/https) → return as-is
 *  2. data: URLs → return as-is
 *  3. /api/media/db/* paths → return as-is (DB-served, persistent)
 *  4. /uploads/* paths → rewrite to /api/media/db/* (DB lookup with disk fallback)
 *  5. Other relative paths → prepend API_URL
 */
const API_URL = import.meta.env.VITE_API_URL || "";

export function resolveMediaUrl(url: string): string {
    if (!url) return url;
    // Absolute URLs — pass through
    if (url.startsWith("http")) return url;
    // Data URLs — pass through
    if (url.startsWith("data:")) return url;
    // Already a DB-served URL — pass through
    if (url.startsWith("/api/media/db/")) return `${API_URL}${url}`;
    // Old /uploads/ paths → rewrite to DB endpoint for persistence
    if (url.startsWith("/uploads/")) {
        return `${API_URL}/api/media/db/${url.replace("/uploads/", "")}`;
    }
    // /api/media/ paths — pass through with API_URL prefix
    if (url.startsWith("/api/")) return `${API_URL}${url}`;
    return `${API_URL}${url}`;
}

/**
 * Get the original /uploads/ path as a fallback.
 */
export function getOriginalUploadUrl(url: string): string {
    if (!url) return url;
    if (url.startsWith("http")) return url;
    return `${API_URL}${url}`;
}

export default resolveMediaUrl;
