import { useLocation } from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
};

export default Layout;