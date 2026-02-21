import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Film, Music, Heart, Camera, Clapperboard } from "lucide-react";

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

            {/* CTA Section */}
            <section className="py-20 bg-gradient-dark">
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
