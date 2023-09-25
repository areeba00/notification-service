import { SetStateAction, useState } from "react";
import "./login.css";
import img from "../../images/gosaas.jpg";
import apiClient from "../../apiService/api-client";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import {
  TextField,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleClick = () => {
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    let hasError = false;

    if (!email) {
      setEmailError("Email* is required.");
      hasError = true;
    } else if (!email.includes("@")) {
      setEmailError("Invalid email format. Must contain '@'");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password* is required.");
      hasError = true;
    } else if (password.length < 5) {
      setPasswordError("Password must be at least 5 characters.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const credentials = { email, password };
    apiClient
      .post("/auth", credentials)
      .then((response) => {
        const data = response.data;
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log(data.token);
          navigate("/Dashboard");
        } else {
          console.error("Authentication failed.");
          setLoginError("Invalid email or password.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoginError("Incorrect email or password.");
      });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleClick();
  };

  const handleEmailChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setEmail(e.target.value);
    setEmailError("");
    if (loginError) {
      setLoginError("");
    }
  };

  const handlePasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setPassword(e.target.value);
    setPasswordError("");
    if (loginError) {
      setLoginError("");
    }
  };

  return (
    <body className="li-body">
      <div id="loginform">
        <br />
        <img src={img} alt="PlanIt Pro logo" />
        <h1 id="login-headerTitle">Login to continue</h1>
        {loginError && <Alert severity="error">{loginError}</Alert>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* <label>Email*</label> */}
            <TextField
              className = "L-TextField"
              // required
              type="text" // Changed to text type
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              id="outlined-basic" 
              label="Email *" 
              variant="outlined"
            />
            <div
              className="error-message"
              style={{ marginLeft: "0px", color: "red" }}
            >
              {emailError}
            </div>
          </div>
          <div className="row">
            {/* <label>Password*</label> */}
            <TextField
              className = "L-TextField"
              // required
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              id="outlined-basic" 
              label="Password *" 
              variant="outlined"
            />
            <div
              className="error-message"
              style={{ marginLeft: "0px", color: "red" }}
            >
              {passwordError}
            </div>
          </div>
          <div id="button" className="row">
            <button type="submit">SIGN IN</button>
          </div>
        </form>
      </div>

    </body>
  );
};

export default Login;
