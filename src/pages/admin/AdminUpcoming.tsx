import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Upload, Image, Video } from "lucide-react";

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
  active: boolean;
}

const emptyForm = {
  title: "",
  description: "",
  status: "planned",
  video_url: "",
};

const statusOptions = ["planned", "in_progress", "coming_soon", "completed"];

const AdminUpcoming = () => {
  const [projects, setProjects] = useState<UpcomingProject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Media management
  const [managingProjectId, setManagingProjectId] = useState<string | null>(null);
  const [projectMedia, setProjectMedia] = useState<ProjectMedia[]>([]);
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const [videoUrls, setVideoUrls] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("upcoming_projects")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects((data as UpcomingProject[]) || []);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchMedia = async (projectId: string) => {
    const { data } = await supabase
      .from("upcoming_project_media")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    setProjectMedia((data as ProjectMedia[]) || []);
  };

  const openMediaManager = (projectId: string) => {
    setManagingProjectId(projectId);
    fetchMedia(projectId);
  };

  const handleUploadMedia = async () => {
    if (!managingProjectId) return;
    setUploadingMedia(true);
    try {
      const newMedia: { project_id: string; media_url: string; media_type: string; sort_order: number }[] = [];
      let order = projectMedia.length;

      // Upload image files
      if (mediaFiles) {
        for (let i = 0; i < mediaFiles.length; i++) {
          const file = mediaFiles[i];
          const fileExt = file.name.split(".").pop();
          const fileName = `${managingProjectId}/${crypto.randomUUID()}.${fileExt}`;
          const { error } = await supabase.storage.from("upcoming-media").upload(fileName, file);
          if (error) throw error;
          const { data: urlData } = supabase.storage.from("upcoming-media").getPublicUrl(fileName);
          const isVideo = file.type.startsWith("video/");
          newMedia.push({
            project_id: managingProjectId,
            media_url: urlData.publicUrl,
            media_type: isVideo ? "video" : "image",
            sort_order: order++,
          });
        }
      }

      // Add video URLs
      if (videoUrls.trim()) {
        const urls = videoUrls.split("\n").map((u) => u.trim()).filter(Boolean);
        for (const url of urls) {
          newMedia.push({
            project_id: managingProjectId,
            media_url: url,
            media_type: "video",
            sort_order: order++,
          });
        }
      }

      if (newMedia.length > 0) {
        const { error } = await supabase.from("upcoming_project_media").insert(newMedia);
        if (error) throw error;
        toast.success(`${newMedia.length} media item(s) added`);
      }

      setMediaFiles(null);
      setVideoUrls("");
      fetchMedia(managingProjectId);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    const { error } = await supabase.from("upcoming_project_media").delete().eq("id", mediaId);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Media removed");
    if (managingProjectId) fetchMedia(managingProjectId);
  };

  const handleEdit = (p: UpcomingProject) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      status: p.status,
      video_url: p.video_url || "",
    });
    setThumbnailFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("upcoming_projects").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete project");
      return;
    }
    toast.success("Project deleted");
    fetchProjects();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let thumbnailUrl = "";

      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split(".").pop();
        const fileName = `upcoming/${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("painting-images")
          .upload(fileName, thumbnailFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("painting-images")
          .getPublicUrl(fileName);
        thumbnailUrl = urlData.publicUrl;
      }

      const projectData = {
        title: form.title,
        description: form.description,
        status: form.status,
        video_url: form.video_url || null,
        ...(thumbnailUrl ? { thumbnail_url: thumbnailUrl } : {}),
      };

      if (editingId) {
        const { error } = await supabase
          .from("upcoming_projects")
          .update(projectData)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Project updated");
      } else {
        const { error } = await supabase
          .from("upcoming_projects")
          .insert(projectData);
        if (error) throw error;
        toast.success("Project added");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setThumbnailFile(null);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const statusLabel = (s: string) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-gradient-gold mb-2">Upcoming Projects</h1>
          <p className="text-muted-foreground font-sans text-sm">Manage upcoming paintings & projects</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setThumbnailFile(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-xs font-sans tracking-[0.2em] uppercase rounded-sm hover:bg-primary/80 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {projects.map((p) => (
          <div key={p.id} className="glass-card rounded-lg overflow-hidden">
            {p.thumbnail_url && (
              <img src={p.thumbnail_url} alt={p.title} className="w-full aspect-video object-cover" />
            )}
            {!p.thumbnail_url && (
              <div className="w-full aspect-video bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm font-sans">No Thumbnail</span>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-serif text-lg text-foreground flex-1">{p.title}</h3>
                <span className="text-[10px] font-sans uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                  {statusLabel(p.status)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-sans line-clamp-2 mb-3">{p.description}</p>
              {p.video_url && (
                <p className="text-xs text-primary font-sans truncate mb-3">🎬 Video linked</p>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => openMediaManager(p.id)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  title="Manage Media"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button onClick={() => handleEdit(p)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground font-sans">No upcoming projects yet. Add your first one!</p>
        </div>
      )}

      {/* Media Manager Modal */}
      {managingProjectId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-lg p-6 md:p-8 max-w-2xl w-full border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-foreground">
                Manage Media — {projects.find((p) => p.id === managingProjectId)?.title}
              </h2>
              <button onClick={() => setManagingProjectId(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing media */}
            {projectMedia.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {projectMedia.map((m) => (
                  <div key={m.id} className="relative group rounded-lg overflow-hidden border border-border">
                    {m.media_type === "image" ? (
                      <img src={m.media_url} alt="" className="w-full aspect-square object-cover" />
                    ) : (
                      <div className="w-full aspect-square bg-muted flex flex-col items-center justify-center gap-2">
                        {getYoutubeEmbedUrl(m.media_url) ? (
                          <iframe
                            src={getYoutubeEmbedUrl(m.media_url)!}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : (
                          <>
                            <Video className="w-6 h-6 text-primary" />
                            <span className="text-[10px] text-muted-foreground font-sans">Video</span>
                          </>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteMedia(m.id)}
                      className="absolute top-1 right-1 p-1.5 bg-destructive/90 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 left-1">
                      {m.media_type === "image" ? (
                        <Image className="w-3 h-3 text-primary" />
                      ) : (
                        <Video className="w-3 h-3 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {projectMedia.length === 0 && (
              <p className="text-sm text-muted-foreground font-sans mb-6 text-center py-4">No media added yet.</p>
            )}

            {/* Upload new media */}
            <div className="space-y-4 border-t border-border pt-4">
              <div>
                <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">
                  Upload Images / Videos (multiple)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => setMediaFiles(e.target.files)}
                  className="w-full text-sm text-muted-foreground font-sans file:mr-4 file:px-4 file:py-2 file:rounded-sm file:border file:border-border file:bg-card file:text-muted-foreground file:font-sans file:text-xs file:tracking-wider file:uppercase file:cursor-pointer hover:file:text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">
                  Video URLs (one per line — YouTube, etc.)
                </label>
                <textarea
                  rows={2}
                  value={videoUrls}
                  onChange={(e) => setVideoUrls(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors resize-none text-sm"
                />
              </div>
              <button
                onClick={handleUploadMedia}
                disabled={uploadingMedia || (!mediaFiles && !videoUrls.trim())}
                className="w-full py-3 bg-primary text-primary-foreground font-sans text-sm font-semibold tracking-[0.2em] uppercase hover:bg-primary/80 transition-all rounded-sm disabled:opacity-50"
              >
                {uploadingMedia ? "Uploading..." : "Add Media"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-lg p-8 max-w-lg w-full border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-foreground">
                {editingId ? "Edit Project" : "Add New Project"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Title *</label>
                <input
                  type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Description</label>
                <textarea
                  rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Status *</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{statusLabel(s)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Video URL (YouTube/external)</label>
                <input
                  type="url" value={form.video_url}
                  onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">
                  Thumbnail Image (optional)
                </label>
                <input
                  type="file" accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-muted-foreground font-sans file:mr-4 file:px-4 file:py-2 file:rounded-sm file:border file:border-border file:bg-card file:text-muted-foreground file:font-sans file:text-xs file:tracking-wider file:uppercase file:cursor-pointer hover:file:text-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-primary-foreground font-sans text-sm font-semibold tracking-[0.2em] uppercase hover:bg-primary/80 transition-all duration-500 rounded-sm disabled:opacity-50 mt-2"
              >
                {submitting ? "Saving..." : editingId ? "Update Project" : "Add Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpcoming;
