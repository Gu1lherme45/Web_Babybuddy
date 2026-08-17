import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const LOADER_DURATION = 700;
const LOADER_SIZE = "clamp(140px, 20vmin, 260px)";

export default function PageWrapper({ children, skipLoader = false, duration = LOADER_DURATION }) {
  const [loading, setLoading] = useState(!skipLoader);

  useEffect(() => {
    if (skipLoader) return;
    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
          }}
        >
          <div style={{ width: LOADER_SIZE, aspectRatio: "64 / 48" }}>
            <Loader />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
