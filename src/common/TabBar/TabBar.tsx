import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./TabBar.css";

interface Props {
  title: string;
}

const TabBar = (props: Props) => {
  const iconStyle = {
    fontSize: "30px", // Set the font size
    color: "white",
  };
  return (
    <nav className="navbar tabbar-custom">
      <div className="container">
        <a
          className="navbar-brand"
          style={{ fontSize: "21px", color: "white" }}
        >
          {props.title}
        </a>
        <form className="d-flex">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          {/* <button className="btn btn-outline-success" type="submit">
            Search
          </button> */}
          <IconButton style={iconStyle}>
            <AddCircleOutlineIcon />
          </IconButton>
        </form>
      </div>
    </nav>
  );
};

export default TabBar;
