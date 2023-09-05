import Button from "@mui/material/Button";
import { RiRadioButtonLine } from "react-icons/ri";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useState, ChangeEvent } from "react";

import "./Cards.css";
import ActionButtonGroup from "../../../common/ActionButtonGroup/ActionButtonGroup";

interface Applications {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

interface Props {
  deleteApplication: (app: Applications) => void;
  applications: Applications;
}

const Cards = (app: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    closeModal();
  };

  return (
    <article className="card">
      {/* <div
            className="thumb"
            style={{
              backgroundImage:
                'url("https://codingyaar.com/wp-content/uploads/bootstrap-4-card-image-left-demo-image.jpg")',
            }}
          ></div> */}

      <div className="C-infos" key={app.applications.id}>
        <h2 className="C-title">{app.applications.name}</h2>
        <h3 className="C-status">
          Status: &ensp; <RiRadioButtonLine className="TB-radio-button" />
        </h3>
        <div className="text-center">
          <ActionButtonGroup
            onEditClick={openModal}
            onDeleteClick={() => app.deleteApplication(app.applications)}
            // onToggleClick={() => toggleApplication(app)}
            isActive={app.applications.isActive}
          />
        </div>
        <br></br>
        {/* <h3 className="seats">the details</h3> */}
        <p className="C-txt">
          {/* {app.description} */} Lorem ipsum dolor sit, amet consectetur
          adipisicing elit. Totam, voluptatum!
        </p>
      </div>
      <Dialog
        open={isModalOpen}
        onClose={closeModal}
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
            // style={{ marginBottom: "20px" }}
            value={formData.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </article>
  );
};

export default Cards;
