import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  // If the user is authenticated (token exists), render the specified element.
  // Otherwise, redirect to the login page.
  return token ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;

