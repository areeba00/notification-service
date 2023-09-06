import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
      <IconButton aria-label="edit" onClick={onEditClick} className="icon-button">
        <EditIcon style={{ color: "black" }} />
      </IconButton>
      <IconButton aria-label="delete" onClick={onDeleteClick} className="icon-button">
        <DeleteIcon style={{ color: "red" }} />
      </IconButton>
      <IconButton aria-label="toggle" className="icon-button">
        <RadioButtonCheckedRoundedIcon
          style={{ color: isActive ? "green" : "primary" }}
        />
      </IconButton>
    </div>
  );
};

export default ActionButtonGroup;
