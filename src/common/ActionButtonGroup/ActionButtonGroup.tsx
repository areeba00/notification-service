import React from "react";
import "./ActionButtonGroup.css";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
// import { RiRadioButtonLine } from "react-icons/ri";
// import ToggleButton from "../ToggleButton/toggle";
import { PiToggleLeftFill } from "react-icons/pi";
import { PiToggleRightFill } from "react-icons/pi";
import { useState } from "react";

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
  const [clicked, setclicked] = useState(true);

  return (
    <div className="custom-button-container">
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
      <div className="icon-button toggle">
        {!clicked && (
          <PiToggleLeftFill
            className="togglebutton off"
            onClick={(event: { stopPropagation: () => void; }) => {
              event.stopPropagation();
              setclicked(true);
              console.log("like button has been clicked");
            }}
          />
        )}
        {clicked && (
          <PiToggleRightFill
            className={`togglebutton ${isActive ? "on" : "off"}`}
            onClick={(event: { stopPropagation: () => void; }) => {
              event.stopPropagation();
              setclicked(!clicked);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ActionButtonGroup;
