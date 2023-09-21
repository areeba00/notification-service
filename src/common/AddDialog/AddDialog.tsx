/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./AddDialog.css";
import { Alert } from "@mui/material";

interface AddDialogProps<T> {
  open: boolean;
  onClose: () => void;
  formData: T;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAdd: (newData: T) => void; // Callback for adding new data
  title: string; // Title for the dialog
  alertMessage: string | null;
  alertType: string | null;
}

const AddDialog = <T extends object>({
  open,
  onClose,
  formData,
  handleInputChange,
  handleAdd,
  title,
  alertMessage, // Access alertMessage from props
  alertType,
}: AddDialogProps<T>) => {
  const [nameError, setNameError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  // Function to handle form input change and clear errors for the corresponding field
  const handleInputChangeAndClearError = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    handleInputChange(e);

    // Clear the corresponding error when the user starts typing
    if (name === "name") {
      setNameError(null);
    } else if (name === "description") {
      setDescriptionError(null);
    }
  };
  const validateForm = () => {
    let valid = true;

    if ((formData as any).name.trim().length < 3) {
      setNameError("Name must be at least 3 characters");
      valid = false;
    } else {
      setNameError(null);
    }

    if ((formData as any).description.trim().length < 5) {
      setDescriptionError("Description must be at least 5 characters");
      valid = false;
    } else {
      setDescriptionError(null);
    }

    return valid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Call handleAdd function
      handleAdd(formData);
    }
  };

  // Reset errors when the dialog is opened or closed
  useEffect(() => {
    if (!open) {
      setNameError(null);
      setDescriptionError(null);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "90%",
          maxWidth: "600px",
          height: "auto",
          maxHeight: "600px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle style={{ textAlign: "center", marginTop: "20px" }}>
        {title}
      </DialogTitle>
      <DialogContent style={{ padding: "26px" }}>
        {alertMessage && alertType && (
          <Alert severity={alertType}>{alertMessage}</Alert>
        )}
        <TextField
          label="Name"
          name="name"
          required
          fullWidth
          margin="dense"
          variant="outlined"
          style={{ marginBottom: "30px", marginTop: "10px" }}
          value={(formData as any).name}
          onChange={handleInputChangeAndClearError}
          error={nameError !== null}
          helperText={nameError}
        />
        <TextField
          label="Description"
          name="description"
          required
          multiline
          rows={5}
          fullWidth
          margin="dense"
          variant="outlined"
          value={(formData as any).description}
          onChange={handleInputChangeAndClearError}
          error={descriptionError !== null}
          helperText={descriptionError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} color="primary">
          ADD
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDialog;
