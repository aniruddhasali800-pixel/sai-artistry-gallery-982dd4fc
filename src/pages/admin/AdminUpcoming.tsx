import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

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
                  Thumbnail Image {editingId ? "(optional)" : "(optional)"}
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
