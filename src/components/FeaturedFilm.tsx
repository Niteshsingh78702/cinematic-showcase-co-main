import { motion } from "framer-motion";
import YouTubeEmbed from "./YouTubeEmbed";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const FeaturedFilm = () => {
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
                        Milloner Bela
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
                        <YouTubeEmbed videoId="dQw4w9WgXcQ" title="Milloner Bela — Official Trailer" />
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        variants={fadeInUp}
                    >
                        <span className="category-badge mb-4 inline-flex">Drama • Short Film • 2024</span>
                        <p className="text-muted-foreground font-body leading-relaxed mt-4 mb-6">
                            A poignant short film that explores human emotions through the lens of regional storytelling.
                            Directed with cinematic precision, <em>Milloner Bela</em> showcases the depth of
                            Purulia Bangla culture and the raw talent of our lead actress, Monika Singh.
                        </p>

                        {/* Credits */}
                        <div className="space-y-3 mb-8">
                            {[
                                { label: "Director", value: "MG Films" },
                                { label: "Lead Actress", value: "Monika Singh" },
                                { label: "Genre", value: "Drama / Short Film" },
                                { label: "Language", value: "Purulia Bangla" },
                            ].map((credit) => (
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
