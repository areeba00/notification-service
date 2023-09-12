import React, { ChangeEvent, useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {IoSearchCircleSharp} from "react-icons/io5";
import "./TabBar.css";

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
}

const TabBar = (props: Props) => {
  const iconStyle = {
    fontSize: "30px", // Set the font size
    color: "white",
  };

  const [formData, setFormData] = useState({
    // Initialize your form fields here
    name: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    props.submitFunction(formData.name);
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
        <form className="d-flex" onSubmit={handleSubmit}>
          <input
            className="form-control me-2"
            type="search"
            name="name" // Make sure the 'name' attribute matches your state key
            placeholder="Search"
            aria-label="Search"
            value={formData.name}
            onChange={handleChange}
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
