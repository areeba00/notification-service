import React, { ChangeEvent, useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import "./Grid.css";
import ActionButtonGroup from "../ActionButtonGroup/ActionButtonGroup";
import DialogBox from "../EditDialogBox/DialogBox";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import Notifications from "../../components/Notifications/Notifications";

interface Events {
  id: number;
  name: string;
  description: string;
  application_id: number;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}
interface Props {
  events: Events[];
  deleteHandler: (event: Events) => void;
  editHandler: (event: Events) => void;
}

const Grid = ({ events, deleteHandler, editHandler }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const openModal = (event: Events) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };




  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  
  const [errorData, setErrorData] = useState({nameError: " ",descriptionError:" ",})
  // useEffect(() => {
  //   setErrorData({
  //     nameError: nameError,
  //     descriptionError: descriptionError,
  //   });
  // },[nameError, descriptionError])
  


  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    // Validate the "Name" field
    let nameErr = "";
    if (name === "name" && value.length < 5) {
      nameErr = "Name must have at least 5 characters.";
    }
  
    // Validate the "Description" field
    let descriptionErr = "";
    if (name === "description" && value.length < 5) {
      descriptionErr = "Description must have at least 5 characters.";
    }
  
    // Update the state for nameError and descriptionError
    setNameError(nameErr);
    setDescriptionError(descriptionErr);
  
    // Update the errorData state object
    setErrorData({
      nameError: nameErr,
      descriptionError: descriptionErr,
    });
  
    // Update the formData state
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  



  const handleSave = () => {
    if (selectedEvent) {
      // Create a new event object with updated name and description
      const updatedEvent: Events = {
        ...selectedEvent,
        name: formData.name,
        description: formData.description,
      };
      // Call the editHandler to update the event
      editHandler(updatedEvent);
      closeModal();
    }
  };

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const openDeleteConfirmation = (event: Events) => {
    setSelectedEvent(event);
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      deleteHandler(selectedEvent);
      closeDeleteConfirmation();
    }
  };

  // checkbox click
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  // Handle checkbox click and store the selected event ID
  const handleCheckboxClick = (eventId: number) => {
    if (selectedEventId === eventId) {
      // If the same event is clicked again, unselect it
      setSelectedEventId(null);
    } else {
      setSelectedEventId(eventId);
    }
  };

  return (
    <>
      <br />
      <div className="table-container">
        <Paper className="paper">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell className="actions-column">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="checkbox-cell">
                      <Checkbox
                        onClick={() => handleCheckboxClick(event.id)}
                        color="primary"
                        checked={selectedEventId === event.id}
                      />
                    </TableCell>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>
                      <ActionButtonGroup
                        onEditClick={() => openModal(event)}
                        onDeleteClick={() => openDeleteConfirmation(event)}
                        isActive={event.isActive}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>

      <div>
        <DialogBox
          open={isModalOpen}
          onClose={closeModal}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          errors={errorData || { nameError: "", descriptionError: "" }}
        />
      </div>
      <div>
        <DeleteDialog
          open={isDeleteConfirmationOpen}
          onClose={closeDeleteConfirmation}
          onConfirm={confirmDelete}
        />
      </div>

      <div>
        <Notifications eventId={selectedEventId} />
      </div>
    </>
  );
};

export default Grid;
