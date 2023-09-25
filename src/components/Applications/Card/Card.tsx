/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, ChangeEvent, useEffect } from "react";

import "./Card.css";
import ActionButtonGroup from "../../../common/ActionButtonGroup/ActionButtonGroup";
import DialogBox from "../../../common/EditDialogBox/DialogBox";
import DeleteDialog from "../../../common/DeleteDialog/DeleteDialog";

// Define your alert types
const ALERT_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
};
interface Applications {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

interface Props {
  clicked_id: number;
  card_id: number;
  applications: Applications;
  deleteHandler: (application: Applications) => void;
  editHandler: (editedApplication: Applications) => void;
  onClick: () => void;
  AlertMessage: string | null;
  AlertType: string | null;
}

const Cards = ({
  clicked_id,
  card_id,
  applications,
  deleteHandler,
  editHandler,
  onClick,
  AlertMessage, // Access alertMessage from props
  AlertType,
}: // gridComponent: Grid,
Props) => {
  //delete things
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [applicationToDelete, setApplicationToDelete] =
    useState<Applications | null>(null);

  // Clicked state for the card
  const [isCardClicked, setIsCardClicked] = useState(false);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<string | null>(null);

  // Function to open the delete confirmation dialog
  const openDeleteConfirmation = (application: Applications) => {
    setApplicationToDelete(application);
    setIsDeleteConfirmationOpen(true);
  };

  useEffect(() => {
    setIsCardClicked(clicked_id === card_id);
  }, [clicked_id, card_id]);
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

  // const [associatedEvents, setAssociatedEvents] = useState<Events[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const openModal = (applications: Applications) => {
    setFormData({
      name: applications.name,
      description: applications.description,
    });
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

    // Clear the alert message when the user starts typing
    if (name === "name" || name === "description") {
      setAlertMessage(null);
      setAlertType(null);
    }
  };

  const handleSave = async () => {
    const editedApplication: Applications = {
      ...applications,
      name: formData.name,
      description: formData.description,
    };

    try {
      const message = await editHandler(editedApplication);

      // On success, set the success alert
      setAlertMessage(message);
      setAlertType(ALERT_TYPES.SUCCESS);

      // Close the modal after a brief delay (you can adjust the delay)
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      setAlertMessage(error);
      setAlertType(ALERT_TYPES.ERROR);
    }
  };

  // FUNCTION TO SWITCH THE ACTIVE STATE
  const switchActive_fun = async (active: boolean) => {
    const editedApplication: Applications = {
      ...applications,
      isActive: !active,
    };

    try {
      const message = await editHandler(editedApplication);

      // On success, set the success alert
      setAlertMessage(message);
      setAlertType(ALERT_TYPES.SUCCESS);

      // Close the modal after a brief delay (you can adjust the delay)
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      // On error, set the error alert
      setAlertMessage(error);
      setAlertType(ALERT_TYPES.ERROR);
    }
  };

  // Reset the alert when the dialog is opened or closed
  useEffect(() => {
    if (!isModalOpen) {
      setAlertMessage(null);
      setAlertType(null);
    }
  }, [isModalOpen]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);

  const handleCardClick = () => {
    // Toggle the card clicked state
    setIsCardClicked((prevIsCardClicked) => !prevIsCardClicked);

    // If the card is clicked, set the selected application ID; otherwise, clear it
    if (!isCardClicked) {
      setSelectedApplicationId(applications.id);
    } else {
      setSelectedApplicationId(null);
    }
  };

  return (
    <>
      <article
        className={`card ${isCardClicked ? "clicked" : ""}`}
        onClick={() => {
          onClick(); // Call the onClick prop to handle card click
          handleCardClick(); // You can also keep this if needed
        }}
      >
        <div className="C-infos" key={applications.id}>
          <div className="C-text-data">
            <h2 className="C-title">{applications.name}</h2>
            <br></br>
            <br></br>
            <br></br>
            <p className="C-txt">{applications.description}</p>
          </div>
          <br></br>
          <div className="C-action-buttons">
            <ActionButtonGroup
              onEditClick={() => openModal(applications)}
              onDeleteClick={() => openDeleteConfirmation(applications)}
              isActive={applications.isActive}
              switchActive_fun={switchActive_fun}
            />
          </div>
        </div>
      </article>
      <div>
        <DialogBox
          open={isModalOpen}
          onClose={closeModal}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          alertMessage={alertMessage} // Pass the alert message as a prop
          alertType={alertType}
          title={"Application"}
        />
      </div>
      <div>
        <DeleteDialog
          open={isDeleteConfirmationOpen}
          onClose={closeDeleteConfirmation}
          onConfirm={confirmDelete}
          title={"Application"}
        />
      </div>
    </>
  );
};

export default Cards;
