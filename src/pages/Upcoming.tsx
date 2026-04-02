import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Play, Eye, Palette, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface UpcomingProject {
  id: string;
  title: string;
  description: string;
  status: string;
  video_url: string | null;
  thumbnail_url: string | null;
}

const statusIcon: Record<string, typeof Palette> = {
  planned: Clock,
  in_progress: Palette,
  coming_soon: Eye,
  completed: Play,
};

const statusLabel = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const getYoutubeEmbedUrl = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const Upcoming = () => {
  const [projects, setProjects] = useState<UpcomingProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("upcoming_projects")
      .select("id, title, description, status, video_url, thumbnail_url")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProjects(data ?? []);
        setLoading(false);
      });
  }, []);

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

          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-sans">Loading...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-sans italic">No upcoming projects at the moment. Stay tuned!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {projects.map((item, index) => {
                const Icon = statusIcon[item.status] || Clock;
                const embedUrl = item.video_url ? getYoutubeEmbedUrl(item.video_url) : null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                  >
                    <Card className="glass-card border-border/30 h-full hover:border-primary/40 transition-colors duration-300 overflow-hidden">
                      {/* Video or Thumbnail */}
                      {embedUrl ? (
                        <div className="aspect-video">
                          <iframe
                            src={embedUrl}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      ) : item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full aspect-video object-cover"
                        />
                      ) : null}

                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-full bg-primary/10 shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="text-xl font-serif font-semibold text-foreground">
                                {item.title}
                              </h3>
                              <span className="text-xs font-sans uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary">
                                {statusLabel(item.status)}
                              </span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                            {item.video_url && !embedUrl && (
                              <a
                                href={item.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary text-sm mt-3 hover:underline"
                              >
                                Watch Video <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

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
