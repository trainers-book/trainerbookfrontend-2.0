import { motion } from "framer-motion";

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    // transition={{ duration: 0.5 }}
    style={{
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
    }}
  >
    {children}
  </motion.div>
);

export default PageWrapper;
