import { createBrowserRouter } from "react-router-dom";
import Login from "../components/LoginPage/Login";
import App from "../App";
import NotificationEdit from "../components/Notifications/NotificationEdit";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/Dashboard", element: <App /> },
  {
    path: "/notifications/:notificationId",
    element: <NotificationEdit />,
  },
]);

export default router;
