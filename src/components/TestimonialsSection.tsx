import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Rajesh Kumar",
        role: "Wedding Client",
        text: "MG Films made our wedding day truly magical. The cinematography was beyond anything we imagined — every emotion, every ritual captured beautifully. It felt like watching a movie of our own love story.",
        rating: 5,
    },
    {
        name: "Sunita Devi",
        role: "Music Artist",
        text: "Working with MG Films for my music album was an incredible experience. They understood the Purulia Bangla vibe perfectly and created visuals that elevated every song to a cinematic level.",
        rating: 5,
    },
    {
        name: "Vikash Mahato",
        role: "Film Producer",
        text: "Professional, creative, and absolutely dedicated. The team at MG Films brings a level of quality to regional content that is rare and truly commendable. Highly recommended!",
        rating: 5,
    },
    {
        name: "Priya Singh",
        role: "Wedding Client",
        text: "From pre-wedding to the reception, every moment was captured with cinematic perfection. The same-day edit left everyone at the wedding speechless. Thank you, MG Films!",
        rating: 5,
    },
];

const TestimonialsSection = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((c) => (c + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 bg-card relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Testimonials</p>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient-gold mb-4">
                        What Our Clients Say
                    </h2>
                    <div className="glow-line mt-4" />
                </motion.div>

                <div className="max-w-3xl mx-auto text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Opening quote */}
                            <div className="text-primary/30 text-6xl font-display leading-none mb-4">"</div>

                            {/* Stars */}
                            <div className="flex justify-center gap-1 mb-6">
                                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-foreground/85 font-body text-lg md:text-xl leading-relaxed italic mb-8 px-4">
                                {testimonials[current].text}
                            </p>

                            {/* Author */}
                            <div>
                                <p className="text-foreground font-display font-semibold text-lg">
                                    {testimonials[current].name}
                                </p>
                                <p className="text-primary font-body text-sm tracking-wider uppercase mt-1">
                                    {testimonials[current].role}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-3 mt-10">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`transition-all duration-300 rounded-full ${i === current
                                        ? "w-8 h-2 bg-primary shadow-gold-sm"
                                        : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                    }`}
                                aria-label={`Testimonial ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
