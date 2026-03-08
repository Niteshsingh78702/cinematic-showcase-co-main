import { useState, useRef } from "react";
import YouTubeEmbed from "./YouTubeEmbed";
import GoogleDriveEmbed from "./GoogleDriveEmbed";

/* ---- URL detection helpers ---- */

export const isGoogleDriveUrl = (url: string | null): boolean =>
    !!url && (url.includes("drive.google.com") || url.includes("docs.google.com"));

export const isYouTubeUrl = (url: string | null): boolean =>
    !!url && (url.includes("youtube.com") || url.includes("youtu.be"));

export const isLocalVideoUrl = (url: string | null): boolean =>
    !!url && (url.match(/\.(mp4|webm|ogg|mov)$/i) !== null || (url.includes("/uploads/") && !isYouTubeUrl(url) && !isGoogleDriveUrl(url)));

/** Extract Google Drive file ID from various URL formats */
export const extractGDriveFileId = (url: string): string => {
    // Format: https://drive.google.com/file/d/{FILE_ID}/view
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) return fileMatch[1];

    // Format: https://drive.google.com/open?id={FILE_ID}
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return idMatch[1];

    // Format: https://docs.google.com/.../{FILE_ID}/...
    const docsMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (docsMatch) return docsMatch[1];

    // Assume the url itself is a file ID
    return url;
};

/** Extract YouTube video ID from various URL formats */
export const extractYouTubeVideoId = (url: string): string => {
    if (!url) return "dQw4w9WgXcQ";
    if (!url.includes("/") && !url.includes(".")) return url;
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
        if (u.searchParams.get("v")) return u.searchParams.get("v")!;
        if (u.pathname.includes("/embed/")) return u.pathname.split("/embed/")[1];
        if (u.pathname.includes("/shorts/")) return u.pathname.split("/shorts/")[1];
    } catch { }
    return url;
};

/** Detect the video type from a URL or media_type */
export const detectVideoType = (
    url: string | null,
    mediaType?: string | null
): "youtube" | "gdrive" | "local" | "unknown" => {
    // Explicit media_type hints (specific types)
    if (mediaType === "gdrive") return "gdrive";
    if (mediaType === "youtube") return "youtube";
    // URL-based detection takes priority over generic "video" type
    if (isGoogleDriveUrl(url)) return "gdrive";
    if (isYouTubeUrl(url)) return "youtube";
    // Generic "video" media_type → local file
    if (mediaType === "video" || mediaType === "local") return "local";
    if (isLocalVideoUrl(url)) return "local";
    // Bare 11-char string is likely a YouTube video ID
    if (url && /^[\w-]{11}$/.test(url)) return "youtube";
    return "unknown";
};

/* ---- Unified Video Embed Component ---- */

interface VideoEmbedProps {
    /** Full URL (YouTube or Google Drive) or a bare YouTube video ID */
    url: string;
    title?: string;
    className?: string;
    /** Optional media_type hint from database (e.g. 'youtube', 'gdrive') */
    mediaType?: string | null;
}

/**
 * Auto-detects the video source and renders the appropriate embed.
 * Automatically adjusts the container to match the video's native aspect ratio.
 * - Portrait videos → centered, narrower container with max-height cap
 * - Landscape videos → full-width container
 * - YouTube → delegates to YouTubeEmbed (always 16:9)
 * - Google Drive → delegates to GoogleDriveEmbed
 * - Local/uploaded → renders HTML5 video player with smart ratio detection
 * - Unknown → falls back to YouTubeEmbed (backward compatible)
 */
const VideoEmbed = ({ url, title = "Video", className = "", mediaType }: VideoEmbedProps) => {
    const type = detectVideoType(url, mediaType);

    /* Hooks must be called unconditionally (React rules) */
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoRatio, setVideoRatio] = useState<number>(16 / 9);
    const [ratioDetected, setRatioDetected] = useState(false);

    if (type === "gdrive") {
        const fileId = extractGDriveFileId(url);
        return <GoogleDriveEmbed fileId={fileId} title={title} className={className} />;
    }

    if (type === "local") {
        // Resolve the video URL — prepend API base if it's a relative path
        const videoSrc = url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL || ""}${url}`;
        const isPortrait = ratioDetected && videoRatio < 1;

        return (
            <div className={`flex justify-center ${className}`}>
                <video
                    ref={videoRef}
                    src={videoSrc}
                    title={title}
                    controls
                    playsInline
                    preload="metadata"
                    className="rounded-sm bg-black"
                    style={{
                        maxWidth: "100%",
                        width: isPortrait ? "auto" : "100%",
                        maxHeight: isPortrait ? "65vh" : undefined,
                    }}
                    onLoadedMetadata={() => {
                        const vid = videoRef.current;
                        if (vid && vid.videoWidth && vid.videoHeight) {
                            setVideoRatio(vid.videoWidth / vid.videoHeight);
                            setRatioDetected(true);
                        }
                    }}
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }

    // YouTube or unknown — extract video ID and use existing component
    const videoId = extractYouTubeVideoId(url);
    return <YouTubeEmbed videoId={videoId} title={title} className={className} />;
};

export default VideoEmbed;

