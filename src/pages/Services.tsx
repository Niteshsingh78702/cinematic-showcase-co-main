import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Film, Music, Heart, Camera, Clapperboard, Sparkles, MapPin, Clock, Users, Star } from "lucide-react";
import weddingCover from "@/assets/wedding-cover.jpg";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const services = [
    {
        icon: Film,
        title: "Film Production",
        description: "From concept to final cut, we create compelling short films and feature-length content. Our team handles everything — scriptwriting, direction, cinematography, and post-production. We specialize in regional stories that resonate deeply with audiences.",
        features: ["Script Development", "Professional Direction", "4K Cinematography", "Post-Production & VFX"],
    },
    {
        icon: Music,
        title: "Music Album Production",
        description: "Premium music video production for regional artists across Purulia Bangla, Khortha, and Santhali. We bring your music to life with stunning visuals, professional choreography, and cinematic storytelling that amplifies your artistic vision.",
        features: ["Music Video Direction", "Multi-Camera Setup", "Location Scouting", "Sound Design & Mixing"],
    },
    {
        icon: Heart,
        title: "Wedding Event Coverage",
        description: "Your most special day deserves cinematic perfection. Our wedding coverage captures every emotion, every ritual, and every celebration with the artistry of a feature film. From intimate ceremonies to grand receptions.",
        features: ["Pre-Wedding Shoots", "Full Day Coverage", "Reception & Sangeet", "Same-Day Edit Available"],
    },
    {
        icon: Camera,
        title: "Photography & Cinematography",
        description: "Professional photography and cinematography services for portfolios, events, corporate shoots, and fashion. We combine technical expertise with an artistic eye to deliver images and footage that tell your story beautifully.",
        features: ["Portrait & Fashion", "Event Photography", "Product Shoots", "Drone Aerial Photography"],
    },
    {
        icon: Clapperboard,
        title: "Video Editing",
        description: "State-of-the-art video editing and post-production services. From color grading to visual effects, sound design to final mastering — we transform raw footage into polished, professional content that captivates audiences.",
        features: ["Color Grading", "Visual Effects (VFX)", "Sound Design", "Motion Graphics"],
    },
];

