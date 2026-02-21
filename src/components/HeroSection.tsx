import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContent } from "@/hooks/useContent";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const { items } = useContent("hero");

  /* Use first hero item from API, fallback to defaults */
  const heroData = items.length > 0 ? items[0] : null;
  const subtitle = heroData?.title || "Capturing Emotions, Creating Memories";
  const tagline = heroData?.description || "Regional Music, Films & Wedding Moments — Purulia Bangla • Khortha • Santhali";
  const bgImage = heroData?.media_url || heroBg;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with parallax feel */}
      <div className="absolute inset-0">
        <motion.img
          src={bgImage}
          alt="MG Films cinematic background"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.p
            className="text-primary font-body text-sm tracking-[0.35em] uppercase mb-5"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            Film • Music • Events
          </motion.p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
            <span className="text-gradient-gold">MG Films</span>
          </h1>
          <p className="text-foreground/80 text-lg md:text-xl font-body max-w-2xl mx-auto mb-3">
            {subtitle}
          </p>
          <p className="text-muted-foreground text-sm md:text-base font-body max-w-xl mx-auto mb-4">
            {tagline}
          </p>
          <div className="glow-line my-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/work"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-gold text-primary-foreground font-body font-semibold rounded-sm tracking-wide hover:opacity-90 transition-opacity shadow-gold-sm"
          >
            Watch Our Work
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-gold/30 text-foreground font-body font-medium rounded-sm hover:bg-primary/10 transition-colors"
          >
            Book Wedding Event
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-border text-muted-foreground font-body font-medium rounded-sm hover:border-gold/30 hover:text-foreground transition-all"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-primary/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-0.5 h-2 bg-primary/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
