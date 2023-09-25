import React, { ChangeEvent, useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import { IoSearchCircleSharp } from "react-icons/io5";
import "./TabBar.css";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import SortIcon from "@mui/icons-material/Sort";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";


import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Divider from '@mui/material/Divider';

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

let selectedFilter = 'all';

const TabBar = (props: Props) => {
  const handleActiveClick = () => {
    selectedFilter = 'active';
    props.onActiveClick(true);
  };

  const handleInactiveClick = () => {
    selectedFilter = 'inactive';
    props.onActiveClick(false);
  };

  const handleAllClick = () => {
    selectedFilter = 'all';
    props.onActiveClick(undefined);
  };

  const handleSortByNameClick = () => {
    console.log('sorting by name');
    props.onSortByClick("name");
  };

  const handleSortByCreatedAtClick = () => {
    console.log('sorting by created at');
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


  const [currentSort, setCurrentSort] = useState('name');
  const [currentSortOrder, setCurrentSortOrder] = useState('asc');

  // Define event handlers to update the states
  const handleSortChange = (newValue) => {
    setCurrentSort(newValue); 
  };

  const handleSortOrderChange = (newValue) => {
    setCurrentSortOrder(newValue);
  };


  return (
    <nav
      className={`navbar tabbar-custom ${
        isSearchActive ? "search-active" : ""
      }`}
    >
      <div className="container-fluid">
        <div className="navbar-brand">
          <a
            style={{ color: "white" }}
            >
            {props.title}
          </a>
          <a
            style={{ color: "white" }}
          >
            {props.totalCount && (
              <span style={{ marginLeft: "10px", fontSize: "14px" }}>
                (Total count: {props.totalCount})
              </span>
            )}
          </a>
        </div>


        <div className="grid-all-things">

          
          <div className="grid-all-icons">
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
            {/* <div className="icon-box">
              <Tooltip title="Sort On">
                <IconButton
                  onClick={handleSortMenuOpen}
                  style={{ color: "white" }}
                >
                  <SortByAlphaIcon />
                </IconButton>
              </Tooltip>
            </div> */}
            <div className="icon-box">
              <Tooltip title="Sort">
                <IconButton
                  onClick={handleSortOrderMenuOpen}
                  style={{ color: "white" }}
                >
                  <SortIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>


          
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
        </div>

        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterMenuClose}
        >
          <MenuItem onClick={handleActiveClick}
          style={{ backgroundColor: selectedFilter === 'active' ? 'lightblue' : 'inherit' }}
          >Active</MenuItem>
          <MenuItem onClick={handleInactiveClick}
          style={{ backgroundColor: selectedFilter === 'inactive' ? 'lightblue' : 'inherit' }}
          >Inactive</MenuItem>
          <MenuItem onClick={handleAllClick}
          style={{ backgroundColor: selectedFilter === 'all' ? 'lightblue' : 'inherit' }}
          >All</MenuItem>
        </Menu>




        <Menu
          anchorEl={sortOrderMenuAnchor}
          open={Boolean(sortOrderMenuAnchor)}
          onClose={handleSortOrderMenuClose}
        >
          <MenuItem>
            <FormControl component="fieldset">
              <FormLabel component="legend">Sort By</FormLabel>
              <RadioGroup
                value={currentSort}
                onClick={(e) => handleSortChange(e.target.value)}
              >
                <FormControlLabel
                  value="name"
                  control={<Radio />}
                  label="Name"
                  onClick={handleSortByNameClick}
                />
                <FormControlLabel
                  value="created_at"
                  control={<Radio />}
                  label="Created_at"
                  onClick={handleSortByCreatedAtClick}
                />
                <FormControlLabel
                  value="updated_at"
                  control={<Radio />}
                  label="Updated_at"
                  onClick={handleSortByUpdatedAtClick}
                />
              </RadioGroup>
            </FormControl>
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControl component="fieldset">
              <FormLabel component="legend">Sort Order</FormLabel>
              <RadioGroup
                value={currentSortOrder}
                onChange={(e) => handleSortOrderChange(e.target.value)}
              >
                <FormControlLabel
                  value="asc"
                  control={<Radio />}
                  label="Ascending"
                  onClick={handleSortOrderAscClick}
                />
                <FormControlLabel
                  value="desc"
                  control={<Radio />}
                  label="Descending"
                  onClick={handleSortOrderDescClick}
                />
              </RadioGroup>
            </FormControl>
          </MenuItem>
        </Menu>


        
      </div>
    </nav>
  );
};

export default TabBar;
