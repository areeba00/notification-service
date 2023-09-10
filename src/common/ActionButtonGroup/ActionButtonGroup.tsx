import React from "react";
import "./ActionButtonGroup.css";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { RiRadioButtonLine } from "react-icons/ri";

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
      {/* <IconButton aria-label="edit" onClick={onEditClick} className="icon-button">
        <EditIcon style={{ color: "black" }} />
      </IconButton>
      <IconButton aria-label="delete" onClick={onDeleteClick} className="icon-button">
        <DeleteIcon style={{ color: "red" }} />
      </IconButton>
      <IconButton aria-label="toggle" className="icon-button">
        <RadioButtonCheckedRoundedIcon
          style={{ color: isActive ? "green" : "primary" }}
        />
      </IconButton> */}
      <FaPen
        onClick={onEditClick}
        className="icon-button"
        style={{ color: "black" }}
      />
      <MdDelete
        onClick={onDeleteClick}
        className="icon-button"
        style={{ color: "red" }}
      />
      <RiRadioButtonLine
        className="icon-button"
        style={{ color: isActive ? "green" : "primary" }}
      />
    </div>
  );
};

export default ActionButtonGroup;
