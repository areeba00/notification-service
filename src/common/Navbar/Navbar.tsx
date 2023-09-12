import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import img from "../../images/gosaas.png";
import SettingsIcon from "@mui/icons-material/Settings";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-light custom-navbar">
      <div>
        <a className="navbar-brand" href="#">
          <img
            src={img}
            className=" navbar-logo"
            alt=""
            style={{ marginBottom: "50px" }}
          />
        </a>
      </div>
      {/* <div className="icon-button">
        <IconButton aria-label="user-profile">
          <Avatar>
            <SettingsIcon style={{ color: "black", marginBottom: "50px" }} />
          </Avatar>
        </IconButton>
      </div> */}
    </nav>
  );
}

export default Navbar;
