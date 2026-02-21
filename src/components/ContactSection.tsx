import { motion } from "framer-motion";
import { Phone, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hi MG Films! I'm ${formData.name}. ${formData.message}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <section id="contact" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-4">
            Contact Us
          </h2>
          <div className="section-divider w-32 mx-auto mt-6" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={fadeInUp}
            className="space-y-5"
          >
            <div>
              <input
                type="text"
                placeholder="Your Name"
                required
                maxLength={100}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                required
                maxLength={255}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <textarea
                placeholder="Your Message"
                required
                maxLength={1000}
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-gold text-primary-foreground font-body font-semibold rounded-sm hover:opacity-90 transition-opacity tracking-wide"
            >
              Send via WhatsApp
            </button>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={fadeInUp}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-4">Connect With Us</h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">
                Ready to bring your vision to life? Whether it's a music album, film production,
                or wedding cinematography — we're here to make it unforgettable.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/" },
                { icon: Phone, label: "Call Us", href: "tel:" },
                { icon: Instagram, label: "Instagram", href: "https://instagram.com/" },
                { icon: Youtube, label: "YouTube", href: "https://youtube.com/" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-sm border border-border hover:border-gold/30 hover:bg-secondary transition-all group"
                >
                  <link.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-foreground font-body text-sm">{link.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
