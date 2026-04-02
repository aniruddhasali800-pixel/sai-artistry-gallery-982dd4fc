import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Play, Eye, Palette, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const upcomingItems = [
  {
    title: "Work in Progress",
    description: "Currently on the easel — a new series exploring light and shadow in traditional Indian architecture.",
    icon: Palette,
    status: "In Progress",
  },
  {
    title: "Upcoming Collection",
    description: "A curated collection of landscapes inspired by the Western Ghats, coming soon.",
    icon: Eye,
    status: "Coming Soon",
  },
  {
    title: "Behind the Scenes",
    description: "Sneak peeks into the creative process — from initial sketches to final brushstrokes.",
    icon: Play,
    status: "Updates",
  },
  {
    title: "Future Vision",
    description: "Exploring mixed media and contemporary art forms while staying rooted in classical techniques.",
    icon: Clock,
    status: "Planned",
  },
];

const Upcoming = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Upcoming Projects
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A glimpse into what's being created — upcoming paintings, behind-the-scenes footage, and the artist's vision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {upcomingItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Card className="glass-card border-border/30 h-full hover:border-primary/40 transition-colors duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-serif font-semibold text-foreground">
                            {item.title}
                          </h3>
                          <span className="text-xs font-sans uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground italic font-serif">
              Stay tuned for more updates. Follow us to never miss a new creation.
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Upcoming;
