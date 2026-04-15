import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContentMap } from "@/hooks/useSiteContent";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { content } = useContentMap("contact");

  const contactInfo = [
    { icon: Mail, label: "Email", value: content.email?.value || "contact@saliarts.com" },
    { icon: Phone, label: "Phone", value: content.phone?.value || "+91 98765 43210" },
    { icon: MapPin, label: "Location", value: content.location?.value || "Mumbai, India" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-sans tracking-[0.4em] uppercase text-primary mb-4">Get In Touch</p>
            <h1 className="text-4xl md:text-6xl font-serif text-gradient-gold">Contact Us</h1>
            <div className="section-divider mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card rounded-lg p-6 text-center"
              >
                <item.icon className="mx-auto mb-3 text-primary" size={24} />
                <p className="text-xs text-muted-foreground font-sans tracking-wider uppercase mb-1">{item.label}</p>
                <p className="text-foreground font-sans text-sm">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-lg p-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-sans tracking-wider uppercase text-muted-foreground mb-2 block">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground font-sans text-sm focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs font-sans tracking-wider uppercase text-muted-foreground mb-2 block">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground font-sans text-sm focus:border-primary focus:outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs font-sans tracking-wider uppercase text-muted-foreground mb-2 block">Message</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-input border border-border rounded-sm px-4 py-3 text-foreground font-sans text-sm focus:border-primary focus:outline-none transition-colors resize-none" />
            </div>
            <button type="submit"
              className="px-10 py-4 border border-primary text-primary font-sans text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-500">
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
