import React, { ChangeEvent, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  formData: {
    name: string;
    description: string;
  };
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  alertMessage: string | null;
  alertType: string | null;
}

const DialogBox: React.FC<EditDialogProps> = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleSave,
  alertMessage, // Access alertMessage from props
  alertType,
}) => {
  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(false);

  useEffect(() => {
    // Check the length of name and description when the "Save" button is clicked
    const isNameValid = formData.name.length >= 3;
    const isDescriptionValid = formData.description.length >= 5;

    setIsSaveDisabled(!(isNameValid && isDescriptionValid));

    if (!isNameValid) {
      setNameError("Name must be at least 3 characters");
    } else {
      setNameError("");
    }

    if (!isDescriptionValid) {
      setDescriptionError("Description must be at least 5 characters");
    } else {
      setDescriptionError("");
    }
  }, [formData]);

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
        Edit Application
      </DialogTitle>
      <DialogContent style={{ padding: "26px" }}>
        {alertMessage && alertType && (
          <Alert severity={alertType}>{alertMessage}</Alert>
        )}
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="dense"
          variant="outlined"
          style={{ marginBottom: "30px", marginTop: "10px" }}
          value={formData.name}
          onChange={handleInputChange}
          error={Boolean(nameError)}
          helperText={nameError}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={5}
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.description}
          onChange={handleInputChange}
          error={Boolean(descriptionError)}
          helperText={descriptionError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={isSaveDisabled}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
