import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Painting {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  category: string;
  dimensions: string;
  medium: string;
  year: number;
  sold: boolean;
  active: boolean;
}

const emptyForm = {
  title: "",
  description: "",
  price: "",
  original_price: "",
  category: "Abstract",
  dimensions: "",
  medium: "",
  year: new Date().getFullYear().toString(),
};

const categories = ["Abstract", "Landscape", "Contemporary", "Portrait", "Still Life"];

const AdminInventory = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPaintings = async () => {
    const { data } = await supabase
      .from("paintings")
      .select("*")
      .order("created_at", { ascending: false });
    setPaintings((data as Painting[]) || []);
  };

  useEffect(() => {
    fetchPaintings();
  }, []);

  const handleEdit = (p: Painting) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      price: p.price.toString(),
      original_price: p.original_price?.toString() || "",
      category: p.category,
      dimensions: p.dimensions,
      medium: p.medium,
      year: p.year.toString(),
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this painting?")) return;
    const { error } = await supabase.from("paintings").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete painting");
      return;
    }
    toast.success("Painting deleted");
    fetchPaintings();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("painting-images")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("painting-images")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const paintingData = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        category: form.category,
        dimensions: form.dimensions,
        medium: form.medium,
        year: parseInt(form.year),
        ...(imageUrl ? { image_url: imageUrl } : {}),
      };

      if (editingId) {
        const { error } = await supabase
          .from("paintings")
          .update(paintingData)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Painting updated");
      } else {
        if (!imageUrl) {
          toast.error("Please upload an image");
          setSubmitting(false);
          return;
        }
        const { error } = await supabase
          .from("paintings")
          .insert({ ...paintingData, image_url: imageUrl });
        if (error) throw error;
        toast.success("Painting added");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setImageFile(null);
      fetchPaintings();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-gradient-gold mb-2">Inventory Management</h1>
          <p className="text-muted-foreground font-sans text-sm">Manage your painting collection</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setImageFile(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-xs font-sans tracking-[0.2em] uppercase rounded-sm hover:bg-primary/80 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Painting
        </button>
      </div>

      {/* Paintings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {paintings.map((p) => (
          <div key={p.id} className="glass-card rounded-lg overflow-hidden">
            <div className="relative">
              <img src={p.image_url} alt={p.title} className="w-full aspect-[4/5] object-cover" />
              {p.sold && (
                <div className="absolute top-3 right-3 bg-destructive/90 px-3 py-1 rounded-sm">
                  <span className="text-xs font-sans font-semibold tracking-widest uppercase text-destructive-foreground">Sold</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg text-foreground">{p.title}</h3>
              <p className="text-xs text-muted-foreground font-sans tracking-wider uppercase mt-1">{p.category} · {p.medium}</p>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="font-serif text-lg text-primary">{formatPrice(p.price)}</p>
                  {p.original_price && (
                    <p className="text-xs text-muted-foreground line-through">{formatPrice(p.original_price)}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-lg p-8 max-w-lg w-full border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-foreground">
                {editingId ? "Edit Painting" : "Add New Painting"}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Price (₹) *</label>
                  <input
                    type="number" required value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Original Price (₹)</label>
                  <input
                    type="number" value={form.original_price}
                    onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Year *</label>
                  <input
                    type="number" required value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Medium</label>
                  <input
                    type="text" value={form.medium}
                    onChange={(e) => setForm({ ...form, medium: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">Dimensions</label>
                  <input
                    type="text" value={form.dimensions}
                    onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans text-muted-foreground mb-1 tracking-wider uppercase">
                  Painting Image {editingId ? "(optional)" : "*"}
                </label>
                <input
                  type="file" accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-muted-foreground font-sans file:mr-4 file:px-4 file:py-2 file:rounded-sm file:border file:border-border file:bg-card file:text-muted-foreground file:font-sans file:text-xs file:tracking-wider file:uppercase file:cursor-pointer hover:file:text-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-primary-foreground font-sans text-sm font-semibold tracking-[0.2em] uppercase hover:bg-primary/80 transition-all duration-500 rounded-sm disabled:opacity-50 mt-2"
              >
                {submitting ? "Saving..." : editingId ? "Update Painting" : "Add Painting"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
