/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface AddDialogProps<T> {
  open: boolean;
  onClose: () => void;
  formData: T;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAdd: (newData: T) => void; // Callback for adding new data
  title: string; // Title for the dialog
}

const AddDialog = <T extends object>({
  open,
  onClose,
  formData,
  handleInputChange,
  handleAdd,
  title,
}: AddDialogProps<T>) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "90%",
          maxWidth: "600px",
          height: "60vh",
          maxHeight: "600px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle style={{ textAlign: "center", marginTop: "20px" }}>
        {title}
      </DialogTitle>
      <DialogContent style={{ padding: "26px" }}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="dense"
          variant="outlined"
          style={{ marginBottom: "30px", marginTop: "10px" }}
          value={(formData as any).name}
          onChange={handleInputChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          variant="outlined"
          value={(formData as any).description}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault(); // Prevent the default button click behavior
            handleAdd(formData);
          }}
          color="primary"
        >
          ADD
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDialog;
