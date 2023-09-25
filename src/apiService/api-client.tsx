import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add an interceptor to include the token in the headers
apiClient.interceptors.request.use((config) => {
  // Retrieve the token from local storage
  const token = localStorage.getItem("token");

  // If a token exists, add it to the headers
  if (token) {
    config.headers["x-auth-token"] = token;
  }

  return config;
});

export default apiClient;
