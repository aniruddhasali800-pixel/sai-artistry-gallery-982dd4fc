import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Smartphone, AlertCircle, ShoppingBag, Camera, RefreshCcw, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Painting3D from "@/components/Painting3D";
import { usePaintings } from "@/hooks/usePaintings";
import { usePaintings3D } from "@/hooks/usePaintings3D";
import { toast } from "sonner";

const Loader = () => (
  <Html center>
    <div className="text-primary text-sm tracking-widest uppercase">Loading 3D...</div>
  </Html>
);

type ARSupport = "checking" | "supported" | "unsupported";
type FacingMode = "environment" | "user";

const ThreeDDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: paintings = [] } = usePaintings();
  const { data: paintings3d = [] } = usePaintings3D();

  // ID prefix "x-" indicates 3D-only painting
  const is3DOnly = id?.startsWith("x-");
  const realId = is3DOnly ? id!.slice(2) : id;

  const inv = paintings.find((p) => p.id === realId);
  const ext = paintings3d.find((p) => p.id === realId);

  const painting = inv
    ? {
        id: inv.id,
        title: inv.title,
        description: inv.description,
        image: inv.image,
        category: inv.category,
        medium: inv.medium,
        dimensions: inv.dimensions,
        year: inv.year,
        price: inv.price,
        sold: inv.sold,
        canOrder: !inv.sold,
      }
    : ext
    ? {
        id: ext.id,
        title: ext.title,
        description: ext.description,
        image: ext.image,
        category: "3D Showcase",
        medium: "—",
        dimensions: "—",
        year: new Date().getFullYear(),
        price: 0,
        sold: false,
        canOrder: false,
      }
    : null;

  const [arSupport, setArSupport] = useState<ARSupport>("checking");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [facing, setFacing] = useState<FacingMode>("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const check = async () => {
      const xr = (navigator as unknown as { xr?: { isSessionSupported?: (m: string) => Promise<boolean> } }).xr;
      if (xr?.isSessionSupported) {
        try {
          setArSupport((await xr.isSessionSupported("immersive-ar")) ? "supported" : "unsupported");
        } catch {
          setArSupport("unsupported");
        }
      } else {
        setArSupport("unsupported");
      }
    };
    check();
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const startCamera = async (mode: FacingMode) => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
    } catch (err) {
      toast.error("Camera access denied or unavailable");
      setCameraOpen(false);
    }
  };

  useEffect(() => {
    if (cameraOpen) startCamera(facing);
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraOpen, facing]);

  const launchAR = async () => {
    try {
      const xr = (navigator as unknown as { xr: { requestSession: (m: string, o: unknown) => Promise<{ addEventListener: (e: string, cb: () => void) => void; end?: () => Promise<void> }> } }).xr;
      const session = await xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "local-floor"],
      });
      toast.success("AR session active. Scan a wall to place the painting.");
      session.addEventListener("end", () => undefined);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "AR failed to launch");
    }
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
                {painting.price > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Price</p>
                    <p className="text-primary font-sans text-xl mt-1">₹{painting.price.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Camera Preview (front/back toggle) */}
              <div className="space-y-3">
                <h3 className="font-serif text-xl">View on Your Wall</h3>
                <p className="text-xs text-muted-foreground">
                  Open your camera and overlay the painting on your real environment. Switch between back and front cameras anytime.
                </p>
                <button
                  onClick={() => setCameraOpen(true)}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground font-sans tracking-widest uppercase text-sm hover:bg-primary/90 transition-all"
                >
                  <Camera className="w-5 h-5" /> Open Camera View
                </button>

                {arSupport === "supported" && (
                  <button
                    onClick={launchAR}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-primary text-primary font-sans tracking-widest uppercase text-sm hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Smartphone className="w-5 h-5" /> Place on Wall (AR)
                  </button>
                )}
                {arSupport === "unsupported" && (
                  <div className="flex gap-3 p-3 border border-border/40 rounded bg-muted/20">
                    <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Full AR (with auto wall detection) needs an Android phone with Chrome + ARCore. The Camera View above works on every device.
                    </p>
                  </div>
                )}
              </div>

              {painting.canOrder && (
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

      {/* Camera Overlay Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover ${facing === "user" ? "scale-x-[-1]" : ""}`}
          />
          {/* Painting overlay (semi-transparent 3D canvas) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[80vmin] h-[80vmin] pointer-events-auto">
              <Canvas camera={{ position: [0, 0, 3], fov: 45 }} style={{ background: "transparent" }} gl={{ alpha: true }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[2, 3, 4]} intensity={1.2} />
                <Suspense fallback={null}>
                  <Painting3D imageUrl={painting.image} scale={1.2} />
                </Suspense>
                <OrbitControls enablePan enableZoom minDistance={1.5} maxDistance={6} />
              </Canvas>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center">
            <button
              onClick={() => setCameraOpen(false)}
              className="bg-black/60 text-white p-3 rounded-full backdrop-blur-sm"
              aria-label="Close camera"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
              className="flex items-center gap-2 bg-black/60 text-white px-4 py-3 rounded-full backdrop-blur-sm text-xs uppercase tracking-widest"
            >
              <RefreshCcw className="w-4 h-4" />
              {facing === "environment" ? "Back" : "Front"}
            </button>
          </div>

          <div className="absolute bottom-6 inset-x-0 text-center text-white text-xs tracking-widest uppercase opacity-80">
            Drag the painting · Pinch to resize · Tap switch to flip camera
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDDetail;
