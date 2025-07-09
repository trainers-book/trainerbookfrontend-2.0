import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/loginPage";
import ManageIssues from "../pages/manageIssues";
import ManageUsers from "../pages/manageUsers";
import ReviewFlights from "../pages/reviewFlights";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
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
            <ReviewFlights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usersManagment"
        element={
          <ProtectedRoute>
            <ReviewFlights />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
