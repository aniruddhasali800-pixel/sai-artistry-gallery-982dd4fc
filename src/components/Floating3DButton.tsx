import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Box } from "lucide-react";

const Floating3DButton = () => {
  const location = useLocation();
  // Hide on admin pages and on the 3D view itself
  if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/3d-view")) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="fixed right-4 sm:right-6 bottom-6 sm:bottom-10 z-40"
    >
      <Link
        to="/3d-view"
        className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-primary/40"
        aria-label="Open 3D Gallery"
      >
        <Box className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-xs sm:text-sm font-sans tracking-widest uppercase font-medium hidden sm:inline">
          3D View
        </span>
      </Link>
    </motion.div>
  );
};

export default Floating3DButton;
