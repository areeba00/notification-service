import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

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
    <Paper elevation={3} className="custom-paper">
      <div style={{ alignContent: "center" }}>
        // remove duplication
        <Box className="custom-box">
          <IconButton aria-label="edit" onClick={onEditClick}>
            <EditIcon />
          </IconButton>
        </Box>
        <Box className="custom-box" onClick={onDeleteClick}>
          <IconButton aria-label="delete" className="delete-button">
            <DeleteIcon />
          </IconButton>
        </Box>
        <Box className="custom-box">
          <IconButton aria-label="toggle">
            {isActive ? (
              <ToggleOnIcon color="primary" />
            ) : (
              <ToggleOffIcon color="primary" />
            )}
          </IconButton>
        </Box>
      </div>
    </Paper>
  );
};

export default ActionButtonGroup;
