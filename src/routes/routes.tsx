import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import Login from "../components/LoginPage/Login";
import App from "../App";
import NotificationEdit from "../components/Notifications/NotificationEdit";

// Function to log out and remove the token from localStorage
const logOut = () => {
  localStorage.removeItem("token");
  // Optionally, you can redirect the user to the login page or perform any other actions here.
};
// Create a custom ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");

  // If the user is authenticated (token exists), render the children.
  // Otherwise, redirect to the login page.
  return token ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/Dashboard",
    element: (
      <ProtectedRoute>
        <App />
        <Outlet />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications/:notificationId",
    element: <NotificationEdit />,
  },
  {
    path: "/add-notification/:eventId/:applicationId",
    element: <NotificationEdit />,
  },
  {
    path: "/logout",
    element: <button onClick={logOut}>Log Out</button>,
  },
]);

export default router;
