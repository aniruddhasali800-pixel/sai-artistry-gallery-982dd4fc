import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User, IndianRupee, MapPin, Phone, Mail, X } from "lucide-react";

interface SoldPainting {
  id: string;
  title: string;
  image_url: string;
  price: number;
  category: string;
  dimensions: string;
  medium: string;
  year: number;
}

interface OrderDetail {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  painting_price: number;
  created_at: string;
}

const Sold = () => {
  const [paintings, setPaintings] = useState<SoldPainting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPainting, setSelectedPainting] = useState<SoldPainting | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    supabase
      .from("paintings")
      .select("id, title, image_url, price, category, dimensions, medium, year")
      .eq("sold", true)
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setPaintings((data as SoldPainting[]) || []);
        setLoading(false);
      });
  }, []);

  const showBuyerDetails = async (painting: SoldPainting) => {
    setSelectedPainting(painting);
    setLoadingOrder(true);
    const { data } = await supabase
      .from("orders")
      .select("id, customer_name, customer_email, customer_phone, customer_address, painting_price, created_at")
      .eq("painting_id", painting.id)
      .order("created_at", { ascending: false });
    setOrderDetails((data as OrderDetail[]) || []);
    setLoadingOrder(false);
  };

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
              Sold Collection
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              These masterpieces have found their forever homes. Click on any painting to see who brought it home.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-sans">Loading...</p>
            </div>
          ) : paintings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-sans italic">No paintings sold yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {paintings.map((painting, index) => (
                <motion.div
                  key={painting.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-lg overflow-hidden border border-border/30 hover:border-primary/40 transition-colors duration-300 cursor-pointer group"
                  onClick={() => showBuyerDetails(painting)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={painting.image_url}
                      alt={painting.title}
                      className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-destructive/90 text-destructive-foreground text-xs font-sans uppercase tracking-wider rounded-full">
                      Sold
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-foreground mb-1">{painting.title}</h3>
                    <p className="text-sm text-muted-foreground font-sans mb-2">
                      {painting.medium} • {painting.dimensions} • {painting.year}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-sans font-semibold flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        {painting.price.toLocaleString()}
                      </span>
                      <button className="text-xs text-muted-foreground hover:text-primary font-sans flex items-center gap-1 transition-colors">
                        <User className="w-3 h-3" /> Who bought it?
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buyer Details Modal */}
      <AnimatePresence>
        {selectedPainting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPainting(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-lg p-6 md:p-8 max-w-lg w-full border border-border max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl text-foreground mb-1">{selectedPainting.title}</h2>
                  <p className="text-sm text-muted-foreground font-sans">Buyer Details</p>
                </div>
                <button onClick={() => setSelectedPainting(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loadingOrder ? (
                <p className="text-muted-foreground font-sans text-center py-8">Loading...</p>
              ) : orderDetails.length === 0 ? (
                <p className="text-muted-foreground font-sans italic text-center py-8">
                  No order details found for this painting.
                </p>
              ) : (
                <div className="space-y-4">
                  {orderDetails.map((order) => (
                    <div key={order.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-sans font-semibold text-foreground">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground font-sans">
                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm font-sans">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <IndianRupee className="w-3.5 h-3.5 text-primary" />
                          <span>Paid: <span className="text-foreground font-semibold">₹{order.painting_price.toLocaleString()}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-3.5 h-3.5 text-primary" />
                          <span>{order.customer_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3.5 h-3.5 text-primary" />
                          <span>{order.customer_phone}</span>
                        </div>
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{order.customer_address}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Sold;
