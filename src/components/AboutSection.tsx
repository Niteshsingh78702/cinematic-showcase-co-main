import { motion } from "framer-motion";
import { useContent } from "@/hooks/useContent";
import monikaPic from "@/assets/monika.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AboutSection = () => {
  const { items } = useContent("about");

  /* Use first about item for main text, fallback to defaults */
  const aboutData = items.length > 0 ? items[0] : null;
  const heading = aboutData?.title || "From Regional Roots to Big Screens";
  const description = aboutData?.description || `MG Films is a creative production house specializing in regional music albums, short films, and premium wedding cinematography. We bring stories to life through the rich cultural traditions of Purulia Bangla, Khortha, and Santhali art forms.

Our debut short film "Milloner Bela" (2:10 min) showcases our commitment to powerful storytelling with cinematic quality.`;
  const portraitImage = aboutData?.media_url || monikaPic;

  return (
    <section id="about" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">About Us</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
            Our Story
          </h2>
          <div className="section-divider w-32 mx-auto mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
              {heading}
            </h3>
            {description.split("\n\n").map((para, i) => (
              <p key={i} className="text-muted-foreground font-body leading-relaxed mb-6">
                {para}
              </p>
            ))}

            <div className="flex flex-wrap gap-3">
              {["Purulia Bangla", "Khortha", "Santhali"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 text-xs tracking-wider uppercase border border-gold/30 text-primary rounded-sm font-body"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Portrait */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            variants={fadeInUp}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-sm shadow-gold">
              <img
                src={portraitImage}
                alt="Monika Singh - Actress & Co-Founder"
                className="w-full h-[500px] object-contain bg-black"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h4 className="text-xl font-display font-semibold text-foreground">Monika Singh</h4>
                <p className="text-primary text-sm font-body">Actress • Album Performer • Co-Founder</p>
                <p className="text-muted-foreground text-xs font-body mt-2">
                  Regional actress working in Purulia Bangla, Khortha and Santhali music albums and short films.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
