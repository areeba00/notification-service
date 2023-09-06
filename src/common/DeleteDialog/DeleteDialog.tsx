import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import "./DeleteDialog.css";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  // applicationName: string; // Add the application name prop
  // applicationDescription: string;
}

const DeleteDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  // applicationName, // Access the application name prop
  // applicationDescription,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      sx={{ "& .MuiDialog-paper": { width: "40%" } }}
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        {/* <p>
          Application Name: <strong>{applicationName}</strong>
        </p>
        <p>
          Description: <em>{applicationDescription}</em>
        </p> */}
        <p>Are you sure you want to delete this application?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
