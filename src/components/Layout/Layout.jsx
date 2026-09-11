import Navbar from '../../components/header/Navbar'
import Footer from '../../components/footer/Footer'

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;