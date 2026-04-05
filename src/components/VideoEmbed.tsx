import { useState, useRef, useEffect, useCallback } from "react";
import YouTubeEmbed from "./YouTubeEmbed";
import GoogleDriveEmbed from "./GoogleDriveEmbed";
import { resolveMediaUrl } from "@/lib/resolveMediaUrl";

/* ---- URL detection helpers ---- */

export const isGoogleDriveUrl = (url: string | null): boolean =>
    !!url && (url.includes("drive.google.com") || url.includes("docs.google.com"));

export const isYouTubeUrl = (url: string | null): boolean =>
    !!url && (url.includes("youtube.com") || url.includes("youtu.be"));

export const isLocalVideoUrl = (url: string | null): boolean =>
    !!url && (url.match(/\.(mp4|webm|ogg|mov)$/i) !== null || (url.includes("/uploads/") && !isYouTubeUrl(url) && !isGoogleDriveUrl(url)));

/** Extract Google Drive file ID from various URL formats */
export const extractGDriveFileId = (url: string): string => {
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) return fileMatch[1];
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return idMatch[1];
    const docsMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (docsMatch) return docsMatch[1];
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
    if (mediaType === "gdrive") return "gdrive";
    if (mediaType === "youtube") return "youtube";
    if (isGoogleDriveUrl(url)) return "gdrive";
    if (isYouTubeUrl(url)) return "youtube";
    if (mediaType === "video" || mediaType === "local") return "local";
    if (isLocalVideoUrl(url)) return "local";
    if (url && /^[\w-]{11}$/.test(url)) return "youtube";
    return "unknown";
};

/* ---- Local Video with Auto-Thumbnail ---- */

