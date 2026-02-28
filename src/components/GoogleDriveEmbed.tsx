import { useState } from "react";

interface GoogleDriveEmbedProps {
    fileId: string;
    title?: string;
    className?: string;
}

const GoogleDriveEmbed = ({ fileId, title = "Video", className = "" }: GoogleDriveEmbedProps) => {
    const [loaded, setLoaded] = useState(false);

    if (!loaded) {
        return (
            <div
                className={`relative aspect-video bg-secondary cursor-pointer group overflow-hidden ${className}`}
                onClick={() => setLoaded(true)}
                role="button"
                aria-label={`Play ${title}`}
            >
                {/* Google Drive thumbnail */}
                <img
                    src={`https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
                    loading="lazy"
                    onError={(e) => {
                        // Fallback: show a dark placeholder if thumbnail fails
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-opacity group-hover:opacity-80" />

                {/* Play button */}
                <div className="play-overlay">
                    <div className="play-btn">
                        <svg viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <p className="text-foreground font-body text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        {title}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative aspect-video ${className}`}>
            <iframe
                src={`https://drive.google.com/file/d/${fileId}/preview`}
                title={title}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
            />
        </div>
    );
};

export default GoogleDriveEmbed;
