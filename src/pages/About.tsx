import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import monikaPic from "@/assets/monika.png";
import { Heart, Film, Music, Award, Users } from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Page Header */}
            <section className="pt-28 pb-16 bg-gradient-dark">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.6 }}
                        variants={fadeInUp}
                    >
                        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Who We Are</p>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient-gold mb-4">
                            About MG Films
                        </h1>
                        <div className="section-divider w-32 mx-auto mt-6" />
                    </motion.div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 bg-card">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-3xl font-display font-bold text-foreground mb-6">Our Story</h2>
                            <p className="text-muted-foreground font-body leading-relaxed mb-6">
                                MG Films was born from a passion for storytelling and a deep love for regional art forms.
                                We are a creative production house specializing in regional music albums, short films, and
                                premium wedding cinematography across Eastern India.
                            </p>
                            <p className="text-muted-foreground font-body leading-relaxed mb-6">
                                From the vibrant traditions of Purulia Bangla to the soulful melodies of Khortha and the
                                rich heritage of Santhali culture — we bring stories to life through the lens of
                                cinematic excellence. Every project we undertake is crafted with emotion, authenticity,
                                and a commitment to quality that sets us apart.
                            </p>
                            <p className="text-muted-foreground font-body leading-relaxed">
                                Our debut short film <span className="text-primary font-medium">"Milloner Bela"</span> (2:10 min)
                                showcases our dedication to powerful regional storytelling with professional cinematic quality.
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            variants={fadeInUp}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { icon: Film, label: "Films Produced", value: "10+" },
                                { icon: Music, label: "Music Albums", value: "25+" },
                                { icon: Heart, label: "Weddings Covered", value: "50+" },
                                { icon: Award, label: "Years Experience", value: "5+" },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="p-6 rounded-sm border border-border bg-secondary/50 text-center hover:border-gold/30 transition-colors"
                                >
                                    <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                                    <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                                    <p className="text-muted-foreground text-xs font-body mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-20 bg-gradient-dark">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            variants={fadeInUp}
                            className="p-8 rounded-sm border border-border bg-card/50"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-display font-semibold text-foreground mb-4">Our Vision</h3>
                            <p className="text-muted-foreground font-body leading-relaxed">
                                To become the leading regional production house in Eastern India, creating world-class
                                content that celebrates local culture while meeting international quality standards.
                                We envision a future where every story from our regions reaches a global audience.
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            variants={fadeInUp}
                            className="p-8 rounded-sm border border-border bg-card/50"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-display font-semibold text-foreground mb-4">Our Mission</h3>
                            <p className="text-muted-foreground font-body leading-relaxed">
                                To deliver emotionally powerful, visually stunning productions that honor our
                                cultural roots. We are committed to professionalism, creativity, and making
                                every client's vision a reality — whether it's a music album, a film, or the
                                most important day of their life.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Founder Profile */}
            <section className="py-20 bg-card">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Founder</p>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
                            Meet Our Visionary
                        </h2>
                        <div className="section-divider w-32 mx-auto mt-6" />
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            variants={fadeInUp}
                            className="relative"
                        >
                            <div className="relative overflow-hidden rounded-sm shadow-gold">
                                <img
                                    src={monikaPic}
                                    alt="Monika Singh - Actress & Co-Founder"
                                    className="w-full h-[500px] object-contain bg-black"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            variants={fadeInUp}
                        >
                            <h3 className="text-3xl font-display font-bold text-foreground mb-2">Monika Singh</h3>
                            <p className="text-primary font-body text-sm mb-6">Actress • Album Performer • Film Artist • Co-Founder</p>

                            <p className="text-muted-foreground font-body leading-relaxed mb-6">
                                Monika Singh is a talented regional actress working across Purulia Bangla, Khortha
                                and Santhali music albums and short films. With years of experience in regional
                                entertainment, she brings a unique blend of artistic vision and cultural understanding
                                to every MG Films production.
                            </p>

                            <p className="text-muted-foreground font-body leading-relaxed mb-8">
                                As co-founder of MG Films, Monika combines her on-screen talent with behind-the-scenes
                                expertise, ensuring every project delivers emotional authenticity and cinematic
                                excellence. Her deep roots in regional art forms make her an invaluable creative force.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {["Actress", "Regional Artist", "Co-Founder", "Purulia Bangla", "Khortha", "Santhali"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-4 py-1.5 text-xs tracking-wider uppercase border border-gold/30 text-primary rounded-sm font-body"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
