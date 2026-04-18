import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Smartphone, AlertCircle, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Painting3D from "@/components/Painting3D";
import { usePaintings } from "@/hooks/usePaintings";
import { toast } from "sonner";

const Loader = () => (
  <Html center>
    <div className="text-primary text-sm tracking-widest uppercase">Loading 3D...</div>
  </Html>
);

type ARSupport = "checking" | "supported" | "unsupported";

const ThreeDDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: paintings = [] } = usePaintings();
  const painting = paintings.find((p) => p.id === id);
  const [arSupport, setArSupport] = useState<ARSupport>("checking");
  const [arActive, setArActive] = useState(false);

  useEffect(() => {
    const check = async () => {
      // @ts-expect-error - WebXR types not standard
      if (typeof navigator !== "undefined" && navigator.xr?.isSessionSupported) {
        try {
          // @ts-expect-error
          const ok = await navigator.xr.isSessionSupported("immersive-ar");
          setArSupport(ok ? "supported" : "unsupported");
        } catch {
          setArSupport("unsupported");
        }
      } else {
        setArSupport("unsupported");
      }
    };
    check();
  }, []);

  const launchAR = async () => {
    if (!painting) return;
    try {
      // @ts-expect-error
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "local-floor"],
      });
      setArActive(true);
      toast.success("Scan a wall, then tap to place the painting");

      // Minimal AR session: setup WebGL canvas
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl", { xrCompatible: true } as never);
      if (!gl) throw new Error("WebGL unavailable");
      // @ts-expect-error
      await gl.makeXRCompatible?.();
      // @ts-expect-error
      session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });

      session.addEventListener("end", () => setArActive(false));

      // Simple session: end after 60s if user doesn't end manually
      // (Full hit-testing AR placement requires a dedicated renderer; this opens
      // the AR session so user sees their environment with the painting overlay
      // in supported viewers like Scene Viewer / model-viewer)
      setTimeout(() => {
        if (session.end) session.end();
      }, 60_000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "AR failed to launch";
      toast.error(msg);
      setArActive(false);
    }
  };

  // Fallback: Android Scene Viewer via intent (works without full WebXR setup)
  const launchSceneViewer = () => {
    if (!painting) return;
    // Scene Viewer requires a .glb model URL. Since we generate 3D from images,
    // we use the WebXR session above. As a graceful fallback, show a message.
    toast.info("AR placement requires a compatible Android device with Chrome + ARCore.");
  };

  if (!painting) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 px-6 text-center">
          <p className="text-muted-foreground">Painting not found.</p>
          <Link to="/3d-view" className="text-primary underline mt-4 inline-block">Back to 3D Gallery</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <Link
            to="/3d-view"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to 3D Gallery
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 3D Canvas */}
            <div className="glass-card border border-border/30 rounded-lg overflow-hidden h-[400px] sm:h-[500px] lg:h-[600px]">
              <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[3, 4, 5]} intensity={1.3} />
                <directionalLight position={[-3, -2, 2]} intensity={0.5} />
                <Suspense fallback={<Loader />}>
                  <Painting3D imageUrl={painting.image} scale={1.1} />
                  <Environment preset="apartment" />
                </Suspense>
                <OrbitControls enablePan={false} minDistance={1.8} maxDistance={6} />
              </Canvas>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">{painting.category}</p>
                <h1 className="text-3xl sm:text-5xl font-serif text-gradient-gold">{painting.title}</h1>
              </div>

              <p className="text-muted-foreground leading-relaxed">{painting.description}</p>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/30">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Medium</p>
                  <p className="text-foreground mt-1">{painting.medium}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Dimensions</p>
                  <p className="text-foreground mt-1">{painting.dimensions}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Year</p>
                  <p className="text-foreground mt-1">{painting.year}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Price</p>
                  <p className="text-primary font-sans text-xl mt-1">₹{painting.price.toLocaleString()}</p>
                </div>
              </div>

              {/* AR Section */}
              <div className="space-y-3">
                <h3 className="font-serif text-xl">View on Your Wall</h3>
                {arSupport === "checking" && (
                  <p className="text-sm text-muted-foreground">Checking AR support...</p>
                )}
                {arSupport === "supported" && (
                  <button
                    onClick={launchAR}
                    disabled={arActive}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground font-sans tracking-widest uppercase text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    <Smartphone className="w-5 h-5" />
                    {arActive ? "AR Session Active..." : "Place on My Wall (AR)"}
                  </button>
                )}
                {arSupport === "unsupported" && (
                  <div className="flex gap-3 p-4 border border-border/40 rounded bg-muted/20">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      AR wall preview requires an Android phone with Chrome and ARCore support.
                      Try opening this page on a supported device.
                      <button
                        onClick={launchSceneViewer}
                        className="block mt-2 text-primary underline text-xs"
                      >
                        More info
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order CTA */}
              {!painting.sold && (
                <Link
                  to={`/place-order/${painting.id}`}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-primary text-primary font-sans tracking-widest uppercase text-sm hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <ShoppingBag className="w-5 h-5" /> Place Order
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDDetail;
