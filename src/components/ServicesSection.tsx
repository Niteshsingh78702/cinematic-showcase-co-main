import { motion } from "framer-motion";
import { Film, Music, Heart, Camera, Clapperboard } from "lucide-react";
import { useContent } from "@/hooks/useContent";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const iconMap: Record<string, any> = {
  film: Film,
  music: Music,
  wedding: Heart,
  camera: Camera,
  video: Clapperboard,
};

const defaultServices = [
  { icon: Film, title: "Film Production", desc: "From script to screen, we create compelling short films and features." },
  { icon: Music, title: "Music Album Production", desc: "Regional music albums in Purulia Bangla, Khortha & Santhali." },
  { icon: Heart, title: "Wedding Event Coverage", desc: "Complete wedding cinematography with drone & 4K editing." },
  { icon: Camera, title: "Photography & Cinematography", desc: "Professional shoots for events, portfolios & pre-weddings." },
  { icon: Clapperboard, title: "Video Editing", desc: "Color grading, VFX, and post-production at cinematic quality." },
];

const ServicesSection = () => {
  const { items } = useContent("services");

  /* Map API items to services display, fallback to defaults */
  const services = items.length > 0
    ? items.map((item) => {
      /* Match icon by category keyword, default to Film */
      const cat = (item.category || "").toLowerCase();
      const IconComp = iconMap[cat] || Film;
      return {
        icon: IconComp,
        title: item.title || "Service",
        desc: item.description || "",
      };
    })
    : defaultServices;

  return (
    <section id="services" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">What We Do</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
            Our Services
          </h2>
          <div className="section-divider w-32 mx-auto mt-6" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title + i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              variants={fadeInUp}
              className="p-6 rounded-sm border border-border bg-card/50 hover:border-gold/30 hover:shadow-gold-sm transition-all duration-300 group"
            >
              <svc.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">{svc.title}</h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
