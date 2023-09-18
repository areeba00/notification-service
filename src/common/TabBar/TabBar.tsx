import React, { ChangeEvent, useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IoSearchCircleSharp } from "react-icons/io5";
import "./TabBar.css";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Popover from "@mui/material/Popover"; // Import the Popover component
import Button from "@mui/material/Button";
interface Applications {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

interface Props {
  title: string;
  onAddClick: () => void;
  submitFunction: (searchString: string) => Applications[];
  totalCount: string;
  onIsActiveFilterClick: () => void;
}

const TabBar = (props: Props) => {
  const handleIsActiveFilterClick = () => {
    // Call the parent component's callback function when "isActive" is clicked
    props.onIsActiveFilterClick();
  };
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleFilterIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
    setAnchorEl(null);
  };
  const iconStyle = {
    fontSize: "30px", // Set the font size
    color: "white",
  };

  const [formData, setFormData] = useState({
    // Initialize your form fields here
    name: "",
  });

  const [isSearchActive, setSearchActive] = useState(false); // Track search state

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (!value) {
      // Automatically submit the search query when cleared
      setSearchActive(false);
      props.submitFunction(""); // Submit an empty string to show all applications
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    props.submitFunction(formData.name);
    setSearchActive(true); // Set search as active
  };

  useEffect(() => {
    // When the search input is empty and not focused, reset the search state
    if (!formData.name && !document.activeElement) {
      setSearchActive(false);
      props.submitFunction(""); // Submit an empty string to show all applications
    }
  }, [formData.name]);

  return (
    <nav
      className={`navbar tabbar-custom ${
        isSearchActive ? "search-active" : ""
      }`}
    >
      <div className="container">
        <a
          className="navbar-brand"
          style={{ fontSize: "21px", color: "white" }}
        >
          {props.title}
          {props.totalCount && (
            <span style={{ marginLeft: "10px", fontSize: "14px" }}>
              (Total count: {props.totalCount})
            </span>
          )}
        </a>
        {/* Add the FilterAltIcon */}
        <IconButton style={iconStyle} onClick={handleFilterIconClick}>
          <FilterAltIcon />
        </IconButton>
        <Popover
          open={isPopoverOpen}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
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
            <Button color="primary" onClick={handleIsActiveFilterClick}>
              isActive{" "}
            </Button>
          </div>
        </Popover>

        <form className="d-flex search" onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            type="search"
            name="name" // Make sure the 'name' attribute matches your state key
            placeholder="Search"
            aria-label="Search"
            value={formData.name}
            onChange={handleChange} // Handle changes in the search input
          />

          <button className="Search-button" type="submit">
            {/* Search */}
            <IoSearchCircleSharp className="Search-icon" />
          </button>
          <IconButton style={iconStyle} onClick={props.onAddClick}>
            <AddCircleOutlineIcon />
          </IconButton>
        </form>
      </div>
    </nav>
  );
};

export default TabBar;
