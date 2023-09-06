import { RiRadioButtonLine } from "react-icons/ri";
import { useState, ChangeEvent } from "react";

import "./Card.css";
import ActionButtonGroup from "../../../common/ActionButtonGroup/ActionButtonGroup";
import DialogBox from "../../../common/EditDialogBox/DialogBox";
import DeleteDialog from "../../../common/DeleteDialog/DeleteDialog";

interface Applications {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

interface Props {
  applications: Applications;
  deleteHandler: (application: Applications) => void;
}

const Cards = ({ applications, deleteHandler }: Props) => {
  //delete things

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
      deleteHandler(applicationToDelete);

      // Close the delete confirmation dialog
      closeDeleteConfirmation();
    }
  };

  // edit things
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
      <div className="C-infos" key={applications.id}>
        <h2 className="C-title">{applications.name}</h2>
        <h3 className="C-status">
          Status: &ensp; <RiRadioButtonLine className="TB-radio-button" />
        </h3>
        <div className="text-center">
          <ActionButtonGroup
            onEditClick={openModal}
            onDeleteClick={() => openDeleteConfirmation(applications)}
            // onToggleClick={() => toggleApplication(app)}
            isActive={applications.isActive}
          />
        </div>
        <br></br>
        {/* <h3 className="seats">the details</h3> */}
        <p className="C-txt">
          {/* {app.description} */} Lorem ipsum dolor sit, amet consectetur
          adipisicing elit. Totam, voluptatum!
        </p>
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
      <div>
        <DeleteDialog
          open={isDeleteConfirmationOpen}
          onClose={closeDeleteConfirmation}
          onConfirm={confirmDelete}
        />
      </div>
    </article>
  );
};

export default Cards;
