import React, { useState } from "react";
import img from "../../images/gosaas.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  // Function to log out and remove the token from localStorage
  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "user-popover" : undefined;

  return (
    <nav className="navbar navbar-light custom-navbar">
      <div>
        <a className="navbar-brand" href="#">
          <img
            src={img}
            className="navbar-logo"
            alt=""
            style={{ marginBottom: "50px" }}
          />
        </a>
      </div>
      <div className="navbar-icons">
        <IconButton
          aria-describedby={id}
          style={{ marginBottom: "50px" }}
          onClick={handleProfileClick}
        >
          <AccountCircleIcon fontSize="large" />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div style={{ padding: "10px" }}>
            <Button color="primary" onClick={logOut}>
              Logout
            </Button>
          </div>
        </Popover>
      </div>
    </nav>
  );
}

export default Navbar;
