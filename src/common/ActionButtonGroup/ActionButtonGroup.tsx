import React from "react";
import "./ActionButtonGroup.css";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
// import { RiRadioButtonLine } from "react-icons/ri";
// import ToggleButton from "../ToggleButton/toggle";
import { PiToggleLeftFill } from "react-icons/pi";
import { PiToggleRightFill } from "react-icons/pi";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useState, useEffect } from "react";


interface ActionButtonGroupProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
  // onToggleClick: () => void;
  isActive: boolean;
  switchActive_fun?: (arg: boolean) => void;
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  onEditClick,
  onDeleteClick,
  // onToggleClick,
  isActive,
  switchActive_fun,
}) => {

  const [clicked, setclicked] = useState(true);
  
  useEffect(() => {
    setclicked(isActive);
  }, []);

  return (
    <div className="custom-button-container">
      <Tooltip title="Edit">
        <div>
          <FaPen
            onClick={onEditClick}
            className="icon-button"
            style={{ color: "black" }}
          />
        </div>
      </Tooltip>

      <Tooltip title="Delete">
        <div>
          <MdDelete
            onClick={onDeleteClick}
            className="icon-button"
            style={{ color: "red" }}
          />
        </div>
      </Tooltip>
      <div className="icon-button toggle">
        {!clicked && (
          <Tooltip title="Toggle to make it active">
            <div>
              <PiToggleLeftFill
                className="togglebutton off"
                onClick={(event: { stopPropagation: () => void }) => {
                  event.stopPropagation();
                  setclicked(true);
                  // console.lo  background-color: rgb(255, 255, 255);g("in action button, now true", clicked);
                  if (switchActive_fun) {
                    switchActive_fun(clicked);
                  }
                }}
              />
            </div>
          </Tooltip>
        )}
        {clicked && (
          <Tooltip title="Toggle to make it inactive">
            <div>
              <PiToggleRightFill
                // className={`togglebutton ${isActive ? "on" : "off"}`}
                className={"togglebutton on"}
                onClick={(event: { stopPropagation: () => void }) => {
                  event.stopPropagation();
                  setclicked(!clicked);
                  if (switchActive_fun) {
                    switchActive_fun(clicked);
                  }
                }}
              />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default ActionButtonGroup;
