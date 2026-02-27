import { useState } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

const isValidVideoId = (id: string) => /^[\w-]{11}$/.test(id);

const YouTubeEmbed = ({ videoId, title = "Video", className = "" }: YouTubeEmbedProps) => {
  const [loaded, setLoaded] = useState(false);

  // If videoId is invalid, show an error placeholder
  if (!videoId || !isValidVideoId(videoId)) {
    return (
      <div className={`film-error-card ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <p>Video unavailable</p>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div
        className={`relative aspect-video bg-secondary cursor-pointer group overflow-hidden ${className}`}
        onClick={() => setLoaded(true)}
        role="button"
        aria-label={`Play ${title}`}
      >
        {/* High-quality thumbnail with fallback chain */}
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
          loading="lazy"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.src.includes("maxresdefault")) {
              img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            } else if (img.src.includes("hqdefault")) {
              img.src = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
            }
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
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
};

export default YouTubeEmbed;
