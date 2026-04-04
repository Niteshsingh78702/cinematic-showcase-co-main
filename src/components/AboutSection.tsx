import { motion } from "framer-motion";
import { useContent } from "@/hooks/useContent";
import VideoEmbed from "@/components/VideoEmbed";
import { resolveMediaUrl } from "@/lib/resolveMediaUrl";
import monikaPic from "@/assets/monika.png";

const API_URL = import.meta.env.VITE_API_URL || "";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AboutSection = () => {
  const { items, loading } = useContent("about");
  const hasAdminItems = !loading && items.length > 0;

  return (
    <section id="about" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-6">
        {/* Section Header */}
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

        {/* Dynamic Admin Content */}
        {hasAdminItems && (
          <div className="max-w-6xl mx-auto space-y-16 mb-16">
            {items.map((item, index) => {
              const hasMedia = !!item.media_url;
              const isVideo = item.media_type === "video" || item.media_type === "youtube";

              return (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  variants={fadeInUp}
                  className={`grid ${hasMedia ? "lg:grid-cols-2" : ""} gap-12 items-center`}
                >
                  {/* Media */}
                  {hasMedia && (
                    <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      {isVideo ? (
                        <VideoEmbed
                          url={item.media_url!}
                          title={item.title || "About Video"}
                          mediaType={item.media_type}
                        />
                      ) : (
                        <div className="relative overflow-hidden rounded-lg shadow-gold bg-black/20">
                          <img
                            src={resolveMediaUrl(item.media_url!)}
                            alt={item.title || "About MG Films"}
                            className="w-full max-h-[520px] object-contain rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              const el = e.target as HTMLImageElement;
                              if (el.src.includes('/api/media/') && item.media_url) {
                                el.src = item.media_url.startsWith('http') ? item.media_url : `${API_URL}${item.media_url}`;
                              } else {
                                el.style.background = 'linear-gradient(135deg, hsl(20,10%,12%), hsl(20,10%,8%))';
                                el.style.minHeight = '200px';
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none rounded-lg" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Content */}
                  <div className={!hasMedia ? "max-w-3xl mx-auto text-center" : ""}>
                    {item.title && (
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <div>
                        {item.description.split("\n\n").map((para, i) => (
                          <p key={i} className="text-muted-foreground font-body leading-relaxed mb-4">
                            {para}
                          </p>
                        ))}
                      </div>
                    )}
                    {item.category && (
                      <span className="inline-block px-4 py-1.5 text-xs tracking-wider uppercase border border-gold/30 text-primary rounded-sm font-body mt-2">
                        {item.category}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Hardcoded Fallback / Always-visible Portrait Section */}
        {!hasAdminItems && (
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
                From Regional Roots to Big Screens
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed mb-6">
                MG Films is a creative production house specializing in regional music albums, short films, and premium wedding cinematography. We bring stories to life through the rich cultural traditions of Purulia Bangla, Khortha, and Santhali art forms.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-6">
                Our debut picture film "Milloner Bela" (2:10:10) showcases our commitment to powerful storytelling with cinematic quality.
              </p>

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
                  src={monikaPic}
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
        )}
      </div>
    </section>
  );
};

export default AboutSection;
