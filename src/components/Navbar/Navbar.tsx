import img from "../../images/gosaas.jpg";
import "./Navbar.css";
function Navbar() {
  return (
    <nav className="navbar navbar-light custom-navbar">
      <a className="navbar-brand" href="#">
        <img
          src={img}
          width="70"
          height="40"
          className="d-inline-block align-top"
          alt=""
        />
      </a>
    </nav>
  );
}

export default Navbar;
