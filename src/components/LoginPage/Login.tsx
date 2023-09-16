import { useState } from "react";
import "./login.css";
import img from "../../images/gosaas.jpg";
import apiClient from "../../apiService/api-client";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    // Create a JSON object with the email and password
    const credentials = { email, password };
    apiClient
      .post("/auth", credentials)
      .then((response) => {
        // Handle the response from the backend, which should include a JWT token
        const data = response.data;
        if (data.token) {
          // Authentication successful
          console.log("Authentication successful!");

          // Save the JWT token in local storage or state for future requests
          localStorage.setItem("token", data.token);

          console.log(data.token);
          // You can also redirect the user to a protected route here
          // For example, using React Router: history.push('/dashboard');
          navigate("/Dashboard");
        } else {
          // Authentication failed
          console.error("Authentication failed.");
          alert("Authentication failed!");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Invalid email or password.");
      });
  };

  return (
    <body className="li-body">
      <div id="loginform">
        <br />
        <img src={img} alt="PlanIt Pro logo" />
        <h1 id="login-headerTitle">Login to continue</h1>
        <div className="row">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="row">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div id="button" className="row">
          <button onClick={handleClick}>SIGN IN</button>
        </div>
      </div>
    </body>
  );
};

export default Login;
