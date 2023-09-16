import { useState, ChangeEvent, useEffect } from "react";

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
  clicked_id: number;
  card_id: number;
  applications: Applications;
  deleteHandler: (application: Applications) => void;
  editHandler: (editedApplication: Applications) => void;
  onClick: () => void;
  // gridComponent: React.ComponentType<{ events: Events[] }>;
}

const Cards = ({
  clicked_id,
  card_id,
  applications,
  deleteHandler,
  editHandler,
  onClick,
}: // gridComponent: Grid,
Props) => {
  //delete things
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [applicationToDelete, setApplicationToDelete] =
    useState<Applications | null>(null);

  // Clicked state for the card
  const [isCardClicked, setIsCardClicked] = useState(false);

  // Function to open the delete confirmation dialog
  const openDeleteConfirmation = (application: Applications) => {
    setApplicationToDelete(application);
    setIsDeleteConfirmationOpen(true);
  };

  useEffect(() => {
    if (clicked_id !== card_id) {
      setIsCardClicked(false);
    }
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
  };

  const handleSave = () => {
    const editedApplication: Applications = {
      ...applications,
      name: formData.name,
      description: formData.description,
    };

    // Call the editHandler to update the application
    editHandler(editedApplication);
    closeModal();
  };

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
            <br></br><br></br><br></br>
            <p className="C-txt">
              {applications.description}
              {/* Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus minus mollitia magnam ipsa aliquid. Dolore nesciunt quam voluptate, sunt doloremque sit laudantium architecto maxime laboriosam? Nesciunt aut excepturi fugiat molestiae. */}
            </p>
          </div>
          <br></br>
          <div className="C-action-buttons">
            <ActionButtonGroup
              onEditClick={() => openModal(applications)}
              onDeleteClick={() => openDeleteConfirmation(applications)}
              isActive={applications.isActive}
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
          />
        </div>
        <div>
          <DeleteDialog
            open={isDeleteConfirmationOpen}
            onClose={closeDeleteConfirmation}
            onConfirm={confirmDelete}
          />
        </div>
    </>
  );
};

export default Cards;
