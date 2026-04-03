import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Play, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectMedia {
  id: string;
  media_url: string;
  media_type: string;
  sort_order: number;
}

interface UpcomingProject {
  id: string;
  title: string;
  description: string;
  status: string;
  video_url: string | null;
  thumbnail_url: string | null;
}

const getYoutubeEmbedUrl = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const statusLabel = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const UpcomingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<UpcomingProject | null>(null);
  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "images" | "videos">("all");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("upcoming_projects").select("*").eq("id", id).single(),
      supabase.from("upcoming_project_media").select("*").eq("project_id", id).order("sort_order", { ascending: true }),
    ]).then(([{ data: proj }, { data: mediaData }]) => {
      setProject(proj as UpcomingProject | null);
      setMedia((mediaData as ProjectMedia[]) || []);
      setLoading(false);
    });
  }, [id]);

  const filteredMedia = media.filter((m) => {
    if (activeTab === "images") return m.media_type === "image";
    if (activeTab === "videos") return m.media_type === "video";
    return true;
  });

  const imageCount = media.filter((m) => m.media_type === "image").length;
  const videoCount = media.filter((m) => m.media_type === "video").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 text-center">
          <p className="text-muted-foreground font-sans">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 text-center">
          <p className="text-muted-foreground font-sans">Project not found.</p>
          <Link to="/upcoming" className="text-primary text-sm mt-4 inline-block hover:underline">
            ← Back to Upcoming
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Link
            to="/upcoming"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-sans mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Upcoming
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                  {project.title}
                </h1>
                <span className="text-xs font-sans uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {statusLabel(project.status)}
                </span>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                {project.description}
              </p>
            </div>

            {/* Main video if present */}
            {project.video_url && getYoutubeEmbedUrl(project.video_url) && (
              <div className="aspect-video max-w-3xl mb-10 rounded-lg overflow-hidden border border-border">
                <iframe
                  src={getYoutubeEmbedUrl(project.video_url)!}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Media tabs */}
            {media.length > 0 && (
              <>
                <div className="flex gap-4 mb-6 border-b border-border">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`pb-3 px-1 text-sm font-sans tracking-wider uppercase transition-colors ${activeTab === "all" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    All ({media.length})
                  </button>
                  {imageCount > 0 && (
                    <button
                      onClick={() => setActiveTab("images")}
                      className={`pb-3 px-1 text-sm font-sans tracking-wider uppercase transition-colors flex items-center gap-1.5 ${activeTab === "images" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Images ({imageCount})
                    </button>
                  )}
                  {videoCount > 0 && (
                    <button
                      onClick={() => setActiveTab("videos")}
                      className={`pb-3 px-1 text-sm font-sans tracking-wider uppercase transition-colors flex items-center gap-1.5 ${activeTab === "videos" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Play className="w-3.5 h-3.5" /> Videos ({videoCount})
                    </button>
                  )}
                </div>

                {/* Media grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMedia.map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="cursor-pointer group relative rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-colors"
                      onClick={() => setLightboxIndex(i)}
                    >
                      {m.media_type === "image" ? (
                        <img src={m.media_url} alt="" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full aspect-square bg-muted flex flex-col items-center justify-center gap-2">
                          {getYoutubeEmbedUrl(m.media_url) ? (
                            <img
                              src={`https://img.youtube.com/vi/${m.media_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)?.[1]}/mqdefault.jpg`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Play className="w-8 h-8 text-primary" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                            <Play className="w-10 h-10 text-primary-foreground drop-shadow-lg" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {media.length === 0 && !project.video_url && (
              <p className="text-muted-foreground font-sans italic text-center py-8">
                No media available for this project yet.
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {filteredMedia.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex - 1 + filteredMedia.length) % filteredMedia.length);
                  }}
                  className="absolute left-4 p-2 text-muted-foreground hover:text-foreground z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex + 1) % filteredMedia.length);
                  }}
                  className="absolute right-4 p-2 text-muted-foreground hover:text-foreground z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full mx-4">
              {filteredMedia[lightboxIndex]?.media_type === "image" ? (
                <img
                  src={filteredMedia[lightboxIndex].media_url}
                  alt=""
                  className="w-full max-h-[80vh] object-contain rounded-lg"
                />
              ) : (
                <div className="aspect-video w-full rounded-lg overflow-hidden">
                  {getYoutubeEmbedUrl(filteredMedia[lightboxIndex].media_url) ? (
                    <iframe
                      src={getYoutubeEmbedUrl(filteredMedia[lightboxIndex].media_url)!}
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <video
                      src={filteredMedia[lightboxIndex].media_url}
                      controls
                      className="w-full h-full"
                    />
                  )}
                </div>
              )}
              <p className="text-center text-muted-foreground text-sm font-sans mt-3">
                {lightboxIndex + 1} / {filteredMedia.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default UpcomingDetail;
