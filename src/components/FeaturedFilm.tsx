import { motion } from "framer-motion";
import VideoEmbed from "./VideoEmbed";
import { useContent } from "@/hooks/useContent";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

/* Extract YouTube video ID from various URL formats */
const extractVideoId = (url: string): string => {
    if (!url) return "dQw4w9WgXcQ";
    if (!url.includes("/") && !url.includes(".")) return url;
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
        if (u.searchParams.get("v")) return u.searchParams.get("v")!;
        if (u.pathname.includes("/embed/")) return u.pathname.split("/embed/")[1];
    } catch { }
    return url;
};

const FeaturedFilm = () => {
    const { items } = useContent("featured_film");
    const featured = items.length > 0 ? items[0] : null;

    /* Use admin content or fall back to defaults */
    const videoId = featured?.media_url ? extractVideoId(featured.media_url) : "dQw4w9WgXcQ";
    const title = featured?.title || "Milloner Bela";
    const description = featured?.description ||
        "A poignant picture film that explores human emotions through the lens of regional storytelling. Directed with cinematic precision, Milloner Bela showcases the depth of Purulia Bangla culture and the raw talent of our lead actress, Monika Singh.";
    const category = featured?.category || "Drama • Picture Film • 2024";

    /* Parse credits from link_url field (format: Director=MG Films|Lead Actress=Monika Singh|Genre=Drama|Language=Purulia Bangla) */
    const defaultCredits = [
        { label: "Director", value: "MG Films" },
        { label: "Lead Actress", value: "Monika Singh" },
        { label: "Genre", value: "Drama / Picture Film" },
        { label: "Language", value: "Purulia Bangla" },
    ];
    const credits = featured?.link_url
        ? featured.link_url.split("|").map((c) => {
            const [label, value] = c.split("=");
            return { label: label?.trim() || "", value: value?.trim() || "" };
        }).filter((c) => c.label && c.value)
        : defaultCredits;

    return (
        <section className="py-24 bg-gradient-dark relative overflow-hidden">
            {/* Background glow accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    variants={fadeInUp}
                    className="text-center mb-14"
                >
                    <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Featured Release</p>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
                        {title}
                    </h2>
                    <div className="glow-line mt-4" />
                </motion.div>

                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-center max-w-6xl mx-auto">
                    {/* Video */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        variants={fadeInUp}
                        className="yt-embed-wrapper"
                    >
                        <VideoEmbed url={featured?.media_url || "dQw4w9WgXcQ"} title={`${title} — Official Trailer`} mediaType={featured?.media_type} />
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        variants={fadeInUp}
                    >
                        <span className="category-badge mb-4 inline-flex">{category}</span>
                        <p className="text-muted-foreground font-body leading-relaxed mt-4 mb-6">
                            {description}
                        </p>

                        {/* Credits */}
                        <div className="space-y-3 mb-8">
                            {credits.map((credit) => (
                                <div key={credit.label} className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider min-w-[90px]">{credit.label}</span>
                                    <span className="w-px h-3 bg-border" />
                                    <span className="text-sm text-foreground/80 font-body">{credit.value}</span>
                                </div>
                            ))}
                        </div>

                        <a
                            href="/work"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-primary-foreground font-body font-semibold rounded-sm hover:opacity-90 transition-opacity shadow-gold-sm text-sm"
                        >
                            Watch More Films
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedFilm;
