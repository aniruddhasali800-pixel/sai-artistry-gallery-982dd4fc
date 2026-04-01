import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import PaintingCard from "@/components/PaintingCard";
import Footer from "@/components/Footer";
import { usePaintings } from "@/hooks/usePaintings";

const categories = ["All", "Abstract", "Landscape", "Contemporary", "Portrait", "Still Life"];

const Gallery = () => {
  const [active, setActive] = useState("All");
  const { data: paintings = [], isLoading } = usePaintings();

  const filtered = active === "All" ? paintings : paintings.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-sans tracking-[0.4em] uppercase text-primary mb-4">
              Complete Collection
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-gradient-gold">
              The Gallery
            </h1>
            <div className="section-divider mt-6" />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 text-xs font-sans tracking-widest uppercase border transition-all duration-300 ${
                  active === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-20">Loading paintings...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">No paintings found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((painting, i) => (
                <PaintingCard key={painting.id} painting={painting} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
