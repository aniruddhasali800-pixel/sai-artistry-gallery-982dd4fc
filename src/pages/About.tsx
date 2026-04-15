import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContentMap } from "@/hooks/useSiteContent";
import { Palette, Award, Clock, Heart, Loader2 } from "lucide-react";

const About = () => {
  const { content, isLoading } = useContentMap("about");

  const stats = [
    { icon: Palette, label: "Paintings Created", value: content.stat_paintings?.value || "500+" },
    { icon: Award, label: "Awards Won", value: content.stat_awards?.value || "25" },
    { icon: Clock, label: "Years Experience", value: content.stat_experience?.value || "20+" },
    { icon: Heart, label: "Happy Collectors", value: content.stat_collectors?.value || "300+" },
  ];

  const artistPhoto = content.artist_photo?.image_url;
  const artistName = content.artist_name?.value || "Sai";

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
              {content.page_title?.value || "The Story of Sai"}
            </h1>
            <div className="section-divider mt-6" />
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative sticky top-28"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    {artistPhoto ? (
                      <img src={artistPhoto} alt={artistName} className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-auto object-cover object-top" />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center text-muted-foreground">
                        No photo uploaded
                      </div>
                    )}
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
                  <h2 className="text-3xl font-serif text-foreground">
                    {content.heading?.value || "A Journey Through Color & Canvas"}
                  </h2>
                  {[1, 2, 3, 4].map((n) => {
                    const text = content[`paragraph_${n}`]?.value;
                    return text ? (
                      <p key={n} className="text-muted-foreground font-sans leading-relaxed">{text}</p>
                    ) : null;
                  })}
                  <blockquote className="border-l-2 border-primary pl-6 py-2 my-8">
                    <p className="font-serif text-lg text-foreground italic">
                      "{content.quote?.value || "Every painting is a conversation between my soul and the canvas."}"
                    </p>
                    <cite className="text-sm text-primary font-sans mt-2 block">— {artistName}</cite>
                  </blockquote>
                </motion.div>
              </div>

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
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
