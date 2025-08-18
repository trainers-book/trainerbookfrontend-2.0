import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useLocalStorage } from "../context/localStorageContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { ls } = useLocalStorage();
  const isAuthenticated = ls.getIsAuthenticated() == "true";
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
