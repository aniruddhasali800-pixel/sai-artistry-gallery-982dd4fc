import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedGallery from "@/components/FeaturedGallery";
import AboutPreview from "@/components/AboutPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedGallery />
      <AboutPreview />
      <Footer />
    </div>
  );
};

export default Index;
