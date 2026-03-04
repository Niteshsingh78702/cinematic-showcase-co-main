import { useState, useRef, useCallback } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

/* Ordered list of YouTube thumbnail qualities to try */
const THUMB_QUALITIES = [
  "maxresdefault.jpg",
  "hqdefault.jpg",
  "mqdefault.jpg",
  "sddefault.jpg",
  "0.jpg",
];

/**
 * Check if a loaded image is YouTube's gray "no thumbnail" placeholder.
 * YouTube returns a valid gray image (often 120×90 or 480×360) for non-existent videos.
 * We detect it by checking the image dimensions and average brightness via canvas.
 */
const isGrayPlaceholder = (img: HTMLImageElement): boolean => {
  // The tiny 120×90 default placeholder
  if (img.naturalWidth <= 120 && img.naturalHeight <= 90) return true;

  // Canvas-based gray detection for larger placeholders
  try {
    const canvas = document.createElement("canvas");
    const size = 20; // Sample a small thumbnail for performance
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;

    let totalR = 0, totalG = 0, totalB = 0;
    const pixels = size * size;
    for (let i = 0; i < data.length; i += 4) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
    }
    const avgR = totalR / pixels;
    const avgG = totalG / pixels;
    const avgB = totalB / pixels;

    // YouTube's placeholder is a uniform mid-gray (~200 brightness, low color variance)
    const brightness = (avgR + avgG + avgB) / 3;
    const colorVariance = Math.abs(avgR - avgG) + Math.abs(avgG - avgB) + Math.abs(avgR - avgB);

    // Gray placeholder: brightness between 80-220, very low color variance
    if (brightness > 80 && brightness < 220 && colorVariance < 15) return true;
  } catch {
    // Canvas tainted by CORS — can't check, assume it's fine
  }
  return false;
};

const YouTubeEmbed = ({ videoId, title = "Video", className = "" }: YouTubeEmbedProps) => {
  const [loaded, setLoaded] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const fallbackIdx = useRef(0);

  const tryNextThumb = useCallback((imgEl: HTMLImageElement) => {
    fallbackIdx.current += 1;
    if (fallbackIdx.current < THUMB_QUALITIES.length) {
      imgEl.src = `https://img.youtube.com/vi/${videoId}/${THUMB_QUALITIES[fallbackIdx.current]}`;
    } else {
      setThumbFailed(true);
    }
  }, [videoId]);

  const handleThumbError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    tryNextThumb(e.target as HTMLImageElement);
  }, [tryNextThumb]);

  const handleThumbLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    if (isGrayPlaceholder(img)) {
      tryNextThumb(img);
    }
  }, [tryNextThumb]);

  if (!loaded) {
    return (
      <div
        className={`relative aspect-video bg-secondary cursor-pointer group overflow-hidden ${className}`}
        onClick={() => setLoaded(true)}
        role="button"
        aria-label={`Play ${title}`}
      >
        {/* Thumbnail or fallback placeholder */}
        {!thumbFailed ? (
          <img
            src={`https://img.youtube.com/vi/${videoId}/${THUMB_QUALITIES[0]}`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-75"
            loading="lazy"
            crossOrigin="anonymous"
            onError={handleThumbError}
            onLoad={handleThumbLoad}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-3 text-primary/60" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="text-gray-400 text-sm font-body select-none">{title}</span>
            </div>
          </div>
        )}

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
