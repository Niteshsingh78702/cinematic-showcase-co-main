import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import ImageLightbox from "@/components/ImageLightbox";
import { useMultiContent, ContentItem } from "@/hooks/useContent";

/* fallback imports — shown while DB is empty */
import albumCover from "@/assets/album-cover.jpg";
import filmCover from "@/assets/film-cover.jpg";
import weddingCover from "@/assets/wedding-cover.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import actressPortrait from "@/assets/actress-portrait.jpg";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

/* ---------- default (fallback) data ---------- */
const defaultAlbums = [
    { title: "Mon Bhore Jai", category: "Purulia Bangla", image: albumCover, year: "2024", link: "", mediaType: "image" },
    { title: "Khortha Melodies", category: "Khortha", image: filmCover, year: "2023", link: "", mediaType: "image" },
    { title: "Santhali Serenade", category: "Santhali", image: weddingCover, year: "2023", link: "", mediaType: "image" },
    { title: "Dil Ka Dard", category: "Purulia Bangla", image: heroBg, year: "2024", link: "", mediaType: "image" },
    { title: "Prem Kahani", category: "Khortha", image: actressPortrait, year: "2023", link: "", mediaType: "image" },
    { title: "Jharkhand Ki Rani", category: "Santhali", image: albumCover, year: "2022", link: "", mediaType: "image" },
];

const defaultFilms = [
    { title: "Milloner Bela", videoId: "dQw4w9WgXcQ", year: "2024", genre: "Drama • Short Film" },
    { title: "Purulia Express", videoId: "dQw4w9WgXcQ", year: "2023", genre: "Adventure • Short Film" },
];

const defaultWeddingPhotos = [
    { src: heroBg, alt: "Grand Reception Setup" },
    { src: albumCover, alt: "Bridal Portrait" },
    { src: filmCover, alt: "Ceremony Moments" },
    { src: weddingCover, alt: "Sangeet Night" },
    { src: actressPortrait, alt: "Couple Portrait" },
    { src: heroBg, alt: "Mandap Decoration" },
];

/* ---------- helpers — map API data to display ---------- */
const getYouTubeThumbnail = (url: string) => {
    // Extract video ID from various YouTube URL formats
    let videoId = url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
    if (match) videoId = match[1];
    // If it's already just an ID (11 chars)
    if (/^[\w-]{11}$/.test(videoId)) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    return null;
};

const isYouTubeUrl = (url: string | null) =>
    !!url && (url.includes('youtube.com') || url.includes('youtu.be'));

const getVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : (/^[\w-]{11}$/.test(url) ? url : null);
};

const mapAlbums = (items: ContentItem[]) =>
    items.map((i) => {
        const ytDetected = i.media_type === 'youtube' || isYouTubeUrl(i.media_url);
        const videoId = ytDetected && i.media_url ? getVideoId(i.media_url) : null;
        return {
            title: i.title || "Untitled Album",
            category: i.category || "Purulia Bangla",
            image: ytDetected && i.media_url
                ? getYouTubeThumbnail(i.media_url) || albumCover
                : i.media_url || albumCover,
            year: i.description || "2024",
            link: i.link_url || (ytDetected && i.media_url
                ? (i.media_url.includes('youtube.com') || i.media_url.includes('youtu.be')
                    ? i.media_url
                    : `https://www.youtube.com/watch?v=${i.media_url}`)
                : ""),
            mediaType: ytDetected ? 'youtube' : (i.media_type || 'image'),
            videoId,
        };
    });

const mapFilms = (items: ContentItem[]) =>
    items.map((i) => {
        // Extract video ID from full YouTube URLs
        let videoId = i.media_url || "dQw4w9WgXcQ";
        const match = videoId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/);
        if (match) videoId = match[1];
        return {
            title: i.title || "Untitled Film",
            videoId,
            year: i.link_url || "2024",
            genre: i.category || "Drama • Short Film",
            description: i.description || "",
        };
    });

const mapWeddings = (items: ContentItem[]) =>
    items.map((i) => ({
        src: i.media_url || weddingCover,
        alt: i.title || "Wedding Moment",
    }));

/* ---------- tabs / categories ---------- */
const tabs = [
    { key: "albums", label: "Music Albums" },
    { key: "films", label: "Films & Trailers" },
    { key: "weddings", label: "Wedding & Events" },
];

