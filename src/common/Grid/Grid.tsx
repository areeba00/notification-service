// import React, { ChangeEvent, useState } from "react";
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
import { ChangeEvent, useState } from "react";
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
  events: Events;
  deleteHandler: (event: Events) => void;
  editHandler: (event: Events) => void;
}

const Grid = ({ events, deleteHandler, editHandler }: Props) => {
  console.log(events);
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
    const eventToEdit: Events = {
      ...events,
      name: formData.name,
      description: formData.description,
    };
    // Call the editHandler to update the event
    editHandler(eventToEdit);
    closeModal();
  };

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [eventToDelete, setEventToDelete] = useState<Events | null>(null);

  const openDeleteConfirmation = (event: Events) => {
    setEventToDelete(event);
    setIsDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteHandler(eventToDelete);
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
                <TableRow key={events.id}>
                  <TableCell className="checkbox-cell">
                    <Checkbox color="primary" />
                  </TableCell>
                  <TableCell>{events.name}</TableCell>
                  <TableCell>{events.description}</TableCell>
                  <TableCell>
                    {" "}
                    <ActionButtonGroup
                      onEditClick={openModal}
                      onDeleteClick={() => openDeleteConfirmation(events)}
                      isActive={events.isActive}
                    />
                  </TableCell>
                </TableRow>
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
