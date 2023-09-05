import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ChangeEvent } from "react";
import ActionButtonGroup from "../../common/Buttons";
import "./Application.css";

interface Applications {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

interface ApiResponse {
  TotalCount: string;
  applications: Applications[];
}

function Applications() {
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
  const [applications, setApplications] = useState<Applications[]>([]);

  useEffect(() => {
    axios
      .get<ApiResponse>("http://localhost:5000/api/applications?limit=4")
      .then((res) => setApplications(res.data.applications));
  }, []);

  const deleteApplication = (application: Applications) => {
    // Create a new array that filters out the application to be deleted
    const updatedApplications = applications.filter(
      (app) => app.id !== application.id
    );

    // Update the state with the new array
    setApplications(updatedApplications);

    axios
      .delete("http://localhost:5000/api/applications/" + application.id)
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {applications.map((app) => (
          <div key={app.id} className="col-md-3 mb-3 mt-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">{app.name}</h5>
                <hr /> {/* Line below heading */}
                <p className="card-text text-center">{app.description}</p>
                <div className="text-center">
                  <ActionButtonGroup
                    onEditClick={openModal}
                    onDeleteClick={() => deleteApplication(app)}
                    // onToggleClick={() => toggleApplication(app)}
                    isActive={app.isActive}
                  />
                </div>
                <div>
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
                    <DialogTitle
                      style={{ textAlign: "center", marginTop: "20px" }}
                    >
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Applications;
