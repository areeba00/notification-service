import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import img from "../../images/gosaas.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-light custom-navbar">
      <a className="navbar-brand" href="#">
        <img src={img} className=" navbar-logo" alt="" />
      </a>
      {/* <div className="user-icon">
        <IconButton aria-label="user-profile">
          <Avatar>
            <AccountCircleIcon />
          </Avatar>
        </IconButton>
      </div> */}
    </nav>
  );
}

export default Navbar;
