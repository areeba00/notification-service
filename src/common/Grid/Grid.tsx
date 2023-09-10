import React, { ChangeEvent, useState } from "react";
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
  console.log(events);
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
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
                      <Checkbox color="primary" />
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

export default Grid;
