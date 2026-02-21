import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturedFilm from "@/components/FeaturedFilm";
import WorkSection from "@/components/WorkSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Home = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <HeroSection />
            <AboutSection />
            <FeaturedFilm />
            <WorkSection />
            <ServicesSection />
            <TestimonialsSection />
            <ContactSection />
            <Footer />
        </div>
    );
};

export default Home;
