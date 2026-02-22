import { Link } from "react-router-dom";
import { Instagram, Youtube, Phone, MessageCircle, Mail, Facebook } from "lucide-react";

const Footer = () => (
  <footer className="bg-background border-t border-border">
    <div className="container mx-auto px-6 py-16">
      <div className="grid md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="text-2xl font-display font-bold text-gradient-gold">
            MG Films
          </Link>
          <p className="text-muted-foreground text-sm font-body mt-4 leading-relaxed">
            Capturing Emotions, Creating Memories. Regional music albums, short films & premium wedding cinematography.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { label: "Home", to: "/" },
              { label: "About Us", to: "/about" },
              { label: "Our Work", to: "/work" },
              { label: "Services", to: "/services" },
              { label: "Contact", to: "/contact" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-muted-foreground text-sm font-body hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4">Services</h4>
          <ul className="space-y-2">
            {[
              "Film Production",
              "Music Album Production",
              "Wedding Cinematography",
              "Photography",
              "Video Editing",
            ].map((svc) => (
              <li key={svc}>
                <span className="text-muted-foreground text-sm font-body">{svc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-display font-semibold text-foreground mb-4">Connect</h4>
          <div className="space-y-3">
            {[
              { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/917903832653" },
              { icon: Phone, label: "Call Us", href: "tel:+917903832653" },
              { icon: Mail, label: "Email", href: "mailto:rising382@gmail.com" },
              { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/monikasingh4185" },
              { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/1DzP7B65NE/" },
              { icon: Youtube, label: "YouTube", href: "https://youtube.com/" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground text-sm font-body hover:text-primary transition-colors group"
              >
                <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted-foreground text-xs font-body">
          © {new Date().getFullYear()} MG Films. Where Stories Meet Reality.
        </p>
        <p className="text-muted-foreground text-xs font-body">
          Purulia Bangla • Khortha • Santhali Productions
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
