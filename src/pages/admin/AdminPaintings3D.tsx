import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, X, Pencil, Box } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import Painting3D from "@/components/Painting3D";

interface Item {
  id: string;
  title: string;
  description: string;
  image_url: string;
  active: boolean;
}

const Loader = () => (
  <Html center>
    <div className="text-primary text-xs uppercase tracking-widest">Loading...</div>
  </Html>
);

const AdminPaintings3D = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("paintings_3d" as never)
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as unknown as Item[]) || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const reset = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setImageFile(null);
    setShowForm(false);
  };

  const handleEdit = (it: Item) => {
    setEditingId(it.id);
    setTitle(it.title);
    setDescription(it.description);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this 3D painting?")) return;
    const { error } = await supabase.from("paintings_3d" as never).delete().eq("id", id);
    if (error) return toast.error("Failed to delete");
    toast.success("Deleted");
    fetchItems();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let image_url = "";
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("paintings-3d").upload(fileName, imageFile);
        if (upErr) throw upErr;
        image_url = supabase.storage.from("paintings-3d").getPublicUrl(fileName).data.publicUrl;
      }

      if (editingId) {
        const payload: Record<string, unknown> = { title, description };
        if (image_url) payload.image_url = image_url;
        const { error } = await supabase.from("paintings_3d" as never).update(payload as never).eq("id", editingId);
        if (error) throw error;
        toast.success("Updated");
      } else {
        if (!image_url) {
          toast.error("Please upload an image");
          setSubmitting(false);
          return;
        }
        const { error } = await supabase.from("paintings_3d" as never).insert({ title, description, image_url } as never);
        if (error) throw error;
        toast.success("3D painting added — auto-converted to 3D view");
      }
      reset();
      fetchItems();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-gradient-gold mb-2 flex items-center gap-3">
            <Box className="w-7 h-7" /> 3D Paintings
          </h1>
          <p className="text-muted-foreground font-sans text-sm">
            Add paintings here — they automatically appear in the 3D Gallery as interactive 3D framed canvases. AR wall preview works on supported devices.
          </p>
        </div>
        <button
          onClick={() => { reset(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-xs font-sans tracking-[0.2em] uppercase rounded-sm hover:bg-primary/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add 3D Painting
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map((it) => (
          <div key={it.id} className="glass-card rounded-lg overflow-hidden border border-border/30">
            <div className="h-56 bg-gradient-to-b from-background to-muted/20">
              <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[2, 3, 4]} intensity={1.2} />
                <Suspense fallback={<Loader />}>
                  <Painting3D imageUrl={it.image_url} autoRotate />
                  <Environment preset="apartment" />
                </Suspense>
                <OrbitControls enablePan={false} minDistance={2} maxDistance={5} />
              </Canvas>
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg text-foreground">{it.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.description}</p>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => handleEdit(it)} className="p-2 text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(it.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">No 3D paintings yet. Click "Add 3D Painting" to start.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-lg p-8 max-w-lg w-full border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-foreground">{editingId ? "Edit 3D Painting" : "Add 3D Painting"}</h2>
              <button onClick={reset} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Title *</label>
                <input
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Description</label>
                <textarea
                  rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">
                  Painting Image {editingId ? "(optional)" : "*"}
                </label>
                <input
                  type="file" accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-muted-foreground font-sans file:mr-4 file:px-4 file:py-2 file:rounded-sm file:border file:border-border file:bg-card file:text-muted-foreground file:font-sans file:text-xs file:tracking-wider file:uppercase file:cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-2">Image will be auto-converted to a 3D framed canvas.</p>
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full py-4 bg-primary text-primary-foreground font-sans text-sm font-semibold tracking-[0.2em] uppercase hover:bg-primary/80 transition-all rounded-sm disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingId ? "Update" : "Add 3D Painting"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaintings3D;
