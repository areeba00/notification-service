import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import "./ActionButtonGroup.css";

interface ActionButtonGroupProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
  //   onToggleClick: () => void;
  isActive: boolean;
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  onEditClick,
  onDeleteClick,
  //   onToggleClick,
  isActive,
}) => {
  return (
    <div className="custom-button-container">
      <IconButton aria-label="edit" onClick={onEditClick}>
        <EditIcon />
      </IconButton>
      <IconButton aria-label="delete" onClick={onDeleteClick}>
        <DeleteIcon />
      </IconButton>
      <IconButton aria-label="toggle">
        {isActive ? (
          <RadioButtonCheckedRoundedIcon color="secondary" />
        ) : (
          <RadioButtonCheckedRoundedIcon color="primary" />
        )}
      </IconButton>
    </div>
  );
};

export default ActionButtonGroup;
