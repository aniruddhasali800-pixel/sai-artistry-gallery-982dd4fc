import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Painting3D from "@/components/Painting3D";
import { usePaintings, Painting } from "@/hooks/usePaintings";
import { Box, Eye } from "lucide-react";

const Loader = () => (
  <Html center>
    <div className="text-primary text-sm tracking-widest uppercase">Loading 3D...</div>
  </Html>
);

const ThreeDView = () => {
  const { data: paintings = [], isLoading } = usePaintings();
  const available = paintings.filter((p) => !p.sold);
  const [selected, setSelected] = useState<Painting | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-sm font-sans tracking-[0.4em] uppercase text-primary mb-4 flex items-center justify-center gap-2">
              <Box className="w-4 h-4" /> Immersive Experience
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-gradient-gold">
              3D Gallery
            </h1>
            <div className="section-divider mt-6" />
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
              Drag to rotate · Scroll to zoom · Click any painting to view in detail or place on your wall using AR
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-20">Loading...</div>
          ) : available.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">No paintings available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {available.map((painting) => (
                <motion.div
                  key={painting.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card border border-border/30 rounded-lg overflow-hidden"
                >
                  <div className="h-64 bg-gradient-to-b from-background to-muted/20">
                    <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }}>
                      <ambientLight intensity={0.6} />
                      <directionalLight position={[2, 3, 4]} intensity={1.2} />
                      <directionalLight position={[-2, -1, 2]} intensity={0.4} />
                      <Suspense fallback={<Loader />}>
                        <Painting3D imageUrl={painting.image} autoRotate />
                        <Environment preset="apartment" />
                      </Suspense>
                      <OrbitControls
                        enablePan={false}
                        enableZoom={true}
                        minDistance={2}
                        maxDistance={5}
                      />
                    </Canvas>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-serif text-xl text-gradient-gold">{painting.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{painting.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-primary font-sans">₹{painting.price.toLocaleString()}</span>
                      <Link
                        to={`/3d-view/${painting.id}`}
                        className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-primary border border-primary/50 px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <Eye className="w-3 h-3" /> View Painting
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ThreeDView;
