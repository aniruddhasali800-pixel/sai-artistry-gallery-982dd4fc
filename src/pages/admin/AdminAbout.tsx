import { useState, useEffect } from "react";
import { useSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Upload, Loader2 } from "lucide-react";

const AdminAbout = () => {
  const { data: allContent, isLoading } = useSiteContent();
  const updateContent = useUpdateSiteContent();
  const [form, setForm] = useState<Record<string, string>>({});
  const [artistPhoto, setArtistPhoto] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (allContent) {
      const map: Record<string, string> = {};
      allContent.forEach((item) => {
        map[`${item.section}__${item.key}`] = item.value;
        if (item.section === "about" && item.key === "artist_photo" && item.image_url) {
          setArtistPhoto(item.image_url);
        }
      });
      setForm(map);
    }
  }, [allContent]);

  const handleChange = (section: string, key: string, value: string) => {
    setForm((prev) => ({ ...prev, [`${section}__${key}`]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `artist-portrait-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("painting-images").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("painting-images").getPublicUrl(path);
      setArtistPhoto(urlData.publicUrl);
      toast.success("Photo uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const promises: Promise<void>[] = [];
      for (const [compositeKey, value] of Object.entries(form)) {
        const [section, key] = compositeKey.split("__");
        promises.push(updateContent.mutateAsync({ section, key, value }));
      }
      if (artistPhoto) {
        promises.push(updateContent.mutateAsync({ section: "about", key: "artist_photo", value: "", image_url: artistPhoto }));
      }
      await Promise.all(promises);
      toast.success("All changes saved!");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const fields = [
    { section: "about", key: "artist_name", label: "Artist Name", type: "text" },
    { section: "about", key: "page_title", label: "Page Title", type: "text" },
    { section: "about", key: "heading", label: "Section Heading", type: "text" },
    { section: "about", key: "paragraph_1", label: "Paragraph 1", type: "textarea" },
    { section: "about", key: "paragraph_2", label: "Paragraph 2", type: "textarea" },
    { section: "about", key: "paragraph_3", label: "Paragraph 3", type: "textarea" },
    { section: "about", key: "paragraph_4", label: "Paragraph 4", type: "textarea" },
    { section: "about", key: "quote", label: "Artist Quote", type: "textarea" },
    { section: "about", key: "stat_paintings", label: "Stat: Paintings Created", type: "text" },
    { section: "about", key: "stat_awards", label: "Stat: Awards Won", type: "text" },
    { section: "about", key: "stat_experience", label: "Stat: Years Experience", type: "text" },
    { section: "about", key: "stat_collectors", label: "Stat: Happy Collectors", type: "text" },
    { section: "contact", key: "email", label: "Contact Email", type: "text" },
    { section: "contact", key: "phone", label: "Contact Phone", type: "text" },
    { section: "contact", key: "location", label: "Location", type: "text" },
    { section: "footer", key: "description", label: "Footer Description", type: "textarea" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-foreground">About & Contact Settings</h1>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          Manage your About page content, contact details, and footer text
        </p>
      </div>

      {/* Artist Photo */}
      <div className="glass-card rounded-lg p-6 mb-6">
        <h2 className="text-sm font-sans tracking-wider uppercase text-muted-foreground mb-4">Artist Photo</h2>
        <div className="flex items-center gap-6">
          {artistPhoto ? (
            <img src={artistPhoto} alt="Artist" className="w-32 h-32 object-cover rounded-lg border border-border" />
          ) : (
            <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">
              No photo
            </div>
          )}
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-primary text-primary font-sans text-xs tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Photo"}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={`${field.section}__${field.key}`} className="glass-card rounded-lg p-4">
            <label className="text-xs font-sans tracking-wider uppercase text-muted-foreground mb-2 block">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                rows={3}
                value={form[`${field.section}__${field.key}`] || ""}
                onChange={(e) => handleChange(field.section, field.key, e.target.value)}
                className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground font-sans text-sm focus:border-primary focus:outline-none transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={form[`${field.section}__${field.key}`] || ""}
                onChange={(e) => handleChange(field.section, field.key, e.target.value)}
                className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground font-sans text-sm focus:border-primary focus:outline-none transition-colors"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-8 flex items-center gap-2 px-8 py-4 border border-primary text-primary font-sans text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-500 disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
};

export default AdminAbout;
