import { Navigate } from "react-router-dom";
import { useAuthStore } from "../zustand/store/useAuthStore";

const ProtectedRoute = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);

    if (loading) {
    return <p className="p-10 text-center text-slate-500">Loading...</p>;
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;