const LocalVideoPlayer = ({ url, title, className }: { url: string; title: string; className: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [poster, setPoster] = useState<string | null>(null);
    const [videoRatio, setVideoRatio] = useState<number>(16 / 9);
    const [ratioDetected, setRatioDetected] = useState(false);

    const videoSrc = resolveMediaUrl(url);

    // Auto-capture first frame as poster thumbnail
    useEffect(() => {
        const thumbVid = document.createElement("video");
        thumbVid.crossOrigin = "anonymous";
        thumbVid.preload = "metadata";
        thumbVid.muted = true;
        thumbVid.playsInline = true;
        thumbVid.src = videoSrc;

        const handleSeeked = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = thumbVid.videoWidth || 640;
                canvas.height = thumbVid.videoHeight || 360;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(thumbVid, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                    if (dataUrl.length > 1000) {
                        setPoster(dataUrl);
                    }
                }
            } catch {
                // CORS or other error — poster stays null
            }
            if (thumbVid.videoWidth && thumbVid.videoHeight) {
                setVideoRatio(thumbVid.videoWidth / thumbVid.videoHeight);
                setRatioDetected(true);
            }
            thumbVid.remove();
        };

        const handleLoaded = () => {
            // Seek to 1 second to get a non-black frame
            thumbVid.currentTime = Math.min(1, thumbVid.duration * 0.1 || 0.5);
        };

        thumbVid.addEventListener("loadeddata", handleLoaded);
        thumbVid.addEventListener("seeked", handleSeeked);
        thumbVid.addEventListener("error", () => thumbVid.remove());

        const timeout = setTimeout(() => thumbVid.remove(), 10000);

        return () => {
            clearTimeout(timeout);
            thumbVid.removeEventListener("loadeddata", handleLoaded);
            thumbVid.removeEventListener("seeked", handleSeeked);
            thumbVid.remove();
        };
    }, [videoSrc]);

    const handlePlay = useCallback(() => {
        setPlaying(true);
        setTimeout(() => {
            videoRef.current?.play().catch(() => {});
        }, 100);
    }, []);

    const isPortrait = ratioDetected && videoRatio < 1;

    // Thumbnail preview with play button (before clicking play)
    if (!playing) {
        return (
            <div className={`flex justify-center ${className}`}>
                <div
                    className="relative overflow-hidden cursor-pointer group"
                    style={{
                        width: isPortrait ? "fit-content" : "100%",
                        maxWidth: "100%",
                        aspectRatio: ratioDetected ? `${videoRatio}` : "16/9",
                        minHeight: "200px",
                        borderRadius: "6px",
                        border: "1px solid hsl(30, 10%, 18%)",
                        boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.5)",
                        background: poster
                            ? "#000"
                            : "linear-gradient(135deg, hsl(20, 8%, 12%) 0%, hsl(25, 12%, 8%) 50%, hsl(30, 10%, 15%) 100%)",
                    }}
                    onClick={handlePlay}
                    role="button"
                    aria-label={`Play ${title}`}
                >
                    {/* Poster thumbnail from first frame */}
                    {poster && (
                        <img
                            src={poster}
                            alt={title}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
                        />
                    )}

                    {/* Film strip icon when no poster (so it's not just blank) */}
                    {!poster && (
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0.15,
                        }}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "#c9a96e" }}>
                                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                                <line x1="7" y1="2" x2="7" y2="22" />
                                <line x1="17" y1="2" x2="17" y2="22" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <line x1="2" y1="7" x2="7" y2="7" />
                                <line x1="2" y1="17" x2="7" y2="17" />
                                <line x1="17" y1="7" x2="22" y2="7" />
                                <line x1="17" y1="17" x2="22" y2="17" />
                            </svg>
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-opacity group-hover:opacity-80" />

                    {/* Play button — inline styled so it's ALWAYS visible */}
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 20,
                    }}>
                        <div style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: "rgba(201, 169, 110, 0.9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                            transition: "transform 0.3s, box-shadow 0.3s",
                        }}
                            className="group-hover:scale-110"
                        >
                            <svg viewBox="0 0 24 24" style={{ width: "28px", height: "28px", fill: "#1a1a1a", marginLeft: "3px" }}>
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title overlay on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4" style={{ zIndex: 10 }}>
                        <p className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ color: "#c9a96e" }}>
                            ▶ {title}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Active video player (after clicking play)
    return (
        <div className={`flex justify-center ${className}`}>
            <div
                className="relative overflow-hidden"
                style={{
                    width: isPortrait ? "fit-content" : "100%",
                    maxWidth: "100%",
                    borderRadius: "6px",
                    border: "1px solid hsl(30, 10%, 18%)",
                    boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.5)",
                }}
            >
                <video
                    ref={videoRef}
                    src={videoSrc}
                    title={title}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    poster={poster || undefined}
                    className="bg-black block"
                    style={{
                        maxWidth: "100%",
                        width: isPortrait ? "auto" : "100%",
                        maxHeight: isPortrait ? "65vh" : undefined,
                        display: "block",
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
        </div>
    );
};

/* ---- Unified Video Embed Component ---- */

interface VideoEmbedProps {
    url: string;
    title?: string;
    className?: string;
    mediaType?: string | null;
}

/**
 * Auto-detects the video source and renders the appropriate embed.
 * All video types show a thumbnail poster with play button before playing:
 * - YouTube → YouTubeEmbed (has its own thumbnail system)
 * - Google Drive → GoogleDriveEmbed (uses Drive thumbnail API + play overlay)
 * - Local/uploaded → LocalVideoPlayer (auto-captures first frame as poster)
 * - Unknown → falls back to YouTubeEmbed
 */
const VideoEmbed = ({ url, title = "Video", className = "", mediaType }: VideoEmbedProps) => {
    const type = detectVideoType(url, mediaType);

    if (type === "gdrive") {
        const fileId = extractGDriveFileId(url);
        return <GoogleDriveEmbed fileId={fileId} title={title} className={className} />;
    }

    if (type === "local") {
        return <LocalVideoPlayer url={url} title={title} className={className} />;
    }

    // YouTube or unknown
    const videoId = extractYouTubeVideoId(url);
    return <YouTubeEmbed videoId={videoId} title={title} className={className} />;
};

export default VideoEmbed;
