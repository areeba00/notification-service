import React, { ChangeEvent, useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from '@mui/material/Tooltip';
import { IoSearchCircleSharp } from "react-icons/io5";
import "./TabBar.css";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
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
  onActiveClick: (isActive: boolean | undefined) => void;
  onSortByClick: (
    sortByValue: "name" | "created_at" | "updated_at" | undefined
  ) => void;
  onSortOrderClick: (sortOrderValue: "asc" | "desc" | undefined) => void;
}

const TabBar = (props: Props) => {
  const handleActiveClick = () => {
    props.onActiveClick(true);
  };

  const handleInactiveClick = () => {
    props.onActiveClick(false);
  };

  const handleAllClick = () => {
    props.onActiveClick(undefined);
  };

  const handleSortByNameClick = () => {
    props.onSortByClick("name");
  };

  const handleSortByCreatedAtClick = () => {
    props.onSortByClick("created_at");
  };

  const handleSortByUpdatedAtClick = () => {
    props.onSortByClick("updated_at");
  };

  const handleSortOrderAscClick = () => {
    props.onSortOrderClick("asc");
  };

  const handleSortOrderDescClick = () => {
    props.onSortOrderClick("desc");
  };

  // const handleSortOrderResetClick = () => {

  //   props.onSortOrderClick(undefined);
  // };

  const [formData, setFormData] = useState({
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

  const [sortOrderMenuAnchor, setSortOrderMenuAnchor] =
    useState<null | HTMLElement>(null);

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

  const handleSortOrderMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortOrderMenuAnchor(event.currentTarget);
  };

  const handleSortOrderMenuClose = () => {
    setSortOrderMenuAnchor(null);
  };

  return (
    <nav
      className={`navbar tabbar-custom ${
        isSearchActive ? "search-active" : ""
      }`}
    >
      <div className="container-fluid">
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

        <div style={{ display: "flex" }}>
          <form className="d-flex search" onSubmit={handleSubmit}>
            <input
              className="form-control"
              type="search"
              name="name" // Make sure the 'name' attribute matches your state key
              placeholder="Search"
              aria-label="Search"
              value={formData.name}
              onChange={handleChange} // Handle changes in the search input
            />

            <button className="Search-button" type="submit">
              {/* Search */}
              <IoSearchCircleSharp
                className="Search-icon"
                style={{ color: "white" }}
              />
            </button>
          </form>
          <div className="icon-box">
            <Tooltip title="Add">
              <IconButton onClick={props.onAddClick} style={{ color: "white" }}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className="icon-box">
            <Tooltip title="Filter By">
              <IconButton
                onClick={handleFilterMenuOpen}
                style={{ color: "white" }}
              >
              <FilterAltIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className="icon-box">
            <Tooltip title="Sort On">
              <IconButton onClick={handleSortMenuOpen} style={{ color: "white" }}>
                <SortByAlphaIcon />
              </IconButton>
            </Tooltip>
            
          </div>
          <div className="icon-box">
            <Tooltip title="Sort By">
              <IconButton
                onClick={handleSortOrderMenuOpen}
                style={{ color: "white" }}
              >
                <SortIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterMenuClose}
        >
          <MenuItem onClick={handleActiveClick}>Active</MenuItem>
          <MenuItem onClick={handleInactiveClick}>Inactive</MenuItem>
          <MenuItem onClick={handleAllClick}>All</MenuItem>
        </Menu>
        <Menu
          anchorEl={sortMenuAnchor}
          open={Boolean(sortMenuAnchor)}
          onClose={handleSortMenuClose}
        >
          <MenuItem onClick={handleSortByNameClick}>name</MenuItem>
          <MenuItem onClick={handleSortByCreatedAtClick}>created_at</MenuItem>
          <MenuItem onClick={handleSortByUpdatedAtClick}>updated_at</MenuItem>
        </Menu>
        <Menu
          anchorEl={sortOrderMenuAnchor}
          open={Boolean(sortOrderMenuAnchor)}
          onClose={handleSortOrderMenuClose}
        >
          <MenuItem onClick={handleSortOrderAscClick}>ASC</MenuItem>
          <MenuItem onClick={handleSortOrderDescClick}>DESC</MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default TabBar;
