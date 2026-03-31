import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import artistPortrait from "@/assets/artist-portrait.jpg";
import { Palette, Award, Clock, Heart } from "lucide-react";

const stats = [
  { icon: Palette, label: "Paintings Created", value: "500+" },
  { icon: Award, label: "Awards Won", value: "25" },
  { icon: Clock, label: "Years Experience", value: "20+" },
  { icon: Heart, label: "Happy Collectors", value: "300+" },
];

const About = () => {
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
              About The Artist
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-gradient-gold">
              The Story of Sai
            </h1>
            <div className="section-divider mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative sticky top-28"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={artistPortrait}
                  alt="Sai - The Artist"
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-primary/50" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-primary/50" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-serif text-foreground">A Journey Through Color & Canvas</h2>
              <p className="text-muted-foreground font-sans leading-relaxed">
                Born and raised in the vibrant artistic traditions of India, Sai discovered his passion 
                for painting at the young age of eight. What began as simple sketches on the margins of 
                school notebooks evolved into a lifelong dedication to the art of painting.
              </p>
              <p className="text-muted-foreground font-sans leading-relaxed">
                After training at prestigious art academies, Sai developed a unique style that bridges 
                classical Indian art traditions with contemporary global expressions. His work explores 
                themes of nature, mythology, human emotion, and the cosmic dance of creation.
              </p>
              <p className="text-muted-foreground font-sans leading-relaxed">
                Each painting undergoes weeks, sometimes months, of meticulous craftsmanship. From 
                preparing the canvas with traditional gesso to layering oils with palette knives and 
                fine brushes, every step is a meditation in excellence.
              </p>
              <p className="text-muted-foreground font-sans leading-relaxed">
                Today, Sai's works grace private collections across India, the Middle East, Europe, and 
                North America. His art has been featured in numerous exhibitions and has won acclaim from 
                critics and collectors alike.
              </p>

              <blockquote className="border-l-2 border-primary pl-6 py-2 my-8">
                <p className="font-serif text-lg text-foreground italic">
                  "Every painting is a conversation between my soul and the canvas. I paint not just 
                  what I see, but what I feel — the invisible threads that connect us all."
                </p>
                <cite className="text-sm text-primary font-sans mt-2 block">— Sai</cite>
              </blockquote>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-lg p-6 text-center"
              >
                <stat.icon className="mx-auto mb-3 text-primary" size={28} />
                <p className="text-3xl font-serif text-gradient-gold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-sans tracking-wider uppercase mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
