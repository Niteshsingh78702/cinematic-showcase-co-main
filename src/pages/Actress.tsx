import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import ImageLightbox from "@/components/ImageLightbox";
import { useContent, ContentItem } from "@/hooks/useContent";
import actressPortrait from "@/assets/actress-portrait.jpg";
import monikaPic from "@/assets/monika.png";
import heroBg from "@/assets/hero-bg.jpg";
import albumCover from "@/assets/album-cover.jpg";
import filmCover from "@/assets/film-cover.jpg";
import weddingCover from "@/assets/wedding-cover.jpg";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const defaultPhotos = [
    { src: monikaPic, alt: "Monika Singh — Portrait" },
    { src: heroBg, alt: "Monika Singh — On Set" },
    { src: albumCover, alt: "Monika Singh — Album Shoot" },
    { src: filmCover, alt: "Monika Singh — Film Still" },
    { src: weddingCover, alt: "Monika Singh — Event Appearance" },
    { src: monikaPic, alt: "Monika Singh — Traditional" },
    { src: heroBg, alt: "Monika Singh — Cinematic" },
    { src: albumCover, alt: "Monika Singh — Behind the Scenes" },
];

const experience = [
    { year: "2024", work: "Lead Actress — Milloner Bela (Short Film)", highlight: true },
    { year: "2023", work: "Music Video Lead — Mon Bhore Jai (Purulia Bangla Album)", highlight: false },
    { year: "2023", work: "Featured Artist — Khortha Melodies (Music Album)", highlight: false },
    { year: "2022", work: "Lead Artist — Santhali Serenade (Santhali Album)", highlight: false },
    { year: "2022", work: "Co-Founder — MG Films Production House", highlight: true },
    { year: "2021", work: "Regional Music Video Appearances (Multiple)", highlight: false },
];

const Actress = () => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const { items: actressContent } = useContent("actress");

    /* Map API items to photos — use uploaded images when available */
    const photos = actressContent.length > 0
        ? actressContent
            .filter((i) => i.media_url && i.media_type !== "youtube")
            .map((i) => ({ src: i.media_url!, alt: i.title || "Monika Singh" }))
        : defaultPhotos;

    /* Find showreel video (youtube type) from actress section */
    const showreelItem = actressContent.find((i) => i.media_type === "youtube");
    const showreelVideoId = showreelItem?.media_url || "dQw4w9WgXcQ";

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Cinematic Hero */}
            <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
                <div className="absolute inset-0">
                    <img src={monikaPic} alt="Monika Singh" className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
                </div>
                <div className="relative z-10 container mx-auto px-6 pb-16">
                    <motion.div initial="hidden" animate="visible" transition={{ duration: 0.8 }} variants={fadeInUp}>
                        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Artist Portfolio</p>
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-3">
                            Monika <span className="text-gradient-gold">Singh</span>
                        </h1>
                        <p className="text-muted-foreground font-body text-lg max-w-md mb-6">
                            Regional actress & co-founder of MG Films
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {["Acting", "Dance", "Direction", "Script Writing"].map((skill) => (
                                <span key={skill} className="category-badge">{skill}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bio Section */}
            <section className="py-20 bg-card">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center max-w-6xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            variants={fadeInUp}
                        >
                            <div className="gallery-card aspect-[3/4]">
                                <img
                                    src={monikaPic}
                                    alt="Monika Singh — Professional Portrait"
                                    className="w-full h-full object-cover"
                                />
                                <div className="card-overlay">
                                    <h3>Monika Singh</h3>
                                    <p>Co-Founder • Lead Actress</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            variants={fadeInUp}
                        >
                            <div className="glow-line !mx-0 mb-6" />
                            <h2 className="text-3xl font-display font-bold text-foreground mb-2">About Monika</h2>
                            <p className="text-primary font-body text-sm mb-6 tracking-wider uppercase">Actress • Album Performer • Film Artist • Co-Founder</p>

                            <p className="text-muted-foreground font-body leading-relaxed mb-5">
                                Monika Singh is a dedicated regional actress who has carved her niche in the vibrant
                                entertainment industry of Eastern India. With a natural talent for emotive performance
                                and a deep connection to regional culture, she has become a prominent face in Purulia
                                Bangla, Khortha, and Santhali productions.
                            </p>

                            <p className="text-muted-foreground font-body leading-relaxed mb-8">
                                Her journey from regional music videos to founding MG Films reflects her determination
                                to elevate regional content to professional cinematic standards. Every role she takes
                                on is infused with authenticity and emotional depth.
                            </p>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[
                                    { num: "15+", label: "Music Videos" },
                                    { num: "3+", label: "Short Films" },
                                    { num: "3", label: "Languages" },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center py-4 rounded-sm bg-secondary border border-border">
                                        <p className="text-2xl font-display font-bold text-gradient-gold">{stat.num}</p>
                                        <p className="text-xs text-muted-foreground font-body mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <a
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-primary-foreground font-body font-semibold rounded-sm hover:opacity-90 transition-opacity shadow-gold-sm"
                            >
                                Contact for Casting
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Showreel */}
            <section className="py-20 bg-gradient-dark">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Watch</p>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient-gold mb-4">
                            Showreel
                        </h2>
                        <div className="glow-line mt-4" />
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        variants={fadeInUp}
                        className="max-w-4xl mx-auto yt-embed-wrapper"
                    >
                        <YouTubeEmbed videoId={showreelVideoId} title="Monika Singh — Showreel" />
                    </motion.div>
                </div>
            </section>

            {/* Photo Gallery */}
            <section className="py-20 bg-card">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Gallery</p>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient-gold mb-4">
                            Photo Portfolio
                        </h2>
                        <div className="glow-line mt-4" />
                    </motion.div>

                    {/* Premium Gallery Grid */}
                    <div className="gallery-masonry max-w-6xl mx-auto">
                        {photos.map((photo, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.07 }}
                                className="gallery-card"
                                style={{ minHeight: i % 5 === 0 ? '320px' : '240px' }}
                                onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                            >
                                <img src={photo.src} alt={photo.alt} loading="lazy" />
                                <div className="card-overlay">
                                    <h3>{photo.alt.replace("Monika Singh — ", "")}</h3>
                                    <p>Monika Singh</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <ImageLightbox
                        images={photos}
                        initialIndex={lightboxIndex}
                        isOpen={lightboxOpen}
                        onClose={() => setLightboxOpen(false)}
                    />
                </div>
            </section>

            {/* Experience Timeline */}
            <section className="py-20 bg-gradient-dark">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Career</p>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient-gold mb-4">
                            Experience
                        </h2>
                        <div className="glow-line mt-4" />
                    </motion.div>

                    <div className="max-w-2xl mx-auto space-y-3">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                variants={fadeInUp}
                                className={`flex items-start gap-4 p-5 rounded-sm border bg-card/50 transition-all hover:translate-x-1 ${exp.highlight ? "border-gold/40 shadow-gold-sm" : "border-border hover:border-gold/20"
                                    }`}
                            >
                                <span className="text-primary font-display font-bold text-lg min-w-[55px]">{exp.year}</span>
                                <div className="flex-1">
                                    <p className="text-foreground/90 font-body text-sm">{exp.work}</p>
                                </div>
                                {exp.highlight && (
                                    <span className="text-[10px] uppercase tracking-widest text-primary font-body bg-primary/10 px-2 py-0.5 rounded-sm">Featured</span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Actress;