const Work = () => {
    const [activeTab, setActiveTab] = useState("albums");
    const [activeCat, setActiveCat] = useState("All");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [ytModal, setYtModal] = useState<{ videoId: string; title: string; link: string } | null>(null);

    /* Fetch all three sections */
    const { data, loading } = useMultiContent(["work_albums", "work_films", "work_weddings"]);

    /* Use API data when available, fallback to defaults when empty */
    const albums = data.work_albums?.length ? mapAlbums(data.work_albums) : defaultAlbums;
    const films = data.work_films?.length ? mapFilms(data.work_films) : defaultFilms;
    const weddingPhotos = data.work_weddings?.length ? mapWeddings(data.work_weddings) : defaultWeddingPhotos;

    /* Derive categories from album data */
    const categories = ["All", ...Array.from(new Set(albums.map((a) => a.category)))];
    const filteredAlbums = activeCat === "All" ? albums : albums.filter((a) => a.category === activeCat);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Page Header */}
            <section className="pt-28 pb-16 bg-gradient-dark">
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial="hidden" animate="visible" transition={{ duration: 0.6 }} variants={fadeInUp}>
                        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Portfolio</p>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient-gold mb-4">
                            Our Work
                        </h1>
                        <p className="text-muted-foreground font-body max-w-xl mx-auto">
                            Explore our collection of regional music albums, films, and wedding cinematography
                        </p>
                        <div className="glow-line mt-6" />
                    </motion.div>
                </div>
            </section>

            {/* Tabs */}
            <div className="sticky top-16 z-40 bg-card/95 backdrop-blur-md border-b border-border">
                <div className="container mx-auto px-6 flex gap-1 overflow-x-auto py-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setActiveCat("All"); }}
                            className={`px-5 py-2.5 rounded-sm text-sm font-body whitespace-nowrap transition-all ${activeTab === tab.key
                                ? "bg-gradient-gold text-primary-foreground font-semibold shadow-gold-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="py-20 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground font-body">Loading content...</p>
                </div>
            )}

            {/* ==================== ALBUMS TAB ==================== */}
            {!loading && activeTab === "albums" && (
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-6">
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2 mb-10 justify-center">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCat(cat)}
                                    className={`category-badge ${activeCat === cat ? "active" : ""}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Albums Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto stagger-children">
                            {filteredAlbums.map((album, i) => (
                                <motion.div
                                    key={album.title + album.category}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.35 }}
                                    className="gallery-card aspect-video"
                                    style={{ cursor: album.mediaType === 'youtube' || album.link ? 'pointer' : 'default' }}
                                    onClick={() => {
                                        if (album.mediaType === 'youtube' && album.videoId) {
                                            setYtModal({ videoId: album.videoId, title: album.title, link: album.link });
                                        } else if (album.link) {
                                            window.open(album.link, '_blank');
                                        }
                                    }}
                                >
                                    <img src={album.image} alt={album.title} loading="lazy" />
                                    {album.mediaType === 'youtube' && (
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5, pointerEvents: 'none' }}>
                                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.6)" />
                                                <polygon points="10,8 17,12 10,16" fill="white" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="card-overlay">
                                        <h3>{album.title}</h3>
                                        <p>{album.category} • {album.year}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {filteredAlbums.length === 0 && (
                            <p className="text-center text-muted-foreground font-body mt-12">No albums in this category yet.</p>
                        )}
                    </div>
                </section>
            )}

            {/* ==================== FILMS TAB ==================== */}
            {!loading && activeTab === "films" && (
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-6">
                        <div className="space-y-10 max-w-5xl mx-auto">
                            {films.map((film, i) => (
                                <motion.div
                                    key={film.title}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    variants={fadeInUp}
                                    className="film-card"
                                >
                                    <div className="grid md:grid-cols-[1.6fr_1fr] gap-0">
                                        <div className="yt-embed-wrapper border-0 rounded-none shadow-none">
                                            <YouTubeEmbed videoId={film.videoId} title={film.title} />
                                        </div>
                                        <div className="p-6 md:p-8 flex flex-col justify-center">
                                            <span className="text-primary text-xs tracking-[0.2em] uppercase font-body mb-2">{film.genre}</span>
                                            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">{film.title}</h3>
                                            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">
                                                {film.description || "A cinematic production by MG Films, bringing regional stories to life with professional cinematography."}
                                            </p>
                                            <div className="flex items-center gap-3 mt-auto">
                                                <span className="text-xs text-muted-foreground font-body border border-border px-3 py-1 rounded-sm">{film.year}</span>
                                                <span className="text-xs text-muted-foreground font-body">MG Films Production</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ==================== WEDDINGS TAB ==================== */}
            {!loading && activeTab === "weddings" && (
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-6">
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="text-center text-muted-foreground font-body mb-10 max-w-lg mx-auto"
                        >
                            Every wedding is a story. We capture the emotions, rituals, and celebrations that make your day unforgettable.
                        </motion.p>

                        {/* Masonry Gallery */}
                        <div className="gallery-masonry max-w-6xl mx-auto">
                            {weddingPhotos.map((photo, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.06 }}
                                    className="gallery-card"
                                    style={{ minHeight: i % 7 === 0 ? "320px" : "220px" }}
                                    onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                                >
                                    <img src={photo.src} alt={photo.alt} loading="lazy" />
                                    <div className="card-overlay">
                                        <h3>{photo.alt}</h3>
                                        <p>Wedding Collection</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <ImageLightbox
                            images={weddingPhotos}
                            initialIndex={lightboxIndex}
                            isOpen={lightboxOpen}
                            onClose={() => setLightboxOpen(false)}
                        />
                    </div>
                </section>
            )}

            {/* ========== YouTube Player Modal ========== */}
            {ytModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setYtModal(null)}
                >
                    <div
                        className="relative w-full max-w-4xl mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setYtModal(null)}
                            className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm font-body flex items-center gap-1 transition-colors"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            Close
                        </button>

                        {/* Embedded YouTube player */}
                        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                            <iframe
                                src={`https://www.youtube.com/embed/${ytModal.videoId}?autoplay=1&rel=0&modestbranding=1`}
                                title={ytModal.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                            />
                        </div>

                        {/* Title + YouTube link */}
                        <div className="flex items-center justify-between mt-3">
                            <h3 className="text-white font-display font-semibold text-lg">{ytModal.title}</h3>
                            {ytModal.link && (
                                <a
                                    href={ytModal.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary text-sm font-body hover:underline flex items-center gap-1"
                                >
                                    Watch on YouTube
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Work;
