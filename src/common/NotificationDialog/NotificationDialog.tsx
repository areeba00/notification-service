import React, { ChangeEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  formData: {
    name: string;
    description: string;
    template_subject: string;
    template_body: string;
  };
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
}

const NotificationDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  formData,
  handleInputChange,
  handleSave,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "90%",
          maxWidth: "600px",
          height: "80vh",
          maxHeight: "600px",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle style={{ textAlign: "center", marginTop: "20px" }}>
        Edit Application
      </DialogTitle>
      <DialogContent style={{ padding: "26px" }}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="dense"
          variant="outlined"
          style={{ marginBottom: "30px", marginTop: "10px" }}
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.description}
          onChange={handleInputChange}
        />
        <TextField
          label="Template Subject"
          name="template_subject"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.template_subject}
          onChange={handleInputChange}
        />
        <TextField
          label="Template Body"
          name="template_body"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.template_body}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDialog;
