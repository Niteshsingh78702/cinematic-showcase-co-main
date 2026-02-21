import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Instagram, Youtube, MessageCircle, MapPin, Mail, CheckCircle } from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const eventTypes = [
    "Select Event Type",
    "Wedding Cinematography",
    "Pre-Wedding Shoot",
    "Film Production",
    "Music Album",
    "Photography",
    "Video Editing",
    "Other",
];

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        eventType: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // For now, simulate submission (will connect to Express API later)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSubmitted(true);
        setLoading(false);
        setFormData({ name: "", phone: "", email: "", eventType: "", message: "" });

        // Reset success message after 5 sec
        setTimeout(() => setSubmitted(false), 5000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Page Header */}
            <section className="pt-28 pb-16 bg-gradient-dark">
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial="hidden" animate="visible" transition={{ duration: 0.6 }} variants={fadeInUp}>
                        <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3 font-body">Get In Touch</p>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient-gold mb-4">
                            Contact & Booking
                        </h1>
                        <p className="text-muted-foreground font-body max-w-xl mx-auto">
                            Ready to bring your vision to life? Reach out and let's create something unforgettable.
                        </p>
                        <div className="section-divider w-32 mx-auto mt-6" />
                    </motion.div>
                </div>
            </section>

            {/* Contact Form + Info */}
            <section className="py-20 bg-card">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
                        {/* Form */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Send Us a Message</h2>

                            {submitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 mb-6 rounded-sm border border-green-500/30 bg-green-500/10"
                                >
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <p className="text-green-400 font-body text-sm">
                                        Thank you! Your message has been sent successfully. We'll get back to you soon.
                                    </p>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name *"
                                        required
                                        maxLength={100}
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number *"
                                        required
                                        maxLength={15}
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email *"
                                    required
                                    maxLength={255}
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                />

                                <select
                                    name="eventType"
                                    required
                                    value={formData.eventType}
                                    onChange={handleChange}
                                    className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-foreground font-body text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
                                >
                                    {eventTypes.map((type) => (
                                        <option key={type} value={type === "Select Event Type" ? "" : type} disabled={type === "Select Event Type"}>
                                            {type}
                                        </option>
                                    ))}
                                </select>

                                <textarea
                                    name="message"
                                    placeholder="Tell us about your project... *"
                                    required
                                    maxLength={2000}
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-secondary border border-border rounded-sm px-4 py-3 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-gold text-primary-foreground font-body font-semibold rounded-sm hover:opacity-90 transition-opacity tracking-wide disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            variants={fadeInUp}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-2xl font-display font-bold text-foreground mb-4">Connect With Us</h2>
                                <p className="text-muted-foreground font-body leading-relaxed">
                                    Whether it's a music album, film production, or the most important day of your life —
                                    we're here to make it unforgettable. Reach out through any channel below.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { icon: MessageCircle, label: "WhatsApp", detail: "Chat with us instantly", href: "https://wa.me/", color: "hover:border-green-500/30" },
                                    { icon: Phone, label: "Call Us", detail: "Direct phone call", href: "tel:", color: "hover:border-blue-500/30" },
                                    { icon: Mail, label: "Email", detail: "Send us an email", href: "mailto:", color: "hover:border-yellow-500/30" },
                                    { icon: Instagram, label: "Instagram", detail: "@mgfilms", href: "https://instagram.com/", color: "hover:border-pink-500/30" },
                                    { icon: Youtube, label: "YouTube", detail: "MG Films Channel", href: "https://youtube.com/", color: "hover:border-red-500/30" },
                                ].map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-4 p-4 rounded-sm border border-border bg-secondary/50 ${link.color} hover:bg-secondary transition-all group`}
                                    >
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <link.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-foreground font-body font-medium text-sm">{link.label}</p>
                                            <p className="text-muted-foreground font-body text-xs">{link.detail}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Location */}
                            <div className="p-6 rounded-sm border border-border bg-secondary/50">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-foreground font-body font-medium mb-1">Our Location</p>
                                        <p className="text-muted-foreground font-body text-sm leading-relaxed">
                                            Eastern India<br />
                                            Purulia • Khortha • Santhali Region
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
