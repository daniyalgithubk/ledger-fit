import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { auth } from "./firebase";

import { useAuthStore } from "./zustand/store/useAuthStore";

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Auth from "./pages/auth/Auth"; 
import Plan from "./pages/plan/Plan";
import Week from "./pages/week/Week";
import Zones from "./pages/zones/Zones";
import Profile from "./pages/profile/Profile";
import MyProgress from "./pages/progress/MyProgress";
import Settings from "./pages/settings/Settings";
import Ledger from "./pages/ledger/Ledger";

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    auth.authStateReady().then(() => console.log("firebase user:", auth.currentUser?.email));
    const unsubscribe = initAuth();
    return unsubscribe;
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/week" element={<Week />} />
          <Route path="/zones" element={<Zones />} />

          {/* Profile Pages (login required) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/progress" element={<MyProgress />} />
          <Route path="/settings" element={<Settings />} />

          {/* Ledger Pages */}
          <Route path="/ledger" element={<Ledger />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;