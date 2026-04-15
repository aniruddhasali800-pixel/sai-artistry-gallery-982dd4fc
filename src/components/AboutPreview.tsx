import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContentMap } from "@/hooks/useSiteContent";
import artistPortraitFallback from "@/assets/artist-portrait.jpg";

const AboutPreview = () => {
  const { content } = useContentMap("about");

  const artistPhoto = content.artist_photo?.image_url || artistPortraitFallback;
  const artistName = content.artist_name?.value || "Sai";

  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={artistPhoto}
                alt={artistName}
                loading="lazy"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-primary/50" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-primary/50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-sm font-sans tracking-[0.4em] uppercase text-primary mb-4">
              The Artist
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-gradient-gold mb-6">
              {content.heading?.value || "Behind Every\nBrushstroke"}
            </h2>
            <div className="section-divider !mx-0 mb-8" />
            <p className="text-muted-foreground font-sans leading-relaxed mb-4">
              {content.paragraph_1?.value ||
                "With over two decades of artistic journey, Sai has mastered the delicate balance between classical techniques and contemporary expression. Each painting is a labor of love, taking weeks to months to complete."}
            </p>
            <p className="text-muted-foreground font-sans leading-relaxed mb-8">
              {content.paragraph_2?.value ||
                "Trained in the finest art academies and inspired by the beauty of Indian landscapes, mythology, and human emotion, every piece carries a story waiting to be discovered by its new owner."}
            </p>
            <Link
              to="/about"
              className="inline-block px-8 py-3 border border-primary text-primary font-sans text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            >
              Read More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
