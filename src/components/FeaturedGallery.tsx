import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PaintingCard from "./PaintingCard";
import { paintings } from "@/data/paintings";

const FeaturedGallery = () => {
  const featured = paintings.filter((p) => !p.sold).slice(0, 3);

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-sans tracking-[0.4em] uppercase text-primary mb-4">
            Curated Selection
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gradient-gold">
            Featured Works
          </h2>
          <div className="section-divider mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((painting, i) => (
            <PaintingCard key={painting.id} painting={painting} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link
            to="/gallery"
            className="inline-block px-10 py-4 border border-primary text-primary font-sans text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          >
            View All Works
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedGallery;
