import React, { ChangeEvent, useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IoSearchCircleSharp } from "react-icons/io5";
import "./TabBar.css";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
  sortingCriteria: "created_at" | "updated_at" | null;
  sortApps: (sortCriteria: "created_at" | "updated_at" | null) => void;
}

const TabBar = (props: Props) => {
  const handleIsActiveFilterClick = () => {
    // Call the parent component's callback function when "isActive" is clicked
    props.onIsActiveFilterClick();
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
  }, [formData.name, props]);

  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };

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
          <IconButton onClick={props.onAddClick}>
            <AddCircleOutlineIcon />
          </IconButton>

          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleFilterMenuOpen}>
              <FilterAltIcon />
            </IconButton>
            <IconButton onClick={handleSortMenuOpen}>
              <SortIcon />
            </IconButton>
          </div>
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={handleFilterMenuClose}
          >
            <MenuItem onClick={handleIsActiveFilterClick}>Active</MenuItem>
            <MenuItem>Inactive</MenuItem>
            <MenuItem>All</MenuItem>
          </Menu>
          <Menu
            anchorEl={sortMenuAnchor}
            open={Boolean(sortMenuAnchor)}
            onClose={handleSortMenuClose}
          >
            <MenuItem>name</MenuItem>
            <MenuItem onClick={() => props.sortApps("created_at")}>
              created_at
            </MenuItem>
            <MenuItem onClick={() => props.sortApps("updated_at")}>
              updated_at
            </MenuItem>
          </Menu>
        </form>
      </div>
    </nav>
  );
};

export default TabBar;
