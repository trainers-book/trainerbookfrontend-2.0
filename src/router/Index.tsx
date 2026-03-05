import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/loginPage";
import ManageIssues from "../pages/ManageIssues";
import ManageUsers from "../pages/ManageUsers";
import ManagePermits from "../pages/ManagePermits";
import ReviewFlights from "../pages/reviewFlights";
import ProtectedRoute from "./ProtectedRoute";
import { useLocalStorage } from "../context/localStorageContext";

const AppRoutes = () => {
  const { ls } = useLocalStorage();

    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/manageIssues"
          element={
            <ProtectedRoute>
              <ManageIssues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewFlights"
          element={
            <ProtectedRoute>
              <ReviewFlights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/permits"
          element={
            <ProtectedRoute>
              <ManagePermits />
            </ProtectedRoute>
          }
        />
        {ls.getAuthorization() != "Technician" && (
          <Route
            path="/usersManagment"
            element={
              <ProtectedRoute>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
        )}
      </Routes>
    );
};

export default AppRoutes;
