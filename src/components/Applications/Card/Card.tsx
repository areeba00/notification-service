import { useState, ChangeEvent, useEffect } from "react";

import "./Card.css";
import ActionButtonGroup from "../../../common/ActionButtonGroup/ActionButtonGroup";
import DialogBox from "../../../common/EditDialogBox/DialogBox";
import DeleteDialog from "../../../common/DeleteDialog/DeleteDialog";
import apiClient from "../../../apiService/api-client";
import Grid from "../../../common/Grid/Grid";
import Events from "../../Events/Events";

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
  editHandler: (editedApplication: Applications) => void;
  onClick: () => void;
  // gridComponent: React.ComponentType<{ events: Events[] }>;
}

const Cards = ({
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
    const editedApplication: Applications = {
      ...applications,
      name: formData.name,
      description: formData.description,
    };

    // Call the editHandler to update the application
    editHandler(editedApplication);
    closeModal();
  };

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
  // Toggle card click
  // const toggleCardClick = () => {
  //   setIsCardClicked(!isCardClicked);
  // };

  // useEffect(() => {
  //   if (isCardClicked) {
  //     fetchEventsForApplication(applications.id);
  //     console.log(applications.id);
  //   }
  // }, [isCardClicked, applications.id]);

  // const fetchEventsForApplication = (applicationId: number) => {
  //   // Make a GET request to fetch events for the specified application
  //   apiClient
  //     .get(`/events?application_id=${applicationId}`)
  //     .then((response) => {
  //       // Update the state with the fetched events
  //       setAssociatedEvents(response.data.events);
  //       console.log(response.data.events);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching events:", error);
  //     });
  // };

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
          <h2 className="C-title">{applications.name}</h2>
          <p className="C-txt">
            {/* {app.description} */} Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Totam, voluptatum!
          </p>

          <ActionButtonGroup
            onEditClick={openModal}
            onDeleteClick={() => openDeleteConfirmation(applications)}
            isActive={applications.isActive}
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
        <div>
          <DeleteDialog
            open={isDeleteConfirmationOpen}
            onClose={closeDeleteConfirmation}
            onConfirm={confirmDelete}
          />
        </div>
        {/* <Grid events={associatedEvents} /> */}
      </article>
      {/* <Events applicationId={selectedApplicationId} /> */}
    </>
  );
};

export default Cards;
