import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";
import styles from "./PageWrapper.module.css";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const LOADER_DURATION = 700;

export default function PageWrapper({ children, skipLoader = false, duration = LOADER_DURATION }) {
  const [loading, setLoading] = useState(!skipLoader);

  useEffect(() => {
    if (skipLoader) return;
    const timer = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(timer);
  }, [duration, skipLoader]);

  return (
    <AnimatePresence>
      {loading ? (
        <Motion.div
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
          <div className={styles.loaderBox}>
            <Loader />
          </div>
        </Motion.div>
      ) : (
        <Motion.div
          key="content"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {children}
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
