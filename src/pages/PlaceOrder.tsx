import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePaintings } from "@/hooks/usePaintings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PlaceOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: paintings = [], isLoading } = usePaintings();
  const painting = paintings.find((p) => p.id === id);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground text-lg">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!painting) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground text-lg">Painting not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (painting.sold) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground text-lg">This painting is already sold.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let photoUrl: string | null = null;

      if (photo) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("order-photos")
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("order-photos")
          .getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("orders").insert({
        painting_id: painting.id,
        painting_title: painting.title,
        painting_image: painting.image,
        painting_price: painting.price,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        customer_photo_url: photoUrl,
      });

      if (error) throw error;

      toast.success("Order placed successfully! We will review and get back to you soon.");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-sans tracking-[0.4em] uppercase text-primary mb-4 text-center">
              Place Your Order
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-gradient-gold text-center">
              Order Request
            </h1>
            <div className="section-divider mt-6 mb-12" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="glass-card rounded-lg overflow-hidden"
            >
              <img
                src={painting.image}
                alt={painting.title}
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="p-5">
                <h2 className="font-serif text-xl text-foreground">{painting.title}</h2>
                <p className="text-xs text-muted-foreground font-sans tracking-wider uppercase mt-1">
                  {painting.category} · {painting.medium}
                </p>
                <p className="font-serif text-2xl text-primary mt-3">{formatPrice(painting.price)}</p>
                {painting.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(painting.originalPrice)}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2 tracking-wider uppercase">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2 tracking-wider uppercase">
                  Email ID *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2 tracking-wider uppercase">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2 tracking-wider uppercase">
                  Address *
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-card border border-border rounded-sm text-foreground font-sans focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Enter your full address"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2 tracking-wider uppercase">
                  Your Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer px-5 py-3 border border-border bg-card text-muted-foreground font-sans text-sm tracking-wider uppercase hover:border-primary transition-colors rounded-sm">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-primary-foreground font-sans text-sm font-semibold tracking-[0.2em] uppercase hover:bg-primary/80 transition-all duration-500 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {submitting ? "Submitting..." : "Submit Order Request"}
              </button>

              <p className="text-xs text-muted-foreground font-sans text-center mt-4">
                Your order will be reviewed by the artist. You'll receive an email once approved.
              </p>
            </motion.form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PlaceOrder;
