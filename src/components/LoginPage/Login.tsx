import { useState } from "react";
import "./login.css";
import img from "../../images/gosaas.jpg";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    console.log("The form was submitted with the following data:");
    console.log({ username, password });
    alert("Log-in not implemented!!");
  };
  return (
    <body className="li-body">
      <div id="loginform">
        <br />
        <img src={img} alt="PlanIt Pro logo" />
        <h1 id="login-headerTitle">login to continue</h1>
        <div className="row">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
