import { createBrowserRouter } from "react-router-dom";
import Login from "../components/LoginPage/Login";
import App from "../App";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/Dashboard", element: <App /> },
]);

export default router;
