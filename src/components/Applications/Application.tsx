import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import ActionButtonGroup from "../../common/ActionButtonGroup/ActionButtonGroup";
import "./Application.css";
import DialogBox from "../../common/EditDialogBox/DialogBox";
import DeleteDialog from "../../common/DeleteDialog/DeleteDialog";

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
  // delete dialog things

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const [applicationToDelete, setApplicationToDelete] =
    useState<Applications | null>(null);

  // Function to open the delete confirmation dialog
  const openDeleteConfirmation = (application: Applications) => {
    setApplicationToDelete(application);
    setIsDeleteConfirmationOpen(true);
  };

  // Function to close the delete confirmation dialog
  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const confirmDelete = () => {
    if (applicationToDelete) {
      // Create a new array that filters out the application to be deleted
      const updatedApplications = applications.filter(
        (app) => app.id !== applicationToDelete.id
      );

      // Update the state with the new array
      setApplications(updatedApplications);

      axios
        .delete(
          "http://localhost:5000/api/applications/" + applicationToDelete.id
        )
        .catch((err) => console.log(err.message));

      // Close the delete confirmation dialog
      closeDeleteConfirmation();
    }
  };

  //edit form things
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
      .get<ApiResponse>("http://localhost:5000/api/applications")
      .then((res) => setApplications(res.data.applications));
  }, []);

  // const deleteApplication = (application: Applications) => {
  //   // Create a new array that filters out the application to be deleted
  //   const updatedApplications = applications.filter(
  //     (app) => app.id !== application.id
  //   );

  //   // Update the state with the new array
  //   setApplications(updatedApplications);

  //   axios
  //     .delete("http://localhost:5000/api/applications/" + application.id)
  //     .catch((err) => console.log(err.message));
  // };

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
                    onDeleteClick={() => openDeleteConfirmation(app)}
                    // onToggleClick={() => toggleApplication(app)}
                    isActive={app.isActive}
                  />
                </div>
                <div>
                  <DialogBox
                    open={isModalOpen}
                    onClose={closeModal}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                  />
                </div>
                <DeleteDialog
                  open={isDeleteConfirmationOpen}
                  onClose={closeDeleteConfirmation}
                  onConfirm={confirmDelete}
                  applicationName={applicationToDelete?.name || ""}
                  applicationDescription={
                    applicationToDelete?.description || ""
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Applications;
