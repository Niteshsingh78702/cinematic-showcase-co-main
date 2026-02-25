import { motion } from "framer-motion";
import albumCover from "@/assets/album-cover.jpg";
import filmCover from "@/assets/film-cover.jpg";
import weddingCover from "@/assets/wedding-cover.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const categories = [
  {
    title: "Regional Albums",
    subtitle: "Purulia Bangla • Khortha • Santhali",
    image: albumCover,
    items: ["Purulia Bangla Albums", "Khortha Albums", "Santhali Songs", "Music Video Production"],
  },
  {
    title: "Films",
    subtitle: "Short Films & Features",
    image: filmCover,
    items: ["Milloner Bela (2:10:10)", "Script to Screen", "Regional Storytelling", "Cinematic Production"],
  },
  {
    title: "Wedding & Events",
    subtitle: "Premium Cinematography",
    image: weddingCover,
    items: ["Pre-Wedding Shoots", "Wedding Cinematography", "Reception Coverage", "Drone Shoot • 4K Editing"],
  },
];

const WorkSection = () => {
  return (
    <section id="work" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Portfolio</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
            Our Work
          </h2>
          <div className="section-divider w-32 mx-auto mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-sm bg-secondary"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-semibold text-foreground mb-1">{cat.title}</h3>
                <p className="text-primary text-xs font-body tracking-wider mb-4">{cat.subtitle}</p>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="text-muted-foreground text-sm font-body flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
