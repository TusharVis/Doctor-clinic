import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("doctorToken");

  if (!token) {
    return <Navigate to="/doctor-login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;