const Services = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Page Header */}
            <section className="pt-28 pb-16 bg-gradient-dark">
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial="hidden" animate="visible" transition={{ duration: 0.6 }} variants={fadeInUp}>
                        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">What We Do</p>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient-gold mb-4">
                            Our Services
                        </h1>
                        <p className="text-muted-foreground font-body max-w-xl mx-auto">
                            Professional production services that bring your vision to life with cinematic excellence
                        </p>
                        <div className="section-divider w-32 mx-auto mt-6" />
                    </motion.div>
                </div>
            </section>

            {/* Services List */}
            <section className="py-20 bg-card">
                <div className="container mx-auto px-6">
                    <div className="space-y-8 max-w-5xl mx-auto">
                        {services.map((svc, i) => (
                            <motion.div
                                key={svc.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                variants={fadeInUp}
                                className="grid md:grid-cols-[auto_1fr_auto] gap-8 items-start p-8 rounded-sm border border-border bg-background hover:border-gold/30 transition-all group"
                            >
                                {/* Icon */}
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                                    <svc.icon className="w-8 h-8 text-primary" />
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-xl font-display font-semibold text-foreground mb-3">{svc.title}</h3>
                                    <p className="text-muted-foreground font-body leading-relaxed mb-4">{svc.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {svc.features.map((feat) => (
                                            <span key={feat} className="flex items-center gap-1.5 text-xs font-body text-foreground/70">
                                                <span className="w-1 h-1 rounded-full bg-primary" />
                                                {feat}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="flex-shrink-0 self-center">
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-gold text-primary-foreground font-body font-semibold rounded-sm hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
                                    >
                                        Get Quote
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== Pre-Wedding & Wedding Shooting Showcase ====== */}
            <section className="py-20 bg-gradient-dark">
                <div className="container mx-auto px-6">
                    {/* Section Header */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Celebrate Your Love Story</p>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
                            Pre-Wedding & Wedding Shooting
                        </h2>
                        <p className="text-muted-foreground font-body max-w-2xl mx-auto">
                            From romantic pre-wedding shoots set against breathtaking backdrops to capturing every heartfelt
                            moment on your wedding day — MG Films transforms your celebration into a cinematic masterpiece
                            that you'll relive forever.
                        </p>
                        <div className="section-divider w-32 mx-auto mt-6" />
                    </motion.div>

                    {/* Hero Image + Intro */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        variants={fadeInUp}
                        className="max-w-5xl mx-auto mb-16"
                    >
                        <div className="relative rounded-sm overflow-hidden border border-border shadow-gold">
                            <img
                                src={weddingCover}
                                alt="Pre-Wedding & Wedding Shooting by MG Films"
                                className="w-full h-[340px] md:h-[420px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <p className="text-primary text-xs tracking-[0.2em] uppercase font-body mb-2">MG Films Weddings</p>
                                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                                    Where Every Frame Tells Your <span className="text-gradient-gold">Love Story</span>
                                </h3>
                                <p className="text-muted-foreground font-body text-sm max-w-lg mt-2">
                                    We don't just capture weddings — we create cinematic experiences. Our team blends candid
                                    emotion, stunning drone visuals, and storytelling to deliver wedding films and photographs
                                    that feel like a Bollywood movie.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Our Process */}
                    <div className="max-w-5xl mx-auto mb-16">
                        <motion.h3
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            variants={fadeInUp}
                            className="text-2xl font-display font-bold text-foreground text-center mb-10"
                        >
                            How We Work
                        </motion.h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Users, step: "01", title: "Free Consultation", desc: "Tell us your dream wedding vision. We discuss themes, outfits, locations, and the moments that matter most to you — all at no cost." },
                                { icon: MapPin, step: "02", title: "Location Recce & Planning", desc: "From riverside sunsets to royal heritage forts — we handpick the perfect locations and create a detailed shoot plan tailored to your style." },
                                { icon: Camera, step: "03", title: "The Cinematic Shoot", desc: "Our professional crew arrives with 4K cameras, gimbal stabilizers, drones, and lighting to capture every glance, every smile, every tear of joy." },
                                { icon: Sparkles, step: "04", title: "Delivery & Memories", desc: "Receive beautifully color-graded photos, a cinematic highlight reel, and a full wedding film — all delivered within 2–3 weeks." },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.step}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    variants={fadeInUp}
                                    className="relative p-6 rounded-sm border border-border bg-card/50 hover:border-gold/30 transition-all group text-center"
                                >
                                    <span className="text-3xl font-display font-bold text-primary/20 absolute top-3 right-4">{item.step}</span>
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h4 className="text-base font-display font-semibold text-foreground mb-2">{item.title}</h4>
                                    <p className="text-muted-foreground text-xs font-body leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Two Highlight Cards — Pre-Wedding + Wedding Day */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                        {/* Pre-Wedding */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            variants={fadeInUp}
                            className="p-8 rounded-sm border border-border bg-card/60 hover:border-gold/30 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-display font-semibold text-foreground">Pre-Wedding Shoot</h3>
                            </div>
                            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-5">
                                Make your engagement unforgettable. Our pre-wedding shoots are more than just photos — they're
                                a cinematic experience in stunning locations. We guide every pose, every look, every moment to
                                create visuals that will leave your family and friends speechless.
                            </p>
                            <ul className="space-y-2">
                                {["Scenic outdoor & destination locations", "Professional posing & expression guidance", "Drone aerial shots & cinematic slow-motion", "Same-day Instagram-ready teaser", "Outfit & theme consultation included"].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-xs font-body text-foreground/70">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Wedding Day */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            variants={fadeInUp}
                            className="p-8 rounded-sm border border-border bg-card/60 hover:border-gold/30 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Star className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-display font-semibold text-foreground">Wedding Day Coverage</h3>
                            </div>
                            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-5">
                                Your wedding happens once — we make sure nothing is missed. From the Haldi ceremony at sunrise
                                to the last dance at the reception, our team provides complete cinematic coverage. Multiple cameras,
                                candid storytelling, and professional editing — your wedding film will feel like a feature film.
                            </p>
                            <ul className="space-y-2">
                                {["Full-day multi-camera & drone coverage", "Haldi, Mehendi, Sangeet, Baraat & Reception", "Candid moments + traditional group photos", "4K cinematic wedding film with music", "Same-day highlight edit for social sharing"].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-xs font-body text-foreground/70">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Key Features Strip */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        variants={fadeInUp}
                        className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {[
                            { icon: Camera, label: "4K Cinematic Quality" },
                            { icon: MapPin, label: "Destination Weddings" },
                            { icon: Clock, label: "Fast 2-Week Delivery" },
                            { icon: Sparkles, label: "Bollywood-Style Editing" },
                        ].map((feat, i) => (
                            <div key={feat.label} className="flex flex-col items-center gap-2 py-5 rounded-sm bg-card/40 border border-border hover:border-gold/20 transition-all">
                                <feat.icon className="w-6 h-6 text-primary" />
                                <span className="text-xs font-body text-foreground/80 text-center">{feat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-card">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                            Ready to Create Something <span className="text-gradient-gold">Amazing</span>?
                        </h2>
                        <p className="text-muted-foreground font-body max-w-xl mx-auto mb-8">
                            Let's discuss your project and bring your creative vision to life.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-gold text-primary-foreground font-body font-semibold rounded-sm hover:opacity-90 transition-opacity"
                            >
                                Book a Consultation
                            </Link>
                            <a
                                href="https://wa.me/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-8 py-3 border border-gold/30 text-foreground font-body font-medium rounded-sm hover:bg-primary/10 transition-colors"
                            >
                                WhatsApp Us
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